// components/OutletGuard.jsx
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import NoOutletsMessage from "../partial/common/NoOutletsMessage";
import { ROLES } from "../constants";
import { ROUTE_PATHS } from "../config/paths";

// Routes that DONT need outlet check
const EXEMPT_ROUTES = [
  ROUTE_PATHS.ALL_OUTLETS,
  ROUTE_PATHS.OUTLET_ADD,
  ROUTE_PATHS.GUIDE,
];

const OutletGuard = ({ children }) => {
  const location = useLocation();
  const { meData, hasOutlet } = useSelector((state) => state.auth);

  const isExemptRoute = EXEMPT_ROUTES.some((route) =>
    location.pathname.startsWith(route),
  );

  // master admins can access everything
  const isMasterAdmin = meData?.roles?.[0]?.slug === ROLES.MASTER;

  // Don't block if:
  // 1. Route is exempt OR
  // 2. User has outlets OR
  // 3. User is master admin
  if (isExemptRoute || hasOutlet || isMasterAdmin) {
    return children;
  }

  return <NoOutletsMessage />;
};

export default OutletGuard;
