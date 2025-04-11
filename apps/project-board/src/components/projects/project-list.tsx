'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@ui';
import {
  FileText,
  Edit2,
  Trash2,
  UserPlus,
  X,
  Folder,
  File,
  Users,
  User,
} from 'lucide-react';
import { createClient } from '../../lib/supabase/client';
import {
  containerVariants,
  itemVariants,
  ProjectType,
} from '@utils';
import { useProject } from './hooks/useProject';
import { useProjectStore } from '../../store/project-store';
import { projectService } from '../../services/project-services';
import { useUserStore } from '../../store/auth-store';
import { AnimatePresence, motion } from 'framer-motion';
import { toast } from 'sonner';
import { DesignerAssignmentPanel } from './designer-assignment-panel';

export default function ProjectList() {
  const [assigningProject, setAssigningProject] = useState<string | null>(null);

  const { loading, fetchAssignedDesigners, handleDelete } = useProject();
  const { setEditingProject, setShowForm, projects, assignedDesigners } =
    useProjectStore();
  const { role } = useUserStore();

  const supabase = createClient();

  const handleAssignClick = (projectId: string) => {
    setAssigningProject(projectId);
  };

  const unassignDesigner = async (projectId: string, designerId: string) => {
    try {
      await projectService.unassignDesignerFromProject(projectId, designerId);
      fetchAssignedDesigners();
      // toast
      toast.success(
        `Diseñador ${designerId} desasignado del proyecto ${projectId}`
      );
    } catch (error) {
      console.error('Error unassigning designer:', error);
    }
  };

  function handleEditProject(project: ProjectType): void {
    setEditingProject(project);
    setShowForm(true);
  }

  return (
    <motion.div
      className="bg-card rounded-lg border border-border shadow-sm p-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div className="space-y-6" variants={containerVariants}>
        <AnimatePresence mode="wait">
          {projects.length === 0 ? (
            <motion.div
              className="text-center py-12"
              key="empty-state"
              variants={itemVariants}
            >
              {loading ? (
                <motion.div
                  className="flex flex-col items-center"
                  variants={itemVariants}
                >
                  <motion.div
                    className="w-16 h-16 border-8 border-t-8 border-blue-500 rounded-full animate-spin-slow"
                    style={{
                      borderTopColor: 'transparent',
                      borderBottomColor: 'transparent',
                      borderLeftColor: '#0aa6ab',
                      borderRightColor: '#36d984',
                    }}
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      ease: 'linear',
                      repeat: Infinity,
                    }}
                  />
                  <motion.p
                    className="text-lg font-medium text-foreground mt-4 text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    Cargando proyectos...
                  </motion.p>
                </motion.div>
              ) : (
                <motion.div
                  className="flex flex-col items-center"
                  variants={itemVariants}
                >
                  <motion.p
                    className="text-lg font-medium text-foreground"
                    initial={{ y: -10 }}
                    animate={{ y: 0 }}
                  >
                    No hay proyectos creados aún
                  </motion.p>
                  <motion.p
                    className="text-sm text-muted-foreground mt-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    Crea tu primer proyecto para comenzar
                  </motion.p>
                </motion.div>
              )}
            </motion.div>
          ) : (
            <AnimatePresence>
              {projects.map((project, index) => (
                <motion.div
                  key={project.id}
                  className="bg-card p-6 rounded-lg border border-border shadow-sm hover:shadow-md transition-shadow"
                  variants={itemVariants}
                  custom={index}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  whileHover={{ y: -2 }}
                  layout="position" // o layout="size" para más control
                  transition={{
                    type: 'spring',
                    stiffness: 300,
                    damping: 20,
                    // Configuración específica para animaciones de layout
                    layout: {
                      type: 'spring',
                      stiffness: 500,
                      damping: 30,
                      duration: 0.3,
                    },
                  }}
                >
                  <div className="flex flex-col sm:flex-row justify-between gap-4">
                    <div className="flex-1">
                      <motion.div
                        className="flex items-center gap-3"
                        whileTap={{ scale: 0.98 }}
                      >
                        <Folder className="h-5 w-5 text-primary" />
                        <h3 className="text-lg font-semibold text-foreground">
                          {project.title}
                        </h3>
                      </motion.div>

                      {project.description && (
                        <motion.p
                          className="text-muted-foreground mt-2 pl-8"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.1 }}
                        >
                          {project.description}
                        </motion.p>
                      )}

                      {(project.project_files ?? []).length > 0 && (
                        <motion.div
                          className="mt-4 pl-8"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.2 }}
                        >
                          <h4 className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            <span>Archivos adjuntos:</span>
                          </h4>
                          <ul className="space-y-2">
                            {(project.project_files ?? []).map((file) => (
                              <motion.li
                                key={file.id}
                                whileHover={{ x: 5 }}
                                transition={{ type: 'spring', stiffness: 400 }}
                              >
                                <Link
                                  href={
                                    supabase.storage
                                      .from('project-files')
                                      .getPublicUrl(file.file_url).data
                                      .publicUrl
                                  }
                                  target="_blank"
                                  className="inline-flex items-center text-sm text-primary hover:text-primary/80 hover:underline transition-colors"
                                >
                                  <File className="h-4 w-4 mr-2" />
                                  {file.file_name}
                                  <span className="text-xs text-muted-foreground ml-2">
                                    ({file.file_type})
                                  </span>
                                </Link>
                              </motion.li>
                            ))}
                          </ul>
                        </motion.div>
                      )}

                      {assignedDesigners[project.id!]?.length > 0 && (
                        <motion.div
                          className="mt-4 pl-8"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.3 }}
                        >
                          <h4 className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            <span>Diseñadores asignados:</span>
                          </h4>
                          <ul className="space-y-2">
                            {assignedDesigners[project.id!].map((designer) => (
                              <motion.li
                                key={designer.id}
                                className="flex items-center justify-strart gap-4 group"
                              >
                                <div className="flex items-center gap-2">
                                  <User className="h-4 w-4 text-muted-foreground" />
                                  <span className="text-sm text-foreground">
                                    {designer.email}
                                  </span>
                                </div>
                                <motion.button
                                  onClick={() =>
                                    unassignDesigner(project.id!, designer.id)
                                  }
                                  className="text-muted-foreground hover:text-destructive transition-colors opacity-0 group-hover:opacity-100"
                                  aria-label="Remover diseñador"
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                >
                                  <X className="h-4 w-4" />
                                </motion.button>
                              </motion.li>
                            ))}
                          </ul>
                        </motion.div>
                      )}
                    </div>

                    {role === 'manager' && (
                      <div className="flex sm:flex-col gap-2 sm:gap-2 justify-end">
                        <Button
                          variant="link"
                          size="sm"
                          onClick={() => handleEditProject(project)}
                          className="flex items-center gap-2 border hover:bg-secondary/80 hover:border-secondary/30"
                        >
                          <Edit2 className="h-4 w-4" />
                          <span>Editar</span>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleAssignClick(project.id!)}
                          className="flex items-center gap-2 border-input hover:bg-secondary/20 text-muted-foreground hover:border-secondary/30"
                        >
                          <UserPlus className="h-4 w-4" />
                          <span>Asignar</span>
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(project.id!)}
                          className="flex items-center gap-2 hover:bg-destructive/90"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span>Eliminar</span>
                        </Button>
                      </div>
                    )}
                  </div>

                  <AnimatePresence>
                    {assigningProject === project.id && (
                      <DesignerAssignmentPanel projectId={project.id} />
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
