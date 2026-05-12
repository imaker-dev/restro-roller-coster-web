import React, { useEffect } from "react";
import PageHeader from "../../layout/PageHeader";
import { useQueryParams } from "../../hooks/useQueryParams";
import { useDispatch, useSelector } from "react-redux";
import { fetchTransactionById } from "../../redux/slices/transactionSlice";
import {
  Store,
  Receipt,
  CalendarDays,
  IndianRupee,
  Percent,
  ShieldCheck,
  CheckCircle2,
  CreditCard,
  Hash,
  MapPin,
  Phone,
  Mail,
  FileText,
  Building2,
  BadgeCheck,
  RefreshCw,
  Package,
  Landmark,
  SplitSquareHorizontal,
  CircleDollarSign,
  ReceiptText,
} from "lucide-react";
import { formatDate } from "../../utils/dateFormatter";
import { formatNumber } from "../../utils/numberFormatter";
import MetricPanel from "../../partial/report/daily-sales-report/MetricPanel";
import NoDataFound from "../../layout/NoDataFound";

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function Skeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="bg-white rounded-3xl border border-slate-200 h-52" />
      <div className="bg-white rounded-3xl border border-slate-200 h-40" />
      <div className="bg-white rounded-3xl border border-slate-200 h-44" />
      <div className="bg-white rounded-3xl border border-slate-200 h-40" />
    </div>
  );
}

// ─── Row ──────────────────────────────────────────────────────────────────────

function InfoRow({
  icon: Icon,
  label,
  value,
  valueClass = "text-slate-800",
  mono = false,
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-3 border-b border-slate-100 last:border-0">
      <div className="flex items-center gap-2.5 shrink-0">
        <Icon size={12} className="text-slate-400" />
        <p className="text-xs font-semibold text-slate-500">{label}</p>
      </div>
      <p
        className={`text-xs font-bold text-right max-w-[60%] break-all ${mono ? "font-mono" : ""} ${valueClass}`}
      >
        {value ?? "—"}
      </p>
    </div>
  );
}

// ─── Status badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }) {
  const map = {
    captured: {
      bg: "bg-emerald-50 border-emerald-200 text-emerald-700",
      dot: "bg-emerald-500",
      label: "Paid",
    },
    pending: {
      bg: "bg-amber-50 border-amber-200 text-amber-700",
      dot: "bg-amber-400",
      label: "Pending",
    },
    failed: {
      bg: "bg-red-50 border-red-200 text-red-700",
      dot: "bg-red-500",
      label: "Failed",
    },
  };
  const cfg = map[status] ?? map.pending;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl border text-[11px] font-black ${cfg.bg}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

// ─── Amount row (for totals) ──────────────────────────────────────────────────

