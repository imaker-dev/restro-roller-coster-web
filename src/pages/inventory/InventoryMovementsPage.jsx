import { useEffect, useState, useMemo } from "react";
import PageHeader from "../../layout/PageHeader";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllMovements } from "../../redux/slices/inventorySlice";
import { formatNumber } from "../../utils/numberFormatter";
import { formatDate } from "../../utils/dateFormatter";
import {
  ArrowUpRight,
  ArrowDownRight,
  ArrowRight,
  Info,
  RotateCcw,
  ShoppingCart,
  TrendingUp,
  SlidersHorizontal,
  Trash2,
  Factory,
  Activity,
} from "lucide-react";
import SmartTable from "../../components/SmartTable";
import InventoryBadge from "../../partial/inventory/inventory/InventoryBadge";
import CustomDateRangePicker from "../../components/CustomDateRangePicker";
import SearchBar from "../../components/SearchBar";
import Pagination from "../../components/Pagination";
import StatCard from "../../components/StatCard";

/* ─── Quantity display — colour + sign ───────────────────────────────────── */
function QtyCell({ quantity, unit }) {
  const isPos = quantity > 0;
  return (
    <div
      className={`flex items-center gap-1 font-extrabold tabular-nums text-sm ${isPos ? "text-emerald-600" : "text-red-600"}`}
    >
      {isPos ? (
        <ArrowUpRight size={13} strokeWidth={2.5} className="flex-shrink-0" />
      ) : (
        <ArrowDownRight size={13} strokeWidth={2.5} className="flex-shrink-0" />
      )}
      {isPos ? "+" : ""}
      {formatNumber(quantity)} {unit}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   PAGE
═══════════════════════════════════════════════════════════════════════════ */
const InventoryMovementsPage = () => {
  const dispatch = useDispatch();
  const { outletId } = useSelector((state) => state.auth);
  const { isFetchingMovements, allMovements } = useSelector(
    (state) => state.inventory,
  );
  const { movements = [], pagination, summary } = allMovements || {};

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [dateRange, setDateRange] = useState();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState(null);

  const fetchMovements = () => {
    if (!outletId || !dateRange?.startDate || !dateRange?.endDate) return;
    dispatch(
      fetchAllMovements({
        outletId,
        page: currentPage,
        limit: itemsPerPage,
        dateRange,
        search: searchQuery,
        type: selectedType,
      }),
    );
  };

  useEffect(() => {
    fetchMovements();
  }, [
    outletId,
    currentPage,
    itemsPerPage,
    dateRange,
    searchQuery,
    selectedType,
  ]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, dateRange, selectedType]);

  const actions = [
    {
      label: "Refresh",
      type: "refresh",
      icon: RotateCcw,
      onClick: fetchMovements,
      loading: isFetchingMovements,
      loadingText: "Refreshing...",
    },
  ];

  const columns = [
    {
      key: "id",
      label: "ID",
      sortable: true,
      render: (row) => (
        <span className="text-[11px] font-bold text-slate-500 tabular-nums">
          #{row.id}
        </span>
      ),
    },
    {
      key: "itemAndBatch",
      label: "Item / Batch",
      sortable: true,
      sortValue: (row) => row.itemName, // sorts by item name
      render: (row) => (
        <div className="flex flex-col min-w-0">
          {/* Item name */}
          <p className="text-xs font-extrabold text-slate-800 truncate">
            {row.itemName}
          </p>

          {/* Batch info */}
          {row.batchCode ? (
            <p className="text-[11px] font-bold text-slate-500 truncate">
              {row.batchCode}
            </p>
          ) : (
            <div className="flex items-center gap-1 mt-0.5">
              <Info size={12} className="text-sky-500" />
              <span className="text-[10px] font-medium text-sky-700">
                Auto Deduct
              </span>
            </div>
          )}
        </div>
      ),
    },

    {
      key: "type",
      label: "Type",
      sortable: false,
      render: (row) => (
        <InventoryBadge type="movement" value={row.movementType} size="sm" />
      ),
    },

    {
      key: "quantity",
      label: "Quantity",
      sortable: true,
      render: (row) => (
        <div className="flex flex-col">
          <QtyCell quantity={row.quantity} unit={row.unitAbbreviation} />
          {row.totalCost > 0 && (
            <p className="text-[10px] text-slate-400 font-medium mt-0.5">
              {formatNumber(row.totalCost, true)}
            </p>
          )}
        </div>
      ),
    },
    {
      key: "balance",
      label: "Balance",
      sortable: false,
      render: (row) => (
        <div className="flex flex-col">
          <div className="flex items-center  gap-1.5">
            <span className="text-[11px] font-semibold text-slate-400 tabular-nums">
              {formatNumber(row.balanceBefore)}
            </span>
            <ArrowRight size={14} className="text-slate-300" />
            <span
              className={`text-[12px] font-extrabold tabular-nums ${
                row.balanceAfter <= 0 ? "text-red-600" : "text-slate-800"
              }`}
            >
              {formatNumber(row.balanceAfter)}
            </span>
            <span className="text-[10px] text-slate-400">
              {row.unitAbbreviation}
            </span>
          </div>
          {row.notes && (
            <p className="text-[10px] text-slate-400 font-medium truncate max-w-[200px] mt-0.5">
              {row.notes}
            </p>
          )}
        </div>
      ),
    },
    {
      key: "date",
      label: "Date",
      sortable: true,
      sortValue: (row) => new Date(row.createdAt).getTime(),
      render: (row) => (
        <div className="">
          <p className="text-[11px] font-semibold text-slate-600">
            {formatDate(row.createdAt, "long")}
          </p>
          <p className="text-[10px] text-slate-400 font-medium mt-0.5">
            {formatDate(row.createdAt, "time")} · {row.createdByName}
          </p>
        </div>
      ),
    },
  ];

  const STATUS_OPTIONS = [
    { label: "All", value: "" },
    { label: "Purchase", value: "purchase" },
    { label: "Sale", value: "sale" },
    { label: "Reversals", value: "reversals" },
    { label: "Production", value: "production" },
    { label: "Wastage", value: "wastage" },
    { label: "Adjustment", value: "adjustment" },
  ];

  const stats = [
    // Movement Overview
    {
      label: "Total Movements",
      value: formatNumber(summary?.totalMovements),
      sub: "All stock activities",
      icon: Activity,
      color: "slate",
      dark: true,
    },

    // Movement Types
    {
      label: "Purchases",
      value: formatNumber(summary?.purchaseCount),
      sub: "Stock inward entries",
      icon: ShoppingCart,
      color: "green",
    },
    {
      label: "Sales",
      value: formatNumber(summary?.saleCount),
      sub: "Stock outward entries",
      icon: TrendingUp,
      color: "blue",
    },
    {
      label: "Reversals",
      value: formatNumber(summary?.reversalCount),
      sub: "Voided / reversed entries",
      icon: RotateCcw,
      color: "orange",
    },
    {
      label: "Adjustments",
      value: formatNumber(summary?.adjustmentCount),
      sub: "Manual corrections",
      icon: SlidersHorizontal,
      color: "purple",
    },
    {
      label: "Wastage",
      value: formatNumber(summary?.wastageCount),
      sub: "Damaged / expired stock",
      icon: Trash2,
      color: "red",
    },
    {
      label: "Production",
      value: formatNumber(summary?.productionCount),
      sub: "Manufactured stock",
      icon: Factory,
      color: "indigo",
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Stock Movements"
        actions={actions}
        rightContent={
          <CustomDateRangePicker value={dateRange} onChange={setDateRange} />
        }
      />

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        {stats.map((stat, i) => (
          <StatCard
            key={i}
            icon={stat.icon}
            title={stat.label}
            value={stat.value}
            subtitle={stat.sub}
            color={stat.color}
            mode={stat.dark ? "solid" : ""}
            variant="v9"
            loading={isFetchingMovements}
          />
        ))}
      </div>

      <div className="flex items-center gap-2">
        <SearchBar
          placeholder="Search..."
          onSearch={(value) => setSearchQuery(value)}
        />

        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="form-input"
        >
          {STATUS_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>


      <SmartTable
        title="Movements"
        totalcount={pagination?.total}
        data={movements}
        columns={columns}
        // actions={rowActions}
        loading={isFetchingMovements}
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

export default InventoryMovementsPage;
