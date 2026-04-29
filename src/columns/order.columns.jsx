import React from "react";
import { Eye } from "lucide-react";
import { formatDate } from "../utils/dateFormatter";
import { formatNumber } from "../utils/numberFormatter";
import OrderBadge from "../partial/order/OrderBadge";
import { ROUTE_PATHS } from "../config/paths";

export const getOrderTableConfig = (navigate) => {
  const columns = [
    {
      key: "orderNumber",
      label: "Order",
      sortable: true,
      sortKey: "created_at",
      render: (row) => {
        const hasPartialNC = !row.isNC && row.ncAmount > 0;

        return (
          <div className="max-w-[180px] leading-tight">
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-slate-800 truncate">
                {row.orderNumber}
              </span>

              {row.isNC && (
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-100 text-purple-700">
                  NC
                </span>
              )}

              {hasPartialNC && (
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-violet-100 text-violet-700">
                  NC Items
                </span>
              )}
            </div>

            <div className="text-xs text-slate-500 truncate">
              {/* {row.invoiceNumber && (
                <span className="text-indigo-600">{row.invoiceNumber}</span>
              )}
              {row.invoiceNumber && " · "} */}
              {formatDate(row.createdAt, "longTime")}
            </div>
          </div>
        );
      },
    },

    {
      key: "orderType",
      label: "Type",
      sortable: true,
      render: (row) => <OrderBadge type="type" value={row.orderType} />,
    },

    {
      key: "table",
      label: "Table / Location",
      sortable: true,
      render: (row) => {
        if (row.orderType !== "dine_in") {
          return (
            <span className="text-xs text-slate-500 italic capitalize">
              {row.orderType}
            </span>
          );
        }

        const table = row.tableNumber || "—";
        const location = [row.floorName, row.sectionName]
          .filter(Boolean)
          .join(" / ");

        return (
          <div className="leading-tight max-w-[150px]">
            <div className="font-medium text-slate-800">{table}</div>
            <div className="text-xs text-slate-500 truncate">
              {location || "—"}
            </div>
          </div>
        );
      },
    },

    {
      key: "customer",
      label: "Customer",
      render: (row) => (
        <div className="leading-tight max-w-[160px]">
          <div className="font-medium text-slate-800">
            {row.customerName || "Walk-in"}
          </div>
          <div className="text-xs text-slate-500">
            {row.customerPhone || "—"}
          </div>
        </div>
      ),
    },

    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (row) => <OrderBadge type="status" value={row.status} />,
    },

    {
      key: "paymentStatus",
      label: "Payment",
      sortable: true,
      render: (row) => <OrderBadge type="payment" value={row.paymentStatus} />,
    },

    {
      key: "amount",
      label: "Amount",
      sortable: true,
      render: (row) => {
        const due =
          row.dueAmount ?? (row.totalAmount || 0) - (row.paidAmount || 0);

        return (
          <div className="leading-tight max-w-[140px]">
            <div className="font-semibold text-slate-900">
              {formatNumber(row.totalAmount || 0, true)}
            </div>

            <div className="text-xs text-slate-500">
              Paid {formatNumber(row.paidAmount || 0, true)}
              {due > 0 && (
                <span className="text-orange-600">
                  {" · "}Due {formatNumber(due, true)}
                </span>
              )}
            </div>
          </div>
        );
      },
    },

    {
      key: "meta",
      label: "Info",
      render: (row) => {
        const hasItems = row.itemCount > 0;
        const hasKOT = row.kotCount > 0;
        const hasCaptain = !!row.captainName;

        if (!hasItems && !hasKOT && !hasCaptain) return null;

        return (
          <div className="leading-tight max-w-[140px]">
            {(hasItems || hasKOT) && (
              <div className="flex flex-wrap gap-1 text-[11px]">
                {hasItems && (
                  <span className="px-1.5 py-0.5 bg-slate-100 rounded-md">
                    {row.itemCount} items
                  </span>
                )}
                {hasKOT && (
                  <span className="px-1.5 py-0.5 bg-slate-100 rounded-md">
                    {row.kotCount} KOT
                  </span>
                )}
              </div>
            )}

            {hasCaptain && (
              <div className="text-xs text-slate-500 truncate">
                {row.captainName}
              </div>
            )}
          </div>
        );
      },
    },
  ];

  const actions = [
    {
      label: "View",
      icon: Eye,
      onClick: (row) =>
        navigate(
          `${ROUTE_PATHS.ORDER_DETAILS}?orderId=${row.id ?? row.orderId}`,
        ),
    },
  ];

  return { columns, actions };
};
