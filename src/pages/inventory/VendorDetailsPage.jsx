import React, { useEffect, useState } from "react";
import PageHeader from "../../layout/PageHeader";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useQueryParams } from "../../hooks/useQueryParams";
import { fetchVendorById } from "../../redux/slices/vendorSlice";
import {
  User,
  Phone,
  Mail,
  Building2,
  CreditCard,
  Hash,
  Calendar,
  ShoppingCart,
  IndianRupee,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  Landmark,
  FileText,
  Clock,
  Package,
  ChevronRight,
  Banknote,
  Smartphone,
  ArrowLeft,
} from "lucide-react";
import { formatDate } from "../../utils/dateFormatter";
import { formatNumber, num } from "../../utils/numberFormatter";
import InventoryBadge from "../../partial/inventory/inventory/InventoryBadge";
import MetricPanel from "../../partial/report/daily-sales-report/MetricPanel";
import StatCard from "../../components/StatCard";
import Tabs from "../../components/Tabs";
import LoadingOverlay from "../../components/LoadingOverlay";
import NoDataFound from "../../layout/NoDataFound";

const PAY_METHOD = {
  cash: { icon: Banknote, label: "Cash" },
  upi: { icon: Smartphone, label: "UPI" },
  card: { icon: CreditCard, label: "Card" },
  bank: { icon: Landmark, label: "Bank" },
  cheque: { icon: FileText, label: "Cheque" },
};

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function Skeleton() {
  return (
    <div className="animate-pulse space-y-5">
      <div className="h-[160px] rounded-2xl bg-slate-200" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-[88px] rounded-2xl bg-slate-100" />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <div className="h-[200px] rounded-2xl bg-slate-100" />
          <div className="h-[280px] rounded-2xl bg-slate-100" />
        </div>
        <div className="space-y-4">
          <div className="h-[180px] rounded-2xl bg-slate-100" />
          <div className="h-[200px] rounded-2xl bg-slate-100" />
        </div>
      </div>
    </div>
  );
}

