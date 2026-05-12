// ─── Confirmation Overlay ─────────────────────────────────────────────────────

import {
  RefreshCw,
  ArrowRight,
  IndianRupee,
  Percent,
  Store,
  BadgeCheck,
  Info,
  Loader2,
  ShieldCheck,
  X,
  Clock,
  AlertTriangle,
} from "lucide-react";
import { formatNumber } from "../../utils/numberFormatter";

function LineRow({
  icon: Icon,
  label,
  value,
  valueClass = "text-xs font-bold text-slate-800",
}) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-slate-100 last:border-0">
      <div className="flex items-center gap-2">
        <Icon size={12} className="text-slate-400" />
        <span className="text-xs font-medium text-slate-500">{label}</span>
      </div>
      <span className={valueClass}>{value}</span>
    </div>
  );
}

function RenewalOverlay({ open, onClose, data, onConfirm, isCreatingOrder }) {
  const pricing = data?.nextRenewalPricing;
  const basePrice = pricing?.basePrice ?? data?.base_amount;
  const gstPct = pricing?.gstPercentage ?? data?.gst_percentage ?? 18;
  const totalPrice = pricing?.totalPrice ?? data?.total_amount;
  const gstAmount = totalPrice - basePrice;
  const source = pricing?.source ?? data?.pricing_source;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-200 ${
          open
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Bottom sheet */}
      <div
        className={`fixed bottom-0 inset-x-0 z-50 flex justify-center transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] ${
          open ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="w-full max-w-md bg-white rounded-t-[28px] shadow-2xl overflow-hidden">
          {/* Handle */}
          <div className="flex justify-center pt-3 pb-2">
            <div className="w-8 h-[3px] bg-slate-200 rounded-full" />
          </div>

          {/* Header */}
          <div className="flex items-start justify-between px-5 pt-2 pb-5">
            <div>
              <p className="text-[15px] font-black text-slate-900">
                Confirm Renewal
              </p>
              <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                Review your order before confirming
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors mt-0.5"
            >
              <X size={13} className="text-slate-500" />
            </button>
          </div>

          <div className="px-5 pb-7 space-y-3 overflow-y-auto max-h-[72vh]">
            {/* Order summary card */}
            <div className="bg-slate-50 border border-slate-100 rounded-2xl overflow-hidden">
              {/* Outlet */}
              <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-100">
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-black text-slate-900 leading-none truncate">
                    {data?.outlet_name}
                  </p>
                  <p className="text-[10px] text-slate-400 font-medium mt-0.5">
                    Outlet #{data?.outlet_id}
                  </p>
                </div>
                <div className="flex items-center gap-1 px-2 py-1 bg-violet-50 border border-violet-100 rounded-lg shrink-0">
                  <BadgeCheck size={9} className="text-violet-500" />
                  <span className="text-[10px] font-bold text-violet-600 capitalize">
                    {source}
                  </span>
                </div>
              </div>

              {/* Price breakdown */}
              <div className="px-4">
                <LineRow
                  icon={IndianRupee}
                  label="Base amount"
                  value={formatNumber(basePrice, true)}
                />
                <LineRow
                  icon={Percent}
                  label={`GST (${gstPct}%)`}
                  value={formatNumber(gstAmount, true)}
                  valueClass="text-xs font-bold text-slate-400"
                />
              </div>

              {/* Total */}
              <div className="flex items-center justify-between px-4 py-3.5 bg-white border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <ShieldCheck size={13} className="text-slate-600" />
                  <span className="text-[13px] font-black text-slate-900">
                    Total payable
                  </span>
                </div>
                <span className="text-[17px] font-black text-slate-900">
                  {formatNumber(totalPrice, true)}
                </span>
              </div>
            </div>

            {/* Notice */}
            <div className="flex items-start gap-2.5 bg-amber-50 border border-amber-100 rounded-2xl px-4 py-3">
              <Info size={12} className="text-amber-500 shrink-0 mt-0.5" />
              <p className="text-[11px] text-amber-700 font-medium leading-relaxed">
                Placing this order will initiate a payment of{" "}
                <span className="font-black">
                  {formatNumber(totalPrice, true)}
                </span>
                . Subscription activates immediately upon successful payment.
              </p>
            </div>

            {/* Actions */}
            <div className="space-y-2 pt-1">
              <button
                onClick={onConfirm}
                disabled={isCreatingOrder}
                className="w-full flex items-center justify-center gap-2.5 py-3.5 bg-slate-900 hover:bg-slate-800 active:scale-[0.98] text-white text-[13px] font-black rounded-2xl transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isCreatingOrder ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    Creating Order…
                  </>
                ) : (
                  <>
                    <RefreshCw size={14} />
                    Place Renewal Order
                    <ArrowRight size={12} />
                  </>
                )}
              </button>
              <button
                onClick={onClose}
                disabled={isCreatingOrder}
                className="w-full py-2.5 text-[11px] font-bold text-slate-400 hover:text-slate-600 transition-colors disabled:opacity-40"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default RenewalOverlay;
