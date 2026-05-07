// ─────────────────────────────────────────────────────────────────────────────
// SUCCESS SCREEN

import { CheckCircle2 } from "lucide-react";
import CurrencyIcon from "../../components/CurrencyIcon";

// ─────────────────────────────────────────────────────────────────────────────
function OrderSuccessScreen({ orderData, session, onContinue }) {
  return (
    <div className="min-h-[100dvh] bg-[#FAF8F5] flex flex-col items-center justify-center px-5 text-center">
      {/* Checkmark */}
      <div className="relative mb-6">
        <div className="w-24 h-24 rounded-full bg-emerald-500/10 flex items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center">
            <CheckCircle2
              size={36}
              className="text-emerald-500"
              strokeWidth={1.5}
            />
          </div>
        </div>
      </div>

      <h1 className="text-2xl font-bold text-[#1C1C1E] mb-2">
        Order Placed! 🎉
      </h1>
      <p className="text-[#6C6C70] text-sm mb-8 max-w-xs">
        Your order has been sent to the kitchen. We'll have it ready soon!
      </p>

      {/* Order Info Card */}
      <div className="w-full max-w-sm bg-white rounded-2xl border border-black/[0.06] shadow-sm p-4 mb-6">
        <div className="flex items-center gap-2 mb-3 pb-3 border-b border-[#F2F2F7]">
          <div className="w-8 h-8 bg-primary-500/10 rounded-lg flex items-center justify-center">
            <CurrencyIcon size={15} className="text-primary-500" />
          </div>
          <div className="text-left">
            <p className="text-sm font-bold text-[#1C1C1E]">
              Order #{orderData?.orderNumber || "—"}
            </p>
            <p className="text-xs text-[#8E8E93]">Confirmed</p>
          </div>
        </div>
        <div className="space-y-2 text-sm text-left">
          <div className="flex justify-between">
            <span className="text-[#8E8E93]">Name</span>
            <span className="font-semibold text-[#1C1C1E]">
              {session?.customerName}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#8E8E93]">Table</span>
            <span className="font-semibold text-[#1C1C1E]">
              {session?.tableNumber || "—"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#8E8E93]">Status</span>
            <span className="font-semibold text-emerald-600">Preparing</span>
          </div>
        </div>
      </div>

      <button
        onClick={onContinue}
        className="btn bg-primary-500 hover:bg-primary-600 text-white"
      >
        Continue Browsing
      </button>
    </div>
  );
}
export default OrderSuccessScreen;
