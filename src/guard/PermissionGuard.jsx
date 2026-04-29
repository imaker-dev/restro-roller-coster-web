import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { hasAccess } from "../utils/accessControl";

const PermissionGuard = ({ children, roles, permissions }) => {
  const { meData } = useSelector((state) => state.auth);

  if (!meData) return null; // or loader

  const allowed = hasAccess({
    userRole: meData.roles?.[0]?.slug,
    userPermissions: meData.permissions,
    roles,
    permissions,
  });

  if (!allowed) {
    return null;
    // return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default PermissionGuard;
