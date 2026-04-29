import { ShoppingBag, Star, TrendingUp, Users, XCircle } from "lucide-react";
import { formatNumber } from "../../../utils/numberFormatter";
import MetaPill from "../../../components/MetaPill";

// ─── Section card ─────────────────────────────────────────────────────────────
export default function SectionCard({ section, rank, floorSales }) {
  const share = floorSales > 0 ? (section.netSales / floorSales) * 100 : 0;

  const safeShare = Math.max(0, Math.min(share, 100));
  return (
    <div
      className={`relative bg-white rounded-2xl overflow-hidden transition-all duration-300
    hover:-translate-y-0.5 hover:shadow-[0_12px_28px_-4px_rgba(0,0,0,0.11)] group border border-slate-200
   `}
    >
      <div className="h-[3px] bg-primary-500" />
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div
              className={`w-7 h-7 rounded-xl flex items-center justify-center 
              text-[11px] font-black flex-shrink-0 
              transition-transform duration-200 group-hover:scale-105 bg-primary-500 text-white
              `}
            >
              {rank}
            </div>
            <div className="min-w-0">
              <p className="text-[13px] font-black text-slate-800 truncate">
                {section.sectionName}
              </p>
            </div>
          </div>
        </div>

        {/* Sales + bar */}
        <div className="mb-3">
          <div className="flex items-end justify-between mb-1.5">
            <span className="text-[22px] font-black tabular-nums leading-none">
              {formatNumber(section.netSales, true)}
            </span>
            <span className="text-[10px] font-black tabular-nums">
              {safeShare.toFixed(1)}%
            </span>
          </div>
          <div className="h-1.5 rounded-full overflow-hidden bg-slate-100">
            <div
              className="h-full rounded-full transition-all duration-700 
               bg-gradient-to-r from-primary-500 to-primary-600 
               shadow-sm"
              style={{ width: `${safeShare}%` }}
            />
          </div>
          <p className="text-[9px] text-slate-400 font-medium mt-1">
            share of floor
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-2">
          <MetaPill
            icon={ShoppingBag}
            label="Orders"
            value={section.orderCount}
            highlight
          />

          <MetaPill icon={Users} label="Guests" value={section.guestCount} />

          <MetaPill
            icon={TrendingUp}
            label="Avg Order"
            value={formatNumber(section.avgOrderValue, true)}
          />

          <MetaPill
            icon={XCircle}
            label="Cancelled"
            value={section.cancelledOrders}
            danger
          />
        </div>
      </div>
    </div>
  );
}
