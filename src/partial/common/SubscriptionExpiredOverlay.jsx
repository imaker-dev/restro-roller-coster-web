// components/SubscriptionExpiredOverlay.jsx
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  LogOut,
  Clock,
  CreditCard,
  PhoneCall,
  ArrowRight,
  Info,
  AlertCircle,
} from "lucide-react";
import { clearLoginState } from "../../redux/slices/authSlice";
import UserAvatar from "../../components/UserAvatar";
import { useNavigate } from "react-router-dom";
import { ROUTE_PATHS } from "../../config/paths";

const SubscriptionExpiredOverlay = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
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
      className={`fixed inset-0 z-[9999] flex items-end sm:items-center justify-center sm:p-4 transition-all duration-300 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-zinc-950/60 backdrop-blur-xs"
        onClick={handleClose}
      />

      {/* Sheet */}
      <div
        className={`relative w-full sm:max-w-[400px] transform transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${
          isVisible
            ? "translate-y-0 opacity-100 sm:scale-100"
            : "translate-y-full sm:translate-y-2 sm:scale-[0.98] sm:opacity-0"
        }`}
      >
        {/* Drag pill — mobile only */}
        <div className="sm:hidden absolute top-3 left-1/2 -translate-x-1/2 w-8 h-[3px] rounded-full bg-zinc-300 z-10" />

        <div className="overflow-hidden rounded-t-[28px] sm:rounded-[20px] bg-white shadow-[0_-2px_40px_rgba(0,0,0,0.08),0_40px_80px_rgba(0,0,0,0.2)]">
          {/* ── HEADER ── */}
          <div className="p-4 border-b border-zinc-100">
            {/* Status badge */}
            <div className="inline-flex items-center gap-1.5 bg-red-50 border border-red-100 rounded-full pl-2 pr-3 py-1 mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              <span className="text-[10.5px] font-semibold text-red-600 tracking-wide uppercase">
                Subscription Expired
              </span>
            </div>

            {/* Icon + text perfectly aligned */}
            <h2 className="text-[21px] font-bold text-zinc-900 tracking-tight leading-tight mb-3">
              Your access has been suspended
            </h2>

            <p className="text-[13px] text-zinc-400 leading-relaxed">
              Renew your plan to instantly restore full access to your workspace
              and all features.
            </p>
          </div>

          {/* ── USER + INFO ── */}
          <div className="p-4 space-y-3 border-b border-zinc-100">
            {meData && (
              <div className="flex items-center gap-3">
                <UserAvatar name={meData.name} size="lg" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13.5px] font-semibold text-zinc-800">
                    {meData.name}
                  </p>
                  <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                    {meData.email && (
                      <span className="truncate text-[11.5px] text-zinc-400">
                        {meData.email}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Franchise note */}
            <div className="flex items-start gap-2.5 bg-zinc-50 rounded-xl border border-zinc-100 px-3.5 py-3">
              <PhoneCall
                size={13}
                strokeWidth={2}
                className="text-zinc-400 mt-0.5 flex-shrink-0"
              />
              <p className="text-[12px] text-zinc-500 leading-relaxed">
                <span className="font-semibold text-zinc-700">
                  Contact your franchise owner
                </span>{" "}
                to renew your subscription and restore access right away.
              </p>
            </div>
          </div>

          {/* ── ACTIONS ── */}
          <div className="p-4 space-y-2.5">
            <button
              onClick={() => {
                handleClose();
                navigate(ROUTE_PATHS.MY_SUBSCRIPTION);
              }}
              className="group w-full flex items-center gap-3 rounded-[14px] bg-zinc-900 hover:bg-zinc-800 px-5 py-3.5 text-[13.5px] font-semibold text-white transition-all duration-200 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2"
            >
              <CreditCard
                className="h-[15px] w-[15px] opacity-60 flex-shrink-0"
                strokeWidth={2}
              />
              <span>Renew Plan</span>
              <ArrowRight
                size={14}
                strokeWidth={2}
                className="ml-auto opacity-30 transition-all duration-200 group-hover:opacity-80 group-hover:translate-x-0.5"
              />
            </button>

            <button
              onClick={handleClose}
              className="w-full rounded-[14px] px-5 py-3 text-[13.5px] font-medium text-zinc-400 hover:text-zinc-700 hover:bg-zinc-50 transition-all duration-150 active:scale-[0.98] focus:outline-none"
            >
              I'll renew later
            </button>
          </div>

          {/* ── FOOTER ── */}
          <div className="flex items-center justify-between px-6 py-3.5 border-t border-zinc-100">
            <div className="flex items-center gap-1.5">
              <Info className="h-3 w-3 text-zinc-300 flex-shrink-0" />
              <span className="text-[11px] text-zinc-400">
                Renew to continue using all features
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-[11.5px] font-medium text-zinc-400 hover:text-zinc-700 transition-colors focus:outline-none"
            >
              <LogOut size={11} strokeWidth={2} />
              Sign out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionExpiredOverlay;
