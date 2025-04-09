'use client';
import { useActionState, useState } from 'react';
import { Button } from '@ui';
import { Loader2, UploadCloud } from 'lucide-react';
import { createClient } from '../../lib/supabase/client';

// Tipos para el proyecto
type Project = {
  id?: string;
  title: string;
  description?: string | null;
  user_id?: string;
  project_files?: ProjectFile[];
};

type ProjectFile = {
  id?: string;
  file_name: string;
  file_url: string;
  file_size: number;
  file_type: string;
};

type ProjectFormProps = {
  editingProject?: Project | null;
  onSuccess: () => void;
};

type FormState = {
  success?: boolean;
  error?: string;
};

export default function ProjectForm({ editingProject, onSuccess }: ProjectFormProps) {
  const [files, setFiles] = useState<File[]>([]);
  const supabase = createClient();

  const [state, formAction, isPending] = useActionState<FormState, FormData>(
    async (prevState, formData) => {
      try {
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) throw new Error('No autenticado');

        // Validación básica
        const title = formData.get('title') as string;
        if (!title || title.trim().length < 3) {
          throw new Error('El título debe tener al menos 3 caracteres');
        }

        const projectData: Partial<Project> = {
          title: title.trim(),
          description: formData.get('description') as string || null,
          user_id: user.id
        };

        // Manejo diferente para edición vs creación
        let projectId: string;
        if (editingProject?.id) {
          projectId = editingProject.id;
          const { error } = await supabase
            .from('projects')
            .update(projectData)
            .eq('id', projectId);
          if (error) throw error;
        } else {
          const { data, error } = await supabase
            .from('projects')
            .insert(projectData)
            .select('id')
            .single();
          if (error) throw error;
          projectId = data.id;
        }

        // Subida de archivos (solo si es nuevo o se están reemplazando)
        if (files.length > 0) {
          // Eliminar archivos antiguos si estamos editando
          if (editingProject?.id && editingProject.project_files?.length) {
            const filePaths = editingProject.project_files.map(f => f.file_url);
            await supabase.storage.from('project-files').remove(filePaths);
            await supabase.from('project_files').delete().eq('project_id', projectId);
          }

          // Subir nuevos archivos
          for (const file of files) {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
            const filePath = `projects/${projectId}/${fileName}`;

            const { error: uploadError } = await supabase.storage
              .from('project-files')
              .upload(filePath, file, { cacheControl: '3600', upsert: false });

            if (uploadError) throw uploadError;

            await supabase.from('project_files').insert({
              project_id: projectId,
              file_name: file.name,
              file_url: filePath,
              file_size: file.size,
              file_type: file.type
            });
          }
        }

        onSuccess();
        return { success: true };
      } catch (error) {
        console.error('Error:', error);
        return { 
          error: error instanceof Error ? error.message : 'Error al guardar el proyecto' 
        };
      }
    },
    { success: undefined, error: undefined }
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      // Validar tamaño máximo (50MB por archivo)
      const isValid = selectedFiles.every(file => file.size <= 50 * 1024 * 1024);
      if (!isValid) {
        alert('Cada archivo debe ser menor a 50MB');
        return;
      }
      setFiles(selectedFiles);
    }
  };

  return (
    <div className="max-w-md mx-auto p-8 bg-card rounded-lg shadow-sm border border-border">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-foreground">
          {editingProject?.id ? 'Editar Proyecto' : 'Crear Nuevo Proyecto'}
        </h2>
        <p className="text-muted-foreground mt-2">
          {editingProject?.id
            ? 'Actualiza los detalles de tu proyecto' 
            : 'Completa la información para comenzar'}
        </p>
      </div>

      {state?.error && (
        <div className="p-4 mb-6 rounded-md border bg-destructive/10 border-destructive/20 text-destructive-foreground">
          {state.error}
        </div>
      )}

      <form action={formAction} className="space-y-5">
        <input type="hidden" name="id" value={editingProject?.id} />

        <div>
          <label htmlFor="title" className="block text-sm font-medium text-foreground mb-2">
            Título del Proyecto *
          </label>
          <input
            id="title"
            name="title"
            type="text"
            defaultValue={editingProject?.title}
            required
            minLength={3}
            className="w-full px-4 py-2.5 rounded-md border border-input bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            placeholder="Nombre del proyecto"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-foreground mb-2">
            Descripción
          </label>
          <textarea
            id="description"
            name="description"
            defaultValue={editingProject?.description || ''}
            rows={4}
            className="w-full px-4 py-2.5 rounded-md border border-input bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            placeholder="Describe los objetivos y detalles de tu proyecto..."
          />
        </div>

        <div>
          <label htmlFor="files" className="block text-sm font-medium text-foreground mb-2">
            Archivos {editingProject ? '(Selecciona para reemplazar)' : ''}
          </label>
          <div className="flex items-center justify-center w-full">
            <label htmlFor="files" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer border-input hover:bg-accent/50 transition-colors">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <UploadCloud className="w-8 h-8 mb-3 text-muted-foreground" />
                <p className="mb-2 text-sm text-muted-foreground">
                  <span className="font-semibold">Haz clic para subir</span> o arrastra los archivos
                </p>
                <p className="text-xs text-muted-foreground">
                  {files.length > 0 
                    ? `${files.length} archivo(s) seleccionado(s)` 
                    : 'PDF, DOC, JPG (Max. 50MB cada uno)'}
                </p>
              </div>
              <input
                id="files"
                name="files"
                type="file"
                multiple
                onChange={handleFileChange}
                className="hidden"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              />
            </label>
          </div>
        </div>

        <Button
          type="submit"
          disabled={isPending}
          className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:pointer-events-none transition-colors"
        >
          {isPending ? (
            <>
              <Loader2 className="animate-spin size-4" />
              {editingProject ? 'Actualizando...' : 'Creando...'}
            </>
          ) : editingProject ? (
            'Actualizar Proyecto'
          ) : (
            'Crear Proyecto'
          )}
        </Button>
      </form>
    </div>
  );
}