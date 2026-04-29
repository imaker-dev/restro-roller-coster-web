import React, { useEffect, useState } from "react";
import PageHeader from "../../layout/PageHeader";
import { useDispatch, useSelector } from "react-redux";
import { fetchVendors } from "../../redux/slices/vendorSlice";
import {
  AlertCircle,
  BarChart2,
  Edit3,
  Eye,
  FileText,
  IndianRupee,
  Plus,
  ShoppingBag,
  TrendingUp,
  UserCheck,
  Users,
  UserX,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import SmartTable from "../../components/SmartTable";
import { formatNumber } from "../../utils/numberFormatter";
import { formatDate } from "../../utils/dateFormatter";
import StatusBadge from "../../layout/StatusBadge";
import StatCard from "../../components/StatCard";
import { ROUTE_PATHS } from "../../config/paths";

const AllVendorsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { outletId } = useSelector((state) => state.auth);
  const { isFetchingVendors, allVendorsData } = useSelector(
    (state) => state.vendor,
  );

  const { vendors, pagination, summary } = allVendorsData || {};

  useEffect(() => {
    if (!outletId) return;
    dispatch(fetchVendors(outletId));
  }, [outletId]);

  const actions = [
    {
      label: "Add New Vendor",
      type: "primary",
      icon: Plus,
      onClick: () => navigate(ROUTE_PATHS.VENDORS_ADD),
    },
  ];

  const columns = [
    {
      key: "name",
      label: "Vendor",
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-2 min-w-0">
          {/* Avatar */}
          <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600">
            {row.name?.charAt(0)?.toUpperCase() || "V"}
          </div>

          <div className="flex flex-col min-w-0">
            <p className="text-xs font-extrabold text-slate-800 truncate">
              {row.name}
            </p>

            <p className="text-[11px] text-slate-500 truncate">
              {row.contactPerson || "No contact person"}
            </p>
          </div>
        </div>
      ),
    },

    {
      key: "phone",
      label: "Contact",
      render: (row) => (
        <div className="flex flex-col text-xs">
          <p className="font-semibold text-slate-800">{row.phone || "—"}</p>

          {row.alternatePhone && (
            <p className="text-[10px] text-slate-400">
              Alt: {row.alternatePhone}
            </p>
          )}

          {row.email && (
            <p className="text-[10px] text-sky-600 truncate max-w-[140px]">
              {row.email}
            </p>
          )}
        </div>
      ),
    },

    {
      key: "location",
      label: "Location",
      render: (row) => {
        const location = [row.city, row.state].filter(Boolean).join(", ");

        return (
          <div className="flex flex-col text-xs">
            <p className="font-medium text-slate-700 truncate max-w-[140px]">
              {location || "No location"}
            </p>

            {row.pincode && (
              <p className="text-[10px] text-slate-400">PIN: {row.pincode}</p>
            )}
          </div>
        );
      },
    },

    {
      key: "tax",
      label: "Tax Info",
      render: (row) => (
        <div className="flex flex-col text-xs min-w-0">
          {row.gstNumber ? (
            <p className="font-medium text-slate-800 truncate">
              GST: {row.gstNumber}
            </p>
          ) : (
            <p className="text-[10px] text-slate-400">No GST</p>
          )}

          {row.panNumber && (
            <p className="text-[10px] text-slate-500 truncate">
              PAN: {row.panNumber}
            </p>
          )}
        </div>
      ),
    },

    {
      key: "purchase",
      label: "Purchases",
      sortable: true,
      render: (row) => (
        <div className="flex flex-col">
          <p className="text-sm font-extrabold text-slate-900 tabular-nums">
            {formatNumber(row.totalPurchaseAmount || 0, true)}
          </p>

          <p className="text-[10px] text-slate-400 font-medium">
            {row.purchaseCount || 0} orders
          </p>
        </div>
      ),
    },

    {
      key: "lastPurchaseDate",
      label: "Last Activity",
      sortable: true,
      render: (row) => (
        <div className="flex flex-col">
          <p className="text-xs font-semibold text-slate-700">
            {row.lastPurchaseDate
              ? formatDate(row.lastPurchaseDate, "long")
              : "—"}
          </p>

          {row.lastPurchaseDate && (
            <p className="text-[10px] text-slate-400">
              {formatDate(row.lastPurchaseDate, "relative")}
            </p>
          )}
        </div>
      ),
    },

    {
      key: "status",
      label: "Status",
      render: (row) => <StatusBadge value={row.isActive} />,
    },
  ];

  const rowActions = [
    {
      label: "View",
      icon: Eye,
      onClick: (row) =>
        navigate(
          `${ROUTE_PATHS.VENDORS_DETAILS}?vendorId=${row.id ?? row.orderId}`,
        ),
    },
    {
      label: "Update",
      icon: Edit3,
      onClick: (row) =>
        navigate(
          `${ROUTE_PATHS.VENDORS_ADD}?vendorId=${row.id ?? row.orderId}`,
        ),
      color: "blue",
    },
  ];

  const stats = [
    //  Overview (what & how many)
    {
      label: "Total Vendors",
      value: formatNumber(summary?.totalVendors),
      sub: `${formatNumber(summary?.activeVendors)} active`,
      icon: Users,
      color: "slate",
      dark: true,
    },
    // {
    //   label: "Active Vendors",
    //   value: formatNumber(summary?.activeVendors),
    //   sub: "Currently supplying",
    //   icon: UserCheck,
    //   color: "green",
    // },
    // {
    //   label: "Inactive Vendors",
    //   value: formatNumber(summary?.inactiveVendors),
    //   sub: "Not currently active",
    //   icon: UserX,
    //   color: "red",
    // },

    //  Engagement (who is actually used)
    {
      label: "Vendors with Purchases",
      value: formatNumber(summary?.vendorsWithPurchases),
      sub: "Have transactions",
      icon: ShoppingBag,
      color: "blue",
    },

    //  Activity
    {
      label: "Purchase Orders",
      value: formatNumber(summary?.totalPurchaseOrders),
      sub: "Total POs created",
      icon: FileText,
      color: "purple",
    },

    //  Financials (MOST important → keep together)
    {
      label: "Total Purchase Value",
      value: formatNumber(summary?.totalPurchaseValue, true),
      sub: "Overall procurement",
      icon: IndianRupee,
      color: "slate",
    },
    {
      label: "Outstanding Amount",
      value: formatNumber(summary?.totalOutstanding, true),
      sub: "Pending to vendors",
      icon: AlertCircle,
      color: "red",
    },

    {
      label: "Avg Purchase per Vendor",
      value: formatNumber(
        (summary?.totalPurchaseValue || 0) /
          (summary?.vendorsWithPurchases || 1),
        true,
      ),
      sub: "Per active vendor",
      icon: BarChart2,
      color: "blue",
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title={"All Vendors"} actions={actions} />

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
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
            loading={isFetchingVendors}
          />
        ))}
      </div>

      <SmartTable
        title="Vendors"
        totalcount={pagination?.total}
        data={vendors}
        columns={columns}
        actions={rowActions}
        loading={isFetchingVendors}
      />
    </div>
  );
};

export default AllVendorsPage;
