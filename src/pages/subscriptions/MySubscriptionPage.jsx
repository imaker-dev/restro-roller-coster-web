import React, { useEffect } from "react";
import PageHeader from "../../layout/PageHeader";
import { useDispatch, useSelector } from "react-redux";
import { fetchMySubscription } from "../../redux/slices/subscriptionSlice";
import {
  Store,
  CalendarDays,
  Clock,
  IndianRupee,
  CheckCircle2,
  RefreshCw,
  BadgeCheck,
  Zap,
  AlertCircle,
  ShieldCheck,
  Receipt,
  Percent,
  RotateCcw,
  Info,
  Loader2,
  XCircle,
} from "lucide-react";
import SubscriptionBadge, {
  SUBSCRIPTION_VARIANTS,
} from "../../partial/subscription/SubscriptionBadge";
import MetricPanel from "../../partial/report/daily-sales-report/MetricPanel";
import { formatText } from "../../utils/utils";
import { formatDate } from "../../utils/dateFormatter";
import { formatNumber } from "../../utils/numberFormatter";

// ─── helpers ──────────────────────────────────────────────────────────────────

const daysLeft = (end) => {
  if (!end) return null;
  return Math.ceil((new Date(end) - new Date()) / (1000 * 60 * 60 * 24));
};

const getStatus = (status) => {
  if (!status) {
    return SUBSCRIPTION_VARIANTS.default;
  }

  return SUBSCRIPTION_VARIANTS[status] || SUBSCRIPTION_VARIANTS.default;
};

// ─── Row item ─────────────────────────────────────────────────────────────────
function InfoRow({ icon: Icon, label, value, valueClass = "text-slate-800" }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3 border-b border-slate-100 last:border-0">
      <div className="flex items-center gap-2.5 shrink-0">
        <Icon size={13} className="text-slate-400" />
        <p className="text-xs font-semibold text-slate-500">{label}</p>
      </div>
      <p className={`text-xs font-bold text-right ${valueClass}`}>{value}</p>
    </div>
  );
}

