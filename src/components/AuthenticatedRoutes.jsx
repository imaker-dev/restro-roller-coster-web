import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import routeConfig from "../config/route-config";
import AppLayout from "../layout/AppLayout";
import PageNotFound from "../pages/PageNotFound";
import UnauthorizedPage from "../pages/UnauthorizedPage";
import { hasAccess } from "../utils/accessControl";

const AuthenticatedRoutes = () => {
  const { meData } = useSelector((state) => state.auth);

  if (!meData) return null;

  const userRole = meData.roles?.[0]?.slug;
  const userPermissions = meData.permissions || [];

  return (
    <AppLayout>
      <Routes>
        {routeConfig.map((route, idx) => {
          const {
            path,
            element: DefaultComponent,
            elements,
            roles,
            permissions,
          } = route;

          const SelectedComponent =
            (elements && elements[userRole]) || DefaultComponent;

          if (!SelectedComponent) return null;

          const allowed = hasAccess({
            userRole,
            userPermissions,
            roles,
            permissions,
          });

          return (
            <Route
              key={idx}
              path={path}
              element={
                allowed ? (
                  <SelectedComponent />
                ) : (
                  <Navigate to="/unauthorized" replace />
                )
              }
            />
          );
        })}

        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </AppLayout>
  );
};

export default AuthenticatedRoutes;
