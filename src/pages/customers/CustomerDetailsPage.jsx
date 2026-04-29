import React, { useEffect } from "react";
import { useQueryParams } from "../../hooks/useQueryParams";
import { useDispatch, useSelector } from "react-redux";
import PageHeader from "../../layout/PageHeader";
import { fetchCustomerById } from "../../redux/slices/customerSlice";
import {
  User,
  Phone,
  Mail,
  MapPin,
  Building2,
  ShoppingBag,
  TrendingUp,
  Calendar,
  CheckCircle2,
  XCircle,
  Star,
  BadgeCheck,
  Hash,
  Activity,
  Wallet,
} from "lucide-react";
import { formatDate } from "../../utils/dateFormatter";
import { formatNumber, num } from "../../utils/numberFormatter";
import StatCard from "../../components/StatCard";
import LoadingOverlay from "../../components/LoadingOverlay";
import SmartTable from "../../components/SmartTable";
import { getOrderTableConfig } from "../../columns/order.columns";
import { useNavigate } from "react-router-dom";
import MetricPanel from "../../partial/report/daily-sales-report/MetricPanel";
import OrderTypeBar from "../../partial/report/daily-sales-report/OrderTypeBar";
import PaymentStatusBar from "../../partial/report/daily-sales-report/PaymentStatusBar";

// ─── Card ──────────────────────────────────────────────────
function Card({ children, className = "", noPad = false }) {
  return (
    <div
      className={`bg-white rounded-2xl border border-slate-200 overflow-hidden ${className}`}
      style={{
        boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 2px 8px rgba(0,0,0,0.04)",
      }}
    >
      {noPad ? children : <div className="p-5">{children}</div>}
    </div>
  );
}

