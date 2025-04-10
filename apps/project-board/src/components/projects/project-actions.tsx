import { Button } from '@ui';
import { ProjectType, withPermissionRole } from '@utils';
import { Edit2, Trash2, UserPlus } from 'lucide-react';

type Props = {
  projectProp: ProjectType;
  handleEditProject: (project: ProjectType) => void;
  handleAssignClick: (projectId: string) => void;
  handleDelete: (projectId: string) => void;
};

export const ActionsProjects = ({
  projectProp,
  handleEditProject,
  handleAssignClick,
  handleDelete,
}: Props) => {
  return (
    <div className="flex sm:flex-col gap-2 sm:gap-2 justify-end">
      <Button
        variant="link"
        size="sm"
        onClick={() => handleEditProject(projectProp)}
        className="flex items-center gap-2 border hover:bg-secondary/80 hover:border-secondary/30"
      >
        <Edit2 className="h-4 w-4" />
        <span>Editar</span>
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleAssignClick(projectProp.id!)}
        className="flex items-center gap-2 border-input hover:bg-secondary/20 text-muted-foreground hover:border-secondary/30"
      >
        <UserPlus className="h-4 w-4" />
        <span>Asignar</span>
      </Button>
      <Button
        variant="destructive"
        size="sm"
        onClick={() => handleDelete(projectProp.id!)}
        className="flex items-center gap-2 hover:bg-destructive/90"
      >
        <Trash2 className="h-4 w-4" />
        <span>Eliminar</span>
      </Button>
    </div>
  );
};