// ─── Section wrapper ──────────────────────────────────────────────────────────
function Section({ title, icon: Icon, children, accent }) {
  return (
    <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden">
      <div
        className={`flex items-center gap-3 px-5 py-4 border-b border-slate-100 ${accent ?? ""}`}
      >
        <div className="w-7 h-7 bg-slate-900 rounded-xl flex items-center justify-center shrink-0">
          <Icon size={13} className="text-white" />
        </div>
        <p className="text-sm font-black text-slate-900">{title}</p>
      </div>
      <div className="px-5">{children}</div>
    </div>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function Skeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden">
        <div className="h-1 bg-slate-100" />
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 bg-slate-100 rounded-2xl" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-slate-100 rounded-full w-2/3" />
              <div className="h-3 bg-slate-100 rounded-full w-1/3" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-20 bg-slate-100 rounded-2xl" />
            ))}
          </div>
        </div>
      </div>
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-3xl border border-slate-200 h-36"
        />
      ))}
    </div>
  );
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
const MySubscriptionPage = () => {
  const dispatch = useDispatch();
  const { isFetchingMySubscription, mySubscriptionData: d } = useSelector(
    (s) => s.subscription,
  );

  useEffect(() => {
    dispatch(fetchMySubscription());
  }, []);

  const meta = getStatus(d?.status);
  const left = daysLeft(d?.subscription_end);
  const urgent = left !== null && left <= 60 && left >= 0;
  const gone = left !== null && left < 0;

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Subscription"
        showBackButton
        actions={[
          {
            label: "Refresh",
            type: "refresh",
            icon: RefreshCw,
            onClick: () => dispatch(fetchMySubscription()),
            loading: isFetchingMySubscription,
            loadingText: "Refreshing...",
          },
        ]}
      />

      <div>
        {isFetchingMySubscription && !d ? (
          <Skeleton />
        ) : !d ? (
          <div className="flex flex-col items-center justify-center py-28 text-center">
            <div className="w-14 h-14 bg-white rounded-2xl border border-slate-200 flex items-center justify-center mb-4 shadow-sm">
              <Store size={24} className="text-slate-300" />
            </div>
            <p className="text-sm font-bold text-slate-600 mb-1">
              No subscription found
            </p>
            <p className="text-xs text-slate-400">
              Your subscription details will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* ── Hero card ── */}
            <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden">
              <div className={`h-1.5 bg-gradient-to-r ${meta.bar}`} />
              <div className="p-6">
                {/* Outlet + status */}
                <div className="flex items-start justify-between gap-4 mb-6">
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 bg-primary-500 rounded-2xl flex items-center justify-center shrink-0 shadow-md shadow-slate-900/10">
                      <Store size={20} className="text-white" />
                    </div>
                    <div>
                      <p className="text-base font-black text-slate-900 leading-none">
                        {d.outlet_name}
                      </p>
                      <p className="text-[11px] text-slate-400 font-medium mt-1">
                        ID #{d.outlet_id}
                      </p>
                    </div>
                  </div>
                  <SubscriptionBadge status={d.status} />
                </div>

                {/* 3 stat tiles */}
                <div className="grid grid-cols-3 gap-3">
                  {/* Start */}
                  <div className="bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3.5">
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <CalendarDays size={10} className="text-slate-400" />
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                        Start
                      </p>
                    </div>
                    <p className="text-xs font-black text-slate-800 leading-tight">
                      {formatDate(d.subscription_start, "long")}
                    </p>
                  </div>

                  {/* End */}
                  <div
                    className={`rounded-2xl px-4 py-3.5 border ${gone ? "bg-red-50 border-red-100" : urgent ? "bg-amber-50 border-amber-100" : "bg-slate-50 border-slate-100"}`}
                  >
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <Clock
                        size={10}
                        className={
                          gone
                            ? "text-red-400"
                            : urgent
                              ? "text-amber-400"
                              : "text-slate-400"
                        }
                      />
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                        Expires
                      </p>
                    </div>
                    <p
                      className={`text-xs font-black leading-tight ${gone ? "text-red-600" : urgent ? "text-amber-700" : "text-slate-800"}`}
                    >
                      {formatDate(d.subscription_end, "long")}
                    </p>
                  </div>

                  {/* Days left */}
                  <div
                    className={`rounded-2xl px-4 py-3.5 border ${gone ? "bg-red-50 border-red-100" : urgent ? "bg-amber-50 border-amber-100" : "bg-emerald-50 border-emerald-100"}`}
                  >
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <Zap
                        size={10}
                        className={
                          gone
                            ? "text-red-400"
                            : urgent
                              ? "text-amber-400"
                              : "text-emerald-500"
                        }
                      />
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                        Days Left
                      </p>
                    </div>
                    <p
                      className={`text-xs font-black leading-tight ${gone ? "text-red-600" : urgent ? "text-amber-700" : "text-emerald-700"}`}
                    >
                      {left === null ? "—" : gone ? "Expired" : `${left} days`}
                    </p>
                  </div>
                </div>

                {/* Auto-renew + pricing source row */}
                <div className="flex items-center gap-3 mt-4">
                  <div
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-bold border ${d.auto_renew ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-slate-100 text-slate-500 border-slate-200"}`}
                  >
                    <RotateCcw size={10} />
                    Auto-renew {d.auto_renew ? "On" : "Off"}
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-violet-50 text-violet-600 border border-violet-100 text-[11px] font-bold">
                    <BadgeCheck size={10} />
                    {d.pricing_source} pricing
                  </div>
                </div>

                {d.notes && (
                  <div className="flex items-start gap-2.5 mt-4 bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3">
                    <Info
                      size={12}
                      className="text-slate-400 shrink-0 mt-0.5"
                    />
                    <p className="text-[11px] text-slate-500 font-medium">
                      {d.notes}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* ── Payment info ── */}
            <MetricPanel icon={Receipt} title="Payment Details">
              <InfoRow
                icon={IndianRupee}
                label="Base Amount"
                value={formatNumber(d.base_amount, true)}
              />
              <InfoRow
                icon={Percent}
                label={`GST (${d.gst_percentage}%)`}
                value={formatNumber(d.gst_amount, true)}
                valueClass="text-slate-600"
              />
              <InfoRow
                icon={ShieldCheck}
                label="Total Paid"
                value={formatNumber(d.total_amount, true)}
                valueClass="text-lg font-black text-slate-900"
              />
              <InfoRow
                icon={CheckCircle2}
                label="Payment Status"
                value={d.payment_status ?? "—"}
                valueClass={
                  d.payment_status === "captured"
                    ? "text-emerald-600 capitalize"
                    : "text-amber-600 capitalize"
                }
              />
              <InfoRow
                icon={CalendarDays}
                label="Paid At"
                value={formatDate(d.paid_at, "longTime")}
              />
            </MetricPanel>

            {/* ── Next renewal ── */}
            {d.nextRenewalPricing && (
              <MetricPanel
                icon={RotateCcw}
                title="Next Renewal Pricing"
                right={
                  <span className="ml-auto text-[10px] font-bold px-2 py-1 rounded-lg bg-orange-50 text-orange-500 border border-orange-100 capitalize">
                    {formatText(d.nextRenewalPricing.source)}
                  </span>
                }
              >
                <div>
                  <InfoRow
                    icon={IndianRupee}
                    label="Base Price"
                    value={formatNumber(d.nextRenewalPricing.basePrice, true)}
                  />
                  <InfoRow
                    icon={Percent}
                    label={`GST (${d.nextRenewalPricing.gstPercentage}%)`}
                    value={formatNumber(
                      d.nextRenewalPricing.totalPrice -
                        d.nextRenewalPricing.basePrice,
                      true,
                    )}
                    valueClass="text-slate-600"
                  />
                  <InfoRow
                    icon={Zap}
                    label="Total at Renewal"
                    value={formatNumber(d.nextRenewalPricing.totalPrice, true)}
                    valueClass="font-black text-orange-600"
                  />
                </div>
                {/* Savings callout */}
                {d.nextRenewalPricing.totalPrice < d.total_amount && (
                  <div className="flex items-center justify-between bg-emerald-50 border border-emerald-100 rounded px-4 py-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 size={13} className="text-emerald-500" />
                      <p className="text-xs font-bold text-emerald-700">
                        You save on renewal
                      </p>
                    </div>
                    <p className="text-xs font-black text-emerald-600">
                      {formatNumber(
                        d.total_amount - d.nextRenewalPricing.totalPrice,
                        true,
                      )}{" "}
                      less
                    </p>
                  </div>
                )}
              </MetricPanel>
            )}

            {/* ── Subscription meta ── */}
            <MetricPanel title="Subscription Info" icon={Info}>
              <InfoRow
                icon={BadgeCheck}
                label="Subscription ID"
                value={`#${d.id}`}
              />
              <InfoRow
                icon={Store}
                label="Outlet ID"
                value={`#${d.outlet_id}`}
              />
              <InfoRow
                icon={CalendarDays}
                label="Created"
                value={formatDate(d.created_at, "longTime")}
              />
              <InfoRow
                icon={RefreshCw}
                label="Last Updated"
                value={formatDate(d.updated_at, "longTime")}
              />
              {d.grace_period_end && (
                <InfoRow
                  icon={Clock}
                  label="Grace Period Ends"
                  value={formatDate(d.grace_period_end, "long")}
                  valueClass="text-amber-600"
                />
              )}
            </MetricPanel>
          </div>
        )}
      </div>
    </div>
  );
};

export default MySubscriptionPage;
