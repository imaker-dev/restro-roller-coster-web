import React, { useEffect, useState } from "react";
import PageHeader from "../../layout/PageHeader";
import { useDispatch, useSelector } from "react-redux";
import { fetchDiscountReport } from "../../redux/slices/reportSlice";
import CustomDateRangePicker from "../../components/CustomDateRangePicker";
import { useNavigate } from "react-router-dom";
import {
  User,
  Phone,
  MapPin,
  Users,
  ChevronRight,
  Hash,
  Download,
  RotateCcw,
  Tag,
  ShoppingCart,
  IndianRupee,
  TrendingUp,
  ArrowUp,
} from "lucide-react";
import SmartTable from "../../components/SmartTable";
import OrderBadge from "../../partial/order/OrderBadge";
import { formatDate, formatFileDate } from "../../utils/dateFormatter";
import StatCard from "../../components/StatCard";
import DiscountBadge from "../../partial/report/disocunt-report/DiscountBadge";
import { formatNumber } from "../../utils/numberFormatter";
import { exportDiscountReport } from "../../redux/slices/exportReportSlice";
import { handleResponse } from "../../utils/helpers";
import { downloadBlob } from "../../utils/blob";
import SearchBar from "../../components/SearchBar";
import { ROUTE_PATHS } from "../../config/paths";
import Pagination from "../../components/Pagination";

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
const DiscountReportPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { outletId } = useSelector((s) => s.auth);
  const { discountReport, isFetchingDiscountReport } = useSelector(
    (s) => s.report,
  );
  const { isExportingDiscountReport } = useSelector((s) => s.exportReport);

  const [dateRange, setDateRange] = useState();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");
  const [discountType, setDiscountType] = useState("");

  const fetchReports = () => {
    dispatch(
      fetchDiscountReport({
        outletId,
        dateRange,
        page: currentPage,
        limit: itemsPerPage,
        search: searchTerm,
        sortBy,
        sortOrder,
        discountType,
      }),
    );
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, itemsPerPage, sortBy, sortOrder, discountType]);

  useEffect(() => {
    if (!outletId || !dateRange?.startDate || !dateRange?.endDate) return;
    fetchReports();
  }, [
    outletId,
    currentPage,
    itemsPerPage,
    dateRange,
    searchTerm,
    sortBy,
    sortOrder,
    discountType,
  ]);

  const { discounts, summary, pagination } = discountReport || [];

  const handleExport = async () => {
    if (!dateRange?.startDate || !dateRange?.endDate) return;

    const fileName = `Discount-Report_${formatFileDate(
      dateRange.startDate,
    )}_to_${formatFileDate(dateRange.endDate)}`;

    await handleResponse(
      dispatch(
        exportDiscountReport({
          outletId,
          dateRange,
          search: searchTerm,
          sortBy,
          sortOrder,
          discountType,
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

  const columns = [
    {
      key: "order",
      label: "Order",
      sortable: true,
      render: (row) => {
        return (
          <div>
            <p className="text-xs font-bold text-gray-900 mb-1">
              {row.orderNumber}
            </p>

            <div className="flex items-center gap-1.5 flex-wrap">
              <OrderBadge type="type" value={row.orderType} size="sm" />
              <OrderBadge type="status" value={row.orderStatus} size="sm" />
            </div>

            {row.tableName && (
              <p className="flex items-center gap-1 text-[10px] text-gray-400 mt-1">
                <MapPin size={9} />
                {row.tableName}
                {row.floorName ? ` · ${row.floorName}` : ""}
              </p>
            )}
          </div>
        );
      },
    },

    {
      key: "discount",
      label: "Discount",
      sortable: true,
      sortKey: "discountValue",
      render: (row) => (
        <div>
          <p className="text-xs font-bold text-gray-800 mb-1">
            {row.discountName || "Manual Discount"}
          </p>

          <div className="flex items-center gap-1.5 flex-wrap">
            <DiscountBadge
              type={row.discountType}
              value={row.discountValue}
              size="sm"
            />

            {row.discountCode && (
              <span className="inline-flex items-center gap-1 text-[9px] font-mono font-bold text-gray-500 bg-gray-100 border border-gray-200 px-1.5 py-0.5 rounded-md">
                <Hash size={8} />
                {row.discountCode}
              </span>
            )}
          </div>

          {row.appliedItemName && (
            <p className="text-[10px] text-gray-400 mt-1">
              on:{" "}
              <span className="font-semibold text-gray-600">
                {row.appliedItemName}
              </span>
            </p>
          )}
        </div>
      ),
    },

    {
      key: "customer",
      label: "Customer",
      render: (row) =>
        row.customerName ? (
          <div>
            <p className="flex items-center gap-1 text-xs font-semibold text-gray-700">
              <User size={10} className="text-gray-400" />
              {row.customerName}
            </p>

            {row.customerPhone && (
              <p className="flex items-center gap-1 text-[10px] text-gray-400 mt-0.5">
                <Phone size={9} />
                {row.customerPhone}
              </p>
            )}
          </div>
        ) : (
          <span className="text-xs text-gray-300">—</span>
        ),
    },

    {
      key: "cashier",
      label: "Cashier",
      render: (row) => (
        <div>
          <p className="flex items-center gap-1 text-xs text-gray-600 font-medium">
            <Users size={10} className="text-gray-400" />
            {row.createdByName || "—"}
          </p>

          {row.approvedByName && (
            <p className="text-[10px] text-gray-400 mt-0.5">
              Approved: {row.approvedByName}
            </p>
          )}
        </div>
      ),
    },

    {
      key: "date",
      label: "Date",
      render: (row) => (
        <div>
          <p className="flex items-center gap-1 text-xs text-gray-600 font-medium">
            {formatDate(row.orderCreatedAt, "long")}
          </p>

          <p className="text-[10px] text-gray-400 mt-0.5">
            {formatDate(row.orderCreatedAt, "time")}
          </p>
        </div>
      ),
    },

    {
      key: "subtotal",
      label: "Subtotal",
      render: (row) => (
        <span className="text-xs text-gray-500 tabular-nums">
          {formatNumber(row.orderSubtotal, true)}
        </span>
      ),
    },

    {
      key: "discountAmount",
      label: "Discount",
      sortable: true,
      sortKey: "discountAmount",
      render: (row) => (
        <span className="text-sm font-bold text-rose-600 tabular-nums">
          −{formatNumber(row.discountAmount, true)}
        </span>
      ),
    },

    {
      key: "total",
      label: "Total",
      render: (row) => (
        <span className="text-sm font-black text-gray-900 tabular-nums">
          {formatNumber(row.orderTotal, true)}
        </span>
      ),
    },
  ];

  const rowActions = [
    {
      label: "View Order",
      icon: ChevronRight,
      onClick: (row) =>
        navigate(`${ROUTE_PATHS.ORDER_DETAILS}?orderId=${row.orderId}`),
    },
  ];

  const actions = [
    {
      label: "Export Report",
      type: "export",
      icon: Download,
      onClick: () => handleExport(),
      loading: isExportingDiscountReport,
      loadingText: "Exporting...",
    },
    {
      label: "Refresh",
      type: "refresh",
      icon: RotateCcw,
      onClick: fetchReports,
      loading: isFetchingDiscountReport,
      loadingText: "Refreshing...",
    },
  ];

  const stats = [
    {
      title: "Discount Applied",
      value: summary?.totalDiscountsApplied,
      subtitle: "Total times used",
      icon: Tag,
      color: "blue",
    },
    {
      title: "Orders with Discount",
      value: summary?.ordersWithDiscount,
      subtitle: "Orders impacted",
      icon: ShoppingCart,
      color: "indigo",
    },
    {
      title: "Total Discount",
      value: formatNumber(summary?.totalDiscountAmount, true),
      subtitle: "Total given",
      icon: IndianRupee,
      color: "rose",
    },
    {
      title: "Avg Discount",
      value: formatNumber(summary?.avgDiscountAmount, true),
      subtitle: "Per usage",
      icon: TrendingUp,
      color: "purple",
    },
    {
      title: "Max Discount",
      value: formatNumber(summary?.maxDiscountAmount, true),
      subtitle: "Highest given",
      icon: ArrowUp,
      color: "green",
    },
  ];

  const handleSort = (sortBy, sortOrder) => {
    setSortBy(sortBy);
    setSortOrder(sortOrder);
  };

  return (
    <div className="space-y-5">
      <PageHeader
        title="Discount Report"
        showBackButton
        actions={actions}
        rightContent={
          <CustomDateRangePicker value={dateRange} onChange={setDateRange} />
        }
      />

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {stats?.map((card) => (
          <StatCard
            key={card.key}
            icon={card.icon}
            title={card.title}
            value={card.value}
            subtitle={card.subtitle}
            color={card.color}
            variant="v9"
            mode="solid"
            loading={isFetchingDiscountReport}
          />
        ))}
      </div>

      <div className="flex items-center justify-between gap-4">
        {/* Search Bar */}
        <SearchBar onSearch={(value) => setSearchTerm(value)} />

        <select
          className="form-select"
          value={discountType}
          onChange={(e) => setDiscountType(e.target.value)}
        >
          <option value="">All</option>
          <option value="percentage">Percentage</option>
          <option value="flat">Flat</option>
        </select>
      </div>

      <SmartTable
        title="All Discount Records"
        totalcount={pagination?.totalCount}
        data={discounts}
        columns={columns}
        rowKey="discountRecordId"
        actions={rowActions}
        loading={isFetchingDiscountReport}
        sortField={sortBy}
        sortDirection={sortOrder}
        onSortChange={handleSort}
      />

      <Pagination
        totalItems={pagination?.totalCount}
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

export default DiscountReportPage;
