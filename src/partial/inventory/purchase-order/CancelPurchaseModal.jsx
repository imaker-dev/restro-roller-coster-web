import { AlertTriangle, Loader2, X, XCircle } from "lucide-react";
import { useState } from "react";
import ModalBlank from "../../../components/ModalBlank";

/* ══════════════════════════════════════════════════════════════════════════
   CANCEL OVERLAY
══════════════════════════════════════════════════════════════════════════ */
export function CancelPurchaseModal({
  isOpen,
  onClose,
  purchase,
  onConfirm,
  loading = false,
}) {
  const [reason, setReason] = useState("");
  const [custom, setCustom] = useState("");
  const [error, setError] = useState("");

  const REASONS = [
    "Vendor unavailable",
    "Duplicate order",
    "Items out of stock",
    "Order placed by mistake",
    "Other",
  ];

  function handleSubmit() {
    const finalReason = reason === "Other" ? custom.trim() : reason;
    if (!finalReason) {
      setError("Please select or enter a reason.");
      return;
    }
    onConfirm({ purchaseId: purchase.id, reason: finalReason });
  }

  return (
    <ModalBlank
      id={"cancel-purchase-order"}
      isOpen={isOpen}
      onClose={onClose}
      size="md"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center">
            <XCircle size={16} className="text-red-600" strokeWidth={2} />
          </div>
          <div>
            <p className="text-sm font-extrabold text-slate-900">
              Cancel Order
            </p>
            <p className="text-[11px] text-slate-400 font-medium mt-0.5">
              {purchase?.vendorName} · {purchase?.purchaseNumber}
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center transition-colors"
        >
          <X size={15} className="text-slate-500" strokeWidth={2.5} />
        </button>
      </div>

      <div className="px-6 py-5 space-y-5">
        {/* Warning banner */}
        <div className="flex items-start gap-3 bg-red-50 border border-red-100 rounded-xl px-4 py-3.5">
          <AlertTriangle
            size={15}
            className="text-red-500 flex-shrink-0 mt-0.5"
            strokeWidth={2}
          />
          <p className="text-[12px] font-semibold text-red-700 leading-relaxed">
            This will permanently cancel the purchase order. This action cannot
            be undone.
          </p>
        </div>

        {/* Reason picker */}
        <div>
          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest block mb-2.5">
            Cancellation Reason <span className="text-red-500">*</span>
          </label>
          <div className="space-y-2">
            {REASONS.map((r) => (
              <button
                key={r}
                onClick={() => {
                  setReason(r);
                  setError("");
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-left text-sm font-semibold transition-all duration-150 ${
                  reason === r
                    ? "bg-slate-900 border-slate-900 text-white"
                    : "bg-slate-50 border-slate-100 text-slate-600 hover:border-slate-200 hover:bg-white"
                }`}
              >
                <span
                  className={`w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all ${
                    reason === r ? "border-white bg-white" : "border-slate-300"
                  }`}
                >
                  {reason === r && (
                    <span className="w-2 h-2 rounded-full bg-slate-900" />
                  )}
                </span>
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* Custom reason input */}
        {reason === "Other" && (
          <div>
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest block mb-2">
              Describe the reason
            </label>
            <textarea
              value={custom}
              onChange={(e) => {
                setCustom(e.target.value);
                setError("");
              }}
              rows={3}
              autoFocus
              placeholder="Enter cancellation reason…"
              className="w-full px-4 py-3 text-sm text-slate-700 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-red-200 focus:border-red-200 placeholder:text-slate-300 resize-none"
            />
          </div>
        )}

        {error && (
          <p className="flex items-center gap-1.5 text-[11px] font-semibold text-red-600">
            <AlertTriangle size={11} strokeWidth={2.5} />
            {error}
          </p>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center gap-3 px-6 py-4 border-t border-slate-100 bg-slate-50/50">
        <button
          onClick={onClose}
          disabled={loading}
          className="flex-1 py-3 text-sm font-bold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
        >
          Keep Order
        </button>

        {/* Cancel Order */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="flex-1 py-3 text-sm font-bold text-white bg-red-600 rounded-xl hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Cancelling...
            </>
          ) : (
            <>
              <XCircle size={14} strokeWidth={2.5} />
              Cancel Order
            </>
          )}
        </button>
      </div>
    </ModalBlank>
  );
}
