import {
  AlertTriangle,
  Loader2,
  Minus,
  Package,
  Plus,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { formatNumber } from "../../../utils/numberFormatter";
import ModalBlank from "../../../components/ModalBlank";
import { formatDate } from "../../../utils/dateFormatter";

/* ══════════════════════════════════════════════════════════════════════════
   STOCK ADJUSTMENT OVERLAY
══════════════════════════════════════════════════════════════════════════ */
const REASONS = [
  "Physical stock count correction",
  "Damaged / spoiled goods",
  "Internal consumption",
  "Stock transfer",
  "Purchase not recorded",
  "Other",
];

export default function StockAdjustOverlay({
  isOpen,
  item,
  onClose,
  onConfirm,
  loading = false,
}) {
  const [mode, setMode] = useState("add"); // "add" | "reduce"
  const [batchId, setBatchId] = useState("");

  const [qty, setQty] = useState("");
  const [reason, setReason] = useState(REASONS[0]);
  const [custom, setCustom] = useState("");
  const [error, setError] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 80);
  }, []);

  const parsed = parseFloat(qty) || 0;
  const finalQty = mode === "add" ? parsed : -parsed;
  const resultStock = item?.currentStock + finalQty;

  // const isValid =
  //   parsed > 0 && (mode === "add" || parsed <= item?.currentStock);

  const activeBatches =
    item?.batches
      ?.filter((b) => !b.isExhausted && b.remainingQuantity > 0)
      ?.sort((a, b) => new Date(a.purchaseDate) - new Date(b.purchaseDate)) ??
    [];
  const batchRequired = activeBatches.length > 0;

  // NEW — use selectedBatch quantity when a batch is selected:
  const selectedBatch = activeBatches.find((b) => b.id === Number(batchId));
  const maxReducible = selectedBatch
    ? selectedBatch.remainingQuantity
    : item?.currentStock;

  const isValid =
    parsed > 0 &&
    (mode === "add" || parsed <= maxReducible) &&
    (!batchRequired || !!batchId);

  const finalReason = reason === "Other" ? custom.trim() : reason;

  function handleConfirm() {
    if (!qty || parsed <= 0) {
      setError("Enter a valid quantity.");
      return;
    }

    if (mode === "reduce" && parsed > maxReducible) {
      setError(
        selectedBatch
          ? `Batch ${selectedBatch.batchCode} only has ${formatNumber(maxReducible)} ${item?.unitAbbreviation}.`
          : `Cannot exceed current stock (${formatNumber(maxReducible)} ${item?.unitAbbreviation}).`,
      );
      return;
    }
    if (!finalReason) {
      setError("Please provide a reason.");
      return;
    }

    const values = {
      inventoryItemId: item?.id,
      quantity: finalQty,
      reason: finalReason,
      ...(batchId ? { batchId: Number(batchId) } : {}),
    };

    const reset = () => {
      setQty("");
      setReason(REASONS[0]);
      setCustom("");
      setBatchId(""); // ← add this line
      setError("");
      setMode("add");
    };

    onConfirm(values, reset);
  }

  return (
    <ModalBlank
      id={"inventory-adjustoment"}
      isOpen={isOpen}
      onClose={onClose}
    >
      <div>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center">
              <SlidersHorizontal
                size={15}
                className="text-white"
                strokeWidth={2}
              />
            </div>
            <div>
              <p className="text-sm font-extrabold text-slate-900">
                Stock Adjustment
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
          {/* Current stock info */}
          <div className="grid grid-cols-3 gap-2.5">
            {[
              {
                label: "Current",
                value: `${formatNumber(item?.currentStock)} ${item?.unitAbbreviation}`,
                color: "text-slate-700",
              },
              {
                label: "Minimum",
                value: `${formatNumber(item?.minimumStock)} ${item?.unitAbbreviation}`,
                color: "text-amber-600",
              },
              {
                label: "Maximum",
                value: `${formatNumber(item?.maximumStock)} ${item?.unitAbbreviation}`,
                color: "text-slate-500",
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

          {/* Add / Reduce toggle */}
          <div>
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2">
              Adjustment Type
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  setMode("add");
                  setError("");
                }}
                className={`flex items-center justify-center gap-2 py-3 rounded-xl border text-sm font-bold transition-all duration-150 ${
                  mode === "add"
                    ? "bg-emerald-600 border-emerald-600 text-white shadow-sm shadow-emerald-600/20"
                    : "bg-white border-slate-200 text-slate-500 hover:border-slate-300"
                }`}
              >
                <Plus size={14} strokeWidth={2.5} />
                Add Stock
              </button>
              <button
                onClick={() => {
                  setMode("reduce");
                  setError("");
                }}
                className={`flex items-center justify-center gap-2 py-3 rounded-xl border text-sm font-bold transition-all duration-150 ${
                  mode === "reduce"
                    ? "bg-red-600 border-red-600 text-white shadow-sm shadow-red-600/20"
                    : "bg-white border-slate-200 text-slate-500 hover:border-slate-300"
                }`}
              >
                <Minus size={14} strokeWidth={2.5} />
                Reduce Stock
              </button>
            </div>
          </div>

          {/* ── Batch selector ── */}
          <div>
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest block mb-2">
              Select Batch <span className="text-red-500">*</span>
            </label>
            {activeBatches.length === 0 ? (
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-100 rounded-xl px-4 py-3">
                <Package
                  size={13}
                  className="text-slate-400 flex-shrink-0"
                  strokeWidth={2}
                />
                <p className="text-xs font-medium text-slate-400">
                  No active batches found for this item.
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
                  className={`w-full px-4 py-3 text-sm font-semibold bg-slate-50 border rounded-xl outline-none focus:ring-2 focus:ring-slate-300 cursor-pointer transition-colors ${
                    !batchId
                      ? "border-red-200 text-slate-400"
                      : "border-slate-200 text-slate-700"
                  }`}
                >
                  <option value="" disabled>
                    — Select a batch —
                  </option>
                  {activeBatches.map((b) => (
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

          {/* Quantity input */}
          <div>
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest block mb-2">
              Quantity ({item?.unitAbbreviation}){" "}
              <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                ref={inputRef}
                type="number"
                min="0.01"
                step="0.01"
                value={qty}
                onChange={(e) => {
                  setQty(e.target.value);
                  setError("");
                }}
                placeholder={`e.g. 10`}
                className="w-full px-4 py-3 text-sm font-bold text-slate-900 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-slate-300 placeholder:text-slate-300 placeholder:font-normal"
              />
              {qty && parsed > 0 && (
                <div
                  className={`absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-bold tabular-nums ${
                    mode === "add" ? "text-emerald-600" : "text-red-600"
                  }`}
                >
                  {mode === "add" ? "+" : "−"}
                  {qty} {item?.unitAbbreviation}
                </div>
              )}
            </div>

            {/* Result preview */}
            {qty && parsed > 0 && !error && (
              <div
                className={`flex items-center gap-2 mt-2 px-3 py-2 rounded-lg ${
                  resultStock < 0
                    ? "bg-red-50 border border-red-100"
                    : resultStock <= item?.minimumStock
                      ? "bg-amber-50 border border-amber-100"
                      : "bg-emerald-50 border border-emerald-100"
                }`}
              >
                <span className="text-[11px] font-semibold text-slate-500">
                  After adjustment:
                </span>
                <span
                  className={`text-[12px] font-extrabold tabular-nums ${
                    resultStock < 0
                      ? "text-red-600"
                      : resultStock <= item?.minimumStock
                        ? "text-amber-600"
                        : "text-emerald-600"
                  }`}
                >
                  {formatNumber(resultStock)} {item?.unitAbbreviation}
                </span>
                {resultStock <= item?.minimumStock && resultStock >= 0 && (
                  <span className="text-[10px] font-bold text-amber-600 ml-auto">
                    Below min stock
                  </span>
                )}
              </div>
            )}

            {error && (
              <p className="flex items-center gap-1.5 text-[11px] font-semibold text-red-600 mt-2">
                <AlertTriangle size={11} strokeWidth={2.5} />
                {error}
              </p>
            )}
          </div>

          {/* Reason */}
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
                className="w-full appearance-none pl-4 pr-9 py-3 text-sm font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-slate-300 cursor-pointer"
              >
                {REASONS.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
              <svg
                className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
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
                placeholder="Describe the reason…"
                className="w-full px-4 py-3 text-sm text-slate-700 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-slate-300 placeholder:text-slate-300 resize-none"
              />
            )}
          </div>
        </div>

        {/* Footer */}
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
            className={`flex-1 py-3 text-sm font-bold text-white rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed ${
              mode === "add"
                ? "bg-emerald-600 hover:bg-emerald-700"
                : "bg-red-600 hover:bg-red-700"
            }`}
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" strokeWidth={2.5} />
                {mode === "add" ? "Adding..." : "Reducing..."}
              </>
            ) : mode === "add" ? (
              <>
                <Plus size={14} strokeWidth={2.5} />
                Add Stock
              </>
            ) : (
              <>
                <Minus size={14} strokeWidth={2.5} />
                Reduce Stock
              </>
            )}
          </button>
        </div>
      </div>
    </ModalBlank>
  );
}
