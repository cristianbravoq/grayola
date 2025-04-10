import { RoleType } from '../types/auth-types';

export interface WithRoleProps {
  allowedRoles: RoleType | RoleType[]; // Uno o varios roles permitidos
  userRole: RoleType; // Rol actual del usuario
}

export function withPermissionRole<T extends object>(
  WrappedComponent: React.ComponentType<T>
) {
  return function WithRoleWrapper(
    props: WithRoleProps & Omit<T, keyof WithRoleProps>
  ) {
    const { allowedRoles, userRole, ...restProps } = props;

    // Verifica si el rol del usuario está permitido
    const isAllowed = Array.isArray(allowedRoles)
      ? allowedRoles.includes(userRole)
      : allowedRoles === userRole;

    if (!isAllowed) {
      return null; // O muestra un componente de acceso denegado
      // return <AccessDenied />;
    }

    return <WrappedComponent {...(restProps as T)} />;
  };
}