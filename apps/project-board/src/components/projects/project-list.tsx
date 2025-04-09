'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@ui';
import { FileText, Edit2, Trash2, UserPlus, Search, X } from 'lucide-react';
import { createClient } from '../../lib/supabase/client';

type Project = {
  id: string;
  title: string;
  description?: string | null;
  user_id: string;
  project_files?: ProjectFile[];
};

type ProjectFile = {
  id: string;
  file_name: string;
  file_url: string;
  file_size: number;
  file_type: string;
};

type Designer = {
  id: string;
  email: string;
};

type ProjectListProps = {
  projects: Project[];
  onEdit: (project: Project) => void;
  onDelete: (projectId: string) => void;
};

export default function ProjectList({
  projects,
  onEdit,
  onDelete,
}: ProjectListProps) {
  const supabase = createClient();
  const [searchEmail, setSearchEmail] = useState<string>('');
  const [searchResults, setSearchResults] = useState<Designer[]>([]);
  const [assigningProject, setAssigningProject] = useState<string | null>(null);
  const [assignedDesigners, setAssignedDesigners] = useState<
    Record<string, Designer[]>
  >({});

  // Obtener diseñadores asignados
  useEffect(() => {
     const fetchAssignedDesigners = async () => {
       try {
         // 1. Intento con RPC (ahora debería funcionar)
         const { data, error } = await supabase.rpc('get_project_assignments');
         
         if (!error && data) {
           const assignments = data.reduce((acc, item) => {
             if (!acc[item.project_id]) acc[item.project_id] = [];
             acc[item.project_id].push({
               id: item.designer_id,
               email: item.designer_email
             });
             return acc;
           }, {});
           setAssignedDesigners(assignments);
           return;
         }
   
         // 2. Fallback con consulta directa (sin acceder a auth.users)
         const { data: directData, error: directError } = await supabase
           .from('project_assignments')
           .select(`
             project_id,
             designer_id,
             profiles:designer_id(email)
           `);
   
         if (!directError) {
           const assignments = directData.reduce((acc, item) => {
             if (!acc[item.project_id]) acc[item.project_id] = [];
             if (item.profiles) {
               acc[item.project_id].push({
                 id: item.designer_id,
                 email: item.profiles.email
               });
             }
             return acc;
           }, {});
           setAssignedDesigners(assignments);
         }
       } catch (error) {
         console.error('Error fetching assignments:', error);
       }
     };
   
     fetchAssignedDesigners();
   }, [supabase]);

  const handleAssignClick = (projectId: string) => {
    setAssigningProject(projectId);
    setSearchEmail('');
    setSearchResults([]);
  };

  const handleSearchDesigners = async () => {
    if (!searchEmail.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      // Intenta con la función RPC primero
      const { data, error } = await supabase.rpc('search_designers_by_email', {
        search_email: `%${searchEmail}%`,
      });

      if (error) throw error;

      // Fallback si no hay resultados o RPC falla
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
          .ilike('user.email', `%${searchEmail}%`)
          .eq('roles.name', 'designer')
          .limit(5);

        if (!fallbackError) {
          setSearchResults(
            fallbackData.map((item) => ({
              id: item.user_id,
              email: item.user?.email || 'Email no disponible',
            }))
          );
          return;
        }
        throw fallbackError;
      }

      setSearchResults(data);
    } catch (err) {
      console.error('Error searching designers:', err);
      setSearchResults([]);
    }
  };

  const assignDesigner = async (
    projectId: string,
    designerId: string,
    designerEmail: string
  ) => {
    try {
      const { error } = await supabase.from('project_assignments').insert({
        project_id: projectId,
        designer_id: designerId,
      });

      if (error) throw error;

      // Actualizar estado local
      setAssignedDesigners((prev) => ({
        ...prev,
        [projectId]: [
          ...(prev[projectId] || []),
          { id: designerId, email: designerEmail },
        ],
      }));
      setAssigningProject(null);
    } catch (error) {
      console.error('Error assigning designer:', error);
    }
  };

  const unassignDesigner = async (projectId: string, designerId: string) => {
    try {
      const { error } = await supabase
        .from('project_assignments')
        .delete()
        .eq('project_id', projectId)
        .eq('designer_id', designerId);

      if (error) throw error;

      setAssignedDesigners((prev) => ({
        ...prev,
        [projectId]: prev[projectId].filter((d) => d.id !== designerId),
      }));
    } catch (error) {
      console.error('Error unassigning designer:', error);
    }
  };

  return (
    <div className="space-y-6">
      {projects.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No hay proyectos creados aún.</p>
          <p className="text-sm text-muted-foreground mt-2">
            Crea tu primer proyecto para comenzar
          </p>
        </div>
      ) : (
        projects.map((project) => (
          <div
            key={project.id}
            className="bg-card p-6 rounded-lg border border-border shadow-sm"
          >
            <div className="flex flex-col sm:flex-row justify-between gap-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-foreground">
                  {project.title}
                </h3>
                {project.description && (
                  <p className="text-muted-foreground mt-1">
                    {project.description}
                  </p>
                )}

                {project.project_files?.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-foreground mb-2">
                      Archivos adjuntos:
                    </h4>
                    <ul className="space-y-2">
                      {project.project_files.map((file) => (
                        <li key={file.id}>
                          <Link
                            href={
                              supabase.storage
                                .from('project-files')
                                .getPublicUrl(file.file_url).data.publicUrl
                            }
                            target="_blank"
                            className="inline-flex items-center text-sm text-primary hover:underline"
                          >
                            <FileText className="h-4 w-4 mr-2" />
                            {file.file_name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {assignedDesigners[project.id]?.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-foreground mb-2">
                      Diseñadores asignados:
                    </h4>
                    <ul className="space-y-1">
                      {assignedDesigners[project.id].map((designer) => (
                        <li
                          key={designer.id}
                          className="flex items-center gap-2"
                        >
                          <span className="text-sm text-muted-foreground">
                            {designer.email}
                          </span>
                          <button
                            onClick={() =>
                              unassignDesigner(project.id, designer.id)
                            }
                            className="text-red-500 hover:text-red-700 ml-2"
                            aria-label="Remover diseñador"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="flex sm:flex-col gap-2 sm:gap-1 justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(project)}
                  className="flex items-center gap-2"
                >
                  <Edit2 className="h-4 w-4" />
                  <span>Editar</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleAssignClick(project.id)}
                  className="flex items-center gap-2"
                >
                  <UserPlus className="h-4 w-4" />
                  <span>Asignar</span>
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => onDelete(project.id)}
                  className="flex items-center gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  <span>Eliminar</span>
                </Button>
              </div>
            </div>

            {assigningProject === project.id && (
              <div className="mt-6 p-4 bg-background rounded-lg border border-border">
                <div className="flex items-center gap-2 mb-3">
                  <input
                    type="text"
                    value={searchEmail}
                    onChange={(e) => setSearchEmail(e.target.value)}
                    placeholder="Buscar diseñador por email..."
                    className="flex-1 px-3 py-2 text-sm border rounded-md"
                    onKeyDown={(e) =>
                      e.key === 'Enter' && handleSearchDesigners()
                    }
                  />
                  <Button
                    onClick={handleSearchDesigners}
                    size="sm"
                    className="flex items-center gap-1"
                  >
                    <Search className="h-4 w-4" />
                    <span>Buscar</span>
                  </Button>
                </div>

                {searchResults.length > 0 ? (
                  <ul className="space-y-2">
                    {searchResults.map((designer) => (
                      <li
                        key={designer.id}
                        className="flex justify-between items-center p-2 hover:bg-accent/50 rounded"
                      >
                        <span className="text-sm">{designer.email}</span>
                        <Button
                          size="sm"
                          onClick={() =>
                            assignDesigner(
                              project.id,
                              designer.id,
                              designer.email
                            )
                          }
                        >
                          Asignar
                        </Button>
                      </li>
                    ))}
                  </ul>
                ) : searchEmail ? (
                  <p className="text-sm text-muted-foreground text-center py-2">
                    No se encontraron diseñadores con ese email
                  </p>
                ) : null}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}
