import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllCustomers } from "../../redux/slices/customerSlice";
import PageHeader from "../../layout/PageHeader";
import { formatDate } from "../../utils/dateFormatter";
import SmartTable from "../../components/SmartTable";
import { formatNumber } from "../../utils/numberFormatter";
import { Box, Eye, ReceiptIndianRupee, Users } from "lucide-react";
import StatCard from "../../components/StatCard";
import { useNavigate } from "react-router-dom";
import StatusBadge from "../../layout/StatusBadge";
import { ROUTE_PATHS } from "../../config/paths";

const AllCustomersPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { outletId } = useSelector((state) => state.auth);
  const { allCustomers, loading } = useSelector((state) => state.customer);

  const { customers, pagination, summary } = allCustomers || {};

  useEffect(() => {
    dispatch(fetchAllCustomers({ outletId }));
  }, [outletId]);

  const columns = [
    {
      key: "name",
      label: "Customer",
      render: (row) => (
        <div className="leading-tight max-w-[180px]">
          <div
            className="text-slate-700 font-semibold truncate"
            title={row.name}
          >
            {row.name}
          </div>

          <div className="text-xs text-slate-500">{row.phone}</div>
        </div>
      ),
    },

    {
      key: "totalOrders",
      label: "Orders",
      render: (row) => (
        <div className="text-slate-700 font-medium">{row.totalOrders}</div>
      ),
    },

    {
      key: "totalSpent",
      label: "Total Spent",
      render: (row) => (
        <div className="leading-tight max-w-[140px]">
          <div className="text-slate-700 font-semibold">
            {formatNumber(row.totalSpent, true)}
          </div>

          <div className="text-xs text-slate-500">
            Avg {formatNumber(row.avgOrderValue, true)}
          </div>
        </div>
      ),
    },

    {
      key: "firstOrderAt",
      label: "First Order",
      render: (row) => (
        <div className="text-slate-700 text-sm">
          {row.firstOrderAt ? formatDate(row.firstOrderAt, "long") : "—"}
        </div>
      ),
    },

    {
      key: "lastOrderAt",
      label: "Last Order",
      render: (row) => (
        <div className="text-slate-700 text-sm">
          {row.lastOrderAt ? formatDate(row.lastOrderAt, "longTime") : "—"}
        </div>
      ),
    },

    {
      key: "isActive",
      label: "Status",
      sortable: true,
      render: (row) => <StatusBadge value={row.isActive} />,
    },
  ];

  const rowActions = [
    {
      label: "View",
      icon: Eye,
      onClick: (row) =>
        navigate(`${ROUTE_PATHS.CUSTOMER_DETAILS}?customerId=${row.id}`),
    },
  ];

  const customerStats = [
    {
      title: "Total Customers",
      value: formatNumber(summary?.totalCustomers),
      color: "blue",
      icon: Users,
    },
    {
      title: "Total Orders",
      value: formatNumber(summary?.totalOrders, true),
      color: "indigo",
      icon: Box,
    },
    {
      title: "GST Customers",
      value: formatNumber(summary?.gstCustomers),
      color: "green",
      icon: ReceiptIndianRupee,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title={"All Customers"} />

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {customerStats.map((card, i) => (
          <StatCard
            key={i}
            title={card.title}
            value={card.value}
            color={card.color}
            icon={card.icon}
            variant="v9"
          />
        ))}
      </div>

      <SmartTable
        title="Customers"
        totalcount={customers?.length}
        data={customers}
        columns={columns}
        actions={rowActions}
        loading={loading}
      />
    </div>
  );
};

export default AllCustomersPage;
