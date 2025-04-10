// services/projectService.ts
import { ProjectType } from '@utils';
import { createClient } from 'apps/project-board/src/lib/supabase/client';
const supabase = createClient();

export const projectService = {
  getProjects: async (userRole?: 'manager' | 'client' | 'designer', userId?: string) => {
    let query = supabase
      .from('projects')
      .select('*, project_files(*), project_assignments!inner(*)')
      .order('created_at', { ascending: false });

    // Filtros según el rol
    if (userRole === 'client' && userId) {
      // Clientes ven solo sus proyectos
      query = query.eq('user_id', userId);
    } else if (userRole === 'designer' && userId) {
      // Diseñadores ven solo proyectos asignados
      query = query.eq('project_assignments.designer_id', userId);
    }
    // Managers ven todos los proyectos (sin filtro adicional)

    const { data, error } = await query;

    if (error) throw error;
    return data;
  },


  deleteProject: async (projectId: string) => {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', projectId);

    if (error) throw error;
  },

  getAssignedDesigners: async () => {
    const { data, error } = await supabase.rpc('get_project_assignments');
    if (error) throw error;
    return data;
  },

  createOrUpdateProject: async (
    project: Partial<ProjectType>,
    userId: string,
    projectId?: string
  ) => {
    if (projectId) {
      const { error } = await supabase
        .from('projects')
        .update(project)
        .eq('id', projectId);
      if (error) throw error;
      return projectId;
    } else {
      const { data, error } = await supabase
        .from('projects')
        .insert(project)
        .select('id')
        .single();
      if (error) throw error;
      return data.id;
    }
  },

  getUser: async () => {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();
    if (error || !user) throw new Error('No autenticado');
    return user;
  },

  deleteProjectFiles: async (projectId: string, filePaths: string[]) => {
    if (!projectId || filePaths.length === 0) return;

    // Eliminar archivos del storage
    const { error: storageError } = await supabase.storage
      .from('project-files')
      .remove(filePaths);

    if (storageError) throw storageError;

    // Eliminar registros en DB
    const { error: dbError } = await supabase
      .from('project_files')
      .delete()
      .eq('project_id', projectId);

    if (dbError) throw dbError;
  },

  uploadProjectFiles: async (projectId: string, files: File[]) => {
    if (!projectId || files.length === 0) return;

    for (const file of files) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `projects/${projectId}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('project-files')
        .upload(filePath, file, { cacheControl: '3600', upsert: false });

      if (uploadError) throw uploadError;

      const { error: insertError } = await supabase
        .from('project_files')
        .insert({
          project_id: projectId,
          file_name: file.name,
          file_url: filePath,
          file_size: file.size,
          file_type: file.type,
        });

      if (insertError) throw insertError;
    }
  },

  searchDesignersByEmail: async (email: string) => {
    if (!email.trim()) return [];
  
    // Primero intenta con la función RPC
    const { data, error } = await supabase.rpc('search_designers_by_email', {
      search_email: `%${email}%`,
    });
  
    if (error) throw error;
  
    // Si no hay resultados o falla, fallback a query directa
    if (!data || data.length === 0) {
      const { data: fallbackData, error: fallbackError } = await supabase
        .from('user_profiles')
        .select(
          `
           user_id,
           user:user_id (email),
           roles:role_id (name)
         `
        )
        .ilike('user.email', `%${email}%`)
        .eq('roles.name', 'designer')
        .limit(5);
  
      if (fallbackError) throw fallbackError;
  
      return fallbackData.map((item) => ({
        id: item.user_id,
        email: (item.user as { email?: string })?.email || 'Email no disponible',
      }));
    }
  
    return data;
  },

  assignDesignerToProject: async (
    projectId: string,
    designerId: string
  ) => {
    const { error } = await supabase.from('project_assignments').insert({
      project_id: projectId,
      designer_id: designerId,
    });
  
    if (error) throw error;
  },
  
  unassignDesignerFromProject: async (
    projectId: string,
    designerId: string
  ) => {
    const { error } = await supabase
      .from('project_assignments')
      .delete()
      .eq('project_id', projectId)
      .eq('designer_id', designerId);
  
    if (error) throw error;
  },
};
