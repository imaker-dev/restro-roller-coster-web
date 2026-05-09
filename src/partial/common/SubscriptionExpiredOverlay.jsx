// components/SubscriptionExpiredOverlay.jsx
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AlertTriangle, Info, LogOut, Clock } from "lucide-react";
import { clearLoginState } from "../../redux/slices/authSlice";
import UserAvatar from "../../components/UserAvatar";

const SubscriptionExpiredOverlay = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { meData } = useSelector((state) => state.auth);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => setIsVisible(true), 10);
      document.body.style.overflow = "hidden";
    } else {
      setIsVisible(false);
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleLogout = () => dispatch(clearLoginState());

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      if (onClose) onClose();
    }, 300);
  };

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center transition-all duration-300 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div
        className={`relative w-full max-w-md transform transition-all duration-300 ${
          isVisible ? "scale-100 translate-y-0" : "scale-95 translate-y-4"
        }`}
      >
        <div className="overflow-hidden rounded-lg bg-white shadow-2xl ring-1 ring-black/5">
          {/* Top accent bar */}
          <div className="h-1 w-full bg-gradient-to-r from-red-400 via-rose-500 to-orange-400" />

          {/* Header */}
          <div className="px-6 pt-7 pb-5 text-center">
            {/* Icon */}
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 ring-1 ring-red-100">
              <AlertTriangle
                className="h-7 w-7 text-red-500"
                strokeWidth={1.75}
              />
            </div>

            {/* Badge */}
            <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1 ring-1 ring-red-100">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-500" />
              <span className="text-[11px] font-semibold uppercase tracking-widest text-red-600">
                Access Restricted
              </span>
            </div>

            <h2 className="text-[22px] font-bold tracking-tight text-gray-900">
              Subscription Expired
            </h2>
            <p className="mt-1.5 text-sm leading-relaxed text-gray-500">
              Your plan has lapsed. Please renew to restore full access to all
              features.
            </p>
          </div>

          {/* Divider */}
          <div className="mx-6 border-t border-gray-100" />

          {/* User card */}
          {meData && (
            <div className="mx-6 mt-4">
              <div className="flex items-center gap-3 rounded-xl bg-gray-50 px-4 py-3 ring-1 ring-gray-100">
                <UserAvatar name={meData.name} size="lg" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-gray-900">
                    {meData.name}
                  </p>
                  <div className="mt-0.5 flex items-center gap-1.5">
                    {meData.roles?.[0] && (
                      <span className="text-xs text-gray-400">
                        {meData.roles[0].name}
                      </span>
                    )}
                    {meData.roles?.[0] && meData.email && (
                      <span className="text-gray-300">·</span>
                    )}
                    {meData.email && (
                      <span className="truncate text-xs text-gray-400">
                        {meData.email}
                      </span>
                    )}
                  </div>
                </div>
                {/* Expired pill */}
                {/* <div className="flex flex-shrink-0 items-center gap-1 rounded-md bg-red-50 px-2 py-1 ring-1 ring-red-100">
                  <Clock className="h-3 w-3 text-red-400" strokeWidth={2} />
                  <span className="text-[10px] font-semibold text-red-500">
                    Expired
                  </span>
                </div> */}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="space-y-2.5 px-6 pt-4 pb-5">
            <button
              onClick={handleLogout}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gray-900 px-4 py-3 text-sm font-semibold text-white transition-all duration-150 hover:bg-gray-800 active:scale-[0.98]"
            >
              <LogOut className="h-4 w-4" strokeWidth={2} />
              Logout
            </button>

            <button
              onClick={handleClose}
              className="w-full rounded-xl px-4 py-2.5 text-sm font-medium text-gray-400 transition-all duration-150 hover:bg-gray-50 hover:text-gray-600 active:scale-[0.98]"
            >
              I'll renew later
            </button>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-center gap-2 border-t border-gray-100 bg-gray-50 px-6 py-3.5">
            <Info className="h-3.5 w-3.5 flex-shrink-0 text-gray-300" />
            <span className="text-xs text-gray-400">
              Contact your administrator to renew the subscription
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionExpiredOverlay;
