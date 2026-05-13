// components/common/ExpirationOverlay.jsx
import { useEffect, useState } from "react";

export default function ExpirationOverlay({ isOpen, message, onClose }) {
  const [show, setShow] = useState(false);
  const [animate, setAnimate] = useState(false);
  const [ringAnimate, setRingAnimate] = useState(false);

  const displayMessage =
    message?.trim() ||
    "Your session has expired or the order cannot be processed at this time.";

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setShow(true);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setAnimate(true);
          // Delay ring animation slightly
          setTimeout(() => setRingAnimate(true), 400);
        });
      });
    } else {
      document.body.style.overflow = "";
      setAnimate(false);
      setRingAnimate(false);
      const timer = setTimeout(() => setShow(false), 300);
      return () => clearTimeout(timer);
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleClose = () => {
    setAnimate(false);
    setRingAnimate(false);
    setTimeout(() => {
      onClose?.();
    }, 300);
  };

  if (!show) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-6 transition-all duration-300 ${
        animate ? "opacity-100" : "opacity-0"
      }`}
      style={{
        background: animate ? "rgba(0, 0, 0, 0.5)" : "rgba(0, 0, 0, 0)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
      }}
      onClick={(e) => e.target === e.currentTarget && handleClose()}
    >
      <div
        className={`w-full sm:max-w-[380px] transition-all duration-300 ease-out ${
          animate
            ? "translate-y-0 opacity-100"
            : "translate-y-full sm:translate-y-8 opacity-0"
        }`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="exp-title"
      >
        {/* Card */}
        <div
          className="w-full rounded-t-[28px] sm:rounded-[28px] overflow-hidden"
          style={{
            background: "#FFFFFF",
            boxShadow:
              "0 -8px 40px rgba(0,0,0,0.12), 0 -2px 8px rgba(0,0,0,0.06)",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="px-8 pt-10 pb-8 sm:px-10 sm:pt-12 sm:pb-10">
            {/* Timer circle */}
            <div className="flex justify-center mb-8">
              <div className="relative">
                <svg
                  className="w-[88px] h-[88px] -rotate-90"
                  viewBox="0 0 88 88"
                >
                  {/* Background circle */}
                  <circle
                    cx="44"
                    cy="44"
                    r="40"
                    fill="none"
                    stroke="#F5F5F7"
                    strokeWidth="3"
                  />
                  {/* Animated progress arc */}
                  <circle
                    cx="44"
                    cy="44"
                    r="40"
                    fill="none"
                    stroke="#FF3B30"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 40}`}
                    strokeDashoffset={`${2 * Math.PI * 40}`}
                    style={{
                      transition:
                        "stroke-dashoffset 1.2s cubic-bezier(0.4, 0, 0.2, 1)",
                      strokeDashoffset: ringAnimate
                        ? `${(1 - 0.75) * 2 * Math.PI * 40}`
                        : `${2 * Math.PI * 40}`,
                    }}
                  />
                </svg>

                {/* Center icon with scale animation */}
                <div
                  className="absolute inset-0 flex items-center justify-center transition-transform duration-500 ease-out"
                  style={{
                    transform: ringAnimate ? "scale(1)" : "scale(0.8)",
                    transitionDelay: "0.3s",
                  }}
                >
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center"
                    style={{
                      background: "linear-gradient(135deg, #FFF5F5, #FFE5E5)",
                    }}
                  >
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#FF3B30"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                  </div>
                </div>

                {/* Pulse ring on mount */}
                <div
                  className="absolute inset-0 rounded-full transition-opacity duration-1000"
                  style={{
                    opacity: ringAnimate ? 0 : 0.3,
                    border: "3px solid #FF3B30",
                    transform: ringAnimate ? "scale(1.3)" : "scale(0.9)",
                    transition: "all 1s cubic-bezier(0.4, 0, 0.2, 1)",
                  }}
                />
              </div>
            </div>

            {/* Title */}
            <h3
              id="exp-title"
              className="text-center text-[22px] font-bold text-[#1D1D1F] mb-2 tracking-tight"
            >
              Session Expired
            </h3>

            {/* Message - improved visibility */}
            <p className="text-center text-[15px] text-[#3C3C43] leading-relaxed mb-8 px-1 font-medium">
              {displayMessage}
            </p>

            {/* Single action button */}
            <button
              onClick={handleClose}
              className="w-full relative flex items-center justify-center py-4 px-6 text-[16px] font-semibold text-white rounded-2xl transition-all duration-200 active:scale-[0.98] overflow-hidden"
              style={{
                background: "#1D1D1F",
                boxShadow:
                  "0 4px 14px rgba(0,0,0,0.15), 0 1px 3px rgba(0,0,0,0.1)",
              }}
            >
              <span className="relative z-10">Start New Session</span>
              <div
                className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{
                  background:
                    "linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)",
                }}
              />
            </button>

            {/* Bottom grabber */}
            <div className="flex justify-center mt-6">
              <div className="w-8 h-1 rounded-full bg-[#E5E5EA]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
