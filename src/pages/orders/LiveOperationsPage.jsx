import { useEffect, useState } from "react";
import { ChefHat, ReceiptText, RotateCcw } from "lucide-react";
import Tabs from "../../components/Tabs";
import RunningOrderSection from "../../partial/order/RunningOrderSection";
import RunningTableSection from "../../partial/order/RunningTableSection";
import { useDispatch, useSelector } from "react-redux";
import { fetchLiveOperations } from "../../redux/slices/dashboardSlice";
import LoadingOverlay from "../../components/LoadingOverlay";
import PageHeader from "../../layout/PageHeader";

const TABS = [
  { id: "orders", label: "Running Orders", icon: ReceiptText },
  { id: "tables", label: "Running Tables", icon: ChefHat },
];

export default function LiveOperationsPage() {
  const dispatch = useDispatch();
  const { outletId } = useSelector((state) => state.auth);
  const { liveOperationData, isFetchingLiveOperations } = useSelector(
    (state) => state.dashboard,
  );

  const { summary, orders, tables } = liveOperationData || {};
  const { orders: orderSummary, tables: tableSummary } = summary || {};

  const [activeTab, setActiveTab] = useState("orders");

  const fetchStats = () => {
    dispatch(fetchLiveOperations({ outletId }));
  };
  useEffect(() => {
    if (outletId) {
      fetchStats();
    }
  }, [outletId]);

  if (isFetchingLiveOperations) return <LoadingOverlay />;

  const actions = [
    {
      label: "Refresh",
      type: "refresh",
      icon: RotateCcw,
      onClick: fetchStats,
      loading: isFetchingLiveOperations,
      loadingText: "Refreshing...",
    },
  ];

  return (
    <div className="space-y-3 sm:space-y-5">
      <PageHeader title="Live Orders & Tables" actions={actions} showBackButton />
      <Tabs
        active={activeTab}
        onChange={(tab) => setActiveTab(tab)}
        tabs={TABS}
        variant="v2"
      />
      <div>
        {/* {activeTab === "orders" && <OrdersTab />} */}
        {activeTab === "orders" && (
          <RunningOrderSection summary={orderSummary} orders={orders} />
        )}
        {activeTab === "tables" && (
          <RunningTableSection summary={tableSummary} tables={tables} />
        )}
      </div>
    </div>
  );
}
