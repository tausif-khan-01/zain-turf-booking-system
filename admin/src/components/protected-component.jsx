import PropTypes from "prop-types";
import { useRBAC } from "@/hooks/use-rbac";

export default function ProtectedComponent({
  children,
  requiredRole,
  requiredPermissions,
  fallback = null,
}) {
  const { hasRole, hasAllPermissions } = useRBAC();

  const hasAccess = () => {
    if (requiredRole && !hasRole(requiredRole)) {
      return false;
    }
    if (requiredPermissions && !hasAllPermissions(requiredPermissions)) {
      return false;
    }
    return true;
  };

  return hasAccess() ? children : fallback;
}

ProtectedComponent.propTypes = {
  children: PropTypes.node.isRequired,
  requiredRole: PropTypes.string,
  requiredPermissions: PropTypes.arrayOf(PropTypes.string),
  fallback: PropTypes.node,
}; 