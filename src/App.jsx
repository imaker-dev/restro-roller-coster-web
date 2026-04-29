import React, { Suspense, useEffect } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import AuthenticatedRoutes from "./components/AuthenticatedRoutes";
import AuthPage from "./pages/AuthPage";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchMeData,
  setLoginFromTokenWithSource,
} from "./redux/slices/authSlice";
import AppLayoutSkeleton from "./layout/AppLayoutSkeleton";
import { usePreventNumberInputScroll, useScrollToTop } from "./hooks/useScroll";
import { useSocket } from "./hooks/useSocket";
import NetworkStatusBanner from "./components/NetworkStatusBanner";
import PublicMenuPage from "./pages/items/PublicMenuPage";
import { useQueryParams } from "./hooks/useQueryParams";
import { TOKEN_KEYS } from "./constants";

const App = () => {
  const dispatch = useDispatch();
  const { token } = useQueryParams();

  const { logIn, loading, meData, outletId } = useSelector(
    (state) => state.auth,
  );

  useSocket();

  useEffect(() => {
    if (token) {
      dispatch(
        setLoginFromTokenWithSource({
          token,
          source: "mobile",
        }),
      );

      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [token,dispatch]);

  useEffect(() => {
    if (logIn && !meData) {
      dispatch(fetchMeData());
    }
  }, [logIn, meData]);

  useScrollToTop();
  usePreventNumberInputScroll();

  if (loading) {
    return <AppLayoutSkeleton />;
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NetworkStatusBanner />
      <Routes>
        <Route path="/self-order" element={<PublicMenuPage />} />

        {/* AUTH */}
        {!logIn && <Route path="/auth" element={<AuthPage />} />}
        {logIn && <Route path="/auth" element={<Navigate to="/" replace />} />}

        {/* PROTECTED */}
        {logIn && meData && (
          <Route path="/*" element={<AuthenticatedRoutes />} />
        )}

        {/* NOT LOGGED IN */}
        {!logIn && <Route path="*" element={<Navigate to="/auth" replace />} />}
      </Routes>
    </Suspense>
  );
};

export default App;
