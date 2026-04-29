import {
  AlertCircle,
  AlertTriangle,
  Bike,
  Check,
  CheckCircle,
  ChevronDown,
  Clock,
  Copy,
  ReceiptIndianRupee,
  ShoppingBag,
  SlidersHorizontal,
  Tag,
  UtensilsCrossed,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import { formatNumber } from "../../../utils/numberFormatter";
import StatusPill from "../../../components/StatusPill";
import { copyToClipboard } from "../../../utils/copyToClipboard";

/* ── Summary Deductions Card ── */
function DailySalesSummaryBreakup({ summary, outsideCollections }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const {
    total_collection,
    total_paid_amount,
    total_due_amount,
    discount_amount,
    nc_amount,
    nc_order_count,
    adjustment_amount,
    adjustment_order_count,
    fully_paid_orders,
    partial_paid_orders,
    unpaid_orders,
  } = summary;

  const buildCopyText = () => {
    const dashed = "-".repeat(14);

    const lines = [
      `*Collection Summary*`,
      dashed,
      ``,

      `*COLLECTION*`,
      ``,

      `Paid: ${formatNumber(total_paid_amount, true)}`,
    ];

    if (outsideCollections.total > 0) {
      lines.push(
        `Outside Collection: ${formatNumber(outsideCollections.total, true)}`,
      );
    }

    if (total_due_amount > 0) {
      lines.push(`Pending (Due): ${formatNumber(total_due_amount, true)}`);
    }

    lines.push(
      ``,
      dashed,
      `*Total Collection: ${formatNumber(total_collection, true)}*`,
    );

    return lines.join("\n");
  };

  const handleCopy = async (e) => {
    e.stopPropagation();

    const success = await copyToClipboard(buildCopyText());

    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };
  return (
    <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
      <button
        onClick={() => setOpen((p) => !p)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50/60 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center">
            <ReceiptIndianRupee size={14} className="text-emerald-600" />
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
              {formatNumber(total_collection, true)}
            </p>
            <p className="text-xs text-gray-400">total collected</p>
          </div>
          <ChevronDown
            size={14}
            className={`text-gray-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          />
        </div>
      </button>

      <div
        className={`border-t border-gray-100 transition-all duration-300 ease-in-out overflow-hidden ${
          open ? "max-h-[700px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-5 py-4 border-b border-gray-50 space-y-2">
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">
            Collection
          </p>

          <div className="bg-gray-50 rounded-xl px-3 py-2.5 space-y-2">
            {/* Paid */}
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">Paid</span>
              <span className="text-xs font-bold text-emerald-600">
                {formatNumber(total_paid_amount, true)}
              </span>
            </div>

            {/* Outside */}
            {outsideCollections.total > 0 && (
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">
                  Outside collection
                </span>
                <span className="text-xs font-semibold text-blue-600">
                  {formatNumber(outsideCollections.total, true)}
                </span>
              </div>
            )}

            {/* Due */}
            {total_due_amount > 0 && (
              <>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <AlertTriangle size={10} className="text-red-400" />
                    <span className="text-xs text-red-400">Due (pending)</span>
                  </div>
                  <span className="text-xs font-bold text-red-500">
                    {formatNumber(total_due_amount, true)}
                  </span>
                </div>
              </>
            )}

            {/* Total */}
            <div className="border-t border-dashed border-gray-200" />
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-gray-600">
                Total collection
              </span>
              <span className="text-xs font-bold text-gray-900">
                {formatNumber(total_collection, true)}
              </span>
            </div>

            {/* Explanation line (optional but ) */}
            {/* <p className="text-[10px] text-gray-400">
      = Paid {formatNumber(total_paid_amount, true)}
      {outsideCollections.total > 0 &&
        ` + Outside ${formatNumber(outsideCollections.total, true)}`}
      {total_due_amount > 0 &&
        ` + Due ${formatNumber(total_due_amount, true)}`}
    </p> */}
          </div>
        </div>

        {/* ── GIVEN AWAY ── */}
        {(discount_amount > 0 || nc_amount > 0 || adjustment_amount > 0) && (
          <div className="px-5 py-4">
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-2">
              Given Away
            </p>

            <div className="bg-gray-50 rounded-xl px-3 py-2.5 space-y-0 divide-y divide-gray-100">
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

        {/* <div className="flex justify-end px-5 pb-4">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 transition text-[11px] font-medium text-gray-500"
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

export default DailySalesSummaryBreakup;
