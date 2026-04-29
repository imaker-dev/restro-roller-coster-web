// export const hasAccess = ({
//   userRole,
//   userPermissions = [],
//   roles,
//   permissions,
//   public: isPublic,
// }) => {
//   // PUBLIC ROUTE → ALWAYS ALLOW
//   if (isPublic) return true;

import { ROUTE_PATHS } from "../config/paths";
import { ROLES } from "../constants";

//   const roleAllowed =
//     !roles || roles.length === 0 || roles.includes(userRole);

//   const permissionAllowed =
//     !permissions ||
//     permissions.length === 0 ||
//     permissions.every((p) => userPermissions.includes(p));

//   return roleAllowed && permissionAllowed;
// };






const SPECIAL_USER_ID = 215;

const SPECIAL_ALLOWED_PATHS = [
  // Overview
  ROUTE_PATHS.HOME,

  // Reports
  ROUTE_PATHS.REPORTS_LIVE_OPERATIONS,
  ROUTE_PATHS.REPORTS_SHIFT_HISTORY,
  ROUTE_PATHS.REPORTS_DAY_END_SUMMARY,
  ROUTE_PATHS.ALL_REPORTS,

  // Operations (ONLY these)
  ROUTE_PATHS.ALL_ORDERS,
  ROUTE_PATHS.ALL_CUSTOMERS,
];

export const hasAccess = ({
  userRole,
  userPermissions = [],
  userId,
  path,
  roles,
  permissions,
  public: isPublic,
}) => {
  //  PUBLIC always allowed
  if (isPublic) return true;

  if (Number(userId) === SPECIAL_USER_ID) {
    if (roles?.includes(ROLES.KITCHEN) || roles?.includes(ROLES.BARTENDER)) {
      return false;
    }

    return SPECIAL_ALLOWED_PATHS.includes(path);
  }

  //  NORMAL RBAC (others)
  const roleAllowed = !roles || roles.length === 0 || roles.includes(userRole);

  const permissionAllowed =
    !permissions ||
    permissions.length === 0 ||
    permissions.every((p) => userPermissions.includes(p));

  return roleAllowed && permissionAllowed;
};
