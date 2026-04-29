import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useQueryParams } from "../../hooks/useQueryParams";
import { fetchShiftHistoryByid } from "../../redux/slices/shiftSlice";
import {
  Clock,
  Layers,
  Banknote,
  CreditCard,
  Receipt,
  AlertCircle,
  SlidersHorizontal,
  Tag,
  ChevronDown,
  AlertTriangle,
  ArrowRightLeft,
  ShoppingBag,
  UtensilsCrossed,
  Bike,
  ArrowDownLeft,
  ArrowUpRight,
  Package,
  ExternalLink,
  Download,
  Wallet,
} from "lucide-react";
import PageHeader from "../../layout/PageHeader";
import OrderBadge from "../../partial/order/OrderBadge";
import { useNavigate } from "react-router-dom";
import { ROUTE_PATHS } from "../../config/paths";
import ShiftHistoryDetailsSkeleton from "../../partial/report/shift-summary/ShiftHistoryDetailsPageSkeleton";
import NoDataFound from "../../layout/NoDataFound";
import { formatDate, formatFileDate } from "../../utils/dateFormatter";
import { handleResponse } from "../../utils/helpers";
import { exportShiftHistoryDetails } from "../../redux/slices/exportReportSlice";
import { downloadBlob } from "../../utils/blob";
import { formatNumber } from "../../utils/numberFormatter";
import UserAvatar from "../../components/UserAvatar";
import RoleBadge from "../../partial/user/RoleBadge";
import PayRow from "../../partial/report/daily-sales-report/PayRow";
import PaymentBar from "../../partial/report/PaymentBreakdownBar";
import StatusPill from "../../components/StatusPill";
import PaymentTypeBadge from "../../partial/order/PaymentTypeBadge";

/* ── helpers ── */
const fmt = (n) => formatNumber(n, true);
const fmtN = (n) => formatNumber(n);

/* ── tiny reusable atoms ── */
const Label = ({ children }) => (
  <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-2">
    {children}
  </p>
);

const InfoRow = ({ label, value, valueClass = "text-gray-800" }) => (
  <div className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
    <span className="text-xs text-gray-400">{label}</span>
    <span className={`text-xs font-medium ${valueClass}`}>{value}</span>
  </div>
);

const StatChip = ({ label, value, accent = "gray" }) => {
  const map = {
    green: "bg-emerald-50 text-emerald-700",
    blue: "bg-blue-50 text-blue-700",
    amber: "bg-amber-50 text-amber-700",
    red: "bg-red-50 text-red-500",
    violet: "bg-violet-50 text-violet-700",
    gray: "bg-gray-100 text-gray-600",
  };
  return (
    <div className={`rounded-xl px-3 py-2.5 ${map[accent]}`}>
      <p className="text-[10px] font-medium opacity-70 mb-0.5">{label}</p>
      <p className="text-sm font-bold">{value}</p>
    </div>
  );
};

const PayBar = ({
  icon: Icon,
  label,
  amount,
  count,
  total,
  barColor,
  iconBg,
  iconColor,
}) => {
  const ratio = total ? Math.round((amount / total) * 100) : 0;
  return (
    <div className="flex items-center gap-3 py-2.5 border-b border-gray-50 last:border-0">
      <div
        className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${iconBg}`}
      >
        <Icon size={12} className={iconColor} />
      </div>
      <span className="text-xs text-gray-600 w-8 shrink-0">{label}</span>
      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${barColor}`}
          style={{ width: `${ratio}%` }}
        />
      </div>
      <span className="text-[10px] text-gray-400 w-6 text-right shrink-0">
        {ratio}%
      </span>
      <span className="text-xs text-gray-400 shrink-0">({count})</span>
      <span className="text-xs font-semibold text-gray-800 w-[68px] text-right shrink-0">
        {fmt(amount)}
      </span>
    </div>
  );
};

