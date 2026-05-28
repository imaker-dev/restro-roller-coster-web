import React, { useEffect, useState } from "react";
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
  ShieldCheck,
  Receipt,
  Percent,
  RotateCcw,
  Info,
  Loader2,
  AlertTriangle,
  ReceiptText,
} from "lucide-react";
import SubscriptionBadge from "../../partial/subscription/SubscriptionBadge";
import MetricPanel from "../../partial/report/daily-sales-report/MetricPanel";
import { formatText } from "../../utils/utils";
import { formatDate } from "../../utils/dateFormatter";
import { formatNumber } from "../../utils/numberFormatter";
import { handleResponse } from "../../utils/helpers";
import { createRazorPayOrder } from "../../redux/slices/paymentSlice";
import NoDataFound from "../../layout/NoDataFound";
import RazorpayComponent from "../../components/RazorpayComponent";
import RenewalOverlay from "../../partial/subscription/RenewalOverlay";
import PaymentResultOverlay from "../../partial/subscription/PaymentResultOverlay";
import InfoCard from "../../components/InfoCard";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const daysLeft = (end) => {
  if (!end) return null;
  return Math.ceil((new Date(end) - new Date()) / (1000 * 60 * 60 * 24));
};

// ─── Sub-components ───────────────────────────────────────────────────────────

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

function Skeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden">
        <div className="h-1 bg-slate-100" />
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-slate-100 rounded-2xl" />
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
      {[...Array(2)].map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-3xl border border-slate-200 h-36"
        />
      ))}
    </div>
  );
}

// ─── Hero card (active state) ─────────────────────────────────────────────────

