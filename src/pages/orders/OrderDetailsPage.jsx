import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useQueryParams } from "../../hooks/useQueryParams";
import { fetchOrderByIdApi } from "../../redux/slices/orderSlice";
import {
  User,
  Building2,
  Receipt,
  Tag,
  AlertCircle,
  SlidersHorizontal,
  AlertTriangle,
  Banknote,
  CreditCard,
  Layers,
  Package,
  FileText,
  Percent,
  ArrowLeft,
  Star,
  Info,
  Wallet,
  ReceiptIndianRupee,
} from "lucide-react";
import OrderBadge from "../../partial/order/OrderBadge";
import StatusPill from "../../components/StatusPill";
import FoodTypeIcon from "../../partial/common/FoodTypeIcon";
import { formatNumber } from "../../utils/numberFormatter";
import { formatDate } from "../../utils/dateFormatter";
import OrderDetailsSkeleton from "../../partial/order/OrderDetailsSkeleton";
import NoDataFound from "../../layout/NoDataFound";

/* ── helpers ── */
const fmt = (n) => formatNumber(n, true);

const fmtN = (n) => formatNumber(n);

const payIcon = {
  cash: Banknote,
  card: CreditCard,
  upi: Layers,
  wallet: Wallet,
};

const Section = ({
  title,
  icon: Icon,
  iconBg = "bg-gray-100 border-gray-200",
  iconColor = "text-gray-500",
  children,
  noPad = false,
}) => (
  <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
    <div className="flex items-center gap-2.5 px-4 py-3.5 border-b border-gray-50">
      <div
        className={`w-7 h-7 rounded-xl flex items-center justify-center border ${iconBg}`}
      >
        <Icon size={13} className={iconColor} />
      </div>
      <p className="text-sm font-semibold text-gray-800">{title}</p>
    </div>
    <div className={noPad ? "" : "px-4 py-3"}>{children}</div>
  </div>
);

const InfoRow = ({
  label,
  value,
  valueClass = "text-gray-800",
  mono = false,
}) => (
  <div className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
    <span className="text-xs text-gray-400">{label}</span>
    <span
      className={`text-xs font-medium ${valueClass} ${mono ? "font-mono" : ""}`}
    >
      {value || "—"}
    </span>
  </div>
);

