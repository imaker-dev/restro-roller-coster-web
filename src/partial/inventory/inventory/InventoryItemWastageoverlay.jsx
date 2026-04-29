import { useEffect, useRef, useState } from "react";
import {
  AlertTriangle,
  X,
  Trash2,
  ChevronDown,
  Package,
  Info,
  Loader2,
} from "lucide-react";
import { formatNumber } from "../../../utils/numberFormatter";
import { formatDate } from "../../../utils/dateFormatter";
import ModalBlank from "../../../components/ModalBlank";

/* ─── Wastage reasons ─────────────────────────────────────────────────────── */
const WASTAGE_REASONS = [
  "Spoiled / Expired",
  "Damaged during storage",
  "Damaged during preparation",
  "Contamination",
  "Overcooked / Burnt",
  "Dropped / Spilled",
  "Other",
];

/* ══════════════════════════════════════════════════════════════════════════
   WASTAGE OVERLAY
══════════════════════════════════════════════════════════════════════════ */
export default function InventoryItemWastageoverlay({
  isOpen,
  item,
  onClose,
  onConfirm,
  loading = false,
}) {
  const [qty, setQty] = useState("");
  const [reason, setReason] = useState(WASTAGE_REASONS[0]);
  const [custom, setCustom] = useState("");
  const [batchId, setBatchId] = useState(""); // "" = FIFO (auto)
  const [error, setError] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 80);
  }, []);

  const parsed = parseFloat(qty) || 0;
  const finalReason = reason === "Other" ? custom.trim() : reason;

  /* active batches only, sorted oldest first (FIFO order) */
  const activeBatches = item?.batches
    ?.filter((b) => !b.isExhausted && b.remainingQuantity > 0)
    ?.sort((a, b) => new Date(a.purchaseDate) - new Date(b.purchaseDate));

  const selectedBatch = activeBatches?.find((b) => b?.id === Number(batchId));
  const maxQty = selectedBatch
    ? selectedBatch.remainingQuantity
    : item?.currentStock;

  const batchRequired = activeBatches?.length > 0;
  const isValid =
    parsed > 0 &&
    parsed <= maxQty &&
    !!finalReason &&
    (!batchRequired || !!batchId);

  const resultStock = item?.currentStock - parsed;

  function handleConfirm() {
    if (!qty || parsed <= 0) {
      setError("Enter a valid quantity.");
      return;
    }
    if (parsed > maxQty) {
      setError(
        `Max deductible: ${formatNumber(maxQty)} ${item?.unitAbbreviation}.`,
      );
      return;
    }
    if (!finalReason) {
      setError("Please provide a reason.");
      return;
    }

    const values = {
      inventoryItemId: item?.id,
      quantity: parsed,
      reason: finalReason,
      ...(batchId ? { batchId: Number(batchId) } : {}),
    };

    const reset = () => {
      setQty("");
      setReason(WASTAGE_REASONS[0]);
      setCustom("");
      setBatchId("");
      setError("");
    };

    onConfirm(values, reset);
  }

  return (
    <ModalBlank
      id={"inventory-item-wastage"}
      isOpen={isOpen}
      onClose={onClose}
      size="md"
    >
      <div>
        {/* ── Header ── */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-red-600 flex items-center justify-center flex-shrink-0">
              <Trash2 size={15} className="text-white" strokeWidth={2} />
            </div>
            <div>
              <p className="text-sm font-extrabold text-slate-900">
                Record Wastage
              </p>
              <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                {item?.name} · {item?.unitAbbreviation}
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
          {/* ── Current stock strip ── */}
          <div className="grid grid-cols-3 gap-2.5">
            {[
              {
                label: "Current Stock",
                value: `${formatNumber(item?.currentStock)} ${item?.unitAbbreviation}`,
                color: "text-slate-700",
              },
              {
                label: "Active Batches",
                value: activeBatches?.length,
                color: "text-sky-600",
              },
              {
                label: "Min Stock",
                value: `${formatNumber(item?.minimumStock)} ${item?.unitAbbreviation}`,
                color: "text-amber-600",
              },
            ].map(({ label, value, color }) => (
              <div
                key={label}
                className="bg-slate-50 border border-slate-100 rounded-xl px-3 py-2.5 text-center"
              >
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                  {label}
                </p>
                <p className={`text-xs font-extrabold tabular-nums ${color}`}>
                  {value}
                </p>
              </div>
            ))}
          </div>

          {/* ── Batch selector ── */}
          <div>
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest block mb-2">
              Select Batch <span className="text-red-500">*</span>
            </label>
            {activeBatches?.length === 0 ? (
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-100 rounded-xl px-4 py-3">
                <Package
                  size={13}
                  className="text-slate-400 flex-shrink-0"
                  strokeWidth={2}
                />
                <p className="text-xs font-medium text-slate-400">
                  No active batches — the system will pick stock automatically.
                </p>
              </div>
            ) : (
              <>
                <select
                  value={batchId}
                  onChange={(e) => {
                    setBatchId(e.target.value);
                    setError("");
                  }}
                  className={`w-full px-4 py-3 text-sm font-semibold bg-slate-50 border rounded-xl outline-none focus:ring-2 focus:ring-red-200 cursor-pointer transition-colors ${
                    !batchId
                      ? "border-red-200 text-slate-400 focus:border-red-300"
                      : "border-slate-200 text-slate-700 focus:border-red-300"
                  }`}
                >
                  <option value="" disabled>
                    — Select a batch —
                  </option>
                  {activeBatches?.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.batchCode} · {formatNumber(b.remainingQuantity)}{" "}
                      {b.unitAbbreviation}
                      {b.expiryDate
                        ? ` (Exp: ${formatDate(b.expiryDate, "long")})`
                        : ""}
                    </option>
                  ))}
                </select>
                {!batchId && (
                  <p className="flex items-center gap-1.5 text-[11px] font-semibold text-red-500 mt-1.5">
                    <AlertTriangle size={10} strokeWidth={2.5} />
                    Please select a batch to proceed.
                  </p>
                )}
              </>
            )}
          </div>

          {/* ── Quantity input ── */}
          <div>
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest block mb-2">
              Wastage Quantity ({item?.unitAbbreviation}){" "}
              <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                ref={inputRef}
                type="number"
                min="0.01"
                step="0.01"
                max={maxQty}
                value={qty}
                onChange={(e) => {
                  setQty(e.target.value);
                  setError("");
                }}
                placeholder={`Max ${formatNumber(maxQty)} ${item?.unitAbbreviation}`}
                className="w-full px-4 py-3 text-sm font-bold text-slate-900 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-red-200 focus:border-red-300 placeholder:text-slate-300 placeholder:font-normal"
              />
              {parsed > 0 && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-bold text-red-600 tabular-nums">
                  −{qty} {item?.unitAbbreviation}
                </div>
              )}
            </div>

            {/* After-adjustment preview */}
            {parsed > 0 && !error && (
              <div
                className={`flex items-center justify-between gap-2 mt-2 px-3.5 py-2.5 rounded-xl border ${
                  resultStock < 0
                    ? "bg-red-50 border-red-100"
                    : resultStock <= item?.minimumStock
                      ? "bg-amber-50 border-amber-100"
                      : "bg-slate-50 border-slate-100"
                }`}
              >
                <span className="text-[11px] font-semibold text-slate-500">
                  Remaining after wastage:
                </span>
                <span
                  className={`text-[12px] font-extrabold tabular-nums ${
                    resultStock < 0
                      ? "text-red-600"
                      : resultStock <= item?.minimumStock
                        ? "text-amber-600"
                        : "text-slate-700"
                  }`}
                >
                  {formatNumber(resultStock < 0 ? 0 : resultStock)}{" "}
                  {item?.unitAbbreviation}
                  {resultStock <= item?.minimumStock && resultStock >= 0 && (
                    <span className="text-[10px] font-bold text-amber-500 ml-2">
                      · below min
                    </span>
                  )}
                </span>
              </div>
            )}

            {error && (
              <p className="flex items-center gap-1.5 text-[11px] font-semibold text-red-600 mt-2">
                <AlertTriangle size={11} strokeWidth={2.5} />
                {error}
              </p>
            )}
          </div>

          {/* ── Reason ── */}
          <div>
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest block mb-2">
              Reason <span className="text-red-500">*</span>
            </label>
            <div className="relative mb-2">
              <select
                value={reason}
                onChange={(e) => {
                  setReason(e.target.value);
                  setError("");
                }}
                className="w-full appearance-none pl-4 pr-9 py-3 text-sm font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-red-200 cursor-pointer"
              >
                {WASTAGE_REASONS.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={14}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                strokeWidth={2}
              />
            </div>
            {reason === "Other" && (
              <textarea
                autoFocus
                value={custom}
                onChange={(e) => {
                  setCustom(e.target.value);
                  setError("");
                }}
                rows={2}
                placeholder="Describe the wastage reason…"
                className="w-full px-4 py-3 text-sm text-slate-700 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-red-200 placeholder:text-slate-300 resize-none"
              />
            )}
          </div>
        </div>

        {/* ── Footer ── */}
        <div className="flex items-center gap-3 px-6 py-4 border-t border-slate-100 bg-slate-50/50">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 py-3 text-sm font-bold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={!isValid || loading}
            className="flex-1 py-3 text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 size={14} className="animate-spin" strokeWidth={2.5} />
                Recording...
              </>
            ) : (
              <>
                <Trash2 size={14} strokeWidth={2.5} />
                Record Wastage
              </>
            )}
          </button>
        </div>
      </div>
    </ModalBlank>
  );
}