function AmountRow({ label, value, sub, bold, accent, topDivider }) {
  return (
    <div
      className={`flex items-center justify-between py-3 ${topDivider ? "border-t border-slate-200 mt-1" : "border-b border-slate-100 last:border-0"}`}
    >
      <div>
        <p
          className={`text-xs ${bold ? "font-black text-slate-900" : "font-semibold text-slate-500"}`}
        >
          {label}
        </p>
        {sub && (
          <p className="text-[10px] text-slate-400 font-medium mt-0.5">{sub}</p>
        )}
      </div>
      <p
        className={`font-bold ${bold ? "text-base font-black" : "text-xs"} ${accent ? "text-emerald-600" : "text-slate-800"}`}
      >
        {value}
      </p>
    </div>
  );
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────

const TransactionDetailsPage = () => {
  const dispatch = useDispatch();
  const { transactionId } = useQueryParams();
  const { isFetchingTransaction, transactionDetails } = useSelector(
    (state) => state.transaction,
  );

  useEffect(() => {
    if (transactionId) {
      dispatch(fetchTransactionById({ transactionId }));
    }
  }, []);

  // Support both old and new data shapes
  const isInvoiceShape = !!transactionDetails?.invoice;
  const t = transactionDetails;

  // Destructure invoice shape
  const invoice = t?.invoice;
  const billedTo = t?.billedTo;
  const lineItems = t?.lineItems ?? [];
  const tax = t?.taxBreakdown;
  const totals = t?.totals;
  const payment = t?.payment;
  const meta = t?.meta;

  const addr = billedTo?.address
    ? [
        billedTo.address.line1,
        billedTo.address.line2,
        billedTo.address.city,
        billedTo.address.state,
        billedTo.address.postalCode,
        billedTo.address.country,
      ]
        .filter(Boolean)
        .join(", ")
    : null;

  return (
    <div className="space-y-6">
      <PageHeader title="Transaction Details" showBackButton />

      <div>
        {isFetchingTransaction && !t ? (
          <Skeleton />
        ) : !t ? (
          <NoDataFound
            icon={ReceiptText}
            title="Transaction not found"
            description="The requested transaction could not be loaded."
          />
        ) : (
          <div className="space-y-4">
            {/* ── Invoice Hero ── */}
            <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden">
              <div
                className={`h-1.5 bg-gradient-to-r ${invoice?.status === "captured" ? "from-emerald-400 via-teal-400 to-emerald-300" : "from-red-400 via-orange-300 to-amber-300"}`}
              />
              <div className="p-5">
                {/* Invoice header row */}
                <div className="flex items-start justify-between gap-4 mb-5">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
                        Invoice
                      </p>
                    </div>
                    <p className="text-[18px] font-black text-slate-900 leading-none tracking-tight">
                      {invoice?.invoiceNumber}
                    </p>
                    <p className="text-[11px] text-slate-400 font-medium mt-1.5">
                      {invoice?.type}
                    </p>
                  </div>
                  <StatusBadge status={invoice?.status} />
                </div>

                {/* Date + outlet pills */}
                <div className="flex flex-wrap items-center gap-2 mb-5">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-[11px] font-bold text-slate-500">
                    <CalendarDays size={9} />
                    {formatDate(invoice?.invoiceDate, "long")}
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-[11px] font-bold text-slate-500">
                    <Store size={9} />
                    {billedTo?.outletName}
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-[11px] font-bold text-slate-500">
                    <Hash size={9} />
                    TXN #{meta?.transactionId}
                  </div>
                </div>

                {/* Grand total highlight */}
                <div className="flex items-center justify-between bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3.5">
                  <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">
                      Amount Paid
                    </p>
                    <p className="text-[10px] text-slate-400 font-medium">
                      {formatNumber(totals?.subtotal, true)} +{" "}
                      {formatNumber(totals?.totalTax, true)} GST
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[22px] font-black text-slate-900 leading-none tracking-tight">
                      {formatNumber(totals?.grandTotal, true)}
                    </p>
                    <p className="text-[9px] text-slate-400 font-medium mt-1">
                      incl. GST
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Line Items ── */}
            <MetricPanel title="Items" icon={Package}>
              {/* Header */}
              <div className="flex items-center justify-between py-2.5 border-b border-slate-100">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                  Description
                </p>
                <div className="flex items-center gap-6">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                    Qty
                  </p>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest w-20 text-right">
                    Amount
                  </p>
                </div>
              </div>
              {lineItems.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between py-3.5 border-b border-slate-100 last:border-0 gap-4"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-black text-slate-900 leading-none">
                      {item.description}
                    </p>
                    <p className="text-[10px] text-slate-400 font-medium mt-1">
                      {formatNumber(item.unitPrice, true)} × {item.quantity}
                    </p>
                  </div>
                  <div className="flex items-center gap-6 shrink-0">
                    <p className="text-xs font-bold text-slate-500">
                      {item.quantity}
                    </p>
                    <p className="text-xs font-black text-slate-900 w-20 text-right">
                      {formatNumber(item.amount, true)}
                    </p>
                  </div>
                </div>
              ))}
            </MetricPanel>

            {/* ── Tax Breakdown ── */}
            <MetricPanel title="Tax Breakdown" icon={Landmark}>
              <div className="grid grid-cols-2 gap-2.5 py-4">
                {/* Taxable */}
                <div className="bg-slate-50 border border-slate-100 rounded-2xl px-3.5 py-3">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">
                    Taxable Amount
                  </p>
                  <p className="text-[13px] font-black text-slate-800">
                    {formatNumber(tax?.taxableAmount, true)}
                  </p>
                </div>
                {/* GST rate */}
                <div className="bg-slate-50 border border-slate-100 rounded-2xl px-3.5 py-3">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">
                    GST Rate
                  </p>
                  <p className="text-[13px] font-black text-slate-800">
                    {tax?.gstPercentage}%
                  </p>
                </div>
                {/* CGST */}
                <div className="bg-slate-50 border border-slate-100 rounded-2xl px-3.5 py-3">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">
                    CGST (9%)
                  </p>
                  <p className="text-[13px] font-black text-slate-800">
                    {formatNumber(tax?.cgst, true)}
                  </p>
                </div>
                {/* SGST */}
                <div className="bg-slate-50 border border-slate-100 rounded-2xl px-3.5 py-3">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">
                    SGST (9%)
                  </p>
                  <p className="text-[13px] font-black text-slate-800">
                    {formatNumber(tax?.sgst, true)}
                  </p>
                </div>
              </div>
              {/* Total tax row */}
              <div className="flex items-center justify-between bg-amber-50 border border-amber-100 rounded-2xl px-4 py-3 mb-4">
                <div className="flex items-center gap-2">
                  <Percent size={12} className="text-amber-500" />
                  <p className="text-xs font-black text-amber-700">Total Tax</p>
                </div>
                <p className="text-sm font-black text-amber-700">
                  {formatNumber(tax?.totalTax, true)}
                </p>
              </div>
            </MetricPanel>

            {/* ── Totals ── */}
            <MetricPanel title="Summary" icon={CircleDollarSign}>
              <AmountRow
                label="Subtotal"
                value={formatNumber(totals?.subtotal, true)}
              />
              <AmountRow
                label="Total Tax"
                value={formatNumber(totals?.totalTax, true)}
                sub={`GST ${tax?.gstPercentage}%`}
              />
              <AmountRow
                label="Grand Total"
                value={formatNumber(totals?.grandTotal, true)}
                bold
                topDivider
              />
              <AmountRow
                label="Amount Paid"
                value={formatNumber(totals?.amountPaid, true)}
                accent
              />
              <div className="flex items-center justify-between py-3">
                <p className="text-xs font-semibold text-slate-500">
                  Amount Due
                </p>
                <div
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[11px] font-black border ${totals?.amountDue === 0 ? "bg-emerald-50 border-emerald-200 text-emerald-700" : "bg-red-50 border-red-200 text-red-700"}`}
                >
                  {totals?.amountDue === 0 ? (
                    <CheckCircle2 size={10} />
                  ) : (
                    <IndianRupee size={10} />
                  )}
                  {totals?.amountDue === 0
                    ? "Fully Paid"
                    : formatNumber(totals?.amountDue, true)}
                </div>
              </div>
            </MetricPanel>

            {/* ── Payment ── */}
            <MetricPanel
              title="Payment Details"
              icon={CreditCard}
              right={<StatusBadge status={payment?.status} />}
            >
              <InfoRow
                icon={CreditCard}
                label="Method"
                value={
                  payment?.method === "razorpay" ? "Razorpay" : payment?.method
                }
              />
              <InfoRow
                icon={Hash}
                label="Transaction ID"
                value={payment?.transactionId}
                mono
                valueClass="text-slate-700"
              />
              <InfoRow
                icon={CalendarDays}
                label="Paid At"
                value={
                  payment?.paidAt ? formatDate(payment.paidAt, "longTime") : "—"
                }
                valueClass="text-emerald-600"
              />
              {payment?.notes && (
                <InfoRow icon={FileText} label="Notes" value={payment.notes} />
              )}
            </MetricPanel>

            {/* ── Billed To ── */}
            <MetricPanel title="Billed To" icon={Building2}>
              <InfoRow
                icon={Building2}
                label="Legal Name"
                value={billedTo?.name}
              />
              <InfoRow
                icon={Store}
                label="Outlet"
                value={`${billedTo?.outletName} · ${billedTo?.outletCode}`}
              />
              <InfoRow
                icon={Mail}
                label="Email"
                value={billedTo?.email}
                valueClass="text-violet-600"
              />
              <InfoRow icon={Phone} label="Phone" value={billedTo?.phone} />
              <InfoRow icon={MapPin} label="Address" value={addr} />
              {billedTo?.gstin && (
                <InfoRow
                  icon={BadgeCheck}
                  label="GSTIN"
                  value={billedTo.gstin}
                  mono
                />
              )}
              {billedTo?.panNumber && (
                <InfoRow
                  icon={FileText}
                  label="PAN"
                  value={billedTo.panNumber}
                  mono
                />
              )}
            </MetricPanel>

            {/* ── Meta ── */}
            <MetricPanel title="Record Info" icon={RefreshCw}>
              <InfoRow
                icon={Hash}
                label="Transaction ID"
                value={`#${meta?.transactionId}`}
              />
              <InfoRow
                icon={Store}
                label="Outlet ID"
                value={`#${meta?.outletId}`}
              />
              <InfoRow
                icon={CalendarDays}
                label="Created At"
                value={
                  meta?.createdAt ? formatDate(meta.createdAt, "longTime") : "—"
                }
              />
            </MetricPanel>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionDetailsPage;
