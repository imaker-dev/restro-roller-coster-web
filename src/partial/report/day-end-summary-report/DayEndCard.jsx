import { useState } from "react";
import { formatNumber } from "../../../utils/numberFormatter";
import {
  Banknote,
  Bike,
  ChevronDown,
  Copy,
  Check,
  CreditCard,
  Smartphone,
  ShoppingBag,
  AlertTriangle,
  ReceiptIndianRupee,
  UtensilsCrossed,
  Wallet,
  Tag,
  AlertCircle,
  SlidersHorizontal,
  Gift,
} from "lucide-react";
import PaymentBar from "../PaymentBreakdownBar";
import { copyToClipboard } from "../../../utils/copyToClipboard";
import { formatText } from "../../../utils/utils";

const weekday = (d) =>
  new Date(d).toLocaleDateString("en-IN", { weekday: "short" });

const shortDate = (d) =>
  new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short" });

const fmt = (n) => formatNumber(n, true);

function Row({ label, value, labelClass = "", valueClass = "", sub = false }) {
  return (
    <div className={`flex items-center justify-between ${sub ? "pl-4" : ""}`}>
      <span className={`text-xs ${labelClass || "text-gray-500"}`}>
        {label}
      </span>
      <span
        className={`text-xs font-semibold ${valueClass || "text-gray-800"}`}
      >
        {value}
      </span>
    </div>
  );
}

function Divider({ dashed = false }) {
  return (
    <div
      className={`border-t ${dashed ? "border-dashed border-gray-200" : "border-gray-100"}`}
    />
  );
}

function SectionLabel({ icon: Icon, label }) {
  return (
    <div className="flex items-center gap-1.5">
      <Icon size={11} className="text-gray-400" />
      <span className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">
        {label}
      </span>
    </div>
  );
}

