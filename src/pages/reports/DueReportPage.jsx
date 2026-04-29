import { useEffect, useRef, useState } from "react";
import PageHeader from "../../layout/PageHeader";
import { useDispatch, useSelector } from "react-redux";
import { fetchDueReport } from "../../redux/slices/reportSlice";
import LoadingOverlay from "../../components/LoadingOverlay";
import {
  Users,
  AlertCircle,
  BadgeIndianRupee,
  ReceiptText,
  TrendingDown,
  TrendingUp,
  Download,
  RotateCcw,
} from "lucide-react";
import StatCard from "../../components/StatCard";
import { formatNumber } from "../../utils/numberFormatter";
import {  formatFileDate } from "../../utils/dateFormatter";
import CustomDateRangePicker from "../../components/CustomDateRangePicker";
import { handleResponse } from "../../utils/helpers";
import { downloadBlob } from "../../utils/blob";
import NoDataFound from "../../layout/NoDataFound";
import { exportDueReport } from "../../redux/slices/exportReportSlice";
import Pagination from "../../components/Pagination";
import SearchBar from "../../components/SearchBar";
import { CustomerDueCard } from "../../partial/report/due-report/CustomerDueCard";
import CustomerDueCardSkeleton from "../../partial/report/due-report/CustomerDueCardSkeleton";

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════════════════════════════════ */
const DueReportPage = () => {
  const dispatch = useDispatch();
  const { outletId } = useSelector((state) => state.auth);
  const { dueReport, isFetchingDueReport } = useSelector(
    (state) => state.report,
  );

  const { isExportingDueReport } = useSelector((state) => state.exportReport);

  const [dateRange, setDateRange] = useState();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(9);

  const fetchDue = () => {
    dispatch(
      fetchDueReport({
        outletId,
        dateRange,
        page: currentPage,
        limit: itemsPerPage,
        search: searchTerm,
      }),
    );
  };

  useEffect(() => {
    if (!outletId || !dateRange?.startDate || !dateRange?.endDate) return;

    fetchDue();
  }, [outletId, dateRange, currentPage, itemsPerPage, searchTerm]);

  const { summary, customers, pagination } = dueReport || {};

  const stats = [
    {
      label: "Total Outstanding",
      value: formatNumber(summary?.totalOutstandingDue,true),
      sub: "Across all customers",
      icon: TrendingDown,
      color: "red",
    },
    {
      label: "Total Collected",
      value: formatNumber(summary?.totalCollected,true),
      sub: "Due payments received",
      icon: BadgeIndianRupee,
      color: "green",
    },

    {
      label: "Customers With Due",
      value: formatNumber(summary?.totalCustomersWithDue),
      sub: "Active due accounts",
      icon: Users,
      color: "violet",
    },
    {
      label: "Orders With Due",
      value: formatNumber(summary?.totalOrdersWithDue),
      sub: "Pending due orders",
      icon: ReceiptText,
      color: "sky",
    },
    {
      label: "Highest Due",
      value: formatNumber(summary?.maxDue,true),
      sub: "Single customer max",
      icon: AlertCircle,
      color: "rose",
    },
  ];

  const handleExportDueReport = async () => {
    if (!dateRange?.startDate || !dateRange?.endDate) return;

    const fileName = `Due-Report_${formatFileDate(
      dateRange.startDate,
    )}_to_${formatFileDate(dateRange.endDate)}`;

    await handleResponse(
      dispatch(exportDueReport({ outletId, dateRange, searchTerm })),
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
      onClick: () => handleExportDueReport(),
      loading: isExportingDueReport,
      loadingText: "Exporting...",
      disabled: !customers || customers.length === 0,
    },
    {
      label: "Refresh",
      type: "refresh",
      icon: RotateCcw,
      onClick: fetchDue,
      loading: isFetchingDueReport,
      loadingText: "Refreshing...",
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Due Reports"
        showBackButton
        rightContent={
          <CustomDateRangePicker value={dateRange} onChange={setDateRange} />
        }
        actions={actions}
      />

      {/* ── Summary KPIs ── */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        {stats?.map((stat, index) => (
          <StatCard
            key={index}
            icon={stat.icon}
            title={stat.label}
            value={stat.value}
            subtitle={stat.sub}
            color={stat.color}
            variant="v9"
            loading={isFetchingDueReport}
          />
        ))}
      </div>

      <div>
        <SearchBar
          placeholder="Search by user details..."
          onSearch={(value) => setSearchTerm(value)}
        />
      </div>

      {/* ── Customer list ── */}
      {isFetchingDueReport ? (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <CustomerDueCardSkeleton key={i} />
          ))}
        </div>
      ) : customers?.length > 0 ? (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {customers.map((c) => (
            <CustomerDueCard key={c.id} customer={c} />
          ))}
        </div>
      ) : (
        <NoDataFound
          icon={Users}
          title="No customers with due balance"
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
  );
};

export default DueReportPage;
