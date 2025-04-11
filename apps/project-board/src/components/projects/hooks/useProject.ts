import { use, useEffect, useState } from 'react';
import { projectService } from 'apps/project-board/src/services/project-services';
import { useProjectStore } from 'apps/project-board/src/store/project-store';
import { useUserStore } from 'apps/project-board/src/store/auth-store';

export const useProject = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const { setProjects, setAssignedDesigners } = useProjectStore();
  const { role, id } = useUserStore();

  useEffect(() => {
    fetchProjects();
    fetchAssignedDesigners();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    try {   
      // Solo pasa role y userId si están definidos
      const data = await projectService.getProjects(
        role || undefined, 
        id || undefined
      );
      
      setProjects(data || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
      setProjects([]); // Asegura que projects nunca sea undefined
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (projectId: string) => {
    try {
      await projectService.deleteProject(projectId);
      await fetchProjects();
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  const fetchAssignedDesigners = async () => {
    try {
      const data = await projectService.getAssignedDesigners();
      const transformed = data.reduce((acc: any, curr: any) => {
        if (!acc[curr.project_id]) {
          acc[curr.project_id] = [];
        }
        acc[curr.project_id].push({
          id: curr.designer_id,
          email: curr.designer_email
        });
        return acc;
      }, {} as Record<string, {id: string, email: string}[]>);
      
      setAssignedDesigners(transformed);
    } catch (error) {
      console.error('Error fetching designers:', error);
    }
  };

  return {
    loading,
    fetchProjects,
    fetchAssignedDesigners,
    handleDelete,
  };
};
