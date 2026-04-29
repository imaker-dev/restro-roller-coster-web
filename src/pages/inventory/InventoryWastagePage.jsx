import React, { useEffect, useState } from "react";
import PageHeader from "../../layout/PageHeader";
import { useDispatch, useSelector } from "react-redux";
import { fetchWastageLogs } from "../../redux/slices/inventorySlice";
import {
  AlertTriangle,
  IndianRupee,
  Package,
  Search,
  Trash2,
} from "lucide-react";
import { formatDate } from "../../utils/dateFormatter";
import { formatNumber, num } from "../../utils/numberFormatter";
import SmartTable from "../../components/SmartTable";
import StatCard from "../../components/StatCard";
import SearchBar from "../../components/SearchBar";
import { formatText } from "../../utils/utils";
import CustomDateRangePicker from "../../components/CustomDateRangePicker";
import Pagination from "../../components/Pagination";

const InventoryWastagePage = () => {
  const dispatch = useDispatch();
  const { outletId } = useSelector((s) => s.auth);
  const { isFetchingWastageLogs, allWastageLogs } = useSelector(
    (s) => s.inventory,
  );
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [dateRange, setDateRange] = useState();

  useEffect(() => {
    setCurrentPage(1);
  }, [search, dateRange, itemsPerPage]);

  const fetchWastage = () => {
    if (!outletId || !dateRange?.startDate || !dateRange?.endDate) return;

    dispatch(
      fetchWastageLogs({
        outletId,
        search,
        page: currentPage,
        limit: itemsPerPage,
        dateRange,
      }),
    );
  };

  useEffect(() => {
    fetchWastage();
  }, [outletId, search, currentPage, itemsPerPage, dateRange]);

  const report = allWastageLogs?.data || allWastageLogs || {};
  const { wastage = [], summary, pagination } = report;

  const columns = [
    {
      key: "item",
      label: "Item",
      render: (row) => (
        <div className="flex flex-col">
          <span className="font-semibold text-slate-800">{row.itemName}</span>
          <span className="text-[11px] text-slate-400 mt-0.5">
            SKU: {row.itemSku}
          </span>
        </div>
      ),
    },

    {
      key: "batchCode",
      label: "Batch",
      render: (row) => (
        <span className="text-[11px] font-mono text-slate-600">
          {row.batchCode || "-"}
        </span>
      ),
    },

    {
      key: "wastageType",
      label: "Type / Reason",
      render: (row) => (
        <div className="flex flex-col">
          <span className="inline-flex w-fit text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
            {formatText(row.wastageType)}
          </span>

          <span className="text-[10px] text-slate-400 mt-1">
            {formatText(row.reason)}
          </span>
        </div>
      ),
    },

    {
      key: "date",
      label: "Date",
      render: (row) => (
        <div className="flex flex-col">
          <span className="text-[12px] font-semibold text-slate-700">
            {formatDate(row.wastageDate, "long")}
          </span>
          <span className="text-[10px] text-slate-400 mt-0.5">
            {formatDate(row.createdAt, "time")}
          </span>
        </div>
      ),
    },

    {
      key: "quantity",
      label: "Quantity",
      sortValue: (row) => Number(row.quantity),
      render: (row) => (
        <div className="">
          <span className="text-[13px] font-bold text-slate-800 tabular-nums">
            {row.quantity}
          </span>
          <span className="block text-[10px] text-slate-400">{row.unit}</span>
        </div>
      ),
    },

    {
      key: "unitCost",
      label: "Unit Cost",
      sortValue: (row) => Number(row.unitCost),
      render: (row) => (
        <div className="">
          <span className="text-[12px] font-semibold text-slate-700 tabular-nums">
            {formatNumber(row.unitCost, true)}
          </span>
          <span className="block text-[10px] text-slate-400">
            per {row.unit}
          </span>
        </div>
      ),
    },

    {
      key: "reportedBy",
      label: "Reported By",
      render: (row) => (
        <div className="flex flex-col">
          <span className="text-[12px] font-semibold text-slate-700">
            {row.reportedBy}
          </span>
          {row.approvedBy && (
            <span className="text-[10px] text-slate-400">
              Approved: {row.approvedBy}
            </span>
          )}
        </div>
      ),
    },

    {
      key: "totalCost",
      label: "Cost Lost",
      sortValue: (row) => Number(row.totalCost),
      render: (row) => (
        <div className="">
          <span className="text-[14px] font-black text-rose-600 tabular-nums">
            {formatNumber(row.totalCost, true)}
          </span>
        </div>
      ),
    },
  ];

  const stats = [
    {
      key: "totalCostLost",
      icon: IndianRupee,
      label: "Total Cost Lost",
      value: formatNumber(summary?.totalCostLost, true),
      sub: "Value of wasted stock",
      color: "rose",
      dark: true,
    },
    {
      key: "totalEntries",
      icon: Package,
      label: "Total Entries",
      value: num(summary?.totalEntries),
      sub: "Wastage records logged",
      color: "blue",
    },
    {
      key: "totalQtyWasted",
      icon: AlertTriangle,
      label: "Qty Wasted",
      value: parseFloat(num(summary?.totalQtyWasted).toFixed(2)),
      sub: "Across all units",
      color: "amber",
    },
  ];

  return (
    <div className="space-y-5">
      <PageHeader
        title="Inventory Wastage"
        description="Track and review all wastage and spoilage entries"
        rightContent={
          <CustomDateRangePicker value={dateRange} onChange={setDateRange} />
        }
      />

      {/* ── Stat tiles ── */}
      <div className="grid grid-cols-3 gap-3">
        {stats?.map((stat) => (
          <StatCard
            key={stat.label}
            icon={stat.icon}
            title={stat.label}
            value={stat.value}
            subtitle={stat.sub}
            color={stat.color}
            variant="v9"
            mode={stat.dark ? "solid" : "light"}
            loading={isFetchingWastageLogs}
          />
        ))}
      </div>

      <SearchBar
        placeholder="Search item, SKU, batch…"
        onSearch={(value) => setSearch(value)}
      />

      <SmartTable
        title="Wastage"
        totalcount={pagination?.total}
        data={wastage}
        columns={columns}
        //   actions={rowActions}
        loading={isFetchingWastageLogs}
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

export default InventoryWastagePage;
