import React from "react";
import Drawer from "../../../components/Drawer";
import { formatNumber } from "../../../utils/numberFormatter";
import { Calendar, ExternalLink, TrendingDown, Users } from "lucide-react";
import { formatDate } from "../../../utils/dateFormatter";
import { Link } from "react-router-dom";
import { ROUTE_PATHS } from "../../../config/paths";

// ─── Order Row (inside drawer) ────────────────────────────────────────────────
function OrderRow({ order }) {
  const pct =
    order.totalAmount > 0
      ? ((order.paidAmount / order.totalAmount) * 100).toFixed(0)
      : 0;

  return (
    <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
      {/* Top */}
      <div className="px-4 py-3.5 flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="text-sm font-black text-gray-900">
              {order.orderNumber}
            </span>
            {order.invoiceNumber && (
              <span className="text-[10px] font-semibold text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-md">
                {order.invoiceNumber}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-gray-400">
            <Calendar size={10} />
            {formatDate(order.createdAt, "long")} ·{" "}
            {formatDate(order.createdAt, "time")}
          </div>
        </div>

        <div className="flex flex-col items-end gap-1.5 shrink-0">
          <span className="text-sm font-black text-red-600 tabular-nums">
            {formatNumber(order.dueAmount, true)}
          </span>
          <span className="text-[10px] text-gray-400 font-medium">due</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="px-4 pb-3">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">
            Payment progress
          </span>
          <span className="text-[10px] font-bold text-emerald-600">
            {pct}% paid
          </span>
        </div>
        <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-500 rounded-full transition-all duration-700"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {/* Amount row */}
      <div className="grid grid-cols-3 divide-x divide-gray-100 border-t border-gray-100">
        {[
          {
            label: "Total",
            value: formatNumber(order.totalAmount, true),
            color: "text-gray-700",
          },
          {
            label: "Paid",
            value: formatNumber(order.paidAmount, true),
            color: "text-emerald-600",
          },
          {
            label: "Due",
            value: formatNumber(order.dueAmount, true),
            color: "text-red-600",
          },
        ].map(({ label, value, color }) => (
          <div key={label} className="flex flex-col items-center py-2.5 px-2">
            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">
              {label}
            </span>
            <span className={`text-xs font-black tabular-nums ${color}`}>
              {value}
            </span>
          </div>
        ))}
      </div>

      {/* View order link */}
      <div className="px-4 py-2.5 border-t border-gray-100 bg-gray-50/60">
        <Link
          to={`${ROUTE_PATHS.ORDER_DETAILS}?orderId=${order.orderId}`}
          className="flex items-center gap-1.5 text-[11px] font-bold text-gray-500 hover:text-primary-600 transition-colors w-fit"
        >
          <ExternalLink size={11} />
          View full order
        </Link>
      </div>
    </div>
  );
}

const CustomerDueDrawer = ({ isOpen, onClose, customer, totalDue }) => {
  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-primary-500 flex items-center justify-center shrink-0">
            <span className="text-xs font-black text-white uppercase">
              {customer.name?.charAt(0) ?? "?"}
            </span>
          </div>
          <div>
            <p className="text-sm font-black text-gray-900 leading-none">
              {customer.name}
            </p>
            {customer.phone && (
              <p className="text-[11px] text-gray-400 mt-0.5">
                {customer.phone}
              </p>
            )}
          </div>
        </div>
      }
      subtitle={null}
      footer={
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">
              Total outstanding
            </p>
            <p className="text-lg font-black text-red-600 tabular-nums">
              {formatNumber(totalDue, true)}
            </p>
          </div>
          <Link
            to={`${ROUTE_PATHS.CUSTOMER_DETAILS}?customerId=${customer.id}`}
            onClick={() => onClose()}
            className="flex items-center gap-2 text-xs font-bold text-white bg-primary-500 hover:bg-primary-600 px-4 py-2.5 rounded-xl transition-colors shadow-sm shadow-primary-200"
          >
            <Users size={13} /> View Customer Profile
          </Link>
        </div>
      }
    >
      <div className="px-5 py-4 space-y-3">
        {/* Summary strip inside drawer */}
        <div className="grid grid-cols-3 gap-2 bg-gray-50 border border-gray-100 rounded-2xl p-3 mb-2">
          <div className="text-center">
            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">
              Total Orders
            </p>
            <p className="text-sm font-black text-gray-900">
              {customer.totalOrders}
            </p>
          </div>
          <div className="text-center border-x border-gray-200">
            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">
              Pending
            </p>
            <p className="text-sm font-black text-amber-600">
              {customer.pendingOrders?.length}
            </p>
          </div>
          <div className="text-center">
            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">
              Collected
            </p>
            <p className="text-sm font-black text-emerald-600">
              {formatNumber(customer.totalDueCollected, true)}
            </p>
          </div>
        </div>

        {/* Section label */}
        <div className="flex items-center gap-2 py-1">
          <TrendingDown size={12} className="text-red-400" />
          <p className="text-xs font-black text-gray-700">Pending Due Orders</p>
          <span className="ml-auto text-[10px] font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
            {customer.pendingOrders?.length}
          </span>
        </div>

        {/* Order rows */}
        {customer.pendingOrders?.map((order) => (
          <OrderRow key={order.orderId} order={order} />
        ))}
      </div>
    </Drawer>
  );
};

export default CustomerDueDrawer;
