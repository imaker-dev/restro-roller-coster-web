import React, { useState } from "react";
import {
  AlertCircle,
  Bike,
  Check,
  ChevronDown,
  Copy,
  ReceiptIndianRupee,
  ShoppingBag,
  Tag,
  SlidersHorizontal,
  UtensilsCrossed,
  AlertTriangle,
} from "lucide-react";
import { formatNumber } from "../../../utils/numberFormatter";
import PaymentBar from "../PaymentBreakdownBar";
import { formatDate } from "../../../utils/dateFormatter";
import { copyToClipboard } from "../../../utils/copyToClipboard";

const fmt = (n) => formatNumber(n, true);

function SectionHeading({ children }) {
  return (
    <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-3">
      {children}
    </p>
  );
}

function Divider({ dashed = false }) {
  return (
    <div
      className={`border-t my-2 ${dashed ? "border-dashed border-gray-200" : "border-gray-100"}`}
    />
  );
}

function DayEndCollectionSummaryCard({
  grandTotal,
  outsideCollections,
  dateRange,
}) {
  const {
    total_collection,
    paid_amount,
    due_amount,
    discount_amount,
    nc_amount,
    nc_orders,
    adjustment_count,
    adjustment_amount,
    ordersByType,
    paymentBreakdown,
    outside_collection,
    outside_collection_count,
    total_orders,
    average_order_value,
  } = grandTotal;

  const outside = outside_collection ?? outsideCollections?.total ?? 0;
  const collected = paid_amount + outside;

  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const getDateLabel = () => {
    if (!dateRange) return "Day End Summary";

    const start = formatDate(dateRange.start, "long");
    const end = formatDate(dateRange.end, "long");

    return start === end
      ? `Day End Summary — ${start}`
      : `Summary — ${start} to ${end}`;
  };

  const buildCopyText = () => {
    const title = getDateLabel();

    const lines = [
      `*${title}*`,
      `${"-".repeat(27)}`,
      ``,
      `*COLLECTION*`,
      ``,
      `Total Paid: ${fmt(paid_amount)}`,
      `Outside Collection: ${fmt(outside)}`,
    ];

    if (due_amount > 0) {
      lines.push(`Pending Amount: ${fmt(due_amount)}`);
    }

    //  Payment Breakdown
    const payments = Object.entries(paymentBreakdown).filter(([, v]) => v > 0);

    if (payments.length > 0) {
      lines.push(``, `${"-".repeat(27)}`, `*PAYMENT MODES*`, ``);

      payments.forEach(([mode, amount]) => {
        const label = mode.toUpperCase();
        lines.push(`${label}: ${fmt(amount)}`);
      });
    }

    lines.push(
      ``,
      `${"-".repeat(27)}`,
      `*Total Sale: ${fmt(total_collection)}*`,
    );

    return lines.join("\n");
  };

  const handleCopy = async (e) => {
    e.stopPropagation();

    const success = await copyToClipboard(buildCopyText());

    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } else {
      alert("Copy failed. Please copy manually.");
    }
  };

  return (
    <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
      {/* Header */}
      <button
        onClick={() => setOpen((p) => !p)}
        className="w-full flex items-center justify-between px-4 py-4 hover:bg-gray-50/60 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0">
            <ReceiptIndianRupee size={15} className="text-emerald-600" />
          </div>
          <div className="text-left">
            <p className="text-sm font-semibold text-gray-900">
              Collection Summary
            </p>
            <p className="text-xs text-gray-400">Payments, dues & deductions</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-base font-bold text-gray-900">
              {fmt(total_collection)}
            </p>
            {due_amount > 0 && (
              <p className="text-[10px] text-red-400 font-medium">
                {fmt(due_amount)} due
              </p>
            )}
          </div>
          <ChevronDown
            size={14}
            className={`text-gray-400 transition-transform duration-300 ease-in-out ${open ? "rotate-180" : ""}`}
          />
        </div>
      </button>

      {/* Body */}
      <div
        className={`border-t border-gray-100 transition-all duration-300 ease-in-out overflow-hidden ${
          open ? "max-h-[900px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        {/* ── COLLECTION SPLIT ── */}
        <div className="px-4 py-4 border-b border-gray-50">
          <SectionHeading>Collection Split</SectionHeading>

          <div className="bg-gray-50 rounded-xl px-3 py-3 space-y-2">
            {/* Paid */}
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">Paid</span>
              <span className="text-xs font-bold text-emerald-600">
                {fmt(paid_amount)}
              </span>
            </div>

            {/* Outside */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-gray-500">
                  Outside collection
                </span>
                {outside_collection_count > 0 && (
                  <span className="text-[10px] bg-gray-200 text-gray-500 px-1.5 py-0.5 rounded-full">
                    {outside_collection_count}
                  </span>
                )}
              </div>
              <span className="text-xs font-bold text-blue-600">
                {fmt(outside)}
              </span>
            </div>

            {/* Due */}
            {due_amount > 0 && (
              <>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <AlertTriangle size={10} className="text-red-400" />
                    <span className="text-xs text-red-400">Due (pending)</span>
                  </div>
                  <span className="text-xs font-bold text-red-500">
                    {fmt(due_amount)}
                  </span>
                </div>
              </>
            )}

            <Divider />

            {/* Total */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-700">
                Total collection
              </span>
              <span className="text-sm font-bold text-gray-900">
                {fmt(total_collection)}
              </span>
            </div>
            {/* <p className="text-[10px] text-gray-400 leading-relaxed">
              = Paid {fmt(paid_amount)} + Outside {fmt(outside)}
              {due_amount > 0 ? ` + Due ${fmt(due_amount)}` : ""}
            </p> */}
          </div>
        </div>

        {/* ── PAYMENT MODES ── */}
        <div className="px-4 py-4 border-b border-gray-50">
          <SectionHeading>Payment Modes</SectionHeading>

          <div className="bg-gray-50 rounded-xl px-3 py-3 space-y-3">
            {Object.entries(paymentBreakdown)
              .filter(([, amount]) => amount > 0)
              .map(([mode, amount]) => {
                return (
                  <PaymentBar
                    key={mode}
                    type={mode}
                    amount={amount}
                    total={total_collection}
                  />
                );
              })}

            <Divider dashed />
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-gray-600">
                Total collected
              </span>
              <span className="text-xs font-bold text-gray-900">
                {fmt(collected)}
              </span>
            </div>
          </div>
        </div>

        {/* ── ORDER TYPES ── */}
        <div className="px-4 py-4 border-b border-gray-50">
          <SectionHeading>Order Types</SectionHeading>
          <div className="flex gap-2 flex-wrap">
            {[
              {
                icon: UtensilsCrossed,
                label: "Dine-in",
                count: ordersByType.dine_in,
                cls: "bg-blue-50 text-blue-600",
              },
              {
                icon: ShoppingBag,
                label: "Takeaway",
                count: ordersByType.takeaway,
                cls: "bg-violet-50 text-violet-600",
              },
              {
                icon: Bike,
                label: "Delivery",
                count: ordersByType.delivery,
                cls: "bg-orange-50 text-orange-500",
              },
            ].map(({ icon: Icon, label, count, cls }) => (
              <div
                key={label}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl ${cls}`}
              >
                <Icon size={11} />
                <span className="text-[11px] font-medium">{label}</span>
                <span className="text-[11px] font-bold">{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── GIVEN AWAY ── */}
        {(discount_amount > 0 || nc_amount > 0 || adjustment_amount > 0) && (
          <div className="px-4 py-4 border-b border-gray-50">
            <SectionHeading>Given Away</SectionHeading>

            <div className="bg-gray-50 rounded-xl px-3 py-2.5 space-y-0 divide-y divide-gray-100">
              {[
                discount_amount > 0 && {
                  icon: Tag,
                  label: "Discount",
                  value: fmt(discount_amount),
                  cls: "text-gray-700",
                  sub: null,
                },
                nc_amount > 0 && {
                  icon: AlertCircle,
                  label: "No charge",
                  value: fmt(nc_amount),
                  cls: "text-gray-700",
                  sub: `${nc_orders} orders`,
                },
                adjustment_amount > 0 && {
                  icon: SlidersHorizontal,
                  label: "Adjustments",
                  value: fmt(adjustment_amount),
                  cls: "text-gray-700",
                  sub: `${adjustment_count} entries`,
                },
              ]
                .filter(Boolean)
                .map(({ icon: Icon, label, value, cls, sub }) => (
                  <div
                    key={label}
                    className="flex items-center justify-between py-2"
                  >
                    <div className="flex items-center gap-2">
                      <Icon size={12} className="text-gray-400 shrink-0" />
                      <span className="text-xs text-gray-500">{label}</span>
                      {sub && (
                        <span className="text-[10px] text-gray-400 bg-gray-200 px-1.5 py-0.5 rounded-full">
                          {sub}
                        </span>
                      )}
                    </div>
                    <span className={`text-xs font-semibold ${cls}`}>
                      {value}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* ── COPY BUTTON ── */}
        {/* <div className="px-4 py-3 flex justify-end">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors text-[11px] font-medium text-gray-500"
          >
            {copied ? (
              <>
                <Check size={11} className="text-emerald-500" />
                <span className="text-emerald-600">Copied!</span>
              </>
            ) : (
              <>
                <Copy size={11} />
                Copy Summary
              </>
            )}
          </button>
        </div> */}
      </div>
    </div>
  );
}

export default DayEndCollectionSummaryCard;
