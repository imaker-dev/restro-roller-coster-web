// components/GlobalErrorManager.jsx
import { useState, useEffect, useCallback } from "react";
import { ERROR_TYPES } from "../utils/errorHandler";
import SubscriptionExpiredOverlay from "../partial/common/SubscriptionExpiredOverlay";

const GlobalErrorManager = () => {
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);

  const handleApiError = useCallback((event) => {
    const { type } = event.detail;

    if (type === ERROR_TYPES.SUBSCRIPTION) {
      setShowSubscriptionModal(true);
    }
  }, []);

  useEffect(() => {
    window.addEventListener("api-error", handleApiError);
    return () => window.removeEventListener("api-error", handleApiError);
  }, [handleApiError]);

  return (
    <SubscriptionExpiredOverlay
      isOpen={showSubscriptionModal}
      onClose={() => setShowSubscriptionModal(false)}
    />
  );
};

export default GlobalErrorManager;