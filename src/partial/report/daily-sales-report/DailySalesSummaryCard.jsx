import {
  AlertCircle,
  Bike,
  CheckCircle,
  ChevronDown,
  Clock,
  ShoppingBag,
  SlidersHorizontal,
  Tag,
  UtensilsCrossed,
  XCircle,
  AlertTriangle,
  Check,
  Copy,
} from "lucide-react";
import { useState } from "react";
import { formatNumber } from "../../../utils/numberFormatter";
import StatusPill from "../../../components/StatusPill";
import { copyToClipboard } from "../../../utils/copyToClipboard";

const shortDate = (d) =>
  new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
const weekday = (d) =>
  new Date(d).toLocaleDateString("en-IN", { weekday: "short" });

function Divider({ dashed = false }) {
  return (
    <div
      className={`border-t my-2 ${dashed ? "border-dashed border-gray-200" : "border-gray-100"}`}
    />
  );
}

function Row({
  label,
  value,
  labelClass = "text-gray-500",
  valueClass = "text-gray-700",
}) {
  return (
    <div className="flex items-center justify-between">
      <span className={`text-xs ${labelClass}`}>{label}</span>
      <span className={`text-xs font-semibold ${valueClass}`}>{value}</span>
    </div>
  );
}

function DailySalesSummaryCard({ day }) {
  const {
    date,
    total_orders,
    total_sale,
    total_collection,
    order_sale,
    outside_collection,
    outside_collection_count,
    dine_in_orders,
    takeaway_orders,
    delivery_orders,
    discount_amount,
    nc_order_count,
    nc_amount,
    adjustment_order_count,
    adjustment_amount,
    fully_paid_orders,
    partial_paid_orders,
    unpaid_orders,
    total_paid_amount,
    total_due_amount,
    components,
    total_guests,
  } = day;

  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const outside = outside_collection || 0;
  const collected = total_paid_amount + outside;
  const aov = total_orders ? Math.round(total_sale / total_orders) : 0;
  const hasGivenAway =
    discount_amount > 0 || nc_amount > 0 || adjustment_amount > 0;

  const buildCopyText = () => {
    const d = shortDate(date);

    const lines = [
      `*Daily Summary — ${d}*`,
      `${"-".repeat(27)}`,
      ``,
      `*COLLECTION*`,
      ``,
      `Paid: ${formatNumber(total_paid_amount, true)}`,
    ];

    if (outside > 0) {
      lines.push(`Outside Collection: ${formatNumber(outside, true)}`);
    }

    if (total_due_amount > 0) {
      lines.push(`Pending: ${formatNumber(total_due_amount, true)}`);
    }

    lines.push(
      ``,
      `${"-".repeat(27)}`,
      `*Total Sale: ${formatNumber(total_sale, true)}*`,
      ``,
      `Orders: ${total_orders}`,
      `Guests: ${total_guests}`,
      `Avg Order: ${formatNumber(aov, true)}`,
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
    <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
      {/* ── Header ── */}
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
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xs text-gray-400">
                {total_orders} orders · {total_guests} guests
              </span>
              {total_due_amount > 0 && (
                <span className="text-[10px] bg-red-50 text-red-400 border border-red-100 px-1.5 py-0.5 rounded-full font-medium">
                  Due
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-bold text-gray-900">
              {formatNumber(total_sale, true)}
            </p>
            <p className="text-[10px] text-gray-400">
              avg {formatNumber(aov, true)}
            </p>
          </div>
          <ChevronDown
            size={13}
            className={`text-gray-300 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          />
        </div>
      </button>

      {/* ── Body ── */}
      <div
        className={`border-t border-gray-50 transition-all duration-300 ease-in-out overflow-hidden ${
          open ? "max-h-[900px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-4 py-3 space-y-3">
          {/* Order type pills */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <StatusPill
              icon={UtensilsCrossed}
              label="Dine-in"
              count={dine_in_orders}
              color="blue"
            />
            <StatusPill
              icon={ShoppingBag}
              label="Takeaway"
              count={takeaway_orders}
              color="violet"
            />
            {delivery_orders > 0 && (
              <StatusPill
                icon={Bike}
                label="Delivery"
                count={delivery_orders}
                color="orange"
              />
            )}
          </div>

          {/* ── COLLECTION ── */}
          <div className="bg-gray-50 rounded-xl px-3 py-2.5 space-y-2">
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">
              Collection
            </p>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                <span className="text-xs text-gray-500">Paid</span>
              </div>
              <span className="text-xs font-semibold text-emerald-600">
                {formatNumber(total_paid_amount, true)}
              </span>
            </div>

            {outside > 0 && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
                  <span className="text-xs text-gray-500">
                    Outside collection
                  </span>
                </div>
                <span className="text-xs font-semibold text-blue-600">
                  {formatNumber(outside, true)}
                </span>
              </div>
            )}

            {/* <Divider dashed />
            <Row
              label="Collected"
              value={formatNumber(collected, true)}
              labelClass="text-gray-600 font-medium"
              valueClass="text-gray-900 font-bold"
            /> */}

            {total_due_amount > 0 && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <AlertTriangle size={10} className="text-red-400" />
                  <span className="text-xs text-red-400">Due (pending)</span>
                </div>
                <span className="text-xs font-semibold text-red-500">
                  {formatNumber(total_due_amount, true)}
                </span>
              </div>
            )}

            <Divider />
            <Row
              label="Total collection"
              value={formatNumber(total_collection, true)}
              labelClass="text-gray-700 font-semibold"
              valueClass="text-gray-900 font-bold"
            />
            {/* <p className="text-[10px] text-gray-400">
              = Paid {formatNumber(total_paid_amount, true)}
              {outside > 0 ? ` + Outside ${formatNumber(outside, true)}` : ""}
              {total_due_amount > 0 ? ` + Due ${formatNumber(total_due_amount, true)}` : ""}
            </p> */}
          </div>

          {/* ── GIVEN AWAY (informational) ── */}
          {hasGivenAway && (
            <div className="bg-gray-50 rounded-xl px-3 py-2.5">
              <div className="flex items-center justify-between mb-2">
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">
                  Given Away
                </p>
                {/* <span className="text-[10px] text-gray-400">for info only</span> */}
              </div>
              <div className="divide-y divide-gray-100">
                {[
                  discount_amount > 0 && {
                    icon: Tag,
                    label: "Discount",
                    value: formatNumber(discount_amount, true),
                    sub: null,
                  },
                  nc_amount > 0 && {
                    icon: AlertCircle,
                    label: "No charge",
                    value: formatNumber(nc_amount, true),
                    sub: `${nc_order_count} orders`,
                  },
                  adjustment_amount > 0 && {
                    icon: SlidersHorizontal,
                    label: "Adjustments",
                    value: formatNumber(adjustment_amount, true),
                    sub: `${adjustment_order_count} entries`,
                  },
                ]
                  .filter(Boolean)
                  .map(({ icon: Icon, label, value, sub }) => (
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
                      <span className="text-xs font-semibold text-gray-700">
                        {value}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* ── PAYMENT STATUS ── */}
          {/* <div className="grid grid-cols-3 gap-2">
            <StatusPill
              icon={CheckCircle}
              label="Paid"
              count={fully_paid_orders}
              color="emerald"
            />
            <StatusPill
              icon={Clock}
              label="Partial"
              count={partial_paid_orders}
              color="amber"
            />
            {unpaid_orders > 0 && (
              <StatusPill
                icon={XCircle}
                label="Unpaid"
                count={unpaid_orders}
                color="red"
              />
            )}
          </div> */}

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

export default DailySalesSummaryCard;