// ─── Info row ─────────────────────────────────────────────────────────────────
function InfoRow({ icon: Icon, label, value, mono = false, last = false }) {
  if (!value && value !== 0) return null;
  return (
    <div
      className={`flex items-center gap-3 py-2.5 ${!last ? "border-b border-slate-100" : ""}`}
    >
      <div className="w-6 h-6 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
        <Icon size={11} className="text-slate-500" strokeWidth={2} />
      </div>
      <span className="text-[12px] text-slate-500 font-medium flex-1">
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

// ─── Purchase row ─────────────────────────────────────────────────────────────
function PurchaseRow({ p, navigate, last }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={!last ? "border-b border-slate-100" : ""}>
      <div
        className="flex items-center gap-3 px-5 py-3.5 hover:bg-slate-50 transition-colors duration-100 cursor-pointer"
        onClick={() => setOpen((o) => !o)}
      >
        {/* Date + number */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-0.5">
            <p className="text-[13px] font-bold text-slate-800">
              {p.purchaseNumber}
            </p>
            <InventoryBadge type="payment" value={p.paymentStatus} size="sm" />
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
            <span>{formatDate(p.purchaseDate, "long")}</span>
            <span>·</span>
            <span className="font-mono">{p.invoiceNumber}</span>
            <span>·</span>
            <span>
              {p.itemCount} item{p.itemCount !== 1 ? "s" : ""}
            </span>
          </div>
        </div>
        {/* Paid / Due */}
        <div className="text-right flex-shrink-0">
          <p className="text-[14px] font-black text-slate-900 tabular-nums">
            {formatNumber(p.totalAmount, true)}
          </p>
          {num(p.dueAmount) > 0 && (
            <p className="text-[10px] font-bold text-rose-600 tabular-nums mt-0.5">
              {formatNumber(p.dueAmount, true)} due
            </p>
          )}
          {num(p.dueAmount) === 0 && (
            <p className="text-[10px] font-bold text-emerald-600 mt-0.5">
              Paid
            </p>
          )}
        </div>
        <ChevronRight
          size={14}
          className={`text-slate-300 flex-shrink-0 transition-transform duration-200 ${open ? "rotate-90" : ""}`}
          strokeWidth={2}
        />
      </div>

      {/* Expanded items */}
      {open && (
        <div className="px-5 pb-3 bg-slate-50">
          <div className="rounded-xl border border-slate-200 overflow-hidden">
            {p.items.map((item, i) => (
              <div
                key={item.id}
                className={`flex items-center gap-3 px-3.5 py-2.5 ${i < p.items.length - 1 ? "border-b border-slate-100" : ""} bg-white`}
              >
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] font-bold text-slate-800">
                    {item.itemName}
                  </p>
                  <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                    {item.itemSku}
                  </p>
                </div>
                <div className="text-right text-[11px] text-slate-500">
                  {item.quantity} {item.unitAbbreviation} ×{" "}
                  {formatNumber(item.pricePerUnit, true)}
                </div>
                <div className="text-right flex-shrink-0 w-16">
                  <p className="text-[12px] font-bold text-slate-800 tabular-nums">
                    {formatNumber(item.totalCost, true)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
const VendorDetailsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("overview");

  const { vendorId } = useQueryParams();
  const { isFetchingVendorDetails, vendorDetails } = useSelector(
    (s) => s.vendor,
  );

  useEffect(() => {
    if (vendorId) dispatch(fetchVendorById(vendorId));
  }, [vendorId]);

  const {
    vendor,
    financialSummary: fs,
    purchases,
    itemsSupplied = [],
    paymentHistory = [],
    outstandingPurchases = [],
  } = vendorDetails || {};
  const purchaseList = purchases?.data || [];

  const stats = [
    {
      icon: IndianRupee,
      label: "Total Purchased",
      value: formatNumber(fs?.totalPurchaseAmount, true),
      sub: "Lifetime spend",
      color: "slate",
      dark: true,
    },
    {
      icon: ShoppingCart,
      label: "Total Orders",
      value: num(fs?.totalPurchases),
      sub: "Purchase orders",
      color: "blue",
    },
    {
      icon: AlertTriangle,
      label: "Outstanding Due",
      value: formatNumber(fs?.totalDueAmount, true),
      sub: `${num(fs?.paymentBreakdown?.unpaid)} unpaid`,
      color: "red",
      dark: true,
    },
    {
      icon: TrendingUp,
      label: "Avg Order Value",
      value: formatNumber(fs?.avgPurchaseValue, true),
      sub: "Per purchase average",
      color: "green",
    },
  ];

  const TABS = [
    {
      id: "overview",
      label: "Overview",
    },
    {
      id: "purchases",
      label: "Purchases",
      count: purchaseList?.length || 0,
    },
    {
      id: "items",
      label: "Items Supplied",
      count: itemsSupplied?.length || 0,
    },
    {
      id: "payments",
      label: "Payments",
      count: paymentHistory?.length || 0,
    },
  ];

  if (isFetchingVendorDetails) return <LoadingOverlay />;

  return (
    <div className="space-y-5 pb-10">
      <PageHeader title="Vendor Details" showBackButton />

      {isFetchingVendorDetails && <Skeleton />}

      {/* HERO */}
      <div
        className="relative rounded-3xl overflow-hidden shadow-lg"
        style={{
          background:
            "linear-gradient(135deg, var(--color-primary-600), var(--color-primary-700))",
        }}
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
                {(vendor?.name || "V").charAt(0).toUpperCase()}
              </div>

              <div className="min-w-0">
                <h1 className="text-[20px] font-bold leading-tight truncate">
                  {vendor?.name}
                </h1>

                <div className="flex flex-wrap items-center gap-3 mt-1 text-[11px] text-white/75">
                  {vendor?.contactPerson && (
                    <span className="flex items-center gap-1">
                      <User size={11} className="text-white/50" />
                      {vendor.contactPerson}
                    </span>
                  )}

                  {vendor?.phone && (
                    <span className="flex items-center gap-1">
                      <Phone size={11} className="text-white/50" />
                      {vendor.phone}
                    </span>
                  )}

                  {vendor?.email && (
                    <span className="flex items-center gap-1">
                      <Mail size={11} className="text-white/50" />
                      {vendor.email}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Right Section */}
            <div className="sm:text-right flex-shrink-0">
              <p className="text-[9px] font-semibold text-white/70 uppercase tracking-wide">
                Total Purchases
              </p>

              <p className="text-[30px] sm:text-[34px] font-extrabold tabular-nums leading-none">
                {formatNumber(fs?.totalPurchaseAmount, true)}
              </p>

              <p className="text-[11px] text-white/70 mt-1">
                {num(fs?.totalPurchases)} orders · avg{" "}
                {formatNumber(fs?.avgPurchaseValue, true)}
              </p>
            </div>
          </div>

          {/* ── Metric Strip ── */}
          <div className="grid grid-cols-3 gap-3 mt-5">
            {[
              {
                label: "Total Paid",
                value: formatNumber(fs?.totalPaidAmount, true),
              },
              {
                label: "Total Due",
                value: formatNumber(fs?.totalDueAmount, true),
              },
              {
                label: "Last Purchase",
                value: fs?.lastPurchaseDate
                  ? formatDate(fs.lastPurchaseDate, "long")
                  : "—",
              },
            ].map(({ label, value }) => (
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

      {/* ── 4 KPI TILES ─────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats?.map((stat, index) => (
          <StatCard
            key={index}
            icon={stat.icon}
            title={stat.label}
            value={stat.value}
            subtitle={stat.sub}
            color={stat.color}
            variant="v9"
            mode={stat.dark ? "solid" : "light"}
          />
        ))}
      </div>

      {/* ── Tab switcher ── */}
      <Tabs
        tabs={TABS}
        active={activeTab}
        onChange={setActiveTab}
        variant="v2"
      />

      {/* ── OVERVIEW ── */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <MetricPanel icon={User} title="Vendor Info" noPad>
              <div className="px-5 py-1 pb-3">
                <InfoRow
                  icon={User}
                  label="Contact"
                  value={vendor?.contactPerson}
                />
                <InfoRow
                  icon={Phone}
                  label="Phone"
                  value={vendor?.phone}
                  mono
                />
                <InfoRow
                  icon={Phone}
                  label="Alt. Phone"
                  value={vendor?.alternatePhone}
                  mono
                />
                <InfoRow icon={Mail} label="Email" value={vendor?.email} />
                <InfoRow
                  icon={Hash}
                  label="Vendor ID"
                  value={`#${vendor?.id}`}
                  mono
                />
                <InfoRow
                  icon={Calendar}
                  label="Since"
                  value={
                    vendor?.createdAt
                      ? formatDate(vendor?.createdAt, "long")
                      : "—"
                  }
                  last
                />
              </div>
            </MetricPanel>
          </div>

          <div className="space-y-4">
            <MetricPanel icon={CreditCard} title="Payment Summary" noPad>
              <div className="px-5 py-3">
                {[
                  {
                    label: "Fully Paid",
                    v: num(fs?.paymentBreakdown?.fullyPaid),
                    color: "#10b981",
                  },
                  {
                    label: "Partial",
                    v: num(fs?.paymentBreakdown?.partialPaid),
                    color: "#f59e0b",
                  },
                  {
                    label: "Unpaid",
                    v: num(fs?.paymentBreakdown?.unpaid),
                    color: "#f43f5e",
                  },
                ].map(({ label, v, color }) => {
                  const total = num(fs?.totalPurchases) || 1;
                  const pct = (v / total) * 100;
                  return (
                    <div
                      key={label}
                      className="flex items-center gap-3 py-2 border-b border-slate-100 last:border-0"
                    >
                      <div
                        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                        style={{ background: color }}
                      />
                      <span className="text-[12px] font-medium text-slate-600 flex-1">
                        {label}
                      </span>
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{ width: `${pct}%`, background: color }}
                          />
                        </div>
                        <span className="text-[12px] font-bold text-slate-800 tabular-nums w-4">
                          {v}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="flex items-center justify-between gap-3 px-5 py-3 bg-slate-50 border-t border-slate-100">
                <span className="text-[11px] font-medium text-slate-500">
                  Credit Days
                </span>
                <span className="text-[12px] font-bold text-slate-800">
                  {num(vendor?.creditDays) > 0
                    ? `${vendor?.creditDays} days`
                    : "Immediate"}
                </span>
              </div>
            </MetricPanel>

            {vendor?.notes && (
              <MetricPanel icon={FileText} title="Notes" noPad>
                <div className="px-5 py-4">
                  <p className="text-[12px] text-slate-600 leading-relaxed">
                    {vendor?.notes}
                  </p>
                </div>
              </MetricPanel>
            )}
          </div>
        </div>
      )}

      {/* ── PURCHASES ── */}
      {activeTab === "purchases" && (
        <div className="space-y-4">
          {outstandingPurchases?.length > 0 && (
            <MetricPanel
              icon={AlertTriangle}
              title="Outstanding Dues"
              desc={`${outstandingPurchases?.length} unpaid · ${formatNumber(
                outstandingPurchases?.reduce(
                  (s, p) => s + num(p?.dueAmount),
                  0,
                ),
                true,
              )} total`}
              right={
                <span className="text-[11px] font-bold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200">
                  Needs Attention
                </span>
              }
              noPad
            >
              <div className="divide-y divide-slate-100">
                {outstandingPurchases?.map((p) => (
                  <div
                    key={p?.id}
                    className="flex items-center gap-3 px-5 py-3.5 hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-bold text-slate-800">
                        {p?.purchaseNumber}
                      </p>
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-0.5">
                        <span className="font-mono">{p?.invoiceNumber}</span>
                        <span>·</span>
                        <span>{formatDate(p?.purchaseDate, "long")}</span>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-[14px] font-black text-rose-600 tabular-nums">
                        {formatNumber(p?.dueAmount, true)}
                      </p>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        of {formatNumber(p?.totalAmount, true)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </MetricPanel>
          )}

          <MetricPanel
            icon={ShoppingCart}
            title="Purchase History"
            desc={`${purchaseList?.length} orders`}
            noPad
          >
            <div>
              {purchaseList?.length > 0 ? (
                purchaseList.map((p, i) => (
                  <PurchaseRow
                    key={p.id}
                    p={p}
                    navigate={navigate}
                    last={i === purchaseList.length - 1}
                  />
                ))
              ) : (
                <NoDataFound
                  icon={ShoppingCart}
                  title="No purchases yet"
                  size="sm"
                />
              )}
            </div>
          </MetricPanel>
        </div>
      )}

      {/* ── ITEMS SUPPLIED ── */}
      {activeTab === "items" && (
        <MetricPanel
          icon={Package}
          title="Items Supplied"
          desc={`${itemsSupplied.length} unique items`}
          noPad
        >
          <div className="divide-y divide-slate-100">
            {itemsSupplied?.length > 0 ? (
              itemsSupplied.map((item) => {
                const maxSpend = Math.max(
                  ...itemsSupplied.map((s) => num(s.totalSpent)),
                  1,
                );

                const pct = (num(item.totalSpent) / maxSpend) * 100;

                return (
                  <div
                    key={item.inventoryItemId}
                    className="flex items-center gap-3 px-5 py-3.5"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-bold text-slate-800">
                        {item.itemName}
                      </p>

                      <div className="flex items-center gap-1.5 mt-1">
                        <div className="flex-1 h-1 rounded-full bg-slate-100 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-primary-500 transition-all duration-700"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mt-1">
                        <span>
                          {item.purchaseCount} order
                          {item.purchaseCount !== 1 ? "s" : ""}
                        </span>
                        <span>·</span>
                        <span>
                          {num(item.totalQuantityPurchased)} {item.baseUnit}{" "}
                          total
                        </span>
                        <span>·</span>
                        <span>{item.categoryName}</span>
                      </div>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <p className="text-[14px] font-black text-slate-900 tabular-nums">
                        {formatNumber(item.totalSpent, true)}
                      </p>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        avg {formatNumber(item.avgPricePerUnit)}/{item.baseUnit}
                      </p>
                    </div>
                  </div>
                );
              })
            ) : (
              <NoDataFound
                icon={Package}
                title="No items supplied yet"
                size="sm"
              />
            )}
          </div>
        </MetricPanel>
      )}

      {/* ── PAYMENTS ── */}
      {activeTab === "payments" && (
        <div className="space-y-4">
          <MetricPanel
            icon={Landmark}
            title="Payment History"
            desc={`${paymentHistory?.length} transactions`}
            noPad
          >
            <div className="divide-y divide-slate-100">
              {paymentHistory?.length > 0 ? (
                paymentHistory.map((pay) => {
                  const m = PAY_METHOD[pay?.paymentMethod] || {
                    icon: IndianRupee,
                    label: pay?.paymentMethod,
                  };

                  const Icon = m.icon;

                  return (
                    <div
                      key={pay?.id}
                      className="flex items-center gap-3 px-5 py-3 hover:bg-slate-50 transition-colors"
                    >
                      <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                        <Icon
                          size={12}
                          className="text-slate-600"
                          strokeWidth={2}
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="text-[12px] font-bold text-slate-800">
                          {pay?.purchaseNumber}
                        </p>

                        <p className="text-[10px] text-slate-400 mt-0.5">
                          {formatDate(pay?.paymentDate, "long")} · {m.label}
                          {pay?.paymentReference &&
                            ` · ${pay?.paymentReference}`}
                        </p>

                        {pay?.notes && (
                          <p className="text-[10px] text-slate-400 mt-0.5 italic truncate">
                            {pay?.notes}
                          </p>
                        )}
                      </div>

                      <p className="text-[13px] font-black text-emerald-600 tabular-nums flex-shrink-0">
                        +{formatNumber(pay?.amount, true)}
                      </p>
                    </div>
                  );
                })
              ) : (
                <NoDataFound
                  icon={Landmark}
                  title="No payment history"
                  size="sm"
                />
              )}
            </div>
          </MetricPanel>

          {(vendor?.gstNumber || vendor?.panNumber || vendor?.bankName) && (
            <MetricPanel icon={FileText} title="Financial Details" noPad>
              <div className="px-5 py-1 pb-3">
                {vendor?.gstNumber && (
                  <InfoRow
                    icon={Hash}
                    label="GST"
                    value={vendor?.gstNumber}
                    mono
                  />
                )}
                {vendor?.panNumber && (
                  <InfoRow
                    icon={Hash}
                    label="PAN"
                    value={vendor?.panNumber}
                    mono
                  />
                )}
                {vendor?.bankName && (
                  <InfoRow
                    icon={Landmark}
                    label="Bank"
                    value={vendor?.bankName}
                  />
                )}
                {vendor?.bankAccount && (
                  <InfoRow
                    icon={CreditCard}
                    label="Account"
                    value={vendor?.bankAccount}
                    mono
                  />
                )}
                {vendor?.bankIfsc && (
                  <InfoRow
                    icon={Hash}
                    label="IFSC"
                    value={vendor?.bankIfsc}
                    mono
                    last
                  />
                )}
              </div>
            </MetricPanel>
          )}
        </div>
      )}
    </div>
  );
};

export default VendorDetailsPage;