function CardHeader({ icon: Icon, title, subtitle }) {
  return (
    <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-100">
      <div className="w-8 h-8 rounded-xl bg-primary-500 flex items-center justify-center flex-shrink-0">
        <Icon size={14} className="text-white" strokeWidth={2} />
      </div>
      <div>
        <p className="text-[13px] font-black text-slate-800 leading-none">
          {title}
        </p>
        {subtitle && (
          <p className="text-[10px] text-slate-400 font-medium mt-0.5">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}

// ─── Info row ──────────────────────────────────────────────
function InfoRow({ icon: Icon, label, value, last = false, mono = false }) {
  if (!value && value !== 0) return null;
  return (
    <div
      className={`flex items-center gap-3 py-3 ${!last ? "border-b border-slate-100" : ""}`}
    >
      <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
        <Icon size={12} className="text-slate-500" strokeWidth={2} />
      </div>
      <span className="text-[11.5px] text-slate-500 font-medium flex-1">
        {label}
      </span>
      <span
        className={`text-[12px] font-bold text-slate-800 text-right ${mono ? "font-mono" : ""}`}
      >
        {value}
      </span>
    </div>
  );
}

// ─── MAIN PAGE ─────────────────────────────────────────────
const CustomerDetailsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { customerId } = useQueryParams();
  const { outletId } = useSelector((s) => s.auth);
  const { customerDetails, isfetchingCustomerDetails } = useSelector(
    (s) => s.customer,
  );

  useEffect(() => {
    if (customerId) dispatch(fetchCustomerById({ customerId, outletId }));
  }, [customerId, outletId]);

  const {
    customer,
    historyStats: hs,
    historyBreakdown,
    orderHistory = [],
  } = customerDetails || {};

  const { byOrderType, byPaymentStatus } = historyBreakdown || {};

  const { columns, actions } = getOrderTableConfig(navigate);

  const orderStats = [
    {
      label: "Total Orders",
      value: formatNumber(hs?.totalOrders),
      sub: "All time",
      icon: ShoppingBag,
      color: "slate",
    },
    {
      label: "Paid Orders",
      value: formatNumber(hs?.fullyPaidOrders),
      sub: "Fully settled",
      icon: CheckCircle2,
      color: "green",
    },
    {
      label: "Cancelled",
      value: formatNumber(hs?.cancelledOrders),
      sub: "Orders voided",
      icon: XCircle,
      color: "red",
    },
    {
      label: "Active Orders",
      value: formatNumber(hs?.activeOrders),
      sub: "Currently open",
      icon: Activity,
      color: "blue",
    },
  ];

  if (isfetchingCustomerDetails) {
    return <LoadingOverlay text="Loading Customer Details..." />;
  }

  return (
    <div className="space-y-5">
      {/* Back */}
      <PageHeader onlyBack backLabel="Back to Customers" />

      {/* ── CUSTOMER HERO (UNIVERSAL STYLE) ── */}
      <div
        className="relative rounded-3xl overflow-hidden shadow-lg bg-primary-500"
      >
        {/* highlight line */}
        <div
          className="absolute top-0 left-0 right-0 h-[1px]"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)",
          }}
        />

        {/* glow */}
        <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-white/10 pointer-events-none" />

        <div className="relative z-10 px-6 py-5 text-white">
          {/* ── Top Row ── */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
            {/* Left Section */}
            <div className="flex items-center gap-4 flex-1 min-w-0">
              {/* Avatar */}
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-white/15 border border-white/20 backdrop-blur text-[20px] font-black select-none">
                {(customer?.name || "C").charAt(0).toUpperCase()}
              </div>

              <div className="min-w-0">
                <p className="text-[9px] font-semibold text-white/70 uppercase tracking-widest">
                  Customer Profile
                </p>

                <h1 className="text-[20px] font-bold leading-tight truncate">
                  {customer?.name}
                </h1>

                <div className="flex flex-wrap items-center gap-3 mt-1 text-[11px] text-white/75">
                  {customer?.phone && (
                    <span className="flex items-center gap-1">
                      <Phone size={11} className="text-white/50" />
                      {customer.phone}
                    </span>
                  )}

                  {customer?.email && (
                    <span className="flex items-center gap-1">
                      <Mail size={11} className="text-white/50" />
                      {customer.email}
                    </span>
                  )}

                  <span className="flex items-center gap-1">
                    <Hash size={11} className="text-white/50" />
                    ID #{customer?.id}
                  </span>
                </div>
              </div>
            </div>

            {/* Right Section */}
            <div className="sm:text-right flex-shrink-0">
              <p className="text-[9px] font-semibold text-white/70 uppercase tracking-wide">
                Total Spent
              </p>

              <p className="text-[30px] sm:text-[34px] font-extrabold tabular-nums leading-none">
                {formatNumber(customer?.totalSpent, true)}
              </p>

              <p className="text-[11px] text-white/70 mt-1">
                {num(customer?.totalOrders)} lifetime orders
              </p>
            </div>
          </div>

          {/* ── Metric Strip ── */}
          <div className="grid grid-cols-3 gap-3 mt-5">
            {[
              {
                label: "Customer Since",
                value: customer?.createdAt
                  ? formatDate(customer.createdAt, "long")
                  : "—",
              },
              {
                label: "Last Order",
                value: customer?.lastOrderAt
                  ? formatDate(customer.lastOrderAt, "long")
                  : "No orders",
              },
              {
                label: "Avg Order",
                value: formatNumber(customer?.avgOrderValue, true),
              },
            ].map(({ icon: Icon, label, value }) => (
              <div
                key={label}
                className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-white/10 border border-white/20 backdrop-blur-sm"
              >
                <div className="min-w-0">
                  <p className="text-[9px] font-semibold text-white/70 uppercase tracking-wide mb-2">
                    {label}
                  </p>

                  <p className="text-[14px] font-bold tabular-nums leading-none truncate">
                    {value}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══ 4 STAT TILES ══════════════════════════════ */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {orderStats.map((stat, index) => (
          <StatCard
            key={index}
            icon={stat.icon}
            title={stat.label}
            value={stat.value}
            color={stat.color}
            variant="v9"
          />
        ))}
      </div>

      {/* ── Order & Payment Breakdown ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Order Types */}
        <MetricPanel
          icon={ShoppingBag}
          title="Orders by Type"
          right={
            <span className="text-[13px] font-black text-slate-900 tabular-nums">
              {num(hs?.totalOrders)} total
            </span>
          }
        >
          {byOrderType?.length ? (
            byOrderType.map((item) => (
              <OrderTypeBar
                key={item.orderType}
                type={item.orderType}
                value={item.count}
                total={hs?.totalOrders}
              />
            ))
          ) : (
            <div className="text-sm text-slate-400 text-center py-6">
              No order type data
            </div>
          )}
        </MetricPanel>

        {/* Payment Status */}
        <MetricPanel
          icon={Wallet}
          title="Payment Status"
          right={
            <span className="text-[13px] font-black text-slate-900 tabular-nums">
              {formatNumber(hs?.totalSpent, true)}
            </span>
          }
        >
          {byPaymentStatus?.length ? (
            byPaymentStatus.map((item) => (
              <PaymentStatusBar
                key={item.paymentStatus}
                status={item.paymentStatus}
                amount={item.amount}
                count={item.count}
                total={hs?.totalSpent}
              />
            ))
          ) : (
            <div className="text-sm text-slate-400 text-center py-6">
              No payment data
            </div>
          )}
        </MetricPanel>
      </div>

      {/* ══ MAIN GRID ═════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* LEFT (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          {/* Customer profile */}
          <Card noPad>
            <CardHeader
              icon={User}
              title="Customer Profile"
              subtitle="Contact and account information"
            />
            <div className="px-5 py-1 pb-3">
              <InfoRow icon={User} label="Full Name" value={customer?.name} />
              <InfoRow
                icon={Phone}
                label="Phone"
                value={customer?.phone}
                mono
              />
              <InfoRow
                icon={Mail}
                label="Email"
                value={customer?.email || "—"}
              />
              <InfoRow
                icon={MapPin}
                label="Address"
                value={customer?.address || "—"}
              />
              <InfoRow
                icon={Hash}
                label="Customer ID"
                value={`#${customer?.id}`}
                mono
              />
              <InfoRow
                icon={Calendar}
                label="Joined"
                value={
                  customer?.createdAt
                    ? formatDate(customer?.createdAt, "long")
                    : "—"
                }
                last
              />
            </div>
          </Card>

          {/* GST info — only if GST customer */}
          {customer?.isGstCustomer && (
            <Card noPad>
              <CardHeader
                icon={BadgeCheck}
                title="GST Details"
                subtitle="Business and tax information"
              />
              <div className="px-5 py-1 pb-3">
                <InfoRow
                  icon={Building2}
                  label="Company"
                  value={customer?.companyName || "—"}
                />
                <InfoRow
                  icon={Hash}
                  label="GSTIN"
                  value={customer?.gstin || "—"}
                  mono
                />
                <InfoRow
                  icon={MapPin}
                  label="GST State"
                  value={
                    customer?.gstState
                      ? `${customer?.gstState} (${customer?.gstStateCode})`
                      : "—"
                  }
                />
                <InfoRow
                  icon={Phone}
                  label="Company Ph."
                  value={customer?.companyPhone || "—"}
                  mono
                />
                <InfoRow
                  icon={MapPin}
                  label="Company Addr"
                  value={customer?.companyAddress || "—"}
                  last
                />
              </div>
            </Card>
          )}
        </div>

        {/* RIGHT sidebar */}
        <div className="space-y-4">
          {/* Stats summary */}
          <Card noPad>
            <CardHeader icon={TrendingUp} title="Spending Summary" />
            <div className="px-5 py-1 pb-3">
              {[
                {
                  label: "Total Spent",
                  v: formatNumber(hs?.totalSpent, true),
                  mono: false,
                },
                {
                  label: "Avg Order Value",
                  v: formatNumber(hs?.avgOrderValue, true),
                  mono: false,
                },
                {
                  label: "First Order",
                  v: hs?.firstOrderAt
                    ? formatDate(hs.firstOrderAt, "long")
                    : "—",
                  mono: false,
                },
                {
                  label: "Last Order",
                  v: hs?.lastOrderAt ? formatDate(hs.lastOrderAt, "long") : "—",
                  mono: false,
                },
              ].map(({ label, v, mono }, i, arr) => (
                <div
                  key={label}
                  className={`flex items-center justify-between gap-4 py-3 ${i < arr.length - 1 ? "border-b border-slate-100" : ""}`}
                >
                  <span className="text-[11.5px] text-slate-500 font-medium">
                    {label}
                  </span>
                  <span
                    className={`text-[12px] font-bold text-slate-800 tabular-nums ${mono ? "font-mono" : ""}`}
                  >
                    {v}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          {/* Notes */}
          {customer?.notes && (
            <Card noPad>
              <CardHeader icon={Star} title="Notes" />
              <div className="px-5 py-4">
                <p className="text-[12px] text-slate-600 leading-relaxed">
                  {customer?.notes}
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>

      <SmartTable
        title="Order History"
        totalcount={orderHistory?.length}
        data={orderHistory}
        columns={columns}
        actions={actions}
      />
    </div>
  );
};

export default CustomerDetailsPage;
