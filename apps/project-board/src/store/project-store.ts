// store/project-store.ts
import { create } from 'zustand';
import { DesignerType, ProjectType } from '@utils';

type ProjectState = {
  projects: ProjectType[];
  setProjects: (projects: ProjectType[]) => void;
  assignedDesigners: Record<string, DesignerType[]>;
  setAssignedDesigners: (designers: Record<string, DesignerType[]>) => void;
  editingProject: ProjectType | null;
  setEditingProject: (project: ProjectType | null) => void;
  showForm: boolean;
  setShowForm: (show: boolean) => void;
};

export const useProjectStore = create<ProjectState>((set) => ({
  projects: [],
  setProjects: (projects) => set({ projects }),
  assignedDesigners: {},
  setAssignedDesigners: (designers) => set({ assignedDesigners: designers }),
  editingProject: null,
  setEditingProject: (project) => set({ editingProject: project }),
  showForm: false,
  setShowForm: (show) => set({ showForm: show }),
}));
