import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useQueryParams } from "../../hooks/useQueryParams";
import { fetchOutletById } from "../../redux/slices/outletSlice";
import PageHeader from "../../layout/PageHeader";
import {
  MapPin,
  Phone,
  Mail,
  Globe,
  Clock,
  Shield,
  FileText,
  Building2,
  Hash,
  CheckCircle2,
  XCircle,
  Calendar,
  RefreshCw,
  Utensils,
  CreditCard,
  Landmark,
  Tag,
  ReceiptText,
  Timer,
  Layers,
} from "lucide-react";
import { formatDate } from "../../utils/dateFormatter";
import LoadingOverlay from "../../components/LoadingOverlay";

/* ─── Helpers ─────────────────────────────────────────── */
const fmt = (v) =>
  v != null && v !== "" ? (
    v
  ) : (
    <span className="text-slate-300 italic font-normal">—</span>
  );

const timeStr = (t) => {
  if (!t) return null;
  const [h, m] = t.split(":");
  const hr = parseInt(h);
  return `${hr % 12 || 12}:${m} ${hr < 12 ? "AM" : "PM"}`;
};

/* ─── Badge ───────────────────────────────────────────── */
const Badge = ({ active }) =>
  active ? (
    <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-green-50 text-green-700 border border-green-200">
      <CheckCircle2 size={11} /> Active
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-red-50 text-red-600 border border-red-200">
      <XCircle size={11} /> Inactive
    </span>
  );

/* ─── Avatar ──────────────────────────────────────────── */
const Avatar = ({ name, logo }) => {
  const initials = name
    ?.split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  return logo ? (
    <img
      src={logo}
      alt={name}
      className="w-20 h-20 rounded-2xl object-cover flex-shrink-0 shadow-md"
    />
  ) : (
    <div className="w-20 h-20 rounded-2xl flex-shrink-0 bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center text-white text-2xl font-black tracking-tight shadow-lg shadow-blue-200">
      {initials}
    </div>
  );
};

/* ─── Field ───────────────────────────────────────────── */
const Field = ({ icon: Icon, label, value, wide, mono }) => (
  <div
    className={`py-3 pr-4 border-b border-slate-50 ${wide ? "w-full" : "w-1/2"}`}
  >
    <div className="flex items-center gap-1.5 text-[10.5px] font-semibold text-slate-400 uppercase tracking-widest mb-1">
      {Icon && <Icon size={11} strokeWidth={2.2} />}
      {label}
    </div>
    <div
      className={`text-sm font-semibold text-slate-800 leading-snug ${mono ? "font-mono tracking-wide text-[13px]" : ""}`}
    >
      {fmt(value)}
    </div>
  </div>
);

