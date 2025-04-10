'use client';

import { Button } from '@ui';
import { Plus } from 'lucide-react';
import {
  containerVariants,
  counterVariants,
  itemVariants,
  RoleType,
  withPermissionRole,
} from '@utils';
import { useProjectStore } from '../../store/project-store';
import { useUserStore } from '../../store/auth-store';
import { motion } from 'framer-motion';

export const ProjectHead = () => {
  const { projects } = useProjectStore();
  const { role } = useUserStore();
  const { setEditingProject, setShowForm } = useProjectStore();

  const NewProjectButton = (props: { onClick: () => void }) => (
    <Button
      {...props}
      className="px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition-colors shadow-sm hover:shadow-primary/30"
    >
      <Plus className="mr-2 h-4 w-4" />
      Nuevo Proyecto
    </Button>
  );
  const CreateProjectWithPermissions = withPermissionRole(NewProjectButton);

  function handleCreateProject(): void {
    setShowForm(true);
    setEditingProject(null);
  }

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="mb-6"
      >
        <motion.h1
          variants={itemVariants}
          className="text-2xl font-bold text-foreground"
        >
          Mis Proyectos
        </motion.h1>

        <motion.p
          variants={counterVariants}
          className="text-muted-foreground mt-1"
          key={projects.length} // Esto reinicia la animación cuando cambia el conteo
        >
          {projects.length} {projects.length === 1 ? 'proyecto' : 'proyectos'}{' '}
          en total
        </motion.p>
      </motion.div>

      <CreateProjectWithPermissions
        allowedRoles={['client']}
        userRole={role as RoleType}
        onClick={() => handleCreateProject()}
      />
    </div>
  );
};
