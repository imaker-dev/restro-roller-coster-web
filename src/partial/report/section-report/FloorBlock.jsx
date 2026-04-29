import { Layers, LayoutGrid } from "lucide-react";
import { formatNumber } from "../../../utils/numberFormatter";
import SectionCard from "./SectionCard";
import NoDataFound from "../../../layout/NoDataFound";

// ─── Floor block ──────────────────────────────────────────────────────────────
export default function FloorBlock({
  floor,
  totalSales,
}) {
  const sections = [...(floor.sections || [])].sort(
    (a, b) => formatNumber(b.netSales) - formatNumber(a.netSales),
  );

  const share = totalSales > 0 ? (floor.netSales / totalSales) * 100 : 0;

  const safeShare = Math.max(0, Math.min(share, 100));

  return (
    <div className="space-y-5">
      {/* Floor header */}
      <div className="flex items-center gap-3 px-4 py-3.5 rounded-2xl bg-primary-500">
        <div className="w-10 h-10 rounded-xl bg-white/20 border border-white/30 flex items-center justify-center flex-shrink-0">
          <Layers size={18} className="text-white" strokeWidth={1.9} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[15px] font-black text-white leading-tight">
            {floor.floorName}
          </p>
          <p className="text-xs text-white/70 font-semibold mt-0.5">
            {sections.length} section{sections.length !== 1 ? "s" : ""}
            {" · "}
            {floor.orderCount} orders · {floor.guestCount} guests
            {floor.cancelledOrders > 0 &&
              ` · ${floor.cancelledOrders} cancelled`}
          </p>
        </div>
        {/* Sales + mini bar */}
        <div className="hidden sm:flex flex-col items-end gap-1.5 flex-shrink-0">
          <p className="text-[17px] font-black text-white tabular-nums leading-none">
            {formatNumber(floor.netSales, true)}
          </p>
          <div className="flex items-center gap-1.5">
            <div className="w-16 h-1.5 rounded-full bg-black/20 overflow-hidden">
              <div
                className="h-full rounded-full bg-white/70"
                style={{ width: `${safeShare}%` }}
              />
            </div>
            <span className="text-[9px] font-black text-white/60">
              {safeShare.toFixed(1)}%
            </span>
          </div>
        </div>
        {/* Avg order chip */}
        <div className="flex flex-col items-center bg-white/15 border border-white/25 rounded-xl px-3 py-2 flex-shrink-0">
          <p className="text-[13px] font-black text-white tabular-nums leading-none">
            {formatNumber(floor.avgOrderValue, true)}
          </p>
          <p className="text-[8px] text-white/55 font-medium mt-0.5">
            avg order
          </p>
        </div>
      </div>

      {/* Sections */}
      {sections && sections.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {sections.map((sec, si) => (
            <SectionCard
              key={sec.sectionId}
              section={sec}
              rank={si + 1}
              floorSales={floor.netSales}
              delay={si * 55}
            />
          ))}
        </div>
      ) : (
        <div className="mt-3">
          <NoDataFound
            icon={LayoutGrid}
            title="No sections found"
            description="This floor has no section sales for the selected date range."
            className="bg-white rounded-md"
          />
        </div>
      )}
    </div>
  );
}