function DayEndCard({ day }) {
  const {
    date,
    total_orders,
    total_collection,
    ordersByType,
    discount_amount,
    outside_collection_count,
    outside_collection,
    nc_orders,
    nc_amount,
    paid_amount,
    due_amount,
    adjustment_count,
    adjustment_amount,
    average_order_value,
    paymentBreakdown,
    floorBreakdown,
  } = day;

  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  // Payment breakdown total = paid + outside (what's actually received)
  const collected = paid_amount + outside_collection;

  const buildCopyText = () => {
    const d = shortDate(date);

    const formatLine = (label, value) =>
      `${label} - ${value ? fmt(value) + "/-" : "-"}`;

    const lines = [`${d}`, ``];

    // FLOORS
    // floorBreakdown.forEach((floor, index) => {
    //   const pay = floor.paymentBreakdown || {};

    //   lines.push(
    //     `${floor.floor_name}`,
    //     formatLine("Total Sale", floor.total_sale),
    //     formatLine("Cash", pay.cash),
    //     formatLine("Card", pay.card),
    //     formatLine("UPI", pay.upi),
    //     `NC - -`,
    //     formatLine("Hold", floor.due_amount),
    //   );

    //   if (index !== floorBreakdown.length - 1) {
    //     lines.push(``, `${"-".repeat(28)}`, ``);
    //   }
    // });

    floorBreakdown.forEach((floor, index) => {
      const pay = floor.paymentBreakdown || {};

      const isThirdFloor = floor.floor_name.toLowerCase().includes("Restaurent");

      // Add outside collection to third floor totals
      const updatedTotalSale = isThirdFloor
        ? floor.total_sale + outside_collection
        : floor.total_sale;

      const updatedUPI = isThirdFloor
        ? (pay.upi || 0) + outside_collection
        : pay.upi;

      lines.push(
        `${floor.floor_name}`,
        formatLine("Total Sale", updatedTotalSale),
        formatLine("Cash", pay.cash),
        formatLine("Card", pay.card),
        formatLine("UPI", updatedUPI),

        // ✅ Show OUTSIDE COLLECTION inside Third Floor
        ...(isThirdFloor && outside_collection > 0
          ? [formatLine("Outside Collection", outside_collection)]
          : []),

        // `NC - -`,
        formatLine("Hold", floor.due_amount),
      );

      if (index !== floorBreakdown.length - 1) {
        lines.push(``, `${"-".repeat(28)}`, ``);
      }
    });

    // TOTAL
    lines.push(
      ``,
      `${"-".repeat(28)}`,
      ``,
      `TOTAL`,
      formatLine("Total Sale", total_collection),
      formatLine("Cash", paymentBreakdown.cash),
      formatLine("Card", paymentBreakdown.card),
      formatLine("UPI", paymentBreakdown.upi),
      // `NC - -`,
      formatLine("Hold", due_amount),
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
        className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-gray-50/60 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 flex flex-col items-center justify-center shrink-0">
            <span className="text-[10px] font-medium text-gray-400 leading-none">
              {weekday(date)}
            </span>
            <span className="text-sm font-bold text-gray-800 leading-none mt-0.5">
              {new Date(date).getDate()}
            </span>
          </div>
          <div className="text-left">
            <p className="text-sm font-semibold text-gray-900">
              {shortDate(date)}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">
              {total_orders} orders · avg {fmt(average_order_value)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2.5">
          <div className="text-right">
            <p className="text-sm font-bold text-gray-900">
              {fmt(total_collection)}
            </p>
            {due_amount > 0 && (
              <p className="text-[10px] text-red-400 font-medium">
                {fmt(due_amount)} due
              </p>
            )}
          </div>
          <ChevronDown
            size={13}
            className={`text-gray-400 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
          />
        </div>
      </button>

      {/* Expandable body */}
      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          open ? "max-h-[700px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="border-t border-gray-100 px-4 py-3 space-y-3">
          {/* Order type pills */}
          <div className="flex gap-1.5 flex-wrap">
            {[
              {
                icon: UtensilsCrossed,
                label: "Dine-in",
                count: ordersByType.dine_in,
                bg: "bg-blue-50 text-blue-600",
              },
              {
                icon: ShoppingBag,
                label: "Takeaway",
                count: ordersByType.takeaway,
                bg: "bg-violet-50 text-violet-600",
              },
              {
                icon: Bike,
                label: "Delivery",
                count: ordersByType.delivery,
                bg: "bg-orange-50 text-orange-500",
              },
            ].map(({ icon: Icon, label, count, bg }) => (
              <div
                key={label}
                className={`flex items-center gap-1 px-2 py-1 rounded-lg ${bg}`}
              >
                <Icon size={10} />
                <span className="text-[10px] font-medium">{label}</span>
                <span className="text-[10px] font-bold">{count}</span>
              </div>
            ))}
          </div>

          <Divider />

          {/* ── COLLECTION SPLIT ── */}
          <div className="space-y-2">
            <SectionLabel icon={Wallet} label="Collection Split" />

            <div className="bg-gray-50 rounded-xl px-3 py-2.5 space-y-2">
              <Row
                label="Paid"
                value={fmt(paid_amount)}
                valueClass="text-emerald-600 font-bold"
              />
              <Row
                label="Outside collection"
                value={fmt(outside_collection)}
                valueClass="text-blue-600 font-semibold"
              />

              {due_amount > 0 && (
                <>
                  <Divider dashed />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <AlertTriangle size={10} className="text-red-400" />
                      <span className="text-xs text-red-400">
                        Due (pending)
                      </span>
                    </div>
                    <span className="text-xs font-bold text-red-500">
                      {fmt(due_amount)}
                    </span>
                  </div>
                </>
              )}

              <Divider />
              <Row
                label="Total collection"
                value={fmt(total_collection)}
                valueClass="text-gray-900 font-bold"
                labelClass="text-gray-600 font-medium text-xs"
              />
              {/* <p className="text-[10px] text-gray-400">
                = Paid {fmt(paid_amount)} + Outside {fmt(outside_collection)}{due_amount > 0 ? ` + Due ${fmt(due_amount)}` : ""}
              </p> */}
            </div>
          </div>

          {/* ── PAYMENT MODES ── */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <SectionLabel icon={ReceiptIndianRupee} label="Payment Modes" />
            </div>

            <div className="bg-gray-50 rounded-xl px-3 py-2.5 space-y-2.5">
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
              <Row
                label="Total collected"
                value={fmt(collected)}
                valueClass="text-gray-800 font-bold"
              />
            </div>
          </div>

          {/* ── GIVEN AWAY ── */}
          <div className="space-y-2">
            <SectionLabel icon={Gift} label="Given Away" />
            {(discount_amount > 0 ||
              nc_amount > 0 ||
              adjustment_amount > 0) && (
              <div className="border-b border-gray-50">
                {/* <SectionLabel label="Given Away" /> */}

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
          </div>

          {/* Copy button */}
          {/* <div className="flex justify-end pt-1">
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
    </div>
  );
}

export default DayEndCard;
