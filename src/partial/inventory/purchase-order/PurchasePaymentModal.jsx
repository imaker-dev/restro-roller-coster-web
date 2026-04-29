import {
  AlertTriangle,
  Building2,
  CheckCircle2,
  CreditCard,
  IndianRupee,
  Loader2,
  Wallet,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { formatNumber } from "../../../utils/numberFormatter";
import ModalBlank from "../../../components/ModalBlank";
import { InputField } from "../../../components/fields/InputField";
import { TextareaField } from "../../../components/fields/TextareaField";

/* ══════════════════════════════════════════════════════════════════════════
   PAYMENT OVERLAY
══════════════════════════════════════════════════════════════════════════ */
export function PurchasePaymentModal({
  isOpen,
  onClose,
  purchase,
  onConfirm,
  loading = false,
}) {
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("cash");
  const [paymentReference, setPaymentReference] = useState("");
  const [paymentDate, setPaymentDate] = useState("");

  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 80);
  }, []);

  const remaining = purchase?.dueAmount ?? 0;
  const parsed = parseFloat(amount) || 0;
  const isValid = parsed > 0 && parsed <= remaining;

  function handleSubmit() {
    if (!amount) {
      setError("Please enter an amount.");
      return;
    }
    if (parsed <= 0) {
      setError("Amount must be greater than zero.");
      return;
    }
    if (parsed > remaining) {
      setError(
        `Amount cannot exceed due amount of ${formatNumber(remaining, true)}.`,
      );
      return;
    }
    // onConfirm({ amount: parsed, method, note });
    const values = {
      paidAmount: parsed,
      paymentMethod: method,
      notes: note?.trim() || null,

      // optional fields
      paymentReference: paymentReference?.trim() || null,
      paymentDate: paymentDate || null,
    };

    onConfirm({
      purchaseId: purchase?.id,
      values,
    });
  }

  const METHODS = [
    { id: "cash", label: "Cash", icon: Wallet },
    { id: "upi", label: "UPI", icon: IndianRupee },
    { id: "card", label: "Card", icon: CreditCard },
    { id: "bank", label: "Bank Transfer", icon: Building2 },
  ];

  return (
    <ModalBlank id={"purchase-payment"} isOpen={isOpen} onClose={onClose}>
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center">
            <CreditCard
              size={16}
              className="text-emerald-600"
              strokeWidth={2}
            />
          </div>
          <div>
            <p className="text-sm font-extrabold text-slate-900">
              Record Payment
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
        {/* Due summary strip */}
        <div className="grid grid-cols-3 gap-3">
          {[
            {
              label: "Total",
              value: formatNumber(purchase?.totalAmount, true),
              color: "text-slate-700",
            },
            {
              label: "Paid",
              value: formatNumber(purchase?.paidAmount, true),
              color: "text-emerald-600",
            },
            {
              label: "Due",
              value: formatNumber(purchase?.dueAmount, true),
              color: "text-red-600",
            },
          ].map(({ label, value, color }) => (
            <div
              key={label}
              className="bg-slate-50 border border-slate-100 rounded-xl px-3 py-2.5 text-center"
            >
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                {label}
              </p>
              <p className={`text-sm font-extrabold tabular-nums ${color}`}>
                {value}
              </p>
            </div>
          ))}
        </div>

        {/* Amount input */}
        <div>
          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest block mb-2">
            Payment Amount <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">
              ₹
            </span>
            <input
              ref={inputRef}
              type="number"
              min="1"
              max={remaining}
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
                setError("");
              }}
              placeholder={`Max ${formatNumber(remaining, true)}`}
              className="w-full pl-8 pr-4 py-3 text-sm font-bold text-slate-900 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-slate-300 focus:border-slate-300 placeholder:text-slate-300 placeholder:font-normal"
            />
            {remaining > 0 && (
              <button
                onClick={() => {
                  setAmount(String(remaining));
                  setError("");
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-sky-600 hover:text-sky-700 bg-sky-50 px-2 py-1 rounded-lg transition-colors"
              >
                Full
              </button>
            )}
          </div>
          {error && (
            <p className="flex items-center gap-1.5 text-[11px] font-semibold text-red-600 mt-2">
              <AlertTriangle size={11} strokeWidth={2.5} />
              {error}
            </p>
          )}
        </div>

        {/* Payment method */}
        <div>
          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest block mb-2">
            Payment Method
          </label>
          <div className="grid grid-cols-4 gap-2">
            {METHODS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setMethod(id)}
                className={`flex flex-col items-center gap-1.5 py-3 rounded-xl border text-[10px] font-bold uppercase tracking-wide transition-all duration-150 ${
                  method === id
                    ? "bg-slate-900 border-slate-900 text-white"
                    : "bg-slate-50 border-slate-100 text-slate-500 hover:border-slate-200"
                }`}
              >
                <Icon size={14} strokeWidth={2} />
                {label}
              </button>
            ))}
          </div>
        </div>

        {method !== "cash" && (
          <div className="grid grid-cols-2 gap-3">
            {/* Reference Number */}
            <InputField
              label="Reference No"
              type="text"
              value={paymentReference}
              onChange={(e) => setPaymentReference(e.target.value)}
              placeholder="Enter transaction / UTR number"
            />

            {/* Payment Date */}
            <InputField
              label="Payment Date"
              type="date"
              value={paymentDate}
              onChange={(e) => setPaymentDate(e.target.value)}
              placeholder="Enter transaction / UTR number"
            />
          </div>
        )}

        {/* Note */}
        <TextareaField
          label="Note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={2}
          placeholder="Add a payment note…"
        />
      </div>

      {/* Footer */}
      <div className="flex items-center gap-3 px-6 py-4 border-t border-slate-100 bg-slate-50/50">
        <button
          onClick={onClose}
          className="flex-1 py-3 text-sm font-bold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={!isValid || loading}
          className="flex-1 py-3 text-sm font-bold text-white bg-primary-500 rounded-xl hover:bg-primary-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 size={16} className="animate-spin" strokeWidth={2.5} />
              Processing...
            </>
          ) : (
            <>
              <CheckCircle2 size={14} strokeWidth={2.5} />
              Confirm Payment
            </>
          )}
        </button>
      </div>
    </ModalBlank>
  );
}
