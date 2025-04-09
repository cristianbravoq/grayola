'use client';

import { useRouter } from 'next/navigation';
import ProjectsDashboard from '../../components/projects/projects-dashboard';

type Role = 'manager' | 'client' | 'designer';

interface DashboardViewProps {
  role: Role;
}

export function DashboardView({ role }: DashboardViewProps) {
  const router = useRouter();

  // Contenido específico por rol
  const renderRoleSpecificContent = () => {
    switch (role) {
      case 'manager':
        return (
          <div className="max-w-4xl mx-auto p-6 bg-card rounded-lg shadow-sm border border-border">
            <ProjectsDashboard />
          </div>
        );

      case 'client':
        return (
          <div className="bg-green-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-green-800">
              Panel de Cliente
            </h2>
            <p className="mt-2 text-green-600">
              Aquí puedes ver el estado de tus proyectos y comunicarte con tu
              equipo.
            </p>
            <button
              onClick={() => router.push('/my-projects')}
              className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Ver Mis Proyectos
            </button>
          </div>
        );

      case 'designer':
        return (
          <div className="bg-purple-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-purple-800">
              Panel de Diseñador
            </h2>
            <p className="mt-2 text-purple-600">
              Accede a los proyectos asignados y envía tus diseños para
              revisión.
            </p>
            <button
              onClick={() => router.push('/assigned-projects')}
              className="mt-4 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
            >
              Proyectos Asignados
            </button>
          </div>
        );

      default:
        return (
          <div className="bg-red-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-red-800">
              Rol no reconocido
            </h2>
            <p className="mt-2 text-red-600">
              No tienes asignado un dashboard específico. Contacta al
              administrador.
            </p>
            <button
              onClick={() => router.push('/sign-in')}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Cerrar Sesión
            </button>
          </div>
        );
    }
  };

  return (
    <div className="w-full bg-background py-8">
        {renderRoleSpecificContent()}
    </div>
  );
}
