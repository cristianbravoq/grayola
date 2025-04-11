'use client';

import { useActionState, useEffect, useState } from 'react';
import { Button } from '@ui';
import { containerVariants, fileUploadVariants, formItemVariants, FormStateType, ProjectType } from '@utils';
import { AlertCircle, Loader2, UploadCloud } from 'lucide-react';
import { createClient } from '../../lib/supabase/client';
import { useProject } from './hooks/useProject';
import { useProjectStore } from '../../store/project-store';
import { projectService } from '../../services/project-services';
import { AnimatePresence, motion } from 'framer-motion';
import { toast } from 'sonner';

export default function ProjectForm() {
  const { fetchProjects } = useProject();
  const { editingProject, showForm, setShowForm } = useProjectStore();

  // cuando se desmonta el componente, cerrar el formulario
  useEffect(() => {
    return () => {
      setShowForm(false);
    };
  }, [setShowForm]);

  const [files, setFiles] = useState<File[]>([]);
  const supabase = createClient();

  const [state, formAction, isPending] = useActionState<
    FormStateType,
    FormData
  >(
    async (prevState, formData) => {
      try {
        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser();
        if (authError || !user) throw new Error('No autenticado');

        // Validación básica
        const title = formData.get('title') as string;
        if (!title || title.trim().length < 3) {
          throw new Error('El título debe tener al menos 3 caracteres');
        }

        const projectData: Partial<ProjectType> = {
          title: title.trim(),
          description: (formData.get('description') as string) || null,
          user_id: user.id,
        };

        // Manejo diferente para edición vs creación
        const projectId = await projectService.createOrUpdateProject(
          projectData,
          user.id,
          editingProject?.id
        );
        if (!projectId) {
          throw new Error('Error al crear o actualizar el proyecto');
        }

        // Subida de archivos (solo si es nuevo o se están reemplazando)
        if (files.length > 0) {
          if (editingProject?.id && editingProject.project_files?.length) {
            const filePaths = editingProject.project_files.map(
              (f) => f.file_url
            );
            await projectService.deleteProjectFiles(projectId, filePaths);
          }

          await projectService.uploadProjectFiles(projectId, files);
        }

        fetchProjects();
        setShowForm(false);

        // Toast de éxito
        toast.success(
          editingProject?.id
            ? 'Proyecto actualizado con éxito'
            : 'Proyecto creado con éxito'
        );
        // Limpiar archivos seleccionados
        setFiles([]);
        // Limpiar el formulario
        formData.delete('title');
        formData.delete('description');
        formData.delete('files');
        return { success: true };
      } catch (error) {
        console.error('Error:', error);
        return {
          error:
            error instanceof Error
              ? error.message
              : 'Error al guardar el proyecto',
        };
      }
    },
    { success: undefined, error: undefined }
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      // Validar tamaño máximo (50MB por archivo)
      const isValid = selectedFiles.every(
        (file) => file.size <= 50 * 1024 * 1024
      );
      if (!isValid) {
        alert('Cada archivo debe ser menor a 50MB');
        return;
      }
      setFiles(selectedFiles);
    }
  };

  if (!showForm) return null;

  return (
    <motion.div
      className="max-w-md mx-auto p-8 bg-card rounded-lg shadow-sm border border-border"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div 
        className="text-center mb-8"
        variants={formItemVariants}
      >
        <motion.h2 
          className="text-2xl font-bold text-foreground"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {editingProject?.id ? 'Editar Proyecto' : 'Crear Nuevo Proyecto'}
        </motion.h2>
        <motion.p 
          className="text-muted-foreground mt-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {editingProject?.id
            ? 'Actualiza los detalles de tu proyecto'
            : 'Completa la información para comenzar'}
        </motion.p>
      </motion.div>

      <AnimatePresence>
        {state?.error && (
          <motion.div
            className="p-4 mb-6 rounded-md bg-destructive/10 border border-destructive/30 text-destructive-foreground flex items-start gap-3"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <AlertCircle className="h-5 w-5 mt-0.5 text-destructive" />
            <div>
              <p className="font-medium">Error</p>
              <p className="text-sm">{state.error}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.form 
        action={formAction} 
        className="space-y-5"
        variants={{
          visible: {
            transition: {
              staggerChildren: 0.1,
              delayChildren: 0.2
            }
          }
        }}
      >
        <input type="hidden" name="id" value={editingProject?.id} />

        <motion.div variants={formItemVariants}>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-foreground mb-2"
          >
            Título del Proyecto *
          </label>
          <motion.input
            id="title"
            name="title"
            type="text"
            defaultValue={editingProject?.title}
            required
            minLength={3}
            className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 transition-colors"
            placeholder="Nombre del proyecto"
            whileFocus={{ 
              scale: 1.01,
              boxShadow: "0 0 0 2px rgba(59, 130, 246, 0.5)"
            }}
          />
        </motion.div>

        <motion.div variants={formItemVariants}>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-foreground mb-2"
          >
            Descripción
          </label>
          <motion.textarea
            id="description"
            name="description"
            defaultValue={editingProject?.description || ''}
            rows={4}
            className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 transition-colors"
            placeholder="Describe los objetivos y detalles de tu proyecto..."
            whileFocus={{ 
              scale: 1.01,
              boxShadow: "0 0 0 2px rgba(59, 130, 246, 0.5)"
            }}
          />
        </motion.div>

        <motion.div variants={formItemVariants}>
          <label
            htmlFor="files"
            className="block text-sm font-medium text-foreground mb-2"
          >
            Archivos {editingProject ? '(Selecciona para reemplazar)' : ''}
          </label>
          <div className="flex items-center justify-center w-full">
            <motion.label
              htmlFor="files"
              className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer border-input hover:bg-accent/10 transition-colors group"
              variants={fileUploadVariants}
              initial="rest"
              whileHover="hover"
              whileTap="tap"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <motion.div
                  animate={{ 
                    y: [0, -5, 0],
                  }}
                  transition={{ 
                    repeat: Infinity, 
                    duration: 2,
                    ease: "easeInOut"
                  }}
                >
                  <UploadCloud className="w-8 h-8 mb-3 text-muted-foreground transition-colors" />
                </motion.div>
                <p className="mb-2 text-sm text-muted-foreground transition-colors">
                  <span className="font-semibold">Haz clic para subir</span> o
                  arrastra los archivos
                </p>
                <p className="text-xs text-muted-foreground transition-colors">
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
            </motion.label>
          </div>
        </motion.div>

        <motion.div 
          className="flex gap-3 pt-2"
          variants={formItemVariants}
        >
          <Button
            type="submit"
            disabled={isPending}
            className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm hover:shadow-primary/20 transition-all"
          >
            {isPending ? (
              <>
                <Loader2 className="animate-spin h-4 w-4 mr-2" />
                {editingProject ? 'Actualizando...' : 'Creando...'}
              </>
            ) : editingProject ? (
              'Actualizar Proyecto'
            ) : (
              'Crear Proyecto'
            )}
          </Button>
        </motion.div>
      </motion.form>
    </motion.div>
  );
}
