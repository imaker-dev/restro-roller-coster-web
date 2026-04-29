import { useState } from "react";
import NoDataFound from "../../layout/NoDataFound";
import { formatNumber } from "../../utils/numberFormatter";
import LiveOperationSummaryBanner from "./LiveOperationSummaryBanner";
import OrderDetailDrawer from "./OrderDetailDrawer";
import RunningTableCard from "./RunningTableCard";



function RunningTableSection({ summary, tables }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedTable, setSelectedtable] = useState(null);

  return (
    <>
      <div className="space-y-3 sm:space-y-5">
        {/* Summary */}
        <LiveOperationSummaryBanner
          colorCls="bg-emerald-50/70 border border-emerald-100"
          items={[
            { label: "Tables", value: summary?.totalTables },
            // { label: "Guests", value: summary?.totalGuests },
            {
              label: "Revenue",
              value: formatNumber(summary?.totalAmount, true),
            },
          ]}
        />

        {/* Grid — 2 cols on mobile, 3 on sm, 5 on lg */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3">
          {tables?.length ? (
            tables.map((t) => (
              <RunningTableCard
                key={t.id}
                table={t}
                onView={(table) => {
                  (setSelectedtable(table), setDrawerOpen(true));
                }}
              />
            ))
          ) : (
            <div className="col-span-full bg-white text-center text-xs sm:text-sm text-slate-400 py-4 border border-dashed rounded-lg">
              <NoDataFound title="No active tables available" description="" />
            </div>
          )}
        </div>
      </div>
      <OrderDetailDrawer
        table={selectedTable}
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
    </>
  );
}
export default RunningTableSection;