/* ─── Section ─────────────────────────────────────────── */
const Section = ({ title, icon: Icon, iconBg, iconColor, children }) => (
  <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
    <div className="flex items-center gap-2.5 px-5 py-4 bg-slate-50 border-b border-slate-100">
      <span
        className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${iconBg} ${iconColor}`}
      >
        <Icon size={15} strokeWidth={2.2} />
      </span>
      <span className="text-[13px] font-bold text-slate-700 tracking-tight">
        {title}
      </span>
    </div>
    <div className="px-5 pt-1 pb-3 flex flex-wrap">{children}</div>
  </div>
);

/* ══════════════════════════════════════════════════════ */
const OutletDetails = () => {
  const dispatch = useDispatch();
  const { outletId } = useQueryParams();
  const { outletDetails: d, isFetchingOutletDetails: loading } = useSelector(
    (state) => state.outlet,
  );

  useEffect(() => {
    if (outletId) dispatch(fetchOutletById(outletId));
  }, [outletId]);

  if(loading){
    return <LoadingOverlay text="Fetching Outlet Details..."/>
  }
  const fullAddress = [
    d?.address_line1,
    d?.address_line2,
    d?.city,
    d?.state,
    d?.postal_code,
    d?.country,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <div className="space-y-6">
      <PageHeader title="Outlet Details" showBackButton />

      {/* ── Hero Card ── */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden relative">
        {/* Subtle glow */}

        <div className="relative p-5">
          {/* Top row: avatar + info */}
          <div className="flex items-start gap-6 mb-6">
            <Avatar name={d?.name} logo={d?.logo_url} />
            <div className="flex-1 min-w-0">
              {/* Pills row */}
              <div className="flex flex-wrap items-center gap-2 mb-2.5">
                <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-500 border border-slate-200 font-mono tracking-wide">
                  <Hash size={10} /> {d?.code}
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-blue-50 text-blue-600 border border-blue-200 capitalize">
                  <Utensils size={10} /> {d?.outlet_type}
                </span>
                <Badge active={d?.is_active} />
              </div>

              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight leading-tight mb-0.5">
                {d?.name}
              </h1>
              <p className="text-sm text-slate-500 font-medium mb-2">
                {d?.legal_name}
              </p>

              {fullAddress && (
                <div className="flex items-center gap-1.5 text-[13px] text-slate-400 font-medium">
                  <MapPin
                    size={13}
                    strokeWidth={2}
                    className="flex-shrink-0 text-slate-300"
                  />
                  {fullAddress}
                </div>
              )}
            </div>
          </div>

          {/* Contact pills */}
          <div className="flex flex-wrap gap-2.5">
            {d?.phone && (
              <a
                href={`tel:${d?.phone}`}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-50 border border-slate-200 text-[13px] font-semibold text-slate-600 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 transition-all duration-150 no-underline"
              >
                <Phone size={13} /> {d?.phone}
              </a>
            )}
            {d?.email && (
              <a
                href={`mailto:${d?.email}`}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-50 border border-slate-200 text-[13px] font-semibold text-slate-600 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 transition-all duration-150 no-underline"
              >
                <Mail size={13} /> {d?.email}
              </a>
            )}
            {d?.website && (
              <a
                href={d?.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-50 border border-slate-200 text-[13px] font-semibold text-slate-600 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 transition-all duration-150 no-underline"
              >
                <Globe size={13} /> {d?.website}
              </a>
            )}
          </div>
        </div>
      </div>

      {/* ── Sections Grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Section
          title="Business Information"
          icon={Building2}
          iconBg="bg-blue-50"
          iconColor="text-blue-600"
        >
          <Field icon={Layers} label="Outlet Type" value={d?.outlet_type} />
          <Field icon={Hash} label="Outlet Code" value={d?.code} mono />
          <Field icon={Tag} label="Currency" value={d?.currency_code} />
          <Field icon={Globe} label="Timezone" value={d?.timezone} />
        </Section>

        <Section
          title="Operating Hours"
          icon={Clock}
          iconBg="bg-amber-50"
          iconColor="text-amber-600"
        >
          <Field
            icon={Timer}
            label="Mode"
            value={d?.is_24_hours ? "Open 24 Hours" : "Fixed Hours"}
            wide
          />
          {!d?.is_24_hours && (
            <>
              <Field
                icon={Clock}
                label="Opens At"
                value={timeStr(d?.opening_time)}
              />
              <Field
                icon={Clock}
                label="Closes At"
                value={timeStr(d?.closing_time)}
              />
            </>
          )}
        </Section>

        <Section
          title="Tax & Compliance"
          icon={Shield}
          iconBg="bg-emerald-50"
          iconColor="text-emerald-600"
        >
          <Field icon={Shield} label="GSTIN" value={d?.gstin} mono wide />
          <Field
            icon={FileText}
            label="FSSAI Number"
            value={d?.fssai_number}
            mono
            wide
          />
          <Field
            icon={CreditCard}
            label="PAN Number"
            value={d?.pan_number}
            mono
            wide
          />
        </Section>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* <Section title="Invoice Settings" icon={ReceiptText} iconBg="bg-violet-50" iconColor="text-violet-600">
              <Field icon={Tag}      label="Invoice Prefix"   value={d.invoice_prefix}       mono />
              <Field icon={Hash}     label="Invoice Sequence" value={d.invoice_sequence} />
              <Field icon={Tag}      label="KOT Prefix"       value={d.kot_prefix}           mono />
              <Field icon={Hash}     label="KOT Sequence"     value={d.kot_sequence} />
              <Field icon={Landmark} label="Tax Group ID"     value={d.default_tax_group_id} wide />
            </Section> */}

        <Section
          title="Location Details"
          icon={MapPin}
          iconBg="bg-pink-50"
          iconColor="text-pink-600"
        >
          <Field
            icon={MapPin}
            label="Address Line 1"
            value={d?.address_line1}
            wide
          />
          <Field
            icon={MapPin}
            label="Address Line 2"
            value={d?.address_line2}
            wide
          />
          <Field icon={Building2} label="City" value={d?.city} />
          <Field icon={Building2} label="State" value={d?.state} />
          <Field icon={Globe} label="Country" value={d?.country} />
          <Field icon={Hash} label="Postal Code" value={d?.postal_code} mono />
          <Field icon={MapPin} label="Latitude" value={d?.latitude} mono />
          <Field icon={MapPin} label="Longitude" value={d?.longitude} mono />
        </Section>

        <Section
          title="Record Information"
          icon={Calendar}
          iconBg="bg-slate-100"
          iconColor="text-slate-500"
        >
          <Field
            icon={Calendar}
            label="Created At"
            value={formatDate(d?.created_at, "longTime")}
            wide
          />
          <Field
            icon={RefreshCw}
            label="Updated At"
            value={formatDate(d?.updated_at, "longTime")}
            wide
          />
          <Field icon={Hash} label="Created By (ID)" value={d?.created_by} />
          <Field icon={Hash} label="Updated By (ID)" value={d?.updated_by} />
        </Section>
      </div>
    </div>
  );
};

export default OutletDetails;
