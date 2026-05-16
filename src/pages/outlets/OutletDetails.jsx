import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useQueryParams } from "../../hooks/useQueryParams";
import { fetchOutletById } from "../../redux/slices/outletSlice";
import PageHeader from "../../layout/PageHeader";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Globe,
  Building2,
  Users,
  QrCode,
  Layers,
  CreditCard,
  Hash,
  Fingerprint,
  Percent,
  IndianRupee,
  Armchair,
  Sparkles,
  Copy,
  CheckCheck,
  UserCog,
  BadgeInfo,
  SlidersHorizontal,
  AlertTriangle,
  ChevronRight,
  Store,
  Wifi,
  ShieldCheck,
  Calendar,
  RotateCcw,
  Activity,
  TrendingUp,
} from "lucide-react";
import NoDataFound from "../../layout/NoDataFound";
import StatusBadge from "../../layout/StatusBadge";
import StatCard from "../../components/StatCard";
import MetricPanel from "../../partial/report/daily-sales-report/MetricPanel";
import SubscriptionBadge from "../../partial/subscription/SubscriptionBadge";
import { formatNumber } from "../../utils/numberFormatter";
import { formatDate } from "../../utils/dateFormatter";
import InfoCard from "../../components/InfoCard";

// ─── Helpers ─────────────────────────────────────────────────────────────────
const daysLeft = (e) =>
  e ? Math.max(0, Math.ceil((new Date(e) - new Date()) / 86400000)) : null;

// ─── Copy ─────────────────────────────────────────────────────────────────────

const Copy_ = ({ text }) => {
  const [ok, setOk] = useState(false);
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(text);
        setOk(true);
        setTimeout(() => setOk(false), 1600);
      }}
      className="p-1.5 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all"
    >
      {ok ? (
        <CheckCheck size={12} className="text-emerald-500" />
      ) : (
        <Copy size={12} />
      )}
    </button>
  );
};

// ─── Skeleton ────────────────────────────────────────────────────────────────

const Pulse = ({ className }) => (
  <div className={`animate-pulse rounded-2xl bg-slate-100 ${className}`} />
);

const PageSkeleton = () => (
  <div className="space-y-4 p-4 sm:p-6">
    <Pulse className="h-40" />
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {[...Array(4)].map((_, i) => (
        <Pulse key={i} className="h-28" />
      ))}
    </div>
    <Pulse className="h-56" />
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {[...Array(4)].map((_, i) => (
        <Pulse key={i} className="h-52" />
      ))}
    </div>
  </div>
);

// ─── Info Row ─────────────────────────────────────────────────────────────────

const Row = ({ label, value, mono, last, copyText }) => (
  <div
    className={`group flex items-start gap-0 ${!last ? "border-b border-slate-50" : ""}`}
  >
    {/* Label column */}
    <div className="w-[42%] sm:w-[38%] shrink-0 px-5 py-3 bg-slate-50/40 border-r border-slate-50">
      <span className="text-[11.5px] font-semibold text-slate-400 leading-5 block">
        {label}
      </span>
    </div>
    {/* Value column */}
    <div className="flex-1 flex items-center gap-1.5 px-4 py-3 min-w-0">
      {mono ? (
        <code className="text-[11px] font-mono text-slate-600 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-lg break-all leading-5">
          {value ?? "—"}
        </code>
      ) : (
        <span className="text-[13px] font-medium text-slate-700 leading-5 break-words">
          {value ?? "—"}
        </span>
      )}
      {copyText && <Copy_ text={copyText} />}
    </div>
  </div>
);

