import { useAuth } from "@/contexts/auth-context";
import { ROLES, ROLE_PERMISSIONS } from "@/config/roles";

export function useRBAC() {
  const { user } = useAuth();

  const hasRole = (role) => {
    return user?.role === role;
  };

  const hasPermission = (permission) => {
    if (!user?.role) return false;
    return ROLE_PERMISSIONS[user.role]?.includes(permission) || false;
  };

  const hasAnyPermission = (permissions) => {
    return permissions.some(permission => hasPermission(permission));
  };

  const hasAllPermissions = (permissions) => {
    return permissions.every(permission => hasPermission(permission));
  };

  return {
    hasRole,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    isAdmin: hasRole(ROLES.ADMIN),
    isManager: hasRole(ROLES.MANAGER),
    userRole: user?.role,
  };
} 