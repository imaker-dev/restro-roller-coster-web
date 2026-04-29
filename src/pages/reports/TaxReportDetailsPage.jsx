import React, { useEffect } from "react";
import PageHeader from "../../layout/PageHeader";
import { useQueryParams } from "../../hooks/useQueryParams";
import { formatDate } from "../../utils/dateFormatter";
import { useDispatch, useSelector } from "react-redux";
import { fetchTaxReportDetails } from "../../redux/slices/reportSlice";
import {
  Percent,
  CalendarDays,
  Hash,
  AlertCircle,
  ShieldCheck,
  BarChart2,
  Layers,
} from "lucide-react";
import LoadingOverlay from "../../components/LoadingOverlay";
import NoDataFound from "../../layout/NoDataFound";
import MetricPanel from "../../partial/report/daily-sales-report/MetricPanel";

/* ─── helpers ─────────────────────────────────────────────────────────────── */
const inr = (v) =>
  `₹${parseFloat(v ?? 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

/* ─── Row for summary breakdown ───────────────────────────────────────────── */
function BreakdownRow({
  label,
  value,
  note,
  highlight,
  negative,
  muted,
  divider,
}) {
  return (
    <>
      {divider && <div className="h-px bg-slate-100 my-1" />}
      <div
        className={`flex items-center justify-between py-2.5 px-3 rounded-xl transition-colors ${highlight ? "bg-emerald-50" : "hover:bg-slate-50"}`}
      >
        <div className="flex-1 min-w-0">
          <p
            className={`text-sm font-semibold ${muted ? "text-slate-400" : "text-slate-700"}`}
          >
            {label}
          </p>
          {note && (
            <p className="text-xs text-slate-400 font-medium mt-0.5">{note}</p>
          )}
        </div>
        <span
          className={`text-sm font-extrabold tabular-nums ml-4 flex-shrink-0 ${
            highlight
              ? "text-emerald-700"
              : negative
                ? "text-red-500"
                : muted
                  ? "text-slate-400"
                  : "text-slate-800"
          }`}
        >
          {negative ? "−" : ""}
          {value}
        </span>
      </div>
    </>
  );
}

/* ─── Tax component color palette ────────────────────────────────────────── */
const TAX_COLORS = [
  {
    bar: "bg-violet-500",
    dot: "bg-violet-500",
    pill: "bg-violet-50 text-violet-700 border-violet-200",
    track: "bg-violet-100",
    text: "text-violet-700",
  },
  {
    bar: "bg-sky-500",
    dot: "bg-sky-500",
    pill: "bg-sky-50 text-sky-700 border-sky-200",
    track: "bg-sky-100",
    text: "text-sky-700",
  },
  {
    bar: "bg-teal-500",
    dot: "bg-teal-500",
    pill: "bg-teal-50 text-teal-700 border-teal-200",
    track: "bg-teal-100",
    text: "text-teal-700",
  },
  {
    bar: "bg-rose-500",
    dot: "bg-rose-500",
    pill: "bg-rose-50 text-rose-700 border-rose-200",
    track: "bg-rose-100",
    text: "text-rose-700",
  },
  {
    bar: "bg-amber-500",
    dot: "bg-amber-500",
    pill: "bg-amber-50 text-amber-700 border-amber-200",
    track: "bg-amber-100",
    text: "text-amber-700",
  },
];

/* ─── Redesigned Tax Components section ─────────────────────────────────── */
function TaxComponentsSection({ taxComponents, summary }) {
  if (!taxComponents || taxComponents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-14 gap-3">
        <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center">
          <Percent size={20} className="text-slate-300" strokeWidth={1.5} />
        </div>
        <p className="text-sm font-semibold text-slate-400">
          No tax components for this period
        </p>
      </div>
    );
  }

  const totalTax = parseFloat(summary?.total_tax ?? 0);

  return (
    <div className="space-y-0">
      {/* ── Column headers ── */}
      <div className="grid grid-cols-12 gap-3 px-4 pb-3 border-b border-slate-100">
        <div className="col-span-3">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            Tax Type
          </span>
        </div>
        <div className="col-span-2 text-right">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            Rate
          </span>
        </div>
        <div className="col-span-3 text-right">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            Taxable Amount
          </span>
        </div>
        <div className="col-span-2 text-right">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            Tax Amount
          </span>
        </div>
        <div className="col-span-2 text-right">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            Share
          </span>
        </div>
      </div>

      {/* ── Component rows ── */}
      {taxComponents.map((tc, i) => {
        const c = TAX_COLORS[i % TAX_COLORS.length];
        const sharePct =
          totalTax > 0 ? (parseFloat(tc.taxAmount) / totalTax) * 100 : 0;
        return (
          <div
            key={tc.code}
            className="group grid grid-cols-12 gap-3 items-center px-4 py-4 border-b border-slate-50 hover:bg-slate-50/70 transition-colors duration-150"
          >
            {/* Tax name + invoice count */}
            <div className="col-span-3 flex items-center gap-2.5 min-w-0">
              <span
                className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${c.dot}`}
              />
              <div className="min-w-0">
                <p className="text-sm font-bold text-slate-800 truncate">
                  {tc.name}
                </p>
                <p className="text-xs font-medium text-slate-400 mt-0.5">
                  {tc.invoiceCount} invoice{tc.invoiceCount !== 1 ? "s" : ""}
                </p>
              </div>
            </div>

            {/* Rate badge */}
            <div className="col-span-2 flex justify-end">
              <span
                className={`text-xs font-extrabold px-2.5 py-1 rounded-lg border ${c.pill} tabular-nums`}
              >
                {tc.rate}%
              </span>
            </div>

            {/* Taxable amount + bar */}
            <div className="col-span-3 flex flex-col items-end gap-1.5">
              <span className="text-sm font-semibold text-slate-700 tabular-nums">
                {inr(tc.taxableAmount)}
              </span>
            </div>

            {/* Tax amount + bar */}
            <div className="col-span-2 flex flex-col items-end gap-1.5">
              <span className={`text-sm font-extrabold tabular-nums ${c.text}`}>
                {inr(tc.taxAmount)}
              </span>
            </div>

            {/* Share % pill */}
            <div className="col-span-2 flex justify-end">
              <div className="flex flex-col items-end gap-1.5">
                <span className="text-xs font-bold text-slate-500 tabular-nums">
                  {sharePct.toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        );
      })}

      {/* ── Total footer row ── */}
      <div className="grid grid-cols-12 gap-3 items-center px-4 py-4 bg-slate-900 rounded-xl mt-3">
        <div className="col-span-3 flex items-center gap-2.5">
          <ShieldCheck
            size={15}
            className="text-emerald-400 flex-shrink-0"
            strokeWidth={2.5}
          />
          <span className="text-sm font-extrabold text-white">Total Tax</span>
        </div>
        <div className="col-span-2 text-right">
          <span className="text-xs font-semibold text-slate-500">
            {taxComponents.length} type{taxComponents.length !== 1 ? "s" : ""}
          </span>
        </div>
        <div className="col-span-3 text-right">
          <span className="text-sm font-bold text-slate-300 tabular-nums">
            {inr(summary?.total_taxable)}
          </span>
        </div>
        <div className="col-span-2 text-right">
          <span className="text-base font-extrabold text-emerald-400 tabular-nums">
            {inr(summary?.total_tax)}
          </span>
        </div>
        <div className="col-span-2 text-right">
          <span className="text-xs font-bold text-slate-400">100%</span>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════════════════════════════════ */
