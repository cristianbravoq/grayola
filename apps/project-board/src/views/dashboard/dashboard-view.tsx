"use client";

import { containerVariants, itemVariants, RoleType, withPermissionRole } from '@utils';
import ProjectForm from '../../components/projects/project-form';
import { ProjectHead } from '../../components/projects/project-head';
import ProjectList from '../../components/projects/project-list';
import { useEffect } from 'react';
import { useUserStore } from '../../store/auth-store';
import { motion } from 'framer-motion';


interface DashboardViewProps {
  role: RoleType;
  id: string;
}

export const DashboardView = ({ role, id }: DashboardViewProps) => {
  const ProjectFormWithPermissions = withPermissionRole(ProjectForm);
  const ProjectListWithPermissions = withPermissionRole(ProjectList);
  const { setRole, setId } = useUserStore()

  useEffect(() => { 
    setRole(role)
    setId(id)
  }, [role, setRole, setId, id]);

  return (
    <motion.div 
      className="w-full bg-green-50 bg-opacity-70 p-6 rounded-lg"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div 
        className="max-w-4xl mx-auto p-6 bg-card rounded-lg shadow-sm border border-border"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <motion.div 
          className="space-y-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants}>
            <ProjectHead />
          </motion.div>

          <motion.div variants={itemVariants}>
            <ProjectFormWithPermissions
              allowedRoles={['client', 'manager']}
              userRole={role}
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <ProjectListWithPermissions
              allowedRoles={['manager', 'designer']}
              userRole={role}
            />
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}