/* ── Accordion wrapper ── */
function Accordion({
  title,
  subtitle,
  icon: Icon,
  iconBg = "bg-gray-100",
  iconColor = "text-gray-500",
  badge,
  defaultOpen = false,
  children,
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
      <button
        onClick={() => setOpen((p) => !p)}
        className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-gray-50/60 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div
            className={`w-8 h-8 rounded-xl flex items-center justify-center border ${iconBg}`}
          >
            <Icon size={14} className={iconColor} />
          </div>
          <div className="text-left">
            <p className="text-sm font-semibold text-gray-900">{title}</p>
            {subtitle && <p className="text-xs text-gray-400">{subtitle}</p>}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {badge && (
            <span className="text-xs font-semibold text-gray-500">{badge}</span>
          )}
          <ChevronDown
            size={14}
            className={`text-gray-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          />
        </div>
      </button>
      <div
        className={`
          transition-all duration-300 ease-in-out overflow-hidden
          ${open ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"}
        `}
      >
        <div className="border-t border-gray-100 px-4 py-4">{children}</div>
      </div>
    </div>
  );
}

/* ── Order card ── */
function OrderCard({ order }) {
  const [open, setOpen] = useState(false);
  const {
    id,
    orderNumber,
    orderType,
    status,
    paymentStatus,
    tableName,
    customerName,
    customerPhone,
    subtotal,
    taxAmount,
    discountAmount,
    totalAmount,
    isNC,
    ncAmount,
    ncReason,
    paidAmount,
    dueAmount,
    isAdjustment,
    adjustmentAmount,
    paymentMode,
    createdByName,
    createdAt,
    items,
  } = order;

  const navigate = useNavigate();

  const modeIcon =
    { cash: Banknote, card: CreditCard, upi: Layers }[paymentMode] || Banknote;
  const ModeIcon = modeIcon;

  return (
    // <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
    <div
      className={`border  rounded-2xl overflow-hidden transition-colors ${
        status === "cancelled"
          ? " bg-red-50/50 border-red-200"
          : "bg-white border-gray-200"
      }`}
    >
      <button
        onClick={() => setOpen((p) => !p)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50/60 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gray-50 border border-gray-100 flex flex-col items-center justify-center shrink-0">
            {orderType === "dine_in" ? (
              <UtensilsCrossed size={13} className="text-gray-500" />
            ) : orderType === "takeaway" ? (
              <ShoppingBag size={13} className="text-gray-500" />
            ) : (
              <Bike size={13} className="text-gray-500" />
            )}
            {tableName && (
              <span className="text-[8px] text-gray-400 leading-none mt-0.5 font-medium">
                {tableName}
              </span>
            )}
          </div>
          <div className="text-left">
            <div className="flex items-center gap-1.5">
              <p className="text-xs font-semibold text-gray-800">
                {orderNumber}
              </p>
              {isNC && (
                <span className="text-[9px] bg-amber-50 text-amber-500 border border-amber-100 px-1.5 py-0.5 rounded-full font-medium">
                  NC
                </span>
              )}
              {isAdjustment && (
                <span className="text-[9px] bg-blue-50 text-blue-500 border border-blue-100 px-1.5 py-0.5 rounded-full font-medium">
                  Adj
                </span>
              )}
              {dueAmount > 0 && (
                <span className="text-[9px] bg-red-50 text-red-500 border border-red-100 px-1.5 py-0.5 rounded-full font-medium">
                  Due
                </span>
              )}
              {discountAmount > 0 && (
                <span className="text-[9px] bg-emerald-50 text-emerald-500 border border-emerald-100 px-1.5 py-0.5 rounded-full font-medium">
                  Discount
                </span>
              )}
            </div>
            <p className="text-[10px] text-gray-400 mt-0.5">
              {customerName || "Walk-in"} · {formatDate(createdAt, "time")}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-right">
            <p className="text-sm font-bold text-gray-900">
              {fmt(totalAmount)}
            </p>
            <div className="flex items-center justify-end gap-1 mt-0.5">
              <ModeIcon size={10} className="text-gray-400" />
              <span className="text-[10px] text-gray-400 capitalize">
                {paymentMode}
              </span>
            </div>
          </div>
          <ChevronDown
            size={13}
            className={`text-gray-300 transition-transform duration-200 shrink-0 ${open ? "rotate-180" : ""}`}
          />
        </div>
      </button>

      {open && (
        <div className="border-t border-gray-50 px-4 py-3 space-y-3">
          {/* status badges */}
          <div className="flex items-center gap-2 flex-wrap">
            <OrderBadge type="status" value={status} size="sm" />
            <OrderBadge type="payment" value={paymentStatus} size="sm" />
            <span className="text-[10px] text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
              by {createdByName}
            </span>
          </div>

          {/* items */}
          {items?.length > 0 && (
            <div className="bg-gray-50 rounded-xl px-3 py-2">
              <Label>Items</Label>
              {items.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between py-1.5 border-b border-gray-100 last:border-0"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <Package size={11} className="text-gray-400 shrink-0" />
                    <span className="text-xs text-gray-700 truncate">
                      {item.itemName}
                      {item.variantName ? ` · ${item.variantName}` : ""}
                    </span>
                    <span className="text-[10px] text-gray-400 shrink-0">
                      ×{parseFloat(item.quantity)}
                    </span>
                  </div>
                  <span className="text-xs font-medium text-gray-800 shrink-0 ml-3">
                    {fmt(item.totalPrice)}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* bill breakdown */}
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: "Subtotal", value: fmt(subtotal), cls: "text-gray-700" },
              { label: "Tax", value: fmt(taxAmount), cls: "text-gray-700" },
              ...(discountAmount > 0
                ? [
                    {
                      label: "Discount",
                      value: `− ${fmt(discountAmount)}`,
                      cls: "text-red-500",
                    },
                  ]
                : []),
              ...(isNC && ncAmount > 0
                ? [
                    {
                      label: "NC",
                      value: `− ${fmt(ncAmount)}`,
                      cls: "text-amber-500",
                    },
                  ]
                : []),
              ...(isAdjustment && adjustmentAmount > 0
                ? [
                    {
                      label: "Adjustment",
                      value: `− ${fmt(adjustmentAmount)}`,
                      cls: "text-blue-500",
                    },
                  ]
                : []),
              {
                label: "Paid",
                value: fmt(paidAmount),
                cls: "text-emerald-600",
              },
              ...(dueAmount > 0
                ? [{ label: "Due", value: fmt(dueAmount), cls: "text-red-500" }]
                : []),
            ].map(({ label, value, cls }) => (
              <div
                key={label}
                className="flex items-center justify-between bg-gray-50 rounded-xl px-3 py-2"
              >
                <span className="text-[10px] text-gray-500">{label}</span>
                <span className={`text-[11px] font-semibold ${cls}`}>
                  {value}
                </span>
              </div>
            ))}
          </div>

          {/* view details */}
          <button
            onClick={() =>
              navigate(`${ROUTE_PATHS.ORDER_DETAILS}?orderId=${id}`)
            }
            className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-colors group"
          >
            <span className="text-xs font-medium text-gray-500 group-hover:text-gray-700 transition-colors">
              View order details
            </span>
            <ExternalLink
              size={11}
              className="text-gray-400 group-hover:text-gray-600 transition-colors"
            />
          </button>
        </div>
      )}
    </div>
  );
}

/* ── Tab button ── */
const Tab = ({ label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors whitespace-nowrap ${active ? "bg-gray-900 text-white" : "text-gray-500 hover:bg-gray-100"}`}
  >
    {label}
  </button>
);

/* ── Main Page ── */
const ShiftHistoryDetailsPage = () => {
  const dispatch = useDispatch();
  const { shiftId } = useQueryParams();
  const [activeTab, setActiveTab] = useState("overview");
  const { shiftHistoryDetails: d, isFetchingShiftHistoryDetails } = useSelector(
    (s) => s.shift,
  );
  const { isExportingShiftHistoryDetails } = useSelector(
    (state) => state.exportReport,
  );

  useEffect(() => {
    if (shiftId) dispatch(fetchShiftHistoryByid(shiftId));
  }, [shiftId]);

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "collection", label: "Collection" },
    { id: "orders", label: `Orders (${d?.orderStats?.completedOrders || 0})` },
    {
      id: "staff",
      label: `Staff (${d?.staffActivity?.filter((s) => s.ordersCreated > 0 || s.ordersHandled > 0).length || 0})`,
    },
    { id: "dues", label: "Due collections" },
    { id: "transactions", label: "Transactions" },
  ];

  if (isFetchingShiftHistoryDetails) return <ShiftHistoryDetailsSkeleton />;

  if (!d) {
    return (
      <NoDataFound icon={Clock} title="No shift data found" description="" />
    );
  }

  const handleExportShiftSummaryDetailsReport = async () => {
    if (!d?.sessionDate) return;

    const fileName = `Shift-Summary-Report_${formatFileDate(d.sessionDate)}`;

    await handleResponse(
      dispatch(exportShiftHistoryDetails(shiftId)),
      (res) => {
        downloadBlob({
          data: res.payload,
          fileName,
        });
      },
    );
  };

  const {
    orderStats,
    collection,
    paymentBreakdown,
    staffActivity,
    dueCollections,
    transactions,
    orders,
    cashierBreakdown,
  } = d;

  const actions = [
    {
      label: "Export",
      type: "export",
      icon: Download,
      onClick: () => handleExportShiftSummaryDetailsReport(),
      loading: isExportingShiftHistoryDetails,
      loadingText: "Exporting...",
    },
  ];

  return (
    <div className="space-y-5">
      <PageHeader onlyBack backLabel="Back to shifts" />

      {/* <PageHeader
        title={"Shift History Details"}
        actions={actions}
        showBackButton
      /> */}

      <div>
        {/* ── Hero header ── */}
        <div className="bg-white rounded-t-xl border-b border-gray-100 px-4 md:px-6 py-5">
          <div>
            {/* top row */}
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={`text-[10px] font-semibold px-2 py-1 rounded-full border ${d.status === "closed" ? "bg-red-50 text-red-500 border-red-100" : "bg-emerald-50 text-emerald-600 border-emerald-100"}`}
                  >
                    {d.status === "closed" ? "Closed" : "Active"}
                  </span>
                  <span className="text-[10px] text-gray-400">
                    Shift #{d.id}
                  </span>
                </div>
                <h1 className="text-xl font-bold text-gray-900">
                  {d.outletName}
                </h1>
                <p className="text-xs text-gray-400 mt-0.5">
                  {d.floorName} · {formatDate(d.sessionDate, "long")}
                </p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-2xl font-bold text-gray-900">
                  {fmt(d.totalSales)}
                </p>
                <p className="text-xs text-gray-400">total sales</p>
              </div>
            </div>

            {/* cashier + time row */}
            <div className="flex items-center gap-3 flex-wrap mb-4">
              <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2">
                <UserAvatar name={d.cashierName} size="sm" />
                <span className="text-xs text-gray-700 font-medium">
                  {d.cashierName}
                </span>
                <span className="text-[10px] text-gray-400">Cashier</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <Clock size={12} className="text-gray-400" />
                <span>{formatDate(d.openingTime, "time")}</span>
                <span className="text-gray-300">→</span>
                <span>{formatDate(d.closingTime, "time")}</span>
              </div>
            </div>

            {/* quick stat chips */}
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              <StatChip
                label="Orders"
                value={fmtN(d.totalOrders)}
                accent="blue"
              />
              <StatChip
                label="Guests"
                value={fmtN(orderStats?.totalOrders || d.totalOrders)}
                accent="violet"
              />
              <StatChip
                label="Cancelled"
                value={fmtN(orderStats?.cancelledOrders || 0)}
                accent="red"
              />
              <StatChip
                label="NC orders"
                value={fmtN(orderStats?.ncOrders || 0)}
                accent="amber"
              />
              <StatChip
                label="Avg order"
                value={fmt(orderStats?.avgOrderValue || 0)}
                accent="green"
              />
              <StatChip
                label="Due"
                value={fmt(orderStats?.totalDueAmount || 0)}
                accent={orderStats?.totalDueAmount > 0 ? "red" : "gray"}
              />
            </div>
          </div>
        </div>

        {/* ── Tab strip ── */}
        <div className="bg-white border-b border-gray-100 px-4 md:px-6 mb-6">
          <div>
            <div className="flex items-center gap-1 py-2.5 overflow-x-auto scrollbar-hide">
              {tabs.map((t) => (
                <Tab
                  key={t.id}
                  label={t.label}
                  active={activeTab === t.id}
                  onClick={() => setActiveTab(t.id)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Tab content ── */}
      <div className="space-y-3">
        {/* ── OVERVIEW ── */}
        {activeTab === "overview" && (
          <>
            {/* shift info */}
            <Accordion
              title="Shift info"
              subtitle="Session details & timing"
              icon={Clock}
              iconBg="bg-blue-50 border-blue-100"
              iconColor="text-blue-600"
              defaultOpen
            >
              <InfoRow label="Outlet" value={d.outletName} />
              <InfoRow label="Floor" value={d.floorName} />
              <InfoRow label="Cashier" value={d.cashierName} />
              <InfoRow label="Opened by" value={d.openedByName} />
              <InfoRow label="Closed by" value={d.closedByName} />
              <InfoRow
                label="Session date"
                value={formatDate(d.sessionDate, "long")}
              />
              <InfoRow
                label="Opening time"
                value={formatDate(d.openingTime, "longTime")}
              />
              <InfoRow
                label="Closing time"
                value={formatDate(d.closingTime, "longTime")}
              />
              <InfoRow
                label="Status"
                value={d.status === "closed" ? "Closed" : "Active"}
                valueClass={
                  d.status === "closed" ? "text-red-500" : "text-emerald-600"
                }
              />
            </Accordion>

            {/* cash summary */}
            <Accordion
              title="Cash summary"
              subtitle="Opening, closing & variance"
              icon={Banknote}
              iconBg="bg-emerald-50 border-emerald-100"
              iconColor="text-emerald-600"
              defaultOpen
            >
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
                <StatChip
                  label="Opening cash"
                  value={fmt(d.openingCash)}
                  accent="gray"
                />
                <StatChip
                  label="Closing cash"
                  value={fmt(d.closingCash)}
                  accent="green"
                />
                <StatChip
                  label="Expected cash"
                  value={fmt(d.expectedCash)}
                  accent="blue"
                />
                <StatChip
                  label="Variance"
                  value={fmt(d.cashVariance)}
                  accent={
                    d.cashVariance > 0
                      ? "green"
                      : d.cashVariance < 0
                        ? "red"
                        : "gray"
                  }
                />
              </div>
              {d.varianceNotes && (
                <div className="bg-amber-50 border border-amber-100 rounded-xl px-3 py-2 text-xs text-amber-700">
                  {d.varianceNotes}
                </div>
              )}
            </Accordion>

            {/* order stats */}
            <Accordion
              title="Order stats"
              subtitle="Type breakdown & performance"
              icon={Receipt}
              iconBg="bg-violet-50 border-violet-100"
              iconColor="text-violet-600"
              defaultOpen
            >
              <div className="grid grid-cols-3 gap-2 mb-3">
                <StatChip
                  label="Total"
                  value={fmtN(orderStats?.totalOrders)}
                  accent="blue"
                />
                <StatChip
                  label="Completed"
                  value={fmtN(orderStats?.completedOrders)}
                  accent="green"
                />
                <StatChip
                  label="Cancelled"
                  value={fmtN(orderStats?.cancelledOrders)}
                  accent="red"
                />
              </div>
              <div className="grid grid-cols-3 gap-2 mb-3">
                <StatChip
                  label="Dine-in"
                  value={fmtN(orderStats?.dineInOrders)}
                  accent="blue"
                />
                <StatChip
                  label="Takeaway"
                  value={fmtN(orderStats?.takeawayOrders)}
                  accent="violet"
                />
                <StatChip
                  label="Delivery"
                  value={fmtN(orderStats?.deliveryOrders)}
                  accent="amber"
                />
              </div>
              <InfoRow
                label="Avg order value"
                value={fmt(orderStats?.avgOrderValue)}
              />
              <InfoRow
                label="Max order value"
                value={fmt(orderStats?.maxOrderValue)}
              />
              <InfoRow
                label="Min order value"
                value={fmt(orderStats?.minOrderValue)}
              />
              <InfoRow
                label="NC orders"
                value={`${orderStats?.ncOrders} · ${fmt(orderStats?.ncAmount)}`}
                valueClass="text-amber-500"
              />
              <InfoRow
                label="Adjustments"
                value={`${orderStats?.adjustmentCount} · ${fmt(orderStats?.adjustmentAmount)}`}
                valueClass="text-blue-500"
              />
              <InfoRow
                label="Total due"
                value={fmt(orderStats?.totalDueAmount)}
                valueClass={
                  orderStats?.totalDueAmount > 0
                    ? "text-red-500"
                    : "text-gray-800"
                }
              />
            </Accordion>
          </>
        )}

        {/* ── COLLECTION ── */}
        {activeTab === "collection" && (
          <>
            {/* totals */}
            <div className="bg-white border border-gray-100 rounded-2xl p-4">
              <Label>Collection summary</Label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
                <StatChip
                  label="Total"
                  value={fmt(collection.totalMoneyReceived)}
                  accent="green"
                />
                <StatChip
                  label="Fresh"
                  value={fmt(d.cashierBreakdown?.[0]?.freshCollection || 0)}
                  accent="blue"
                />
                <StatChip
                  label="Outside"
                  value={fmt(collection.outsideCollection)}
                  accent="violet"
                />
                <StatChip
                  label="From dues"
                  value={fmt(collection.dueCollection)}
                  accent="violet"
                />
              </div>

              {Object.entries(collection.paymentBreakdown)
                .filter(([, amount]) => amount > 0)
                .map(([mode, amount]) => {
                  return (
                    <PaymentBar
                      key={mode}
                      type={mode}
                      amount={amount}
                      total={collection?.totalMoneyReceived}
                    />
                  );
                })}
              {/* {paymentBreakdown?.map((p) => {
                return (
                  <PaymentBar
                    key={p.mode}
                    type={p.mode}
                    amount={p.total}
                    count={p.count}
                    total={collection?.totalMoneyReceived}
                  />
                );
              })} */}
            </div>

            {/* outside collections */}
            {d.outsideCollections?.count > 0 && (
              <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-50">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-xl bg-violet-50 border border-violet-100 flex items-center justify-center">
                      <ArrowDownLeft size={13} className="text-violet-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800">
                        Outside collections
                      </p>
                      <p className="text-xs text-gray-400">
                        {d.outsideCollections.count} entries
                      </p>
                    </div>
                  </div>
                  <p className="text-base font-bold text-gray-900">
                    {fmt(d.outsideCollections.total)}
                  </p>
                </div>

                {/* outside payment breakdown pills */}
                <div className="flex items-center gap-2 px-4 py-2.5 border-b border-gray-50 flex-wrap">
                  {Object.entries(d.outsideCollections.paymentBreakdown)
                    .filter(([, amount]) => amount > 0)
                    .map(([mode, amount]) => {
                      const cfg = {
                        cash: {
                          color: "emerald",
                          icon: Banknote,
                          label: "Cash",
                        },
                        card: {
                          color: "blue",
                          icon: CreditCard,
                          label: "Card",
                        },
                        upi: { color: "violet", icon: Layers, label: "UPI" },
                        other: { color: "slate", icon: Wallet, label: "Other" },
                      }[mode] || {
                        color: "slate",
                        icon: Wallet,
                        label: "Other",
                      };

                      const Icon = cfg.icon;

                      console.log(amount);
                      return (
                        <StatusPill
                          key={mode}
                          icon={Icon}
                          label={cfg.label}
                          count={fmt(amount)}
                          color={cfg.color}
                        />
                      );
                    })}
                </div>

                {/* items */}
                <div className="divide-y divide-gray-50">
                  {[...d.outsideCollections.items]
                    .sort(
                      (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
                    )
                    .map((item) => {
                      const isCancelled = item.status === "cancelled";

                      return (
                        <div
                          key={item.id}
                          className={`px-4 py-3 ${isCancelled ? "bg-red-50/40" : ""}`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-start gap-2.5 min-w-0">
                              <div className="min-w-0">
                                <p
                                  className={`text-xs font-semibold ${isCancelled ? "text-red-400 line-through" : "text-gray-800"}`}
                                >
                                  {item.reason}
                                </p>
                                {item.description && (
                                  <p className="text-[10px] text-gray-400 mt-0.5">
                                    {item.description}
                                  </p>
                                )}
                                <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                                  <PaymentTypeBadge
                                    type={item?.paymentMode}
                                    size="sm"
                                  />

                                  {isCancelled && (
                                    <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-red-50 text-red-500 border border-red-100">
                                      Cancelled
                                    </span>
                                  )}
                                  <span className="text-[10px] text-gray-400">
                                    by {item.collectedByName}
                                  </span>
                                  <span className="text-[10px] text-gray-400">
                                    ·
                                  </span>
                                  <span className="text-[10px] text-gray-400">
                                    {formatDate(item.createdAt, "longTime")}
                                  </span>
                                </div>
                                {isCancelled && item.cancelReason && (
                                  <p className="text-[10px] text-red-400 mt-1">
                                    Reason: {item.cancelReason}
                                  </p>
                                )}
                              </div>
                            </div>
                            <p
                              className={`text-sm font-bold shrink-0 ${isCancelled ? "text-red-400 line-through" : "text-gray-900"}`}
                            >
                              {fmt(item.amount)}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}

            {/* deductions */}
            <div className="bg-white border border-gray-100 rounded-2xl p-4">
              <Label>Deductions & exceptions</Label>
              {[
                {
                  icon: Tag,
                  label: "Discount",
                  value: `− ${fmt(d.totalDiscounts)}`,
                  cls: "text-red-500",
                  sub: null,
                },
                {
                  icon: AlertCircle,
                  label: "NC amount",
                  value: `− ${fmt(collection.totalNC)}`,
                  cls: "text-amber-500",
                  sub: `${collection.ncOrderCount} orders`,
                },
                {
                  icon: SlidersHorizontal,
                  label: "Adjustments",
                  value: `− ${fmt(collection.totalAdjustment)}`,
                  cls: "text-blue-500",
                  sub: `${collection.adjustmentCount} entries`,
                },
              ].map(({ icon: Icon, label, value, cls, sub }) => (
                <div
                  key={label}
                  className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0"
                >
                  <div className="flex items-center gap-2">
                    <Icon size={13} className="text-gray-400 shrink-0" />
                    <span className="text-xs text-gray-600">{label}</span>
                    {sub && (
                      <span className="text-[10px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-full">
                        {sub}
                      </span>
                    )}
                  </div>
                  <span className={`text-xs font-semibold ${cls}`}>
                    {value}
                  </span>
                </div>
              ))}
              {collection.totalDue > 0 && (
                <div className="mt-3 flex items-center justify-between rounded-xl bg-red-50 border border-red-100 px-3.5 py-2.5">
                  <div className="flex items-center gap-2">
                    <AlertTriangle
                      size={13}
                      className="text-red-400 shrink-0"
                    />
                    <span className="text-xs text-red-500 font-medium">
                      Pending due
                    </span>
                  </div>
                  <span className="text-xs font-bold text-red-600">
                    {fmt(collection.totalDue)}
                  </span>
                </div>
              )}
            </div>

            {/* cashier breakdown */}
            {cashierBreakdown?.map((c, i) => (
              <div
                key={c.cashierId}
                className="bg-white border border-gray-100 rounded-2xl p-4"
              >
                <div className="flex items-center gap-2 mb-3">
                  <UserAvatar name={c.cashierName} size="sm" />
                  <div>
                    <p className="text-xs font-semibold text-gray-800">
                      {c.cashierName}
                    </p>
                    <p className="text-[10px] text-gray-400">
                      {c.orderCount} orders
                    </p>
                  </div>
                  <p className="ml-auto text-sm font-bold text-gray-900">
                    {fmt(c.totalCollection)}
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <StatChip
                    label="Fresh"
                    value={fmt(c.freshCollection)}
                    accent="green"
                  />
                  <StatChip
                    label="From due"
                    value={fmt(c.dueCollection)}
                    accent="violet"
                  />
                  <StatChip
                    label="Total"
                    value={fmt(c.totalCollection)}
                    accent="blue"
                  />
                </div>
              </div>
            ))}
          </>
        )}

        {/* ── ORDERS ── */}
        {activeTab === "orders" && (
          <div className="space-y-2">
            {orders?.length > 0 ? (
              [...orders]
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .map((o) => <OrderCard key={o.id} order={o} />)
            ) : (
              <NoDataFound icon={Receipt} title="No orders found" />
            )}
          </div>
        )}

        {/* ── STAFF ── */}
        {activeTab === "staff" && (
          <div className="space-y-2">
            {staffActivity
              ?.filter(
                (s) =>
                  s.ordersCreated > 0 ||
                  s.ordersHandled > 0 ||
                  s.amountCollected > 0,
              )
              .map((s, i) => (
                <div
                  key={s.userId}
                  className="bg-white border border-gray-100 rounded-2xl p-4"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <UserAvatar name={s.userName} size="sm" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-gray-800">
                          {s.userName}
                        </p>
                        <RoleBadge role={s.role} size="sm" />
                      </div>
                      <p className="text-xs text-gray-400">
                        {s.ordersCreated} created · {s.ordersCancelled}{" "}
                        cancelled
                      </p>
                    </div>
                    {s.amountCollected > 0 && (
                      <p className="text-sm font-bold text-gray-900 shrink-0">
                        {fmt(s.amountCollected)}
                      </p>
                    )}
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <StatChip
                      label="Handled"
                      value={fmtN(s.ordersHandled)}
                      accent="blue"
                    />
                    <StatChip
                      label="Sales"
                      value={fmt(s.orderSales)}
                      accent="green"
                    />
                    {s.dueCollected > 0 && (
                      <StatChip
                        label="Due collected"
                        value={fmt(s.dueCollected)}
                        accent="violet"
                      />
                    )}
                  </div>
                </div>
              ))}
          </div>
        )}

        {/* ── DUE COLLECTIONS ── */}
        {activeTab === "dues" && (
          <>
            <div className="bg-white border border-gray-100 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-3">
                <Label>Due collections</Label>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-gray-400">
                    {dueCollections?.count} orders
                  </span>
                  <span className="text-sm font-bold text-emerald-600">
                    {fmt(dueCollections?.totalCollected)}
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                {dueCollections?.orders?.length ? (
                  dueCollections.orders.map((o) => (
                    <div
                      key={o.paymentId}
                      className="bg-gray-50 rounded-xl px-3 py-3"
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div>
                          <p className="text-xs font-semibold text-gray-800">
                            {o.orderNumber}
                          </p>
                          <p className="text-[10px] text-gray-400">
                            {o.customerName} · {o.customerPhone}
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-sm font-bold text-emerald-600">
                            {fmt(o.collectedAmount)}
                          </p>
                          <p className="text-[10px] text-gray-400 capitalize">
                            {o.paymentMode}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-gray-400">
                          Order total: {fmt(o.orderTotal)}
                        </span>
                        <span className="text-[10px] text-gray-400">
                          by {o.collectedByName} ·{" "}
                          {formatDate(o.createdAt, "time")}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6 text-gray-400 text-xs">
                    No collections recorded
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* ── TRANSACTIONS ── */}
        {activeTab === "transactions" && (
          <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-50">
              <Label>All transactions</Label>
            </div>
            {transactions?.map((t, i) => {
              const isCredit = t.amount > 0;
              const Icon =
                t.type === "opening"
                  ? ArrowDownLeft
                  : t.type === "closing"
                    ? ArrowUpRight
                    : ArrowRightLeft;
              return (
                <div
                  key={t.id}
                  className="flex items-center gap-3 px-4 py-3 border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors"
                >
                  <div
                    className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 ${isCredit ? "bg-emerald-50" : "bg-red-50"}`}
                  >
                    <Icon
                      size={13}
                      className={isCredit ? "text-emerald-600" : "text-red-500"}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-800">
                      {t.description}
                    </p>
                    <p className="text-[10px] text-gray-400">
                      {t.userName} · {formatDate(t.createdAt, "longTime")}
                    </p>
                    {t.notes && (
                      <p className="text-[10px] text-gray-500 mt-0.5">
                        {t.notes}
                      </p>
                    )}
                  </div>
                  <div className="text-right shrink-0">
                    <p
                      className={`text-sm font-bold ${isCredit ? "text-emerald-600" : "text-red-500"}`}
                    >
                      {isCredit ? "+" : ""}
                      {fmt(t.amount)}
                    </p>
                    <p className="text-[10px] text-gray-400">
                      bal {fmt(t.balanceAfter)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ShiftHistoryDetailsPage;
