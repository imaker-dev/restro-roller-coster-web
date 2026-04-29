import { useEffect, useState, useMemo, useRef } from "react";
import PageHeader from "../../layout/PageHeader";
import {
  Plus,
  Search,
  ArrowUpRight,
  Building2,
  Phone,
  Hash,
  CalendarDays,
  BadgeIndianRupee,
  ReceiptText,
  ChevronDown,
  X,
  CreditCard,
  XCircle,
  AlertTriangle,
  CheckCircle2,
  IndianRupee,
  Wallet,
  Activity,
  CheckCircle,
  AlertCircle,
  CheckCheck,
  PauseCircle,
  TrendingUp,
  ShoppingCart,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  cancelPurchase,
  fetchAllPurchase,
  updatePurchasePayment,
} from "../../redux/slices/inventorySlice";
import LoadingOverlay from "../../components/LoadingOverlay";
import { formatNumber } from "../../utils/numberFormatter";
import { formatDate } from "../../utils/dateFormatter";
import NoDataFound from "../../layout/NoDataFound";
import { PurchasePaymentModal } from "../../partial/inventory/purchase-order/PurchasePaymentModal";
import { PurchaseCard } from "../../partial/inventory/purchase-order/PurchaseCard";
import { handleResponse } from "../../utils/helpers";
import { CancelPurchaseModal } from "../../partial/inventory/purchase-order/CancelPurchaseModal";
import StatCard from "../../components/StatCard";
import PurchaseCardSkeleton from "../../partial/inventory/purchase-order/PurchaseCardSkeleton";
import SearchBar from "../../components/SearchBar";
import CustomDateRangePicker from "../../components/CustomDateRangePicker";
import Pagination from "../../components/Pagination";
import { ROUTE_PATHS } from "../../config/paths";

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════════════════════════════════ */
const AllPurchaseOrdersPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showPaymentOverlay, setShowPaymentOverlay] = useState(false);
  const [showCancelOverlay, setShowCancelOverlay] = useState(false);
  const [selectedPurchase, setSelectedPurchase] = useState(null);

  const { outletId } = useSelector((state) => state.auth);
  const {
    allPurchaseData,
    isFetchingPurchase,
    isUpdatingPurchasePayment,
    isCancellingPurchase,
  } = useSelector((state) => state.inventory);

  const { purchases, pagination, summary } = allPurchaseData || {};

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(9);
  const [search, setSearch] = useState("");
  const [dateRange, setDateRange] = useState();

  const fetchPurchases = () => {
    if (!outletId || !dateRange?.startDate || !dateRange?.endDate) return;

    dispatch(
      fetchAllPurchase({
        outletId,
        page: currentPage,
        limit: itemsPerPage,
        search,
        dateRange,
      }),
    );
  };

  useEffect(() => {
    fetchPurchases();
  }, [outletId, search, dateRange, currentPage, itemsPerPage]);

  const resetPurchaseStates = () => {
    setSelectedPurchase(null);
    setShowPaymentOverlay(false);
    setShowCancelOverlay(false);
  };

  // TODO: wire these to your redux thunks
  async function handlePaymentConfirm({ purchaseId, values }) {
    await handleResponse(
      dispatch(updatePurchasePayment({ id: purchaseId, values })),
      () => {
        fetchPurchases();
        resetPurchaseStates();
      },
    );
  }

  async function handleCancelConfirm({ purchaseId, reason }) {
    await handleResponse(
      dispatch(cancelPurchase({ id: purchaseId, reason })),
      () => {
        fetchPurchases();
        resetPurchaseStates();
      },
    );
  }

  const actions = [
    {
      label: "Create Purchase Order",
      type: "primary",
      icon: Plus,
      onClick: () => navigate(ROUTE_PATHS.PURCHASE_ORDERS_ADD),
    },
  ];

  const stats = [
    // Overview
    {
      label: "Total Purchases",
      value: formatNumber(summary?.totalPurchases),
      sub: `${formatNumber(summary?.cancelledCount)} cancelled`,
      icon: ShoppingCart,
      color: "slate",
      dark: true,
    },

    // Status Breakdown
    {
      label: "Active Orders",
      value: formatNumber(summary?.activeCount),
      sub: "Ongoing purchases",
      icon: Activity,
      color: "blue",
    },
    {
      label: "Received Orders",
      value: formatNumber(summary?.receivedCount),
      sub: "Fully received",
      icon: CheckCircle,
      color: "green",
    },
    {
      label: "Cancelled Orders",
      value: formatNumber(summary?.cancelledCount),
      sub: "Voided purchases",
      icon: XCircle,
      color: "red",
    },

    // Financials
    {
      label: "Total Amount",
      value: formatNumber(summary?.totalAmount, true),
      sub: "Total purchase value",
      icon: IndianRupee,
      color: "slate",
    },
    {
      label: "Paid Amount",
      value: formatNumber(summary?.totalPaid, true),
      sub: "Amount paid",
      icon: Wallet,
      color: "green",
    },
    {
      label: "Due Amount",
      value: formatNumber(summary?.totalDue, true),
      sub: "Pending payment",
      icon: AlertCircle,
      color: "red",
    },

    // Payment Status
    {
      label: "Paid Orders",
      value: formatNumber(summary?.paidCount),
      sub: "Fully paid",
      icon: CheckCheck,
      color: "green",
    },
    {
      label: "Partially Paid",
      value: formatNumber(summary?.partialCount),
      sub: "Partially settled",
      icon: PauseCircle,
      color: "orange",
    },
    {
      label: "Unpaid Orders",
      value: formatNumber(summary?.unpaidCount),
      sub: "No payment yet",
      icon: AlertTriangle,
      color: "red",
    },

    // Insight (optional but useful)
    {
      label: "Payment Completion",
      value: `${Math.round(
        ((summary?.totalPaid || 0) / (summary?.totalAmount || 1)) * 100,
      )}%`,
      sub: "Paid vs total",
      icon: TrendingUp,
      color: "blue",
    },
  ];

  return (
    <>
      <div className="space-y-6">
        <PageHeader
          title="All Purchase Orders"
          actions={actions}
          rightContent={
            <CustomDateRangePicker value={dateRange} onChange={setDateRange} />
          }
        />

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {stats.map((stat, i) => (
            <StatCard
              key={i}
              icon={stat.icon}
              title={stat.label}
              value={stat.value}
              // subtitle={stat.sub}
              color={stat.color}
              mode={stat.dark ? "solid" : ""}
              variant="v9"
              loading={isFetchingPurchase}
            />
          ))}
        </div>

        <SearchBar onSearch={(value) => setSearch(value)} />

        {isFetchingPurchase ? (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <PurchaseCardSkeleton key={i} />
            ))}
          </div>
        ) : purchases?.length > 0 ? (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
            {purchases?.map((p) => (
              <PurchaseCard
                key={p.id}
                purchase={p}
                onPay={(purchase) => {
                  setSelectedPurchase(purchase);
                  setShowPaymentOverlay(true);
                }}
                onCancel={(purchase) => {
                  setSelectedPurchase(purchase);
                  setShowCancelOverlay(true);
                }}
              />
            ))}
          </div>
        ) : (
          <NoDataFound
            icon={ReceiptText}
            title={
              purchases?.length === 0
                ? "No purchase orders yet"
                : "No results match your filters"
            }
            className="bg-white"
          />
        )}

        <Pagination
          totalItems={pagination?.total}
          currentPage={currentPage}
          pageSize={itemsPerPage}
          totalPages={pagination?.totalPages}
          onPageChange={(page) => setCurrentPage(page)}
          maxPageNumbers={5}
          showPageSizeSelector={true}
          onPageSizeChange={(size) => {
            setCurrentPage(1);
            setItemsPerPage(size);
          }}
        />
      </div>

      {/* Payment overlay */}
      <PurchasePaymentModal
        isOpen={showPaymentOverlay}
        onClose={resetPurchaseStates}
        purchase={selectedPurchase}
        onConfirm={handlePaymentConfirm}
        loading={isUpdatingPurchasePayment}
      />

      {/* Cancel overlay */}
      <CancelPurchaseModal
        isOpen={showCancelOverlay}
        onClose={resetPurchaseStates}
        purchase={selectedPurchase}
        onConfirm={handleCancelConfirm}
        loading={isCancellingPurchase}
      />
    </>
  );
};

export default AllPurchaseOrdersPage;
