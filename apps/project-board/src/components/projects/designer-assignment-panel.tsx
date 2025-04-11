// components/projects/designer-assignment-panel.tsx
'use client';

import { Button } from '@ui';
import { Search, User, UserX } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { DesignerType } from '@utils';
import { projectService } from '../../services/project-services';
import { useProject } from './hooks/useProject';

interface DesignerAssignmentPanelProps {
  projectId: string;
}

export const DesignerAssignmentPanel = ({
  projectId,
}: DesignerAssignmentPanelProps) => {
  const [searchEmail, setSearchEmail] = useState<string>('');
  const [searchResults, setSearchResults] = useState<DesignerType[]>([]);

  const { fetchAssignedDesigners } = useProject();

  const handleSearchDesigners = async (email: string) => {
    try {
      const results = await projectService.searchDesignersByEmail(email);
      setSearchResults(results);
    } catch (err) {
      console.error('Error searching designers:', err);
      setSearchResults([]);
    }
  };

  const assignDesigner = async (
    projectId: string,
    designerId: string,
  ) => {
    try {
      await projectService.assignDesignerToProject(projectId, designerId);
      fetchAssignedDesigners();
    } catch (error) {
      console.error('Error assigning designer:', error);
    }
  };

  const onSearchDesigner = (email: string) => {
    setSearchEmail(email);
    if (email.length === 3) {
      handleSearchDesigners(email);
    }
  };

  return (
    <motion.div
      className="mt-6 p-4 bg-popover rounded-lg border border-border"
    >
      <div className="flex items-center gap-2">
        <Search className="h-4 w-4 text-muted-foreground" />
        <motion.input
          type="text"
          value={searchEmail}
          onChange={(e) => onSearchDesigner(e.target.value)}
          placeholder="Buscar diseñador por email..."
          className="flex-1 px-3 py-2 text-sm border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
          onKeyDown={(e) => e.key === 'Enter' && onSearchDesigner(searchEmail)}
        />
        <Button
          onClick={() => onSearchDesigner(searchEmail)}
          size="sm"
          className="flex items-center gap-1 bg-primary hover:bg-primary/90"
        >
          <Search className="h-4 w-4" />
          <span>Buscar</span>
        </Button>
      </div>

      <AnimatePresence>
        {searchResults.length > 0 ? (
          <motion.ul
            className="space-y-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {searchResults.map((designer) => (
              <motion.li
                key={designer.id}
                className="flex justify-between items-center p-2 hover:bg-accent/10 rounded transition-colors"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{designer.email}</span>
                </div>
                <Button
                  size="sm"
                  onClick={() =>
                    assignDesigner(projectId, designer.id)
                  }
                  className="bg-primary hover:bg-primary/90"
                >
                  Asignar
                </Button>
              </motion.li>
            ))}
          </motion.ul>
        ) : searchEmail ? (
          <motion.div
            className="flex items-center justify-center gap-2 py-3 text-sm text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <UserX className="h-4 w-4" />
            <span>No se encontraron diseñadores con ese email</span>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.div>
  );
};
