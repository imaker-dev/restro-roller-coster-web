import React, { useEffect, useState } from "react";
import PageHeader from "../../layout/PageHeader";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllOrders } from "../../redux/slices/orderSlice";
import SmartTable from "../../components/SmartTable";
import {
  Ban,
  CheckCircle,
  Download,
  IndianRupee,
  Package,
  ReceiptIndianRupee,
  RotateCcw,
  ShoppingBag,
  TrendingUp,
  Truck,
  Utensils,
  XCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Pagination from "../../components/Pagination";
import SearchBar from "../../components/SearchBar";
import CustomDateRangePicker from "../../components/CustomDateRangePicker";
import StatCard from "../../components/StatCard";
import { formatNumber } from "../../utils/numberFormatter";
import { getOrderTableConfig } from "../../columns/order.columns";
import { formatFileDate } from "../../utils/dateFormatter";
import { handleResponse } from "../../utils/helpers";
import { exportOrdersReport } from "../../redux/slices/exportReportSlice";
import { downloadBlob } from "../../utils/blob";
import SidebarFilter from "../../components/SidebarFilter";
import { ORDER_STATUSES, ORDER_TYPES, PAYMENT_STATUSES } from "../../constants";
import { formatText } from "../../utils/utils";

const AllOrdersPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { outletId } = useSelector((state) => state.auth);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState();

  const [sortBy, setSortBy] = useState("created_at");
  const [sortOrder, setSortOrder] = useState("desc");
  const [filters, setFilters] = useState({});

  const { isExportingOrdersReport } = useSelector(
    (state) => state.exportReport,
  );
  const { allOrdersData, loading } = useSelector((state) => state.order);
  const { orders, pagination, summary } = allOrdersData || {};

  const { columns, actions: rowActions } = getOrderTableConfig(navigate);

  const fetchOrders = () => {
    const { status, orderType, paymentStatus, hasOpenItems, hasNcItems } =
      filters || {};

    dispatch(
      fetchAllOrders({
        outletId,
        page: currentPage,
        limit: itemsPerPage,
        search: searchTerm,
        dateRange,
        orderStatus: status,
        orderType,
        paymentStatus,
        sortBy,
        sortOrder,
        hasOpenItems,
        hasNcItems,
      }),
    );
  };

  useEffect(() => {
    fetchOrders();
  }, [
    outletId,
    currentPage,
    itemsPerPage,
    searchTerm,
    dateRange,
    sortBy,
    sortOrder,
    filters,
  ]);

  const handleSort = (sortBy, sortOrder) => {
    setSortBy(sortBy);
    setSortOrder(sortOrder);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, dateRange, sortBy, sortOrder, filters]);

  const stats = [
    {
      title: "Total Orders",
      value: formatNumber(summary?.totalOrders),
      color: "blue",
      icon: ShoppingBag,
    },
    {
      title: "Total Amount",
      value: formatNumber(summary?.totalAmount, true),
      color: "indigo",
      icon: IndianRupee,
    },
    {
      title: "Completed Amount",
      value: formatNumber(summary?.completedAmount, true),
      color: "green",
      icon: CheckCircle,
    },
    {
      title: "Cancelled Orders",
      value: formatNumber(summary?.cancelledCount),
      color: "red",
      icon: XCircle,
    },
    {
      title: "Dine-In Orders",
      value: formatNumber(summary?.dineInCount),
      color: "purple",
      icon: Utensils,
    },
    {
      title: "Takeaway Orders",
      value: formatNumber(summary?.takeawayCount),
      color: "cyan",
      icon: Package,
    },
    {
      title: "Delivery Orders",
      value: formatNumber(summary?.deliveryCount),
      color: "sky",
      icon: Truck,
    },
    {
      title: "Avg Order Value",
      value: formatNumber(summary?.avgOrderValue, true),
      color: "amber",
      icon: TrendingUp,
    },

    // NEW CARDS
    {
      title: "NC Orders",
      value: formatNumber(summary?.ncCount),
      color: "violet",
      icon: Ban,
    },
    {
      title: "NC Amount",
      value: formatNumber(summary?.ncAmount, true),
      color: "rose",
      icon: ReceiptIndianRupee,
    },
  ];

  const handleExportOrdersReport = async () => {
    if (!dateRange?.startDate || !dateRange?.endDate) return;

    const fileName = `Orders-Report_${formatFileDate(
      dateRange.startDate,
    )}_to_${formatFileDate(dateRange.endDate)}`;

    const { orderStatus, orderType, paymentStatus } = filters || {};
    await handleResponse(
      dispatch(
        exportOrdersReport({
          outletId,
          search: searchTerm,
          dateRange,
          orderStatus,
          orderType,
          paymentStatus,
          sortBy,
          sortOrder,
        }),
      ),
      (res) => {
        downloadBlob({
          data: res.payload,
          fileName,
        });
      },
    );
  };

  const actions = [
    {
      label: "Export",
      type: "export",
      icon: Download,
      onClick: handleExportOrdersReport,
      loading: isExportingOrdersReport,
      loadingText: "Exporting...",
    },
    {
      label: "Refresh",
      type: "refresh",
      icon: RotateCcw,
      onClick: fetchOrders,
      loading: loading,
      loadingText: "Refreshing...",
    },
  ];

  const ORDER_STATUS_OPTIONS = Object.values(ORDER_STATUSES).map((status) => ({
    value: status,
    label: formatText(status),
  }));

  const ORDER_TYPE_OPTIONS = Object.values(ORDER_TYPES).map((type) => ({
    value: type,
    label: formatText(type),
  }));

  const PAYMENT_STATUS_OPTIONS = Object.values(PAYMENT_STATUSES).map(
    (status) => ({
      value: status,
      label: formatText(status),
    }),
  );

  const orderFilterGroups = [
    {
      id: "status",
      title: "Order Status",
      type: "radio",
      options: ORDER_STATUS_OPTIONS,
    },
    {
      id: "orderType",
      title: "Order Type",
      type: "radio",
      options: ORDER_TYPE_OPTIONS,
    },
    {
      id: "paymentStatus",
      title: "Payment Status",
      type: "radio",
      options: PAYMENT_STATUS_OPTIONS.map((item) => ({
        id: item.value || "all",
        label: item.label,
        value: item.value,
      })),
    },
    {
      id: "hasOpenItems",
      title: "Open Orders",
      type: "radio",
      options: [
        { id: "openOnly", label: "Orders with Open Items", value: true },
        { id: "normal", label: "Orders without Open Items", value: false },
      ],
    },
    {
      id: "hasNcItems",
      title: "NC Orders",
      type: "radio",
      options: [
        { id: "ncOnly", label: "Orders with NC Items Only", value: true },
        { id: "normal", label: "Normal Orders", value: false },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <PageHeader
          title={"All Orders"}
          actions={actions}
          rightContent={
            <CustomDateRangePicker
              value={dateRange}
              onChange={(newRange) => {
                setDateRange(newRange);
              }}
            />
          }
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {stats.map((card, i) => (
          <StatCard
            key={i}
            title={card.title}
            value={card.value}
            color={card.color}
            icon={card.icon}
            variant="v9"
            loading={loading}
          />
        ))}
      </div>

      <div className="flex items-center gap-4">
        {/* Search Bar */}
        <SearchBar
          placeholder="Search by order details..."
          onSearch={(value) => setSearchTerm(value)}
        />

        {/* Filters */}
        <SidebarFilter
          filterGroups={orderFilterGroups}
          filters={filters}
          onApplyFilters={setFilters}
        />
      </div>

      <SmartTable
        title="Orders"
        totalcount={pagination?.total}
        data={orders}
        columns={columns}
        actions={rowActions}
        loading={loading}
        sortField={sortBy}
        sortDirection={sortOrder}
        onSortChange={handleSort}
      />

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
  );
};

export default AllOrdersPage;
