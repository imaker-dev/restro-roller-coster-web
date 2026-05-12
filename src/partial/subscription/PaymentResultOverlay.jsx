import {
  AlertTriangle,
  CalendarDays,
  CheckCircle2,
  Clock,
  Store,
  Zap,
  ArrowLeft,
  Shield,
  IndianRupee,
  CreditCard,
  BadgeCheck,
  X,
} from "lucide-react";
import { formatDate } from "../../utils/dateFormatter";
import { formatNumber } from "../../utils/numberFormatter";

const PaymentResultOverlay = ({ open, type, data, result, onClose }) => {
  if (!open) return null;

  const isSuccess = type === "success";

  return (
    <div className="fixed inset-0 z-50 bg-white overflow-y-auto">
      <style>{`
        @keyframes float-up {
          0% {
            transform: translateY(40px);
            opacity: 0;
          }
          100% {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes scale-in {
          0% {
            transform: scale(0.5);
            opacity: 0;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes draw-circle {
          0% {
            stroke-dashoffset: 150;
          }
          100% {
            stroke-dashoffset: 0;
          }
        }

        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }

        .animate-float-up {
          animation: float-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .animate-scale-in {
          animation: scale-in 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .animate-shimmer {
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(255, 255, 255, 0.4) 50%,
            transparent 100%
          );
          background-size: 200% 100%;
          animation: shimmer 2s infinite;
        }

        .delay-100 { animation-delay: 0.1s; opacity: 0; }
        .delay-200 { animation-delay: 0.2s; opacity: 0; }
        .delay-300 { animation-delay: 0.3s; opacity: 0; }
        .delay-400 { animation-delay: 0.4s; opacity: 0; }
        .delay-500 { animation-delay: 0.5s; opacity: 0; }
      `}</style>

      {isSuccess ? (
        /* ========== SUCCESS SCREEN ========== */
        <div className="min-h-screen bg-slate-50 lg:flex lg:items-center lg:justify-center">
          <div className="w-full">
            {/* Main Container */}
            <div className="relative bg-white shadow-2xl shadow-slate-200/50 min-h-screen lg:min-h-[100vh] sm:rounded-[40px] overflow-hidden flex flex-col">
              {/* Close Button - Top Right */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 sm:top-6 sm:right-6 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white shadow-lg shadow-slate-200/50 flex items-center justify-center z-20 transition-all hover:scale-105"
              >
                <X size={18} className="text-slate-600" />
              </button>

              {/* Success Header */}
              <div className="relative bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-600 px-6 sm:px-12 pt-12 sm:pt-14 lg:pt-12 pb-14 sm:pb-16 lg:pb-14 overflow-hidden">
                {/* Animated Background Elements */}
                <div className="absolute inset-0">
                  <div className="absolute top-10 -left-10 sm:left-10 w-32 h-32 sm:w-40 sm:h-40 rounded-full border-2 border-white/20 animate-pulse" />
                  <div className="absolute bottom-20 right-0 sm:right-10 w-48 h-48 sm:w-60 sm:h-60 rounded-full border-2 border-white/10 animate-pulse delay-300" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 sm:w-96 sm:h-96 rounded-full border border-white/10" />

                  {/* Grid Pattern */}
                  <div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                      backgroundImage:
                        "radial-gradient(circle, white 1px, transparent 1px)",
                      backgroundSize: "24px 24px",
                    }}
                  />
                </div>

                {/* Header Content */}
                <div className="relative z-10">
                  {/* Icon with Animation */}
                  <div className="flex justify-center mb-5 sm:mb-6">
                    <div className="relative animate-scale-in">
                      {/* Outer glow */}
                      <div
                        className="absolute inset-0 w-28 h-28 sm:w-36 sm:h-36 rounded-full bg-white/20 blur-2xl animate-pulse"
                        style={{ top: "-20%", left: "-20%" }}
                      />

                      {/* Success Icon Container */}
                      <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white flex items-center justify-center shadow-lg">
                          {/* Animated Checkmark SVG */}
                          <svg
                            width="48"
                            height="48"
                            viewBox="0 0 48 48"
                            fill="none"
                            className="w-10 h-10 sm:w-12 sm:h-12"
                          >
                            <circle
                              cx="24"
                              cy="24"
                              r="22"
                              stroke="#10B981"
                              strokeWidth="3"
                              strokeDasharray="150"
                              strokeDashoffset="0"
                              style={{
                                animation: "draw-circle 0.6s ease-out forwards",
                              }}
                            />
                            <path
                              d="M14 24L21 31L34 17"
                              stroke="#10B981"
                              strokeWidth="3"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeDasharray="50"
                              strokeDashoffset="50"
                              style={{
                                animation:
                                  "draw-circle 0.4s 0.3s ease-out forwards",
                              }}
                            />
                          </svg>
                        </div>
                      </div>

                      {/* Pulse Rings */}
                      <div className="absolute inset-0 w-24 h-24 sm:w-32 sm:h-32 rounded-full border-2 border-white/40 animate-ping" />
                      <div
                        className="absolute inset-0 w-24 h-24 sm:w-32 sm:h-32 rounded-full border border-white/20 animate-ping"
                        style={{ animationDelay: "0.3s" }}
                      />
                    </div>
                  </div>

                  {/* Success Text */}
                  <div className="text-center">
                    <h1 className="text-2xl sm:text-4xl lg:text-[42px] font-black text-white mb-3 sm:mb-4 tracking-tight animate-float-up">
                      Payment Successful!
                    </h1>
                    <p className="text-emerald-100 text-sm sm:text-base lg:text-[15px] font-medium max-w-md mx-auto animate-float-up delay-100">
                      Your subscription has been activated successfully
                    </p>
                  </div>
                </div>
              </div>

              {/* Content Section */}
              <div className="relative -mt-8 sm:-mt-10 bg-slate-50 rounded-t-[32px] sm:rounded-t-[40px]">
                <div className="w-full max-w-3xl xl:max-w-4xl mx-auto px-5 sm:px-8 lg:px-10 pt-6 sm:pt-8 pb-6 sm:pb-8 space-y-4 lg:space-y-4">
                  {/* Outlet Status Card */}
                  <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/60 p-5 sm:p-6 shadow-sm animate-float-up delay-200">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-emerald-50 flex items-center justify-center shrink-0">
                        <Store
                          size={20}
                          className="sm:w-6 sm:h-6 text-emerald-600"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm sm:text-base font-bold text-slate-800 truncate">
                          {data?.outlet_name || "Your Outlet"}
                        </p>
                        <div className="flex items-center gap-1.5 mt-1">
                          <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-500 animate-pulse" />
                          <span className="text-[11px] sm:text-xs font-medium text-emerald-600">
                            Active & Running
                          </span>
                        </div>
                      </div>
                      <div className="shrink-0">
                        <BadgeCheck
                          size={20}
                          className="sm:w-6 sm:h-6 text-emerald-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Subscription Details Card */}
                  <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/60 p-5 sm:p-6 shadow-sm animate-float-up delay-300">
                    <h3 className="text-[11px] sm:text-xs font-black text-slate-400 uppercase tracking-widest mb-4 sm:mb-5">
                      Subscription Period
                    </h3>
                    <div className="space-y-4 sm:space-y-5">
                      {/* Start Date */}
                      {result?.subscriptionStart && (
                        <div className="flex items-center gap-3 sm:gap-4">
                          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                            <CalendarDays
                              size={18}
                              className="sm:w-5 sm:h-5 text-blue-500"
                            />
                          </div>
                          <div className="flex-1">
                            <p className="text-[10px] sm:text-[11px] font-semibold text-slate-400 uppercase tracking-wide">
                              Start Date
                            </p>
                            <p className="text-sm sm:text-base font-bold text-slate-800 mt-0.5">
                              {formatDate(result.subscriptionStart, "long")}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* End Date */}
                      {result?.subscriptionEnd && (
                        <div className="flex items-center gap-3 sm:gap-4">
                          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-purple-50 flex items-center justify-center shrink-0">
                            <Clock
                              size={18}
                              className="sm:w-5 sm:h-5 text-purple-500"
                            />
                          </div>
                          <div className="flex-1">
                            <p className="text-[10px] sm:text-[11px] font-semibold text-slate-400 uppercase tracking-wide">
                              Expiry Date
                            </p>
                            <p className="text-sm sm:text-base font-bold text-slate-800 mt-0.5">
                              {formatDate(result.subscriptionEnd, "long")}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Payment Details Card */}
                  <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/60 p-5 sm:p-6 shadow-sm animate-float-up delay-400">
                    <h3 className="text-[11px] sm:text-xs font-black text-slate-400 uppercase tracking-widest mb-4 sm:mb-5">
                      Payment Details
                    </h3>
                    <div className="space-y-3 sm:space-y-4">
                      <div className="flex items-center justify-between py-3">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <IndianRupee
                            size={14}
                            className="sm:w-4 sm:h-4 text-slate-400"
                          />
                          <span className="text-xs sm:text-sm font-semibold text-slate-700">
                            Amount Paid
                          </span>
                        </div>
                        <span className="text-lg sm:text-xl lg:text-2xl font-black text-slate-900">
                          {data?.nextRenewalPricing
                            ? formatNumber(data.nextRenewalPricing.totalPrice, true)
                            : "—"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="pt-2 sm:pt-4 animate-float-up delay-500">
                    <button
                      onClick={onClose}
                      className="w-full py-4 sm:py-5 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white text-sm sm:text-base font-black rounded-2xl sm:rounded-3xl shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/30 transition-all active:scale-[0.98] tracking-wide"
                    >
                      Continue to Dashboard
                    </button>
                  </div>
                </div>

                {/* Trust Badge */}
                <div className="px-6 sm:px-12 pb-8 sm:pb-10 pt-2 sm:pt-4">
                  <div className="flex items-center justify-center gap-2 text-slate-400">
                    <Shield size={12} className="sm:w-3.5 sm:h-3.5" />
                    <span className="text-[10px] sm:text-xs font-medium">
                      Secured by Razorpay
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* ========== FAILURE SCREEN ========== */
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
          <div className="w-full">
            {/* Main Container */}
            <div className="relative bg-white shadow-2xl shadow-slate-200/50 min-h-screen lg:min-h-[100vh] sm:rounded-[40px] overflow-hidden flex flex-col">
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 sm:top-6 sm:right-6 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white shadow-lg shadow-slate-200/50 flex items-center justify-center z-20 transition-all hover:scale-105"
              >
                <X size={18} className="text-slate-600" />
              </button>

              {/* Failure Header */}
              <div className="relative bg-gradient-to-br from-red-500 via-rose-600 to-pink-600 px-6 sm:px-12 pt-12 sm:pt-14 lg:pt-12 pb-14 sm:pb-16 lg:pb-14 overflow-hidden">
                {/* Animated Background Elements */}
                <div className="absolute inset-0">
                  <div className="absolute top-10 -left-10 sm:left-10 w-32 h-32 sm:w-40 sm:h-40 rounded-full border-2 border-white/20 animate-pulse" />
                  <div className="absolute bottom-20 right-0 sm:right-10 w-48 h-48 sm:w-60 sm:h-60 rounded-full border-2 border-white/10 animate-pulse delay-300" />

                  {/* Grid Pattern */}
                  <div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                      backgroundImage:
                        "radial-gradient(circle, white 1px, transparent 1px)",
                      backgroundSize: "24px 24px",
                    }}
                  />
                </div>

                {/* Header Content */}
                <div className="relative z-10">
                  {/* Failure Icon with Animation */}
                  <div className="flex justify-center mb-5 sm:mb-6">
                    <div className="relative animate-scale-in">
                      <div
                        className="absolute inset-0 w-28 h-28 sm:w-36 sm:h-36 rounded-full bg-white/20 blur-2xl animate-pulse"
                        style={{ top: "-20%", left: "-20%" }}
                      />

                      <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white flex items-center justify-center shadow-lg">
                          <AlertTriangle
                            size={36}
                            className="sm:w-12 sm:h-12 text-red-500"
                          />
                        </div>
                      </div>

                      {/* Shake Animation */}
                      <div
                        className="absolute inset-0 w-24 h-24 sm:w-32 sm:h-32 rounded-full border-2 border-white/40 animate-pulse"
                        style={{
                          animation: "shake 0.5s ease-in-out",
                        }}
                      />
                    </div>
                  </div>

                  {/* Failure Text */}
                  <div className="text-center">
                    <h1 className="text-2xl sm:text-4xl lg:text-[42px] font-black text-white mb-3 sm:mb-4 tracking-tight animate-float-up">
                      Payment Failed
                    </h1>
                    <p className="text-red-100 text-sm sm:text-base lg:text-lg font-medium max-w-md mx-auto animate-float-up delay-100">
                      {result?.message || "We couldn't process your payment"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Content Section */}
              <div className="relative -mt-8 sm:-mt-10 bg-slate-50 rounded-t-[32px] sm:rounded-t-[40px]">
                <div className="w-full max-w-3xl xl:max-w-4xl mx-auto px-5 sm:px-8 lg:px-10 pt-6 sm:pt-8 pb-6 sm:pb-8 space-y-4 lg:space-y-4">
                  {/* Failure Message Card */}
                  <div className="bg-white rounded-2xl sm:rounded-3xl border border-red-100 p-5 sm:p-6 shadow-sm animate-float-up delay-200">
                    <div className="flex items-start gap-4">
                      <div className="flex-1">
                        <h3 className="text-sm sm:text-base font-bold text-slate-900">
                          Payment could not be completed
                        </h3>

                        <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed">
                          Don’t worry — no amount has been deducted permanently.
                          You can safely try the payment again or use a
                          different payment method.
                        </p>

                        <div className="flex items-center gap-2 mt-4">
                          <div className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
                          <span className="text-xs font-semibold text-red-500">
                            Transaction was not successful
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Amount Card */}
                  <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/60 p-5 sm:p-6 shadow-sm animate-float-up delay-300">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[11px] sm:text-xs font-semibold text-slate-400 uppercase tracking-wide">
                          Amount to Pay
                        </p>
                        <p className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 mt-1 sm:mt-2">
                          {data?.total_amount
                            ? formatNumber(data.total_amount, true)
                            : "—"}
                        </p>
                      </div>
                      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center">
                        <IndianRupee
                          size={22}
                          className="sm:w-6 sm:h-6 text-slate-400"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="pt-2 sm:pt-4 animate-float-up delay-400">
                    <button
                      onClick={onClose}
                      className="w-full py-4 sm:py-5 bg-gradient-to-r from-slate-900 to-slate-800 hover:from-slate-800 hover:to-slate-700 text-white text-sm sm:text-base font-black rounded-2xl sm:rounded-3xl shadow-lg shadow-slate-900/10 hover:shadow-xl hover:shadow-slate-900/20 transition-all active:scale-[0.98] tracking-wide"
                    >
                      Try Again
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
          20%, 40%, 60%, 80% { transform: translateX(4px); }
        }
      `}</style>
    </div>
  );
};

export default PaymentResultOverlay;
