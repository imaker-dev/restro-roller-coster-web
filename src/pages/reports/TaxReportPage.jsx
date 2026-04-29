import React, { useEffect, useState } from "react";
import PageHeader from "../../layout/PageHeader";
import { useDispatch, useSelector } from "react-redux";
import { fetchTaxReport } from "../../redux/slices/reportSlice";
import CustomDateRangePicker from "../../components/CustomDateRangePicker";
import StatCard from "../../components/StatCard";
import { formatNumber } from "../../utils/numberFormatter";

import SmartTable from "../../components/SmartTable";
import { formatDate, formatFileDate } from "../../utils/dateFormatter";
import Tabs from "../../components/Tabs";
import {
  Download,
  Eye,
  File,
  IndianRupee,
  Percent,
  RotateCcw,
  TrendingUp,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { handleResponse } from "../../utils/helpers";
import { exportTaxReport } from "../../redux/slices/exportReportSlice";
import { downloadBlob } from "../../utils/blob";
import { ROUTE_PATHS } from "../../config/paths";

const TaxReportPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { outletId } = useSelector((state) => state.auth);
  const { isExportingTaxReport } = useSelector((state) => state.exportReport);
  const { taxReport, isFetchingTaxReport } = useSelector(
    (state) => state.report,
  );

  const { daily, taxComponents, summary } = taxReport || {};

  const [dateRange, setDateRange] = useState();
  const [activeTab, setActiveTab] = useState("daily");

  const fetchReport = () => {
    dispatch(fetchTaxReport({ outletId, dateRange }));
  };

  useEffect(() => {
    if (!outletId || !dateRange?.startDate || !dateRange?.endDate) return;
    fetchReport();
  }, [outletId, dateRange]);

  const stats = [
    {
      title: "Total Sale",
      value: formatNumber(summary?.total_grand, true),
      subtitle: `${summary?.total_orders} orders`,
      icon: IndianRupee,
      color: "green",
    },

    {
      title: "Invoices",
      value: summary?.total_invoices,
      subtitle: "Generated",
      icon: File,
      color: "gray",
    },
    {
      title: "Total Tax",
      value: formatNumber(summary?.total_tax, true),
      subtitle: "Included in sales",
      icon: Percent,
      color: "purple",
    },

    {
      title: "Net Sale (Excl. Tax)",
      value: formatNumber(summary?.total_taxable, true),
      subtitle: "Total Sale - Tax",
      icon: TrendingUp,
      color: "indigo",
    },
  ];

  const taxColumns = [
    {
      key: "report_date",
      label: "Date",
      render: (row) => (
        <span className="font-medium text-slate-800">
          {formatDate(row?.report_date, "long")}
        </span>
      ),
    },

    // 🧮 FINAL FIRST
    {
      key: "grand_total",
      label: "Total Sale",
      render: (row) => (
        <span className="font-semibold text-green-700 tabular-nums">
          {formatNumber(row.grand_total, true)}
        </span>
      ),
    },

    // 🧾 TOTAL TAX
    {
      key: "total_tax",
      label: "Total Tax",
      render: (row) => (
        <span className="font-semibold text-purple-700 tabular-nums">
          {formatNumber(row.total_tax, true)}
        </span>
      ),
    },

    // 🧾 BREAKDOWN
    {
      key: "cgst_amount",
      label: "CGST",
      render: (row) => (
        <span className="text-indigo-600 tabular-nums">
          {formatNumber(row.cgst_amount, true)}
        </span>
      ),
    },

    {
      key: "sgst_amount",
      label: "SGST",
      render: (row) => (
        <span className="text-indigo-600 tabular-nums">
          {formatNumber(row.sgst_amount, true)}
        </span>
      ),
    },

    {
      key: "vat_amount",
      label: "VAT",
      render: (row) => (
        <span className="text-amber-600 tabular-nums">
          {formatNumber(row.vat_amount, true)}
        </span>
      ),
    },

    // 🔄 RESULT (AFTER TAX REMOVAL)
    {
      key: "taxable_amount",
      label: "Net Sale (Excl. Tax)",
      render: (row) => (
        <span className="font-medium text-slate-900 tabular-nums">
          {formatNumber(row.taxable_amount, true)}
        </span>
      ),
    },
  ];

  const taxComponentColumns = [
    {
      key: "name",
      label: "Tax Name",
      render: (row) => (
        <span className="font-medium text-slate-800">{row.name}</span>
      ),
    },

    {
      key: "rate",
      label: "Rate",
      render: (row) => (
        <span className="text-slate-700 font-medium">{row.rate}%</span>
      ),
    },

    {
      key: "taxableAmount",
      label: "Taxable Amount",
      render: (row) => formatNumber(row.taxableAmount, true),
    },

    {
      key: "taxAmount",
      label: "Tax Amount",
      render: (row) => (
        <span className="text-emerald-600 font-medium">
          {formatNumber(row.taxAmount, true)}
        </span>
      ),
    },

    {
      key: "invoiceCount",
      label: "Invoices",
      render: (row) => (
        <span className="text-slate-700">{row.invoiceCount}</span>
      ),
    },
  ];

  const tabs = [
    {
      id: "daily",
      label: "Daily Report",
      badgeCount: daily?.length,
    },
    {
      id: "tax",
      label: "Tax Components",
      badgeCount: taxComponents?.length,
    },
  ];

  const rowActions = [
    {
      label: "View",
      icon: Eye,
      onClick: (row) =>
        navigate(`${ROUTE_PATHS.REPORTS_TAX_DETAILS}?date=${row.report_date}`),
    },
  ];

  const handleExportTaxReport = async () => {
    if (!dateRange?.startDate || !dateRange?.endDate) return;

    const fileName = `Tax-Report_${formatFileDate(
      dateRange.startDate,
    )}_to_${formatFileDate(dateRange.endDate)}`;

    await handleResponse(
      dispatch(exportTaxReport({ outletId, dateRange })),
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
      onClick: () => handleExportTaxReport(),
      loading: isExportingTaxReport,
      loadingText: "Exporting...",
    },
    {
      label: "Refresh",
      type: "refresh",
      icon: RotateCcw,
      onClick: fetchReport,
      loading: isFetchingTaxReport,
      loadingText: "Refreshing...",
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title={"Tax Report"}
        showBackButton
        rightContent={
          <CustomDateRangePicker
            value={dateRange}
            onChange={(newRange) => {
              setDateRange(newRange);
            }}
          />
        }
        actions={actions}
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((card, i) => (
          <StatCard
            key={i}
            title={card?.title}
            icon={card.icon}
            value={card?.value}
            subtitle={card.subtitle}
            color={card?.color}
            variant="v9"
            mode="solid"
            loading={isFetchingTaxReport}
          />
        ))}
      </div>

      {/* ── Tab switcher ── */}
      <Tabs
        tabs={tabs}
        active={activeTab}
        onChange={setActiveTab}
        variant="v2"
      />

      {activeTab === "daily" && (
        <SmartTable
          title={"Daily Tax Report"}
          totalcount={daily?.length}
          data={daily}
          columns={taxColumns}
          loading={isFetchingTaxReport}
          // actions={rowActions}
        />
      )}

      {activeTab === "tax" && (
        <SmartTable
          title={"Tax Summary Report"}
          totalcount={taxComponents?.length}
          data={taxComponents}
          columns={taxComponentColumns}
          loading={isFetchingTaxReport}
        />
      )}
    </div>
  );
};

export default TaxReportPage;
