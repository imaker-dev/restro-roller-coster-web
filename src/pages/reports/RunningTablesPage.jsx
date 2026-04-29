import React, { useEffect } from "react";
import StatCard from "../../components/StatCard";
import { useDispatch, useSelector } from "react-redux";
import { Building2, Layers, RotateCcw, Users, Wallet } from "lucide-react";
import { fetchRunningTable } from "../../redux/slices/reportSlice";
import NoDataFound from "../../layout/NoDataFound";
import LoadingOverlay from "../../components/LoadingOverlay";
import PageHeader from "../../layout/PageHeader";
import FloorSection from "../../partial/report/running-tables/FloorSection";

const RunningTablesPage = () => {
  const dispatch = useDispatch();
  const { outletId } = useSelector((state) => state.auth);

  const { isFetchingRunningTable, runningTables } = useSelector(
    (state) => state.report,
  );

  const { floors, summary } = runningTables || {};
  const fetchTables = () => {
    dispatch(fetchRunningTable(outletId));
  };
  useEffect(() => {
    if (outletId) {
      fetchTables();
    }
  }, [outletId, dispatch]);

  const statCards = [
    {
      icon: Building2,
      title: "Floors",
      value: summary?.totalFloors,
      color: "blue",
    },
    {
      icon: Layers,
      title: "Occupied Tables",
      value: summary?.totalOccupiedTables,
      color: "purple",
    },
    {
      icon: Users,
      title: "Total Guests",
      value: summary?.totalGuests,
      color: "green",
    },
    {
      icon: Wallet,
      title: "Revenue",
      value: summary?.formattedAmount,
      color: "amber",
    },
  ];

  if (isFetchingRunningTable) {
    return <LoadingOverlay text="Loading Running Tables..." />;
  }

  const actions = [
    {
      label: "Refresh",
      type: "refresh",
      icon: RotateCcw,
      onClick: fetchTables,
      loading: isFetchingRunningTable,
      loadingText: "Refreshing...",
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title={"Running Tables"} actions={actions} />

      {/* ── Summary Stats ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {statCards.map((card, index) => (
          <StatCard
            key={index}
            icon={card.icon}
            title={card.title}
            value={card.value}
            color={card.color}
            variant={"v9"}
          />
        ))}
      </div>

      {/* ── Urgency Legend ── */}
      <div className="flex items-center gap-4 flex-wrap">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          Duration
        </span>
        {[
          {
            color: "bg-emerald-400",
            label: "< 60 min — Recent",
            text: "text-emerald-600",
          },
          {
            color: "bg-amber-400",
            label: "60–90 min — Active",
            text: "text-amber-600",
          },
          {
            color: "bg-rose-400",
            label: "> 90 min — Long wait",
            text: "text-rose-600",
          },
        ].map((l) => (
          <div key={l.label} className="flex items-center gap-1.5">
            <div className={`w-2 h-2 rounded-full ${l.color}`} />
            <span className={`text-[11px] font-semibold ${l.text}`}>
              {l.label}
            </span>
          </div>
        ))}
      </div>

      {/* ── Floors ── */}
      <div className="space-y-8">
        {floors?.length === 0 ? (
          <NoDataFound
            icon={Layers}
            title="No tables found"
            className="bg-white"
          />
        ) : (
          floors?.map((floor) => (
            <FloorSection key={floor.floorId} floor={floor} />
          ))
        )}
      </div>
    </div>
  );
};

export default RunningTablesPage;
