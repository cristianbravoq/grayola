'use client';
import { useState, useEffect } from 'react';
import ProjectForm from './project-form';
import ProjectList from './project-list';
import { createClient } from '../../lib/supabase/client';

export default function ProjectsDashboard() {
  const [projects, setProjects] = useState([]);
  const [editingProject, setEditingProject] = useState(null);
  const supabase = createClient();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return;

    const { data, error } = await supabase
      .from('projects')
      .select('*, project_files(*)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (!error) setProjects(data);
  };

  const handleDelete = async (projectId: string) => {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', projectId);

    if (!error) fetchProjects();
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Mis Proyectos</h1>
          <p className="text-muted-foreground mt-1">
            {projects.length} {projects.length === 1 ? 'proyecto' : 'proyectos'} en total
          </p>
        </div>
        
        {!editingProject && (
          <button
            onClick={() => setEditingProject({})}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            Nuevo Proyecto
          </button>
        )}
      </div>

      {editingProject && (
          <ProjectForm 
            editingProject={editingProject} 
            onSuccess={() => {
              setEditingProject(null);
              fetchProjects();
            }} 
          />
      )}

      <div className="bg-card rounded-lg border border-border shadow-sm p-6">
        <ProjectList 
          projects={projects} 
          onEdit={setEditingProject} 
          onDelete={handleDelete} 
        />
      </div>
    </div>
  );
}