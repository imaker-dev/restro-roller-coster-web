// components/common/ExpirationOverlay.jsx
import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";

export default function ExpirationOverlay({
  isOpen,
  message = "Your session has expired or the order cannot be processed at this time.",
  onClose,
}) {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{
        background: "rgba(0,0,0,0.6)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
      }}
      onClick={(e) => e.target === e.currentTarget && onClose?.()}
    >
      {/* Modal card */}
      <div
        className="relative w-full max-w-sm rounded-xl overflow-hidden"
        style={{
          background: "#FFFFFF",
          boxShadow:
            "0 2px 0 0 rgba(0,0,0,0.04), 0 20px 60px rgba(0,0,0,0.12), 0 4px 16px rgba(0,0,0,0.06)",
          border: "0.5px solid rgba(0,0,0,0.06)",
        }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="exp-title"
      >
        {/* Inner padding */}
        <div className="relative z-10 p-6">
          {/* Icon */}
          <div className="flex justify-center mb-5">
            <div className="w-16 h-16 rounded-full bg-amber-50 flex items-center justify-center border border-amber-100">
              <AlertTriangle
                size={30}
                className="text-amber-500"
                strokeWidth={1.5}
              />
            </div>
          </div>

          {/* Title */}
          <h3
            id="exp-title"
            className="text-center text-lg font-bold text-[#1C1C1E] mb-2"
          >
            Session Expired
          </h3>

          {/* Subtitle */}
          <p className="text-center text-sm text-[#6C6C70] leading-relaxed mb-5">
            {message}
          </p>

          {/* Info box */}
          <div className="bg-[#FAF8F5] rounded-xl p-4 mb-5 border border-[#E8E4DF]">
            <div className="flex gap-3">
              <div className="w-1.5 h-1.5 min-w-[6px] rounded-full mt-[5px] bg-primary-500" />
              <p className="text-xs text-[#6C6C70] leading-relaxed">
                Please scan the QR code again or contact a member of restaurant
                staff to begin a new session.
              </p>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-[#F2F2F7] mb-5" />

          {/* Primary CTA */}
          <button
            onClick={onClose}
            className="w-full btn bg-primary-500 hover:bg-primary-600 text-white py-3 active:scale-[0.98] transition-all"
          >
            Start New Session
          </button>
        </div>
      </div>
    </div>
  );
}