function Info({ label, value }) {
  return (
    <div className="min-w-0">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400 mb-1">
        {label}
      </p>

      <div className="text-sm font-semibold text-slate-800 truncate">
        {value || "—"}
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

const OutletDetails = () => {
  const dispatch = useDispatch();
  const { outletId } = useQueryParams();
  const { outletDetails: d, isFetchingOutletDetails: loading } = useSelector(
    (s) => s.outlet,
  );

  useEffect(() => {
    if (outletId) dispatch(fetchOutletById(outletId));
  }, [outletId]);

  if (loading)
    return (
      <div className="min-h-screen bg-slate-50">
        <PageHeader title="Outlet Details" showBackButton />
        <PageSkeleton />
      </div>
    );

  if (!d)
    return (
      <NoDataFound
        icon={Building2}
        title="Outlet not found"
        className="min-h-[70dvh]"
      />
    );

  const {
    address,
    contact,
    operatingHours: hrs,
    subscription: sub,
    pricing,
    metrics,
  } = d;
  const days = daysLeft(sub?.endDate);

  const stats = [
    {
      icon: Layers,
      title: "Floors",
      value: metrics?.floorCount,
      color: "blue",
    },
    {
      icon: Armchair,
      title: "Tables",
      value: metrics?.tableCount,
      color: "purple",
    },
    {
      icon: Users,
      title: "Staff",
      value: metrics?.staffCount,
      color: "emerald",
    },
    {
      icon: QrCode,
      title: "QR Generated",
      value: metrics?.qrGeneratedCount,
      color: "amber",
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Outlet Details" showBackButton />

      {/* ── HERO CARD ─────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl ring-1 ring-slate-100 overflow-hidden">
        <div className="p-5 sm:p-6">
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-tight">
                {d.name}
              </h1>
              <StatusBadge value={d.isActive} size="sm" />
            </div>
            <p className="text-[13px] text-slate-500 mb-3 font-medium">
              {d.legalName}
            </p>

            {/* Chips */}
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-violet-50 text-violet-700 text-[11px] font-semibold ring-1 ring-inset ring-violet-100">
                <Sparkles size={10} strokeWidth={2.5} />
                {d.outletType}
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 text-[11px] font-semibold font-mono ring-1 ring-inset ring-slate-200">
                <Hash size={10} strokeWidth={2.5} />
                {d.code}
              </span>
              {/* <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-sky-50 text-sky-700 text-[11px] font-semibold ring-1 ring-inset ring-sky-100">
                <Globe size={10} strokeWidth={2.5} />
                {d.timezone}
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-[11px] font-semibold ring-1 ring-inset ring-emerald-100">
                <IndianRupee size={10} strokeWidth={2.5} />
                {d.currencyCode}
              </span> */}
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
            {stats.map((stat) => (
              <StatCard key={stat.title} {...stat} variant="v9" mode="solid" />
            ))}
          </div>

          {/* ID pills — full width below on mobile */}
          {/* <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-slate-50">
            <div className="group flex items-center gap-2 bg-slate-50 ring-1 ring-slate-100 rounded-xl px-3 py-2 flex-1 min-w-0">
              <Fingerprint size={12} className="text-slate-300 shrink-0" />
              <code className="text-[10px] font-mono text-slate-400 truncate flex-1">
                {d.uuid}
              </code>
              <Copy_ text={d.uuid} />
            </div>
            <div className="group flex items-center gap-2 bg-slate-50 ring-1 ring-slate-100 rounded-xl px-3 py-2">
              <Hash size={11} className="text-slate-300 shrink-0" />
              <code className="text-[10px] font-mono text-slate-400">
                ID · {d.id?.toString()}
              </code>
              <Copy_ text={d.id?.toString()} />
            </div>
          </div> */}
        </div>
      </div>

      <MetricPanel
        icon={CreditCard}
        title="Subscription"
        right={<SubscriptionBadge status={sub?.status} />}
        noPad
      >
        <div className="p-5">
          {/* TOP */}
          <div className="flex items-start justify-between gap-4">
            {/* PRICE SIDE */}
            <div className="min-w-0">
              <p className="text-xs font-semibold text-slate-400 mb-1">
                Annual Plan
              </p>

              <div className="flex items-end gap-2">
                <h2 className="text-4xl font-black tracking-tight text-slate-900 leading-none">
                  {formatNumber(pricing?.totalPrice, true)}
                </h2>

                <span className="text-sm text-slate-400 font-medium mb-1">
                  / year
                </span>
              </div>

              {/* MINI META */}
              <div className="flex flex-wrap items-center gap-3 mt-3 text-[12px] text-slate-500">
                <span>
                  Base:{" "}
                  <strong className="text-slate-700">
                    {formatNumber(pricing?.basePrice, true)}
                  </strong>
                </span>

                <span className="w-1 h-1 rounded-full bg-slate-300" />

                <span>
                  GST:{" "}
                  <strong className="text-slate-700">
                    {pricing?.gstPercentage ?? "—"}%
                  </strong>
                </span>

                <span className="w-1 h-1 rounded-full bg-slate-300" />

                <span className="capitalize">
                  <strong className="text-slate-700">
                    {pricing?.source} Pricing
                  </strong>
                </span>
              </div>
            </div>

            {/* DAYS LEFT */}
            {days !== null && (
              <div
                className={`
            px-4 py-3 rounded-2xl shrink-0
            ${
              days <= 30
                ? "bg-amber-50 text-amber-700"
                : "bg-slate-100 text-slate-700"
            }
          `}
              >
                <div className="text-center leading-none">
                  <p className="text-3xl font-black">{days}</p>

                  <p className="text-[10px] uppercase tracking-widest mt-1 font-bold opacity-70">
                    Days Left
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* DETAILS */}
          <div className="mt-5 grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-4">
            <Info
              label="Start Date"
              value={formatDate(sub?.startDate, "long")}
            />

            <Info label="End Date" value={formatDate(sub?.endDate, "long")} />

            <Info
              label="Grace Period"
              value={formatDate(sub?.gracePeriodEnd, "long")}
            />

            <Info
              label="Auto Renew"
              value={
                <span
                  className={
                    sub?.autoRenew ? "text-emerald-600" : "text-slate-400"
                  }
                >
                  {sub?.autoRenew ? "Enabled" : "Disabled"}
                </span>
              }
            />
          </div>

          {/* NOTES */}
          {sub?.notes && (
            <InfoCard
              type="warning"
              title={"Notes"}
              description={sub.notes}
              size="sm"
              className="mt-4"
            />
          )}
        </div>
      </MetricPanel>

      {/* ── MAIN INFO GRID ──────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Contact */}
        <MetricPanel icon={Phone} title="Contact Information" noPad>
          <Row
            label="Phone"
            value={
              contact?.phone ? (
                <a
                  href={`tel:${contact.phone}`}
                  className="text-blue-600 font-semibold hover:underline"
                >
                  {contact.phone}
                </a>
              ) : (
                "—"
              )
            }
          />
          <Row
            label="Email"
            value={
              contact?.email ? (
                <a
                  href={`mailto:${contact.email}`}
                  className="text-blue-600 font-semibold hover:underline break-all"
                >
                  {contact.email}
                </a>
              ) : (
                "—"
              )
            }
          />
          <Row
            label="GSTIN"
            value={contact?.gstin}
            mono
            copyText={contact?.gstin}
          />
          <Row
            label="FSSAI No."
            value={contact?.fssaiNumber}
            mono
            copyText={contact?.fssaiNumber}
          />
          <Row
            label="PAN Number"
            value={contact?.panNumber}
            mono
            copyText={contact?.panNumber}
            last
          />
        </MetricPanel>

        {/* Address */}
        <MetricPanel icon={MapPin} title="Address" noPad>
          <Row label="Line 1" value={address?.line1} />
          <Row label="Line 2" value={address?.line2} />
          <Row label="City" value={address?.city} />
          <Row label="State" value={address?.state} />
          <Row label="Postal Code" value={address?.postalCode} mono />
          <Row label="Country" value={address?.country} last />
        </MetricPanel>

        {/* Operating Hours */}
        <MetricPanel icon={Clock} title="Operating Hours" noPad>
          <Row
            label="Mode"
            value={
              hrs?.is24Hours ? (
                <span className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-emerald-600">
                  <Wifi size={12} />
                  Open 24 Hours
                </span>
              ) : (
                <span className="text-[12px] font-semibold text-slate-600">
                  Custom Schedule
                </span>
              )
            }
          />
          <Row
            label="Opens At"
            value={hrs?.is24Hours ? "—" : hrs?.openingTime}
          />
          <Row
            label="Closes At"
            value={hrs?.is24Hours ? "—" : hrs?.closingTime}
            last
          />
        </MetricPanel>

        {/* Administration */}
        <MetricPanel icon={UserCog} title="Administration" noPad>
          <Row label="Created By" value={d.createdBy?.name} />
          <Row
            label="Creator Email"
            value={
              d.createdBy?.email ? (
                <a
                  href={`mailto:${d.createdBy.email}`}
                  className="text-blue-600 font-semibold hover:underline break-all"
                >
                  {d.createdBy.email}
                </a>
              ) : (
                "—"
              )
            }
          />
          <Row label="Super Admin" value={d.superAdmin?.name} />
          <Row
            label="Admin Email"
            value={
              d.superAdmin?.email ? (
                <a
                  href={`mailto:${d.superAdmin.email}`}
                  className="text-blue-600 font-semibold hover:underline break-all"
                >
                  {d.superAdmin.email}
                </a>
              ) : (
                "—"
              )
            }
          />
          <Row label="Created" value={formatDate(d.createdAt, "long")} />
          <Row
            label="Last Updated"
            value={formatDate(d.updatedAt, "long")}
            last
          />
        </MetricPanel>
      </div>
    </div>
  );
};

export default OutletDetails;