const TaxReportDetailsPage = () => {
  const dispatch = useDispatch();
  const { date } = useQueryParams();
  const { outletId } = useSelector((state) => state.auth);
  const { taxReportDetails: d, isFetchingTaxReportDetails } = useSelector(
    (state) => state.report,
  );

  useEffect(() => {
    dispatch(fetchTaxReportDetails({ outletId, date }));
  }, [outletId, date]);

  /* ── derived values ── */
  const s = d?.summary ?? {};
  const taxComponents = d?.taxComponents ?? [];

  if (isFetchingTaxReportDetails) {
    return <LoadingOverlay text="Loading tax report…" />;
  }

  if (!d) {
    return (
      <NoDataFound
        icon={AlertCircle}
        title="No data found for this date range."
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      
      <PageHeader
        title={`Tax Report — ${formatDate(date, "long")}`}
        showBackButton
      />

      {/* ── Hero summary strip ── */}
      <div
        className="relative rounded-2xl overflow-hidden shadow-xl bg-primary-500"
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

        <div className="relative z-10 p-6">
          {/* Date range + invoice count */}
          <div className="flex flex-wrap items-center gap-3 mb-5">
            <div className="flex items-center gap-2 bg-white/10 border border-white/15 rounded-xl px-3 py-1.5 backdrop-blur">
              <CalendarDays
                size={13}
                className="text-white/80"
                strokeWidth={2}
              />
              <span className="text-xs font-semibold text-white">
                {d.dateRange?.start === d.dateRange?.end
                  ? formatDate(d.dateRange?.start, "long")
                  : `${formatDate(d.dateRange?.start, "short")} – ${formatDate(
                      d.dateRange?.end,
                      "short",
                    )}`}
              </span>
            </div>

            <div className="flex items-center gap-2 bg-white/10 border border-white/15 rounded-xl px-3 py-1.5 backdrop-blur">
              <Hash size={13} className="text-white/80" strokeWidth={2} />
              <span className="text-xs font-semibold text-white">
                {s.total_invoices ?? 0} invoices
              </span>
            </div>
          </div>

          {/* Big KPIs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3">
            {[
              {
                label: "Gross Sales",
                val: inr(s.total_subtotal),
                sub: "before deductions",
              },
              {
                label: "Total Discount",
                val: inr(s.total_discount),
                sub: "amount off",
              },
              {
                label: "Taxable Amount",
                val: inr(s.total_taxable),
                sub: "after discounts",
              },
              {
                label: "Total Tax",
                val: inr(s.total_tax),
                sub: "all components",
              },
              {
                label: "Grand Total",
                val: inr(s.total_grand),
                sub: "collected",
              },
            ].map(({ label, val, sub }) => (
              <div
                key={label}
                className="bg-white/10 border border-white/15 rounded-2xl px-4 py-3.5 backdrop-blur-sm"
              >
                <p className="text-xs font-semibold text-white/70 uppercase tracking-widest mb-2">
                  {label}
                </p>

                <p
                  className={`text-xl font-extrabold tabular-nums leading-none text-white`}
                >
                  {val}
                </p>

                <p className="text-xs text-white/70 font-medium mt-1">{sub}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sales Breakdown — 5 cols */}
      <div className="lg:col-span-5">
        <MetricPanel
          icon={BarChart2}
          title="Sales Breakdown"
          desc="How revenue flows from gross to grand total"
        >
          <div className="space-y-0.5">
            <BreakdownRow
              label="Gross Sales (Subtotal)"
              value={inr(s.total_subtotal)}
              note="before any deductions"
            />
            <BreakdownRow
              label="Discounts Applied"
              value={inr(s.total_discount)}
              note="promotional & manual"
              negative
            />
            <BreakdownRow
              label="Taxable Amount"
              value={inr(s.total_taxable)}
              note="gross minus discounts"
              divider
            />
            <BreakdownRow
              label="CGST"
              value={inr(s.total_cgst)}
              muted={parseFloat(s.total_cgst) === 0}
            />
            <BreakdownRow
              label="SGST"
              value={inr(s.total_sgst)}
              muted={parseFloat(s.total_sgst) === 0}
            />
            <BreakdownRow
              label="IGST"
              value={inr(s.total_igst)}
              muted={parseFloat(s.total_igst) === 0}
            />
            <BreakdownRow
              label="VAT"
              value={inr(s.total_vat)}
              muted={parseFloat(s.total_vat) === 0}
            />
            <BreakdownRow
              label="Cess"
              value={inr(s.total_cess)}
              muted={parseFloat(s.total_cess) === 0}
            />
            <BreakdownRow
              label="Total Tax"
              value={inr(s.total_tax)}
              note="sum of all tax components"
              divider
            />
            <BreakdownRow
              label="Service Charge"
              value={inr(s.total_service_charge)}
              muted={parseFloat(s.total_service_charge) === 0}
            />
            <BreakdownRow
              label="Grand Total Collected"
              value={inr(s.total_grand)}
              highlight
            />
          </div>
        </MetricPanel>
      </div>

      {/* Tax Components — 7 cols */}
      <div className="lg:col-span-7">
        <MetricPanel
          icon={Layers}
          title="Tax Components"
          desc={`${taxComponents.length} rate${taxComponents.length !== 1 ? "s" : ""} applied across ${s.total_invoices ?? 0} invoices`}
        >
          <TaxComponentsSection taxComponents={taxComponents} summary={s} />
        </MetricPanel>
      </div>
    </div>
  );
};

export default TaxReportDetailsPage;