function ActiveHeroCard({ d }) {
  const left = daysLeft(d.subscription_end);
  const urgent = left !== null && left <= 60 && left >= 0;
  const gone = left !== null && left < 0;

  const endTileClass = gone
    ? "bg-red-50 border-red-100"
    : urgent
      ? "bg-amber-50 border-amber-100"
      : "bg-slate-50 border-slate-100";

  const endTextClass = gone
    ? "text-red-600"
    : urgent
      ? "text-amber-700"
      : "text-slate-800";

  const daysIconClass = gone
    ? "text-red-400"
    : urgent
      ? "text-amber-400"
      : "text-emerald-500";

  const daysTileClass = gone
    ? "bg-red-50 border-red-100"
    : urgent
      ? "bg-amber-50 border-amber-100"
      : "bg-emerald-50 border-emerald-100";

  const daysTextClass = gone
    ? "text-red-600"
    : urgent
      ? "text-amber-700"
      : "text-emerald-700";

  return (
    <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden">
      <div className="h-1.5 bg-emerald-500" />
      <div className="p-6">
        {/* Outlet + badge */}
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <p className="text-base font-black text-slate-900 leading-none">
              {d.outlet_name}
            </p>
            <p className="text-[11px] text-slate-400 font-medium mt-1">
              ID #{d.outlet_id}
            </p>
          </div>
          <SubscriptionBadge status={d.status} />
        </div>

        {/* 3 stat tiles */}
        <div className="grid grid-cols-3 gap-2.5">
          {/* Start */}
          <div className="bg-slate-50 border border-slate-100 rounded-2xl px-3 py-3">
            <div className="flex items-center gap-1.5 mb-1.5">
              <CalendarDays size={9} className="text-slate-400" />
              <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">
                Start
              </p>
            </div>
            <p className="text-[11px] font-black text-slate-800 leading-tight">
              {formatDate(d.subscription_start, "long")}
            </p>
          </div>

          {/* End */}
          <div className={`rounded-2xl px-3 py-3 border ${endTileClass}`}>
            <div className="flex items-center gap-1.5 mb-1.5">
              <Clock size={9} className={endTextClass} />
              <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">
                Expires
              </p>
            </div>
            <p
              className={`text-[11px] font-black leading-tight ${endTextClass}`}
            >
              {formatDate(d.subscription_end, "long")}
            </p>
          </div>

          {/* Days left */}
          <div className={`rounded-2xl px-3 py-3 border ${daysTileClass}`}>
            <div className="flex items-center gap-1.5 mb-1.5">
              <Zap size={9} className={daysIconClass} />
              <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">
                Left
              </p>
            </div>
            <p
              className={`text-[11px] font-black leading-tight ${daysTextClass}`}
            >
              {left === null ? "—" : gone ? "Expired" : `${left}d`}
            </p>
          </div>
        </div>

        {/* Pills */}
        <div className="flex items-center gap-2 mt-4 flex-wrap">
          <div
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-bold border ${d.auto_renew ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-slate-100 text-slate-500 border-slate-200"}`}
          >
            <RotateCcw size={9} />
            Auto-renew {d.auto_renew ? "On" : "Off"}
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-violet-50 text-violet-600 border border-violet-100 text-[11px] font-bold">
            <BadgeCheck size={9} />
            {d.pricing_source} pricing
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Hero card (expired state — minimal) ──────────────────────────────────────

function ExpiredHeroCard({ d }) {
  return (
    <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden">
      <div className="h-1.5 bg-gradient-to-r from-slate-300 to-slate-200" />
      <div className="p-5">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-100 rounded-2xl flex items-center justify-center shrink-0">
              <Store size={16} className="text-slate-400" />
            </div>
            <div>
              <p className="text-sm font-black text-slate-800 leading-none">
                {d.outlet_name}
              </p>
              <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                ID #{d.outlet_id}
              </p>
            </div>
          </div>
          <SubscriptionBadge status={d.status} />
        </div>
      </div>
    </div>
  );
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────

const MySubscriptionPage = () => {
  const dispatch = useDispatch();

  const [razorPayOrderId, setRazorPayOrderId] = useState("");
  const [overlayOpen, setOverlayOpen] = useState(false);
  const [resultOverlay, setResultOverlay] = useState({
    open: false,
    type: null,
    result: null,
  });

  const { meData } = useSelector((state) => state.auth);
  const { isCreatingRazorPayOrder } = useSelector((state) => state.payment);
  const { isFetchingMySubscription, mySubscriptionData: d } = useSelector(
    (s) => s.subscription,
  );

  const fetchSubscription = () => {
    dispatch(fetchMySubscription());
  };

  useEffect(() => {
    fetchSubscription();
  }, []);

  const isExpired = d?.status === "expired";
  const isSuspended = d?.status === "suspended" || d?.isBlocked;
  const isRestrictedView = isExpired || isSuspended;

  const handleCreateOrder = async () => {
    const values = {
      outletId: d?.outlet_id,
    };
    await handleResponse(dispatch(createRazorPayOrder({ values })), (res) => {
      setRazorPayOrderId(res.payload.orderId);
    });
  };

  const handlePaymentSuccess = ({ res }) => {
    setOverlayOpen(false);
    setResultOverlay({
      open: true,
      type: "success",
      result: {
        subscriptionStart: res?.subscriptionStart,
        subscriptionEnd: res?.subscriptionEnd,
      },
    });
    fetchSubscription();
  };

  const handlePaymentFailure = ({ res }) => {
    setOverlayOpen(false);
    setResultOverlay({
      open: true,
      type: "failure",
      result: {
        message:
          res?.message ||
          "Your payment could not be completed. Please try again.",
      },
    });
  };

  const handleResultClose = () => {
    setResultOverlay({
      open: false,
      type: null,
      result: null,
    });
  };

  return (
    <>
      <RazorpayComponent
        orderId={razorPayOrderId}
        user={{
          name: meData?.name,
          email: meData?.email,
          contact: meData?.phone,
          outletId: meData?.outletId,
        }}
        onPaymentSuccess={handlePaymentSuccess}
        onPaymentFailure={handlePaymentFailure}
      />

      <div className="space-y-6">
        <PageHeader
          title="My Subscription"
          showBackButton
          onRefresh={fetchSubscription}
          isRefreshing={isFetchingMySubscription}
        />

        <div>
          {isFetchingMySubscription && !d ? (
            <Skeleton />
          ) : !d ? (
            <NoDataFound
              icon={Store}
              title="No subscription found"
              description="Your subscription details will appear here."
            />
          ) : isRestrictedView ? (
            /* ── EXPIRED VIEW: minimal hero + renewal section only ── */
            <div className="space-y-4">
              <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden">
                {/* Top bar */}
                <div className="h-1.5 bg-red-500" />

                <div className="p-5">
                  {/* Header */}
                  <div className="flex items-center justify-between gap-4 mb-5">
                    <div>
                      <p className="text-sm font-black text-slate-900 leading-none">
                        {d.outlet_name}
                      </p>

                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-[11px] text-slate-400 font-medium">
                          ID #{d.outlet_id}
                        </p>
                      </div>
                    </div>

                    <SubscriptionBadge status={d.status} />
                  </div>

                  {/* Status Message */}
                  <InfoCard
                    type={isExpired ? "error" : "warning"}
                    title={
                      isSuspended
                        ? "Subscription Suspended"
                        : "Subscription Expired"
                    }
                    description={
                      isSuspended
                        ? "Your outlet access has been temporarily suspended. Please contact support or renew your subscription to restore access."
                        : "Your subscription validity has ended. Renew now to restore billing, orders, and dashboard access."
                    }
                    size="sm"
                  />

                  {/* Notes */}
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

                  {/* Price summary */}
                  {/* <div className="flex items-center justify-between bg-gray-50 border border-slate-100 rounded-xl px-4 py-3 mb-4">
                    <div>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">
                        Renewal amount
                      </p>

                      <p className="text-[10px] text-slate-400 font-medium">
                        {formatNumber(d.nextRenewalPricing?.basePrice, true)} +{" "}
                        {formatNumber(
                          d.nextRenewalPricing?.totalPrice -
                            d.nextRenewalPricing?.basePrice,
                          true,
                        )}{" "}
                        GST
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-[18px] font-black text-slate-900 leading-none">
                        {formatNumber(d.nextRenewalPricing?.totalPrice, true)}
                      </p>

                      <p className="text-[9px] text-slate-400 font-medium mt-1">
                        incl. GST
                      </p>
                    </div>
                  </div> */}

                  {/* CTA */}
                  {/* <button
                    onClick={() => setOverlayOpen(true)}
                    className="w-full flex items-center justify-center gap-2 py-3.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.98] text-white text-[13px] font-black rounded-2xl transition-all"
                  >
                    <RefreshCw size={13} />
                    Renew Subscription
                  </button> */}
                </div>
              </div>
            </div>
          ) : (
            /* ── ACTIVE VIEW: full details ── */
            <div className="space-y-4">
              {/* Hero */}
              <ActiveHeroCard d={d} />

              {/* Payment info */}
              {/* <MetricPanel icon={ReceiptText} title="Payment Details">
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
              </MetricPanel> */}

              {/* Next renewal pricing */}
              {/* {d.nextRenewalPricing && (
                <MetricPanel
                  icon={RotateCcw}
                  title="Next Renewal Pricing"
                  right={
                    <span className="ml-auto text-[10px] font-bold px-2 py-1 rounded-lg bg-orange-50 text-orange-500 border border-orange-100 capitalize">
                      {formatText(d.nextRenewalPricing.source)}
                    </span>
                  }
                >
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
                  {d.nextRenewalPricing.totalPrice < d.total_amount && (
                    <div className="flex items-center justify-between bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-2.5 mt-1">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 size={12} className="text-emerald-500" />
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
              )} */}

              {/* Subscription meta */}
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

      <RenewalOverlay
        open={overlayOpen}
        onClose={() => setOverlayOpen(false)}
        data={d}
        isCreatingOrder={isCreatingRazorPayOrder}
        onConfirm={() => handleCreateOrder?.()}
      />

      {/* Payment result overlay */}
      <PaymentResultOverlay
        open={resultOverlay.open}
        type={resultOverlay.type}
        data={d}
        result={resultOverlay.result}
        onClose={handleResultClose}
      />
    </>
  );
};

export default MySubscriptionPage;
