import React, { useState, useEffect } from "react";
import {
  CheckCircle2,
  RefreshCw,
  Wifi,
  WifiOff,
  ChevronLeft,
  Loader2,
  ClipboardList,
  Clock,
  ChefHat,
  Search,
  XCircle,
  ArrowLeft,
} from "lucide-react";
import KotOrderCard from "../../partial/kot/KotOrderCard";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllOrdersKot,
  markKotItemReady,
  markReadyKot,
  prepareOrderKot,
  serveOrderKot,
} from "../../redux/slices/kotSlice";
import { handleResponse } from "../../utils/helpers";
import KotOrderCardSkeleton from "../../partial/kot/KotOrderCardSkeleton";
import { formatDate } from "../../utils/dateFormatter";
import SearchBar from "../../components/SearchBar";
import { ORDER_STATUSES } from "../../utils/orderStatusConfig";
import { setKotTab } from "../../redux/slices/uiSlice";
import { useNavigate } from "react-router-dom";
import Tooltip from "../../components/Tooltip";

export default function OrderDisplayPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { meData } = useSelector((state) => state.auth);
  const { assignedStations } = meData || {};

  const { allOrdersKot, loading } = useSelector((state) => state.kot);
  const { kotTab } = useSelector((state) => state.ui);
  const { connected, connecting } = useSelector((state) => state.socket);
  const { kots, stats } = allOrdersKot || {};
  const [lastFetchedAt, setLastFetchedAt] = useState(null);
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");

  const ACTION_MAP = {
    preparing: prepareOrderKot,
    ready: markReadyKot,
    served: serveOrderKot,
  };

  const fetchOrder = async () => {
    await handleResponse(
      dispatch(
        fetchAllOrdersKot({
          status: kotTab,
          station: assignedStations.stationId,
        }),
      ),
      () => {
        setLastFetchedAt(new Date());
      },
    );
  };

  useEffect(() => {
    if (connected) return;

    const interval = setInterval(() => {
      fetchOrder();
    }, 30000); // 30 seconds

    return () => clearInterval(interval); // cleanup
  }, [connected, kotTab]);

  useEffect(() => {
    fetchOrder();
  }, [kotTab]);

  const getStatusConfig = (status) =>
    ORDER_STATUSES[status] || ORDER_STATUSES.pending;

  const updateOrderStatus = async (orderId, newStatus) => {
    const status = newStatus?.trim().toLowerCase();

    const action = ACTION_MAP[status];

    if (!action) {
      console.warn("No action for status:", status);
      return;
    }

    await handleResponse(dispatch(action(orderId)), () => {
      const tabExists = tabs.some((t) => t.id === status);
      setKotTab(tabExists ? status : "");

      if (!connected) {
        fetchOrder();
      }
    });
  };

  const handleMarkItemReady = async (itemId) => {
    await handleResponse(dispatch(markKotItemReady(itemId)), () => {
      if (!connected) {
        fetchOrder();
      }
    });
  };

  const tabs = [
    { label: "All", id: "", badgeCount: null },
    {
      label: "Pending",
      id: "pending",
      badgeCount: stats?.pending_count,
    },
    {
      label: "Preparing",
      id: "preparing",
      badgeCount: stats?.preparing_count,
    },
    {
      label: "Ready",
      id: "ready",
      badgeCount: stats?.ready_count,
    },
    {
      label: "Cancelled",
      id: "cancelled",
      badgeCount: stats?.cancelled_count,
    },
  ];

  const stationName = assignedStations?.stationName || "Station";
  const outletName = assignedStations?.outletName || "";

  const ui = {
    subtitle: `Manage orders efficiently`,
    emptyTitle: `All Orders Completed 🎉`,
    emptyMessage: `No orders at the moment.`,
  };

  const TABS = [
    {
      key: "",
      label: "All Orders",
      icon: ClipboardList,
      activeClass: "bg-[#374151] text-white",
      count: stats?.total_count,
    },
    {
      key: "pending",
      label: "Pending",
      icon: Clock,
      activeClass: "bg-[#FFA80B] text-white", // updated
      count: stats?.pending_count,
    },
    {
      key: "preparing",
      label: "Preparing",
      icon: ChefHat,
      activeClass: "bg-[#3B82F6] text-white",
      count: stats?.preparing_count,
    },
    {
      key: "ready",
      label: "Ready",
      icon: CheckCircle2,
      activeClass: "bg-[#14B51D] text-white", // updated
      count: stats?.ready_count,
    },
    {
      key: "cancelled",
      label: "Cancelled",
      icon: XCircle,
      activeClass: "bg-[#FF3636] text-white", // added
      count: stats?.cancelled_count,
    },
  ];

  return (
    <div>
      <div className="space-y-6">
        {/* ── Top Nav ── */}
        <div className="flex items-center justify-between gap-3 flex-wrap">
          {/* Title */}
          <div className="flex items-center gap-2 mr-2 flex-shrink-0">
            <button
              onClick={() => navigate(-1)} // go back
              className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-200 bg-white hover:bg-gray-100 transition"
            >
              <ArrowLeft size={16} className="text-gray-700" />
            </button>

            <h1 className="text-2xl font-black text-gray-900 tracking-tight">
              Kitchen
            </h1>

            <Tooltip
              content={
                connecting
                  ? "Connecting to live updates..."
                  : connected
                    ? "Real-time updates active"
                    : "No live connection"
              }
              position="bottom"
            >
              <div
                className={`
                  w-7 h-7 flex items-center justify-center rounded-full border transition
                  ${
                    connecting
                      ? "bg-yellow-50 border-yellow-200"
                      : connected
                        ? "bg-green-50 border-green-200"
                        : "bg-red-50 border-red-200"
                  }
                `}
              >
                {/* Icon */}
                {connecting ? (
                  <Loader2 className="w-4 h-4 text-yellow-600 animate-spin" />
                ) : connected ? (
                  <Wifi className="w-4 h-4 text-green-600" />
                ) : (
                  <WifiOff className="w-4 h-4 text-red-600" />
                )}
              </div>
            </Tooltip>

            {/* SYNC CONTROL */}
            <Tooltip
              content={
                lastFetchedAt
                  ? `Last updated at ${formatDate(lastFetchedAt, "time")}`
                  : "Sync orders"
              }
            >
              <button
                onClick={fetchOrder}
                disabled={loading}
                className="w-7 h-7 flex items-center justify-center rounded-full  hover:bg-gray-100 text-gray-500 transition-colors"
              >
                <RefreshCw
                  size={15}
                  className={loading ? "animate-spin" : ""}
                />
              </button>
            </Tooltip>
          </div>

          <div className="flex gap-2 flex-wrap">
            {TABS.map((t) => {
              const Icon = t.icon;
              const isActive = kotTab === t.key;

              return (
                <button
                  key={t.key}
                  onClick={() => dispatch(setKotTab(t.key))}
                  className={`flex items-center gap-1.5 px-[14px] py-[7px] rounded-full border text-[13px] font-semibold
                    transition-all
                    ${
                      isActive
                        ? `${t.activeClass} text-white border-transparent shadow-sm`
                        : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
                    }`}
                >
                  {/* ICON */}
                  <span
                    className={`flex items-center justify-center w-5 h-5 rounded-full ${
                      isActive ? "bg-white/20" : t.activeClass
                    }`}
                  >
                    <Icon
                      size={12}
                      className={`${isActive ? "text-white" : "text-white"}`}
                    />
                  </span>

                  {/* LABEL */}
                  <span>{t.label}</span>

                  {/* COUNT */}
                  {t.count > 0 && (
                    <span className="font-black ml-1">{t.count}</span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Search */}
          <div className="relative flex-shrink-0">
            <SearchBar
              className="py-[7px] rounded-full border border-gray-300 text-[13px] text-gray-700 bg-gray-50 outline-none focus:border-gray-400 w-full lg:w-52"
              onSearch={(value) => setSearch(value)}
            />
          </div>
        </div>

        {loading ? (
          // LOADING
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <KotOrderCardSkeleton key={i} />
            ))}
          </div>
        ) : kots?.length > 0 ? (
          // DATA
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {kots?.map((order) => (
              <KotOrderCard
                key={order?.id}
                order={order}
                updateOrderStatus={updateOrderStatus}
                getStatusConfig={getStatusConfig}
                markItemReady={handleMarkItemReady}
              />
            ))}
          </div>
        ) : (
          // EMPTY
          <div className="min-h-[70dvh] flex flex-col items-center justify-center bg-white rounded-xl border border-dashed border-gray-300">
            {/* Icon Circle */}
            <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center mb-5">
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>

            <h2 className="text-xl font-semibold text-gray-900 mb-1">
              {ui.emptyTitle}
            </h2>

            <p className="text-gray-500 text-sm text-center max-w-sm">
              {kotTab
                ? `No ${kotTab} orders at ${stationName} right now.`
                : `There are no orders at ${stationName} at the moment.`}
            </p>

            {/* Actions */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={fetchOrder}
                className="px-4 py-2 text-sm font-medium border border-gray-200 rounded-lg bg-white hover:bg-gray-50 transition"
              >
                Refresh
              </button>

              {kotTab && (
                <button
                  onClick={() => dispatch(setKotTab(""))}
                  className="px-4 py-2 text-sm font-medium rounded-lg bg-primary-500 text-white hover:bg-primary-600 transition"
                >
                  View All Orders
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
