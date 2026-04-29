import { useEffect, useRef, useState } from "react";
import PageHeader from "../../layout/PageHeader";
import { useQueryParams } from "../../hooks/useQueryParams";
import { useDispatch, useSelector } from "react-redux";
import { fetchPurchaseById } from "../../redux/slices/inventorySlice";
import LoadingOverlay from "../../components/LoadingOverlay";
import { formatDate } from "../../utils/dateFormatter";
import {
  Building2,
  Phone,
  Hash,
  CalendarDays,
  ReceiptText,
  CreditCard,
  Package,
  Wallet,
  CalendarX,
  Banknote,
  Smartphone,
  BadgeIndianRupee,
  Info,
  AlertTriangle,
} from "lucide-react";
import MetricPanel from "../../partial/report/daily-sales-report/MetricPanel";
import NoDataFound from "../../layout/NoDataFound";

/* ─── helpers ─────────────────────────────────────────────────────────────── */
const inr = (v) =>
  `₹${parseFloat(v ?? 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const safePct = (a, b) =>
  b > 0 ? Math.min(Math.round((a / b) * 100), 100) : 0;

/* ─── Animated progress bar ──────────────────────────────────────────────── */
function ProgressBar({ value, max, colorClass = "bg-emerald-500", h = "h-2" }) {
  const [w, setW] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setW(safePct(value, max)), 300);
    return () => clearTimeout(t);
  }, [value, max]);
  return (
    <div className={`w-full bg-slate-100 rounded-full ${h} overflow-hidden`}>
      <div
        className={`${h} rounded-full ${colorClass} transition-all duration-1000 ease-out`}
        style={{ width: `${w}%` }}
      />
    </div>
  );
}

/* ─── Animated counter ────────────────────────────────────────────────────── */
function Counter({ to = 0, prefix = "₹" }) {
  const [v, setV] = useState(0);
  const r = useRef();
  useEffect(() => {
    if (!to) {
      setV(0);
      return;
    }
    const t0 = performance.now();
    const run = (t) => {
      const p = Math.min((t - t0) / 900, 1);
      setV(to * (1 - Math.pow(1 - p, 4)));
      if (p < 1) r.current = requestAnimationFrame(run);
      else setV(to);
    };
    r.current = requestAnimationFrame(run);
    return () => cancelAnimationFrame(r.current);
  }, [to]);
  return (
    <>
      {prefix}
      {Math.floor(v).toLocaleString("en-IN")}
    </>
  );
}

/* ─── Status configs ──────────────────────────────────────────────────────── */
const PAYMENT_CFG = {
  paid: {
    label: "Paid",
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    ring: "ring-emerald-200",
    dot: "bg-emerald-500",
  },
  unpaid: {
    label: "Unpaid",
    bg: "bg-red-50",
    text: "text-red-700",
    ring: "ring-red-200",
    dot: "bg-red-500",
  },
  partial: {
    label: "Partial",
    bg: "bg-amber-50",
    text: "text-amber-700",
    ring: "ring-amber-200",
    dot: "bg-amber-500",
  },
  "partially paid": {
    label: "Partial",
    bg: "bg-amber-50",
    text: "text-amber-700",
    ring: "ring-amber-200",
    dot: "bg-amber-500",
  },
};

const ORDER_CFG = {
  confirmed: {
    label: "Confirmed",
    bg: "bg-sky-50",
    text: "text-sky-700",
    ring: "ring-sky-200",
  },
  pending: {
    label: "Pending",
    bg: "bg-orange-50",
    text: "text-orange-700",
    ring: "ring-orange-200",
  },
  draft: {
    label: "Draft",
    bg: "bg-slate-100",
    text: "text-slate-600",
    ring: "ring-slate-200",
  },
  cancelled: {
    label: "Cancelled",
    bg: "bg-red-50",
    text: "text-red-700",
    ring: "ring-red-200",
  },
  received: {
    label: "Received",
    bg: "bg-violet-50",
    text: "text-violet-700",
    ring: "ring-violet-200",
  },
};

const METHOD_CFG = {
  cash: { label: "Cash", Icon: Banknote },
  upi: { label: "UPI", Icon: Smartphone },
  card: { label: "Card", Icon: CreditCard },
  bank: { label: "Bank Transfer", Icon: Building2 },
  "bank transfer": { label: "Bank Transfer", Icon: Building2 },
};

function PayBadge({ status }) {
  const c = PAYMENT_CFG[status?.toLowerCase()] ?? PAYMENT_CFG.unpaid;
  return (
    <span
      className={`inline-flex items-center gap-1.5 ${c.bg} ${c.text} ring-1 ${c.ring} text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide`}
    >
      <span className={`w-1 h-1 rounded-full ${c.dot} flex-shrink-0`} />
      {c.label}
    </span>
  );
}

function OrdBadge({ status }) {
  const c = ORDER_CFG[status?.toLowerCase()] ?? ORDER_CFG.pending;
  return (
    <span
      className={`inline-flex items-center ${c.bg} ${c.text} ring-1 ${c.ring} text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide`}
    >
      {c.label}
    </span>
  );
}

/* ─── Label-value row ─────────────────────────────────────────────────────── */
function Row({ label, value, accent, mono }) {
  if (value === null || value === undefined || value === "") return null;
  return (
    <div className="flex items-center justify-between gap-4 py-2.5 border-b border-slate-50 last:border-0">
      <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex-shrink-0">
        {label}
      </span>
      <span
        className={`text-sm font-bold text-right break-all ${accent ?? "text-slate-800"} ${mono ? "font-mono" : ""}`}
      >
        {value}
      </span>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   PAGE
═══════════════════════════════════════════════════════════════════════════ */
const PurchaseOrderDetailsPage = () => {
  const dispatch = useDispatch();
  const { purchaseId } = useQueryParams();
  const { purchaseDetails, isFetchingPurchaseDetails } = useSelector(
    (state) => state.inventory,
  );

  useEffect(() => {
    if (!purchaseId) return;
    dispatch(fetchPurchaseById(purchaseId));
  }, [purchaseId]);

  if (isFetchingPurchaseDetails) return <LoadingOverlay />;

  const d = purchaseDetails;

  if (!d) return <NoDataFound title="No purchase data found." />;

  const isCancelled = d.status?.toLowerCase() === "cancelled";
  const isPaid = d.paymentStatus?.toLowerCase() === "paid";
  const paidPct = safePct(d.paidAmount, d.totalAmount);
  const payTotal = (d.payments ?? []).reduce((s, p) => s + (p.amount ?? 0), 0);

  return (
    <div className="space-y-4">
      <PageHeader title="Purchase Details" showBackButton />

      {/* ════════════════════════════════════════════
          HERO — order identity + KPIs
      ════════════════════════════════════════════ */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {/* Cancelled banner */}
        {isCancelled && (
          <div className="flex items-center gap-3 bg-red-50 border-b border-red-100 px-5 py-3">
            <AlertTriangle
              size={14}
              className="text-red-500 flex-shrink-0"
              strokeWidth={2}
            />
            <p className="text-xs font-bold text-red-600">
              This purchase order has been cancelled and is no longer active.
            </p>
          </div>
        )}

        {/* Identity row */}
        <div className="flex flex-wrap items-start justify-between gap-4 px-5 py-4 border-b border-slate-50">
          <div className="flex items-center gap-3">
            <div
              className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${isCancelled ? "bg-slate-200" : "bg-slate-900"}`}
            >
              <span className="text-base font-extrabold text-white uppercase">
                {d.vendorName?.charAt(0) ?? "V"}
              </span>
            </div>
            <div>
              <p className="text-base font-extrabold text-slate-900">
                {d.vendorName}
              </p>
              <div className="flex flex-wrap items-center gap-3 mt-0.5">
                <div className="flex items-center gap-1">
                  <Phone size={10} className="text-slate-400" strokeWidth={2} />
                  <span className="text-[11px] text-slate-400 font-medium">
                    {d.vendorPhone ?? "—"}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Hash size={10} className="text-slate-400" strokeWidth={2} />
                  <span className="text-[11px] font-semibold text-slate-500">
                    {d.purchaseNumber}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <CalendarDays
                    size={10}
                    className="text-slate-400"
                    strokeWidth={2}
                  />
                  <span className="text-[11px] text-slate-400 font-medium">
                    {formatDate(d.purchaseDate, "long")}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <OrdBadge status={d.status} />
            <PayBadge status={d.paymentStatus} />
          </div>
        </div>

        {/* KPI strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-y sm:divide-y-0 divide-slate-50">
          {[
            {
              label: "Total Amount",
              to: d.totalAmount,
              color: "text-slate-900",
            },
            {
              label: "Paid Amount",
              to: d.paidAmount,
              color: "text-emerald-600",
            },
            {
              label: "Due Amount",
              to: d.dueAmount,
              color: d.dueAmount > 0 ? "text-red-600" : "text-slate-400",
            },
            {
              label: "Items",
              raw: d.items?.length ?? d.itemCount,
              color: "text-violet-600",
            },
          ].map(({ label, to, raw, color }) => (
            <div key={label} className="flex flex-col gap-1 px-5 py-4">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                {label}
              </span>
              <p
                className={`text-2xl font-extrabold tabular-nums tracking-tight ${color}`}
              >
                {raw !== undefined ? raw : <Counter to={to} />}
              </p>
            </div>
          ))}
        </div>

        {/* Payment progress */}
        <div className="px-5 pb-4 pt-1">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Payment Progress
            </span>
            <span
              className={`text-[10px] font-extrabold ${isPaid ? "text-emerald-600" : isCancelled ? "text-slate-400" : "text-amber-600"}`}
            >
              {paidPct}% cleared
            </span>
          </div>
          <ProgressBar
            value={d.paidAmount}
            max={d.totalAmount}
            colorClass={
              isPaid
                ? "bg-emerald-500"
                : isCancelled
                  ? "bg-slate-300"
                  : "bg-amber-400"
            }
          />
        </div>
      </div>

      {/* ════════════════════════════════════════════
          MAIN 2-COL GRID
      ════════════════════════════════════════════ */}
      <div className="grid lg:grid-cols-3 gap-4">
        {/* ── LEFT (2/3) ── */}
        <div className="lg:col-span-2 space-y-4">
          {/* ── Items table ── */}
          <MetricPanel
            title="Ordered Items"
            desc={`${d.items?.length ?? 0} item${d.items?.length !== 1 ? "s" : ""}`}
            icon={Package}
            noPad
          >
            {!d.items?.length ? (
              <div className="px-5 py-10 text-center">
                <Package
                  size={28}
                  className="text-slate-200 mx-auto mb-2"
                  strokeWidth={1.5}
                />
                <p className="text-sm font-semibold text-slate-400">
                  No items on this order.
                </p>
              </div>
            ) : (
              <>
                {/* Desktop table header */}
                <div className="hidden sm:grid grid-cols-12 gap-2 px-5 py-2.5 bg-slate-50 border-b border-slate-100 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
                  <div className="col-span-4">Item</div>
                  <div className="col-span-2 text-right">Qty</div>
                  <div className="col-span-2 text-right">Rate</div>
                  <div className="col-span-2 text-right">Tax</div>
                  <div className="col-span-2 text-right">Total</div>
                </div>

                {d.items.map((item, i) => {
                  const expDate = item.expiryDate
                    ? new Date(item.expiryDate)
                    : null;
                  const daysLeft = expDate
                    ? Math.ceil((expDate - new Date()) / 86400000)
                    : null;
                  const isExpired = daysLeft !== null && daysLeft < 0;
                  const isWarn =
                    daysLeft !== null && daysLeft >= 0 && daysLeft <= 7;

                  return (
                    <div
                      key={item.id}
                      className={`border-b border-slate-50 last:border-0 ${isCancelled ? "opacity-60" : ""}`}
                    >
                      {/* Main row */}
                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center px-5 py-4">
                        {/* Item identity */}
                        <div className="sm:col-span-4 flex items-center gap-3 min-w-0">
                          <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                            <Package
                              size={13}
                              className="text-slate-400"
                              strokeWidth={2}
                            />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-extrabold text-slate-900 truncate">
                              {item.itemName}
                            </p>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                                {item.itemSku}
                              </span>
                              {item.batchCode && (
                                <span className="text-[10px] font-medium text-slate-400 truncate">
                                  {item.batchCode}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Mobile labels + values */}
                        <div className="sm:hidden grid grid-cols-2 gap-2 mt-2">
                          {[
                            {
                              l: "Qty",
                              v: `${item.quantity} ${item.unitAbbreviation}`,
                            },
                            { l: "Rate", v: inr(item.pricePerUnit) },
                            { l: "Tax", v: inr(item.taxAmount) },
                            { l: "Total", v: inr(item.totalCost), bold: true },
                          ].map(({ l, v, bold }) => (
                            <div
                              key={l}
                              className="bg-slate-50 rounded-lg px-3 py-2"
                            >
                              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">
                                {l}
                              </p>
                              <p
                                className={`text-sm tabular-nums ${bold ? "font-extrabold text-slate-900" : "font-bold text-slate-700"}`}
                              >
                                {v}
                              </p>
                            </div>
                          ))}
                        </div>

                        {/* Desktop cols */}
                        <div className="hidden sm:block sm:col-span-2 text-right">
                          <p className="text-sm font-bold text-slate-700 tabular-nums">
                            {item.quantity} {item.unitAbbreviation}
                          </p>
                          <p className="text-[10px] text-slate-400 font-medium">
                            {item.unitName}
                          </p>
                        </div>
                        <div className="hidden sm:block sm:col-span-2 text-right">
                          <p className="text-sm font-bold text-slate-700 tabular-nums">
                            {inr(item.pricePerUnit)}
                          </p>
                          <p className="text-[10px] text-slate-400">
                            per {item.unitAbbreviation}
                          </p>
                        </div>
                        <div className="hidden sm:block sm:col-span-2 text-right">
                          <p className="text-sm font-bold text-slate-700 tabular-nums">
                            {inr(item.taxAmount)}
                          </p>
                          {item.discountAmount > 0 && (
                            <p className="text-[10px] text-emerald-600 font-medium">
                              -{inr(item.discountAmount)} off
                            </p>
                          )}
                        </div>
                        <div className="hidden sm:block sm:col-span-2 text-right">
                          <p className="text-base font-extrabold text-slate-900 tabular-nums">
                            {inr(item.totalCost)}
                          </p>
                        </div>
                      </div>

                      {/* Expiry + notes sub-row */}
                      {(item.expiryDate || item.notes) && (
                        <div className="flex flex-wrap items-center gap-4 px-5 py-2.5 bg-slate-50 border-t border-slate-50">
                          {item.expiryDate && (
                            <div
                              className={`flex items-center gap-1.5 text-[11px] font-semibold ${isExpired ? "text-red-600" : isWarn ? "text-amber-600" : "text-slate-500"}`}
                            >
                              <CalendarX size={11} strokeWidth={2} />
                              {isExpired
                                ? `Expired ${Math.abs(daysLeft)} day${Math.abs(daysLeft) !== 1 ? "s" : ""} ago`
                                : isWarn
                                  ? `Expires in ${daysLeft} day${daysLeft !== 1 ? "s" : ""}`
                                  : `Expires: ${formatDate(item.expiryDate, "long")}`}
                            </div>
                          )}
                          {item.notes && (
                            <p className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                              <Info size={10} strokeWidth={2} />
                              {item.notes}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Totals footer */}
                <div className="bg-slate-50 border-t border-slate-100 px-5 py-3 grid grid-cols-1 sm:grid-cols-12 gap-2 items-center">
                  <div className="sm:col-span-4">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                      Order Total
                    </p>
                  </div>
                  <div className="hidden sm:block sm:col-span-4" />
                  <div className="hidden sm:block sm:col-span-2 text-right">
                    <p className="text-[11px] font-semibold text-slate-400">
                      {inr(d.taxAmount)}
                    </p>
                  </div>
                  <div className="sm:col-span-2 text-right flex sm:block items-center justify-between sm:justify-end gap-2">
                    <span className="text-xs font-bold text-slate-500 sm:hidden">
                      Total
                    </span>
                    <p className="text-base font-extrabold text-slate-900 tabular-nums">
                      {inr(d.totalAmount)}
                    </p>
                  </div>
                </div>
              </>
            )}
          </MetricPanel>

          {/* ── Payment history ── */}
          <MetricPanel
            title="Payment History"
            desc={`${d.payments?.length ?? 0} transaction${d.payments?.length !== 1 ? "s" : ""}`}
            icon={CreditCard}
            noPad
          >
            {!d.payments?.length ? (
              <div className="px-5 py-10 text-center">
                <CreditCard
                  size={28}
                  className="text-slate-200 mx-auto mb-2"
                  strokeWidth={1.5}
                />
                <p className="text-sm font-semibold text-slate-400">
                  No payments recorded yet.
                </p>
              </div>
            ) : (
              <>
                {/* Header */}
                <div className="hidden sm:grid grid-cols-12 gap-2 px-5 py-2.5 bg-slate-50 border-b border-slate-100 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
                  <div className="col-span-3">Method</div>
                  <div className="col-span-3">Date & Time</div>
                  <div className="col-span-2">Reference</div>
                  <div className="col-span-2">By</div>
                  <div className="col-span-2 text-right">Amount</div>
                </div>

                {d.payments.map((pay, i) => {
                  const cfg = METHOD_CFG[pay.paymentMethod?.toLowerCase()] ?? {
                    label: pay.paymentMethod,
                    Icon: Wallet,
                  };
                  const MIcon = cfg.Icon;
                  return (
                    <div
                      key={pay.id}
                      className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center px-5 py-4 border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors"
                    >
                      {/* Method */}
                      <div className="sm:col-span-3 flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-100 flex items-center justify-center flex-shrink-0">
                          <MIcon
                            size={13}
                            className="text-slate-500"
                            strokeWidth={2}
                          />
                        </div>
                        <div>
                          <p className="text-xs font-extrabold text-slate-800 capitalize">
                            {cfg.label}
                          </p>
                          {pay.notes && (
                            <p className="text-[10px] font-medium text-slate-400 truncate max-w-[100px]">
                              {pay.notes}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Mobile amount quick-view */}
                      <div className="flex items-center justify-between sm:hidden mt-1">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-[10px] text-slate-400 font-medium">
                            {formatDate(pay.createdAt, "long")} ·{" "}
                            {formatDate(pay.createdAt, "time")}
                          </span>
                          {pay.paymentReference && (
                            <span className="text-[10px] font-semibold text-slate-500">
                              Ref: {pay.paymentReference}
                            </span>
                          )}
                        </div>
                        <span className="text-sm font-extrabold text-emerald-600 tabular-nums">
                          +{inr(pay.amount)}
                        </span>
                      </div>

                      {/* Desktop cols */}
                      <div className="hidden sm:block sm:col-span-3">
                        <p className="text-xs font-semibold text-slate-600">
                          {formatDate(pay.createdAt, "long")}
                        </p>
                        <p className="text-[10px] text-slate-400 font-medium">
                          {formatDate(pay.createdAt, "time")}
                        </p>
                      </div>
                      <div className="hidden sm:block sm:col-span-2">
                        {pay.paymentReference ? (
                          <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-1 rounded-lg">
                            {pay.paymentReference}
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-300 font-medium">
                            —
                          </span>
                        )}
                      </div>
                      <div className="hidden sm:block sm:col-span-2">
                        <p className="text-[11px] font-semibold text-slate-500">
                          {pay.createdByName}
                        </p>
                      </div>
                      <div className="hidden sm:block sm:col-span-2 text-right">
                        <p className="text-sm font-extrabold text-emerald-600 tabular-nums">
                          +{inr(pay.amount)}
                        </p>
                      </div>
                    </div>
                  );
                })}

                {/* Total row */}
                <div className="flex items-center justify-between px-5 py-3.5 bg-slate-50 border-t border-slate-100">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                    Total Paid
                  </p>
                  <p className="text-base font-extrabold text-emerald-600 tabular-nums">
                    {inr(payTotal)}
                  </p>
                </div>
              </>
            )}
          </MetricPanel>
        </div>

        {/* ── RIGHT SIDEBAR (1/3) ── */}
        <div className="space-y-4">
          {/* Bill Summary */}
          <MetricPanel
            title="Bill Summary"
            icon={BadgeIndianRupee}
            desc="Amount breakdown"
          >
            <div className="space-y-0.5">
              {[
                {
                  label: "Subtotal",
                  value: inr(d.subtotal),
                  accent: "text-slate-700",
                },
                {
                  label: "Tax",
                  value: inr(d.taxAmount),
                  accent: "text-slate-600",
                },
                {
                  label: "Discount",
                  value: `− ${inr(d.discountAmount)}`,
                  accent: "text-emerald-600",
                },
              ].map(({ label, value, accent }) => (
                <div
                  key={label}
                  className="flex items-center justify-between py-2.5 border-b border-slate-50 last:border-0"
                >
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    {label}
                  </span>
                  <span className={`text-sm font-bold tabular-nums ${accent}`}>
                    {value}
                  </span>
                </div>
              ))}

              {/* Total highlight */}
              <div className="flex items-center justify-between pt-3 mt-2 border-t-2 border-slate-200">
                <span className="text-sm font-extrabold text-slate-900">
                  Grand Total
                </span>
                <span className="text-xl font-extrabold text-slate-900 tabular-nums">
                  {inr(d.totalAmount)}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-4">
                <div className="bg-emerald-50 border border-emerald-100 rounded-xl px-3 py-3 text-center">
                  <p className="text-[9px] font-bold text-emerald-600 uppercase tracking-widest mb-1">
                    Paid
                  </p>
                  <p className="text-sm font-extrabold text-emerald-700 tabular-nums">
                    {inr(d.paidAmount)}
                  </p>
                </div>
                <div
                  className={`border rounded-xl px-3 py-3 text-center ${d.dueAmount > 0 ? "bg-red-50 border-red-100" : "bg-slate-50 border-slate-100"}`}
                >
                  <p
                    className={`text-[9px] font-bold uppercase tracking-widest mb-1 ${d.dueAmount > 0 ? "text-red-600" : "text-slate-400"}`}
                  >
                    Due
                  </p>
                  <p
                    className={`text-sm font-extrabold tabular-nums ${d.dueAmount > 0 ? "text-red-700" : "text-slate-400"}`}
                  >
                    {inr(d.dueAmount)}
                  </p>
                </div>
              </div>

              {/* Progress */}
              <div className="mt-4">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Cleared
                  </span>
                  <span
                    className={`text-[10px] font-extrabold ${isPaid ? "text-emerald-600" : "text-amber-600"}`}
                  >
                    {paidPct}%
                  </span>
                </div>
                <ProgressBar
                  value={d.paidAmount}
                  max={d.totalAmount}
                  colorClass={isPaid ? "bg-emerald-500" : "bg-amber-400"}
                  h="h-1.5"
                />
              </div>
            </div>
          </MetricPanel>

          {/* Order Info */}
          <MetricPanel title="Order Info" icon={ReceiptText}>
            <Row label="PO Number" value={d.purchaseNumber} mono />
            <Row label="Invoice No" value={d.invoiceNumber} />
            <Row label="Date" value={formatDate(d.purchaseDate, "long")} />
            <Row label="Created By" value={d.createdByName} />
            <Row label="Notes" value={d.notes ?? "—"} />
          </MetricPanel>
        </div>
      </div>
    </div>
  );
};

export default PurchaseOrderDetailsPage;
