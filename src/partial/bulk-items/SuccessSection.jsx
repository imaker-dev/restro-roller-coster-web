import {
  AlertCircle,
  BarChart3,
  Check,
  CheckCircle2,
  ChevronRight,
  Eye,
  Layers,
  Plus,
  PlusCircle,
  RefreshCw,
  SkipForward,
  Tag,
  UtensilsCrossed,
  XCircle,
} from "lucide-react";
import { Link } from "react-router-dom";
import { ROUTE_PATHS } from "../../config/paths";

export default function SuccessSection({ uploadResult, onReset }) {
  const created = uploadResult?.created || {};
  const skipped = uploadResult?.skipped || {};
  const errors = uploadResult?.errors || [];

  const createdRows = [
    { key: "categories", label: "Categories", icon: Tag },
    { key: "items", label: "Items", icon: UtensilsCrossed },
    { key: "variants", label: "Variants", icon: Layers },
    { key: "addonGroups", label: "Addon Groups", icon: PlusCircle },
    { key: "addons", label: "Addons", icon: Plus },
  ];

  const totalCreated = Object.values(created).reduce((s, v) => s + (v || 0), 0);
  const totalSkipped = Object.values(skipped).reduce((s, v) => s + (v || 0), 0);
  const hasErrors = errors.length > 0;
  const allSkipped = totalCreated === 0 && totalSkipped > 0;

  return (
    <div className="space-y-6 py-2">
      {/* ── Hero status ── */}
      <div
        className={`relative overflow-hidden rounded-2xl p-6 text-white shadow-xl
        ${
          allSkipped
            ? "bg-gradient-to-br from-amber-500 via-amber-600 to-orange-600"
            : "bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-700"
        }`}
      >
        <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-10 w-36 h-36 rounded-full bg-black/10 translate-y-1/2" />
        <div className="relative z-10 flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center flex-shrink-0 shadow-lg">
            {allSkipped ? (
              <AlertCircle size={32} className="text-white" strokeWidth={1.5} />
            ) : (
              <CheckCircle2
                size={32}
                className="text-white"
                strokeWidth={1.5}
              />
            )}
          </div>
          <div>
            <h2 className="text-xl font-black tracking-tight mb-0.5">
              {allSkipped ? "Import Skipped" : "Import Complete!"}
            </h2>
            <p className="text-white/80 text-[13px] leading-relaxed max-w-md">
              {allSkipped
                ? "All rows were skipped — likely because they already exist in the system. No new records were created."
                : `Successfully imported ${totalCreated} record${totalCreated !== 1 ? "s" : ""} into your menu system.${totalSkipped > 0 ? ` ${totalSkipped} rows were skipped as duplicates.` : ""}`}
            </p>
          </div>
        </div>
      </div>

      {/* ── Created vs Skipped summary pills ── */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-lg bg-emerald-500 flex items-center justify-center">
              <Check size={13} className="text-white" strokeWidth={2.5} />
            </div>
            <span className="text-[11px] font-black text-emerald-700 uppercase tracking-widest">
              Created
            </span>
          </div>
          <div className="text-4xl font-black text-emerald-600 mb-0.5">
            {totalCreated}
          </div>
          <div className="text-[11px] font-semibold text-emerald-600">
            records added
          </div>
        </div>

        <div
          className={`rounded-2xl p-5 border ${totalSkipped > 0 ? "bg-amber-50 border-amber-200" : "bg-slate-50 border-slate-200"}`}
        >
          <div className="flex items-center gap-2 mb-3">
            <div
              className={`w-7 h-7 rounded-lg flex items-center justify-center ${totalSkipped > 0 ? "bg-amber-400" : "bg-slate-300"}`}
            >
              <SkipForward size={13} className="text-white" strokeWidth={2.5} />
            </div>
            <span
              className={`text-[11px] font-black uppercase tracking-widest ${totalSkipped > 0 ? "text-amber-700" : "text-slate-400"}`}
            >
              Skipped
            </span>
          </div>
          <div
            className={`text-4xl font-black mb-0.5 ${totalSkipped > 0 ? "text-amber-600" : "text-slate-400"}`}
          >
            {totalSkipped}
          </div>
          <div
            className={`text-[11px] font-semibold ${totalSkipped > 0 ? "text-amber-600" : "text-slate-400"}`}
          >
            already exist
          </div>
        </div>
      </div>

      {/* ── Detailed breakdown table ── */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-5 py-3.5 border-b border-slate-100 flex items-center gap-2">
          <BarChart3 size={13} className="text-slate-400" />
          <span className="text-[12px] font-bold text-slate-700">
            Detailed Breakdown
          </span>
        </div>

        <div className="divide-y divide-slate-50">
          {/* Header row */}
          <div className="grid grid-cols-3 px-5 py-2 bg-slate-50">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Type
            </span>
            <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest text-center">
              Created
            </span>
            <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest text-center">
              Skipped
            </span>
          </div>

          {createdRows.map(({ key, label, icon: Icon }) => {
            const c = created[key] ?? 0;
            const s = skipped[key] ?? 0;
            return (
              <div
                key={key}
                className="grid grid-cols-3 px-5 py-3.5 items-center hover:bg-slate-50 transition-colors"
              >
                {/* Label */}
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center">
                    <Icon
                      size={13}
                      className="text-slate-500"
                      strokeWidth={1.8}
                    />
                  </div>
                  <span className="text-[12px] font-semibold text-slate-700">
                    {label}
                  </span>
                </div>

                {/* Created */}
                <div className="text-center">
                  {c > 0 ? (
                    <span className="inline-flex items-center justify-center gap-1 text-[12px] font-black text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full min-w-[44px]">
                      <Check size={10} strokeWidth={3} />
                      {c}
                    </span>
                  ) : (
                    <span className="text-[12px] font-semibold text-slate-300">
                      —
                    </span>
                  )}
                </div>

                {/* Skipped */}
                <div className="text-center">
                  {s > 0 ? (
                    <span className="inline-flex items-center justify-center gap-1 text-[12px] font-black text-amber-700 bg-amber-100 px-3 py-1 rounded-full min-w-[44px]">
                      {s}
                    </span>
                  ) : (
                    <span className="text-[12px] font-semibold text-slate-300">
                      —
                    </span>
                  )}
                </div>
              </div>
            );
          })}

          {/* Totals footer */}
          <div className="grid grid-cols-3 px-5 py-3.5 bg-slate-50 border-t border-slate-200 items-center">
            <span className="text-[11px] font-black text-slate-600 uppercase tracking-wider">
              Total
            </span>
            <div className="text-center">
              <span
                className={`text-[13px] font-black ${totalCreated > 0 ? "text-emerald-700" : "text-slate-400"}`}
              >
                {totalCreated}
              </span>
            </div>
            <div className="text-center">
              <span
                className={`text-[13px] font-black ${totalSkipped > 0 ? "text-amber-700" : "text-slate-400"}`}
              >
                {totalSkipped}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Errors (if any) ── */}
      {hasErrors && (
        <div className="bg-white rounded-2xl border border-red-200 shadow-sm overflow-hidden">
          <div className="px-5 py-3.5 bg-red-50 border-b border-red-100 flex items-center gap-2">
            <XCircle size={13} className="text-red-500" />
            <span className="text-[12px] font-bold text-red-700">
              {errors.length} Error{errors.length !== 1 ? "s" : ""} Encountered
            </span>
          </div>
          <div className="divide-y divide-slate-50 max-h-48 overflow-y-auto">
            {errors.map((err, i) => (
              <div
                key={i}
                className="px-5 py-3 flex items-start gap-3 hover:bg-red-50/30"
              >
                <span className="flex-shrink-0 text-[10px] font-black text-red-500 bg-red-100 px-2 py-0.5 rounded-md mt-0.5 whitespace-nowrap">
                  Row {err.row}
                </span>
                <span className="text-[12px] text-slate-700 leading-relaxed">
                  {err.message}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Skipped note ── */}
      {totalSkipped > 0 && (
        <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3.5">
          <AlertCircle
            size={14}
            className="text-amber-500 flex-shrink-0 mt-0.5"
          />
          <p className="text-[12px] text-amber-800 leading-relaxed">
            <span className="font-bold">Why were rows skipped?</span> Items that
            already exist in the system (matched by name) are skipped to prevent
            duplicates. To update existing items, use the Edit feature instead.
          </p>
        </div>
      )}

      {/* ── Actions ── */}
      <div className="flex flex-wrap gap-3 justify-between pt-1">
        <button
          onClick={onReset}
          className="flex items-center gap-2 text-[13px] font-semibold bg-white border border-slate-200 text-slate-700 px-5 py-2.5 rounded-xl hover:bg-slate-50"
        >
          <RefreshCw size={14} /> Import More
        </button>
        <Link
          to={ROUTE_PATHS.ALL_MENU_ITEMS}
          className="flex items-center gap-2 text-[13px] font-bold bg-primary-600 text-white px-5 py-2.5 rounded-xl hover:opacity-90"
        >
          <Eye size={14} /> View All Products <ChevronRight size={13} />
        </Link>
      </div>
    </div>
  );
}
