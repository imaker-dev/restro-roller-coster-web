import React, { useEffect } from "react";
import PageHeader from "../../layout/PageHeader";
import { useDispatch, useSelector } from "react-redux";
import { fetchSubscriptionDashboard } from "../../redux/slices/subscriptionSlice";
import { Store, RefreshCw } from "lucide-react";
import SubscriptionCard from "../../partial/subscription/SubscriptionCard";
import NoDataFound from "../../layout/NoDataFound";

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function Skeleton() {
  return (
    <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden animate-pulse">
      <div className="h-1 bg-slate-100" />
      <div className="p-5 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-slate-100 rounded-2xl shrink-0" />
          <div className="flex-1 space-y-1.5">
            <div className="h-3 bg-slate-100 rounded-full w-3/4" />
            <div className="h-2 bg-slate-100 rounded-full w-1/3" />
          </div>
        </div>
        <div className="h-px bg-slate-100" />
        <div className="grid grid-cols-2 gap-2.5">
          <div className="h-16 bg-slate-100 rounded-2xl" />
          <div className="h-16 bg-slate-100 rounded-2xl" />
        </div>
        <div className="h-10 bg-slate-100 rounded-2xl" />
        <div className="h-px bg-slate-100" />
        <div className="h-12 bg-slate-100 rounded-2xl" />
        <div className="h-10 bg-slate-100 rounded-2xl" />
      </div>
    </div>
  );
}

// ─── Summary stat ─────────────────────────────────────────────────────────────
function Stat({ icon: Icon, label, value, iconBg, iconColor, border }) {
  return (
    <div
      className={`bg-white rounded-2xl border ${border} px-5 py-4 flex items-center gap-3.5`}
    >
      <div
        className={`w-10 h-10 ${iconBg} rounded-xl flex items-center justify-center shrink-0`}
      >
        <Icon size={18} className={iconColor} />
      </div>
      <div>
        <p className="text-xl font-black text-slate-900 leading-none">
          {value}
        </p>
        <p className="text-[11px] font-semibold text-slate-400 mt-0.5">
          {label}
        </p>
      </div>
    </div>
  );
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
const SubscriptionDashboard = () => {
  const dispatch = useDispatch();
  const { isFetchingSubscriptionDashboard, subscriptionDashboard } =
    useSelector((s) => s.subscription);

  const subscriptions = subscriptionDashboard?.subscriptions ?? [];

  const fetchDashboard = () => dispatch(fetchSubscriptionDashboard());

  useEffect(() => {
    fetchDashboard();
  }, []);

  const actions = [
    {
      label: "Refresh",
      type: "refresh",
      icon: RefreshCw,
      onClick: fetchDashboard,
      loading: isFetchingSubscriptionDashboard,
      loadingText: "Refreshing...",
    },
  ];

  return (
    <div className=" space-y-6">
      <PageHeader
        title="Subscription Dashboard"
        showBackButton
        actions={actions}
      />

      {/* ── Grid ── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-black text-slate-800">
            All Subscriptions
            {subscriptions.length > 0 && (
              <span className="ml-2 text-xs font-semibold text-slate-400">
                ({subscriptions.length})
              </span>
            )}
          </h2>
          {isFetchingSubscriptionDashboard && subscriptions.length > 0 && (
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400">
              <RefreshCw size={11} className="animate-spin" /> Updating…
            </div>
          )}
        </div>

        {isFetchingSubscriptionDashboard && !subscriptions.length ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} />
            ))}
          </div>
        ) : subscriptions.length === 0 ? (
          <NoDataFound
            icon={Store}
            title="No subscriptions found"
            description="Subscriptions will appear here once outlets are activated."
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {subscriptions.map((sub) => (
              <SubscriptionCard key={sub.id} sub={sub} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SubscriptionDashboard;
