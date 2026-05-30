import {
  AlertCircle,
  BadgeCheck,
  CalendarDays,
  Clock,
  Hash,
  Mail,
  Phone,
  Store,
  Zap,
} from "lucide-react";
import { formatDate } from "../../utils/dateFormatter";
import { formatNumber } from "../../utils/numberFormatter";
import SubscriptionBadge from "./SubscriptionBadge";
import CurrencyIcon from "../../components/CurrencyIcon";

const daysLeft = (end) => {
  if (!end) return null;
  const diff = Math.ceil((new Date(end) - new Date()) / (1000 * 60 * 60 * 24));
  return diff;
};

// ─── Subscription Card ────────────────────────────────────────────────────────
function SubscriptionCard({ sub }) {
  const left = daysLeft(sub.subscription_end);
  const urgent = left !== null && left <= 30 && left >= 0;
  const expired = left !== null && left < 0;

  return (
    <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden hover:border-slate-300 hover:shadow-xl hover:shadow-slate-200/50 hover:-translate-y-0.5 transition-all duration-200 flex flex-col">
      <div className="p-5 flex flex-col gap-4 flex-1">
        {/* ── Header ── */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 bg-primary-500 rounded-2xl flex items-center justify-center shrink-0">
              <Store size={17} className="text-white" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-black text-slate-900 leading-none truncate">
                {sub.outlet_name}
              </p>
              <div className="flex items-center gap-1 mt-1">
                <Hash size={9} className="text-slate-400" />
                <p className="text-[10px] font-bold text-slate-400">
                  {sub.outlet_code}
                </p>
              </div>
            </div>
          </div>

          {/* Status pill */}
          <SubscriptionBadge type="status" value={sub.status} />
        </div>

        {/* ── Contact row ── */}
        <div className="flex flex-wrap gap-x-4 gap-y-1.5">
          <div className="flex items-center gap-1.5">
            <Phone size={10} className="text-slate-400" />
            <p className="text-[11px] text-slate-500 font-medium">
              {sub.outlet_phone}
            </p>
          </div>
          <div className="flex items-center gap-1.5">
            <Mail size={10} className="text-slate-400" />
            <p className="text-[11px] text-slate-500 font-medium truncate max-w-[160px]">
              {sub.outlet_email}
            </p>
          </div>
        </div>

        <div className="h-px bg-slate-100" />

        {/* ── Dates grid ── */}
        <div className="grid grid-cols-2 gap-2.5">
          <div className="bg-slate-50 rounded-2xl px-3.5 py-3 border border-slate-100">
            <div className="flex items-center gap-1.5 mb-1">
              <CalendarDays size={10} className="text-slate-400" />
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                Start
              </p>
            </div>
            <p className="text-xs font-black text-slate-800">
              {formatDate(sub.subscription_start, "long")}
            </p>
          </div>

          <div
            className={`rounded-2xl px-3.5 py-3 border ${urgent && !expired ? "bg-amber-50 border-amber-100" : expired ? "bg-red-50 border-red-100" : "bg-slate-50 border-slate-100"}`}
          >
            <div className="flex items-center gap-1.5 mb-1">
              <Clock
                size={10}
                className={
                  urgent && !expired
                    ? "text-amber-400"
                    : expired
                      ? "text-red-400"
                      : "text-slate-400"
                }
              />
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                Ends
              </p>
            </div>
            <p
              className={`text-xs font-black ${urgent && !expired ? "text-amber-700" : expired ? "text-red-600" : "text-slate-800"}`}
            >
              {formatDate(sub.subscription_end, "long")}
            </p>
          </div>
        </div>

        {/* ── Days left indicator ── */}
        {left !== null && (
          <div
            className={`flex items-center justify-between px-4 py-2.5 rounded-2xl ${
              expired
                ? "bg-red-50 border border-red-100"
                : urgent
                  ? "bg-amber-50 border border-amber-100"
                  : "bg-emerald-50 border border-emerald-100"
            }`}
          >
            <div className="flex items-center gap-2">
              <Zap
                size={12}
                className={
                  expired
                    ? "text-red-400"
                    : urgent
                      ? "text-amber-400"
                      : "text-emerald-500"
                }
              />
              <p
                className={`text-xs font-bold ${expired ? "text-red-600" : urgent ? "text-amber-700" : "text-emerald-700"}`}
              >
                {expired
                  ? "Subscription expired"
                  : urgent
                    ? `${left} days remaining`
                    : `${left} days remaining`}
              </p>
            </div>
            {!expired && (
              <p className="text-[10px] font-bold text-slate-400">
                Grace until {formatDate(sub.grace_period_end, "long")}
              </p>
            )}
          </div>
        )}

        <div className="h-px bg-slate-100" />

        {/* ── Pricing ── */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">
              Plan Price
            </p>
            <div className="flex items-baseline gap-1.5">
              <p className="text-lg font-black text-slate-900">
                {formatNumber(sub.appliedPrice, true)}
              </p>
              <p className="text-[10px] text-slate-400 font-semibold">/yr</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">
              Source
            </p>
            <span className="inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1.5 rounded-xl bg-violet-50 text-violet-600 border border-violet-100">
              <BadgeCheck size={10} />
              {sub.appliedPricingSource}
            </span>
          </div>
        </div>

        {/* ── Last payment ── */}
        {sub.last_paid_at ? (
          <div className="flex items-center justify-between bg-slate-50 rounded-2xl px-4 py-3 border border-slate-100">
            <div className="flex items-center gap-2">
              <CurrencyIcon size={12} className="text-slate-400" />
              <p className="text-xs font-semibold text-slate-600">
                Last payment
              </p>
            </div>
            <div className="flex items-center gap-2">
              <p className="text-xs font-black text-slate-800">
                {formatNumber(sub.last_paid_amount, true)}
              </p>
              <p className="text-[10px] text-slate-400">
                {formatDate(sub.last_paid_at, "long")}
              </p>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2.5 bg-slate-50 rounded-2xl px-4 py-3 border border-slate-100">
            <AlertCircle size={12} className="text-slate-400 shrink-0" />
            <p className="text-[11px] text-slate-400 font-medium">
              No payment recorded yet
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
export default SubscriptionCard;