/* ── main page ── */
const OrderDetailsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { orderId } = useQueryParams();
  const { orderDetails: d, isFetchingOrderDetails } = useSelector(
    (s) => s.order,
  );

  useEffect(() => {
    if (orderId) dispatch(fetchOrderByIdApi(orderId));
  }, [orderId]);

  /* loading */
  if (isFetchingOrderDetails) return <OrderDetailsSkeleton />;

  if (!d)
    return (
      <NoDataFound
        icon={ReceiptIndianRupee}
        title="Order not found"
        description=""
      />
    );

  const isCancelled = d?.status === "cancelled";
  const hasDiscount = d?.discountAmount > 0;
  const hasNC = d?.isNC || d?.ncAmount > 0 || d?.items?.some((i) => i.isNC);
  const hasDue = d?.dueAmount > 0;
  const hasAdj = d?.isAdjustment && d?.adjustmentAmount > 0;

  return (
    <div className="space-y-3">
      {/* ── Hero ── */}
      <div
        className={`border-b px-4 md:px-6 py-5 rounded-lg ${isCancelled ? "bg-red-50/40 border-red-100" : "bg-white border-gray-100"}`}
      >
        {/* back + order number row */}
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() => navigate(-1)}
            className="w-8 h-8 rounded-xl bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors shrink-0"
          >
            <ArrowLeft size={14} className="text-gray-500" />
          </button>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="text-base font-bold text-gray-900 font-mono">
                {d.orderNumber}
              </p>
              {d.isPriority && (
                <StatusPill
                  icon={Star}
                  label={"Priority"}
                  color="amber"
                  size="sm"
                />
              )}
            </div>
            <p className="text-xs text-gray-400 mt-0.5">
              {formatDate(d.createdAt, "long")}
            </p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-2xl font-bold text-gray-900">
              {fmt(d.totalAmount)}
            </p>
            {d.roundOff !== 0 && (
              <p className="text-[10px] text-gray-400">
                incl. {d.roundOff > 0 ? "+" : ""}
                {d.roundOff?.toFixed(2)} round off
              </p>
            )}
          </div>
        </div>

        {/* status + type row */}
        <div className="flex items-center gap-2 flex-wrap mb-4">
          <OrderBadge type="type" value={d.orderType} />
          <OrderBadge type="status" value={d.status} />
          <OrderBadge type="payment" value={d.paymentStatus} />

          {d.tableName && (
            <StatusPill
              label={`${d.floorName} · ${d.tableName}`}
              color="blue"
              size="sm"
            />
          )}
          {hasNC && (
            <StatusPill icon={AlertCircle} label="NC" color="amber" size="sm" />
          )}
          {hasDue && (
            <StatusPill icon={AlertCircle} label="Due" color="red" size="sm" />
          )}
          {hasAdj && (
            <StatusPill
              icon={SlidersHorizontal}
              label="Adj"
              color="blue"
              size="sm"
            />
          )}
          {hasDiscount && (
            <StatusPill icon={Tag} label="Discount" color="emerald" size="sm" />
          )}
        </div>

        {/* quick stat chips */}
        <div className="grid grid-cols-4 gap-2">
          {[
            {
              label: "Items",
              value: `${d.itemCount} (qty ${d.totalQuantity})`,
            },
            { label: "Guests", value: fmtN(d.guestCount) },
            {
              label: "Paid",
              value: fmt(d.paidAmount),
              red: d.paidAmount === 0 && d.totalAmount > 0,
            },
            { label: "Due", value: fmt(d.dueAmount), red: d.dueAmount > 0 },
          ].map(({ label, value, red }) => (
            <div
              key={label}
              className="bg-white border border-gray-100 rounded-xl px-3 py-2.5 text-center"
            >
              <p className="text-[10px] text-gray-400 mb-0.5">{label}</p>
              <p
                className={`text-xs font-bold ${red ? "text-red-500" : "text-gray-900"}`}
              >
                {value}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Content ── */}
      <div className="space-y-3">
        {/* ── Items ── */}
        <Section
          title={`Order items (${d.itemCount})`}
          icon={Package}
          iconBg="bg-violet-50 border-violet-100"
          iconColor="text-violet-600"
          noPad
        >
          <div className="divide-y divide-gray-50">
            {d.items && d.items.length > 0 ? (
              d.items.map((item) => (
                <div
                  key={item.id}
                  className={`px-4 py-3 ${item.isNC ? "bg-amber-50/40" : ""}`}
                >
                  <div className="flex items-start gap-2.5">
                    <FoodTypeIcon type={item.itemType} />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-gray-800 leading-tight">
                            {item.itemName || "—"}
                          </p>

                          <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                            {item.variantName && (
                              <span className="text-[10px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-full">
                                {item.variantName}
                              </span>
                            )}

                            {item.categoryName && (
                              <span className="text-[10px] text-gray-400">
                                {item.categoryName}
                              </span>
                            )}

                            {item.stationName && (
                              <span className="text-[10px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-full">
                                {item.stationName}
                              </span>
                            )}

                            {item.isNC && (
                              <StatusPill
                                icon={AlertCircle}
                                label={" NC"}
                                color="amber"
                                size="sm"
                              />
                            )}

                            {item.status === "served" && (
                              <span className="text-[10px] text-emerald-600 bg-emerald-50 border border-emerald-100 px-1.5 py-0.5 rounded-full">
                                Served
                              </span>
                            )}
                          </div>

                          {item.specialInstructions && (
                            <p className="text-[10px] text-blue-500 mt-1 italic">
                              "{item.specialInstructions}"
                            </p>
                          )}
                        </div>

                        <div className="text-right shrink-0">
                          <p className="text-sm font-bold text-gray-900">
                            {fmt(item.totalPrice || 0)}
                          </p>
                          <p className="text-[10px] text-gray-400">
                            {fmt(item.unitPrice || 0)} × {item.quantity || 0}
                          </p>
                        </div>
                      </div>

                      {/* item tax */}
                      {item.taxAmount > 0 && (
                        <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                          {(item.taxDetails || []).map((t) => (
                            <span
                              key={t.componentCode}
                              className="text-[9px] text-gray-400 bg-gray-50 border border-gray-100 px-1.5 py-0.5 rounded-full"
                            >
                              {t.componentName}: {fmt(t.amount)}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <NoDataFound title="No items found" description="" size="sm" />
            )}
          </div>
        </Section>

        {/* ── Bill breakdown ── */}
        <Section
          title="Bill breakdown"
          icon={ReceiptIndianRupee}
          iconBg="bg-blue-50 border-blue-100"
          iconColor="text-blue-600"
        >
          <InfoRow label="Subtotal" value={fmt(d.subtotal)} />
          {hasDiscount && (
            <InfoRow
              label="Discount"
              value={`− ${fmt(d.discountAmount)}`}
              valueClass="text-red-500"
            />
          )}
          {d.taxAmount > 0 && (
            <InfoRow
              label="Tax"
              value={`+ ${fmt(d.taxAmount)}`}
              valueClass="text-gray-600"
            />
          )}
          {d.serviceCharge > 0 && (
            <InfoRow
              label="Service charge"
              value={`+ ${fmt(d.serviceCharge)}`}
            />
          )}
          {d.packagingCharge > 0 && (
            <InfoRow label="Packaging" value={`+ ${fmt(d.packagingCharge)}`} />
          )}
          {d.deliveryCharge > 0 && (
            <InfoRow
              label="Delivery charge"
              value={`+ ${fmt(d.deliveryCharge)}`}
            />
          )}
          {d.roundOff !== 0 && (
            <InfoRow
              label="Round off"
              value={(d.roundOff > 0 ? "+" : "") + fmt(d.roundOff)}
              valueClass="text-gray-400"
            />
          )}
          {hasNC && d.ncAmount > 0 && (
            <InfoRow
              label="NC amount"
              value={`− ${fmt(d.ncAmount)}`}
              valueClass="text-amber-500"
            />
          )}
          {hasAdj && (
            <InfoRow
              label="Adjustment"
              value={`− ${fmt(d.adjustmentAmount)}`}
              valueClass="text-blue-500"
            />
          )}
          <div className="flex items-center justify-between pt-2.5 mt-1 border-t border-gray-100">
            <span className="text-sm font-bold text-gray-900">Total</span>
            <span className="text-base font-bold text-gray-900">
              {fmt(d.totalAmount)}
            </span>
          </div>
          <div className="flex items-center justify-between py-1.5">
            <span className="text-xs text-gray-500">Paid</span>
            <span className="text-xs font-semibold text-emerald-600">
              {fmt(d.paidAmount)}
            </span>
          </div>
          {hasDue && (
            <div className="flex items-center justify-between py-1.5">
              <span className="text-xs text-gray-500">Balance due</span>
              <span className="text-xs font-bold text-red-500">
                {fmt(d.dueAmount)}
              </span>
            </div>
          )}
          {hasDue && (
            <div className="mt-2 flex items-center gap-2 bg-red-50 border border-red-100 rounded-xl px-3 py-2">
              <AlertTriangle size={12} className="text-red-400 shrink-0" />
              <span className="text-xs text-red-500 font-medium">
                {fmt(d.dueAmount)} pending collection
              </span>
            </div>
          )}
        </Section>

        {/* ── Tax breakup ── */}
        {d.taxBreakup && Object.keys(d.taxBreakup).length > 0 && (
          <Section
            title="Tax breakup"
            icon={Percent}
            iconBg="bg-gray-100 border-gray-200"
            iconColor="text-gray-500"
          >
            {Object.entries(d.taxBreakup).map(([key, t]) => (
              <div
                key={key}
                className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0"
              >
                <div>
                  <p className="text-xs text-gray-700 font-medium">{t.name}</p>
                  <p className="text-[10px] text-gray-400">
                    Taxable: {fmt(t.taxableAmount)} @ {t.rate}%
                  </p>
                </div>
                <span className="text-xs font-semibold text-gray-800">
                  {fmt(t.taxAmount)}
                </span>
              </div>
            ))}
            <div className="flex items-center justify-between pt-2 mt-1 border-t border-gray-100">
              <span className="text-xs font-semibold text-gray-700">
                Total tax
              </span>
              <span className="text-xs font-bold text-gray-900">
                {fmt(d.totalTax)}
              </span>
            </div>
          </Section>
        )}

        {/* ── Discounts ── */}
        {d.discounts?.length > 0 && (
          <Section
            title="Discounts applied"
            icon={Tag}
            iconBg="bg-emerald-50 border-emerald-100"
            iconColor="text-emerald-600"
          >
            {d.discounts.map((disc) => (
              <div
                key={disc.id}
                className="flex items-start justify-between py-2.5 border-b border-gray-50 last:border-0"
              >
                <div>
                  <p className="text-xs font-semibold text-gray-800">
                    {disc.discountName}
                  </p>
                  <p className="text-[10px] text-gray-400 mt-0.5 capitalize">
                    {disc.discountType === "percentage"
                      ? `${disc.discountValue}% on ${disc.appliedOn}`
                      : `Flat ${fmt(disc.discountValue)}`}
                    {disc.createdByName && ` · by ${disc.createdByName}`}
                  </p>
                  {disc.approvedByName && (
                    <p className="text-[10px] text-emerald-600 mt-0.5">
                      Approved by {disc.approvedByName}
                    </p>
                  )}
                </div>
                <span className="text-xs font-bold text-red-500 shrink-0 ml-3">
                  − {fmt(disc.discountAmount)}
                </span>
              </div>
            ))}
          </Section>
        )}

        {/* ── NC details ── */}
        {hasNC && (
          <Section
            title="No charge details"
            icon={AlertCircle}
            iconBg="bg-amber-50 border-amber-100"
            iconColor="text-amber-600"
          >
            {d.isNC && (
              <div className="bg-amber-50 border border-amber-100 rounded-xl px-3 py-2.5 mb-3">
                <p className="text-xs font-semibold text-amber-700">
                  Full order marked as NC
                </p>
                {d.ncReason && (
                  <p className="text-xs text-amber-600 mt-0.5">{d.ncReason}</p>
                )}
                <p className="text-xs font-bold text-amber-700 mt-1">
                  Amount: {fmt(d.ncAmount)}
                </p>
              </div>
            )}
            {d.items
              ?.filter((i) => i.isNC)
              .map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0"
                >
                  <div className="flex items-center gap-2">
                    <FoodTypeIcon type={item.itemType} />
                    <div>
                      <p className="text-xs font-medium text-gray-800">
                        {item.itemName}
                      </p>
                      {item.ncReason && (
                        <p className="text-[10px] text-amber-500">
                          {item.ncReason}
                        </p>
                      )}
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-amber-500">
                    − {fmt(item.ncAmount)}
                  </span>
                </div>
              ))}
          </Section>
        )}

        {/* ── Payments ── */}
        {d.payments?.length > 0 && (
          <Section
            title="Payments"
            icon={Banknote}
            iconBg="bg-emerald-50 border-emerald-100"
            iconColor="text-emerald-600"
          >
            {d.payments.map((p) => {
              const PayIcon = payIcon[p.paymentMode] || Banknote;
              return (
                <div
                  key={p.id}
                  className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0">
                      <PayIcon size={13} className="text-gray-500" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-800 capitalize">
                        {p.paymentMode}
                      </p>
                      <p className="text-[10px] text-gray-400">
                        {formatDate(p.createdAt, "long")}
                        {p.receivedByName && ` · ${p.receivedByName}`}
                        {p.isDueCollection && " · due collection"}
                      </p>
                      {p.referenceNumber && (
                        <p className="text-[10px] text-gray-400 font-mono">
                          Ref: {p.referenceNumber}
                        </p>
                      )}
                      {p.transactionId && (
                        <p className="text-[10px] text-gray-400 font-mono">
                          TxnID: {p.transactionId}
                        </p>
                      )}
                      {p.upiId && (
                        <p className="text-[10px] text-gray-400">
                          UPI: {p.upiId}
                        </p>
                      )}
                      {p.cardLastFour && (
                        <p className="text-[10px] text-gray-400">
                          {p.cardType} ···{p.cardLastFour}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p
                      className={`text-sm font-bold ${p.amount > 0 ? "text-emerald-600" : "text-gray-400"}`}
                    >
                      {fmt(p.amount)}
                    </p>
                    <OrderBadge type="payment" value={p.status} size="sm" />
                  </div>
                </div>
              );
            })}
          </Section>
        )}

        {/* ── KOTs ── */}
        {d.kots?.length > 0 && (
          <Section
            title={`KOTs (${d.kots.length})`}
            icon={FileText}
            iconBg="bg-gray-100 border-gray-200"
            iconColor="text-gray-500"
          >
            {d.kots.map((kot) => {
              return (
                <div
                  key={kot.id}
                  className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0"
                >
                  <div>
                    <p className="text-xs font-semibold text-gray-800 font-mono">
                      {kot.kotNumber}
                    </p>
                    <p className="text-[10px] text-gray-400">
                      {kot.stationName} · {formatDate(kot.createdAt, "long")}
                    </p>
                  </div>
                  <OrderBadge type="status" value={kot.status} size="sm" />
                </div>
              );
            })}
          </Section>
        )}

        {/* ── Invoice ── */}
        {d.invoice && (
          <Section
            title="Invoice"
            icon={ReceiptIndianRupee}
            iconBg="bg-blue-50 border-blue-100"
            iconColor="text-blue-600"
          >
            <InfoRow
              label="Invoice number"
              value={d.invoice.invoiceNumber}
              mono
            />
            <InfoRow
              label="Invoice date"
              value={`${d.invoice.invoiceDate} ${d.invoice.invoiceTime}`}
            />
            <InfoRow label="Generated by" value={d.invoice.generatedByName} />
            <InfoRow
              label="Payment status"
              value={
                <OrderBadge type="payment" value={d.paymentStatus} size="sm" />
              }
              valueClass={d.paymentStatus}
            />
            {d.invoice.amountInWords && (
              <div className="mt-2 bg-gray-50 rounded-xl px-3 py-2">
                <p className="text-[10px] text-gray-400 mb-0.5">
                  Amount in words
                </p>
                <p className="text-xs text-gray-700 italic">
                  {d.invoice.amountInWords}
                </p>
              </div>
            )}
            {d.invoice.notes && (
              <div className="mt-2 bg-blue-50 border border-blue-100 rounded-xl px-3 py-2">
                <p className="text-xs text-blue-700">{d.invoice.notes}</p>
              </div>
            )}
          </Section>
        )}

        {/* ── Customer & outlet ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* customer */}
          {(d.customerName || d.customerPhone) && (
            <Section
              title="Customer"
              icon={User}
              iconBg="bg-gray-100 border-gray-200"
              iconColor="text-gray-500"
            >
              {d.customerName && (
                <InfoRow label="Name" value={d.customerName} />
              )}
              {d.customerPhone && (
                <InfoRow label="Phone" value={d.customerPhone} mono />
              )}
              {d.customerEmail && (
                <InfoRow label="Email" value={d.customerEmail} />
              )}
              {d.customerGstin && (
                <InfoRow label="GSTIN" value={d.customerGstin} mono />
              )}
            </Section>
          )}

          {/* outlet */}
          <Section
            title="Outlet"
            icon={Building2}
            iconBg="bg-gray-100 border-gray-200"
            iconColor="text-gray-500"
          >
            <InfoRow label="Name" value={d.outletName} />
            {d.outletGstin && (
              <InfoRow label="GSTIN" value={d.outletGstin} mono />
            )}
            {d.outletAddress && (
              <InfoRow
                label="Address"
                value={`${d.outletAddress}, ${d.outletCity} ${d.outletState}`}
              />
            )}
          </Section>
        </div>

        {/* ── Order info ── */}
        <Section
          title="Order info"
          icon={Info}
          iconBg="bg-gray-100 border-gray-200"
          iconColor="text-gray-500"
        >
          <InfoRow label="Order ID" value={`#${d.id}`} mono />
          <InfoRow label="Created by" value={d.createdBy?.name} />
          <InfoRow label="Created at" value={formatDate(d.createdAt, "long")} />
          <InfoRow label="Updated at" value={formatDate(d.updatedAt, "long")} />
          <InfoRow label="Floor" value={d.floorName} />
          {d.sectionName && <InfoRow label="Section" value={d.sectionName} />}
          {d.tableName && (
            <InfoRow
              label="Table"
              value={`${d.tableName} (cap. ${d.tableCapacity})`}
            />
          )}
        </Section>

        <p className="text-center text-[10px] text-gray-300 pb-4">
          {d.orderNumber} · {d.outletName}
        </p>
      </div>
    </div>
  );
};

export default OrderDetailsPage;
