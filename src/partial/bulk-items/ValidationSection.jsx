import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Hash,
  Layers,
  Loader2,
  Plus,
  PlusCircle,
  RotateCcw,
  Tag,
  UtensilsCrossed,
  XCircle,
} from "lucide-react";
import StatCard from "../../components/StatCard";

const SUMMARY_ITEMS = [
  {
    key: "total",
    label: "Total Rows",
    icon: Hash,
    color: "slate",
  },
  {
    key: "categories",
    label: "Categories",
    icon: Tag,
    color: "violet",
  },
  {
    key: "items",
    label: "Items",
    icon: UtensilsCrossed,
    color: "blue",
  },
  {
    key: "variants",
    label: "Variants",
    icon: Layers,
    color: "cyan",
  },
  {
    key: "addonGroups",
    label: "Addon Groups",
    icon: PlusCircle,
    color: "amber",
  },
  {
    key: "addons",
    label: "Addons",
    icon: Plus,
    color: "primary",
  },
];

export default function ValidationSection({
  validationData,
  loading,
  onNext,
  onReset,
}) {
  const isValid = validationData?.isValid;
  const summary = validationData?.summary || {};
  const errors = validationData?.errors || [];
  const warnings = validationData?.warnings || [];

  return (
    <div className="space-y-5">
      {/* Status banner */}
      {isValid ? (
        <div className="flex items-center gap-4 bg-emerald-50 border border-emerald-200 rounded-2xl px-5 py-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center flex-shrink-0 shadow">
            <CheckCircle2 size={20} className="text-white" />
          </div>
          <div className="flex-1">
            <div className="text-[14px] font-bold text-emerald-800">
              File validated successfully!
            </div>
            <div className="text-[12px] text-emerald-700 mt-0.5">
              No errors found. Review the summary and proceed to preview your
              data.
            </div>
          </div>
          <button
            onClick={onNext}
            disabled={loading}
            className="flex-shrink-0 flex items-center gap-2 bg-emerald-500 text-white font-bold text-[12px] px-4 py-2 rounded-xl hover:bg-emerald-600 transition-all shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 size={13} className="animate-spin" />
                Preparing Preview...
              </>
            ) : (
              <>
                Preview Data <ArrowRight size={13} />
              </>
            )}
          </button>
        </div>
      ) : (
        <div className="flex items-start gap-4 bg-red-50 border border-red-200 rounded-2xl px-5 py-4">
          <div className="w-10 h-10 rounded-xl bg-red-500 flex items-center justify-center flex-shrink-0 shadow mt-0.5">
            <XCircle size={20} className="text-white" />
          </div>
          <div className="flex-1">
            <div className="text-[14px] font-bold text-red-800">
              Validation failed
            </div>
            <div className="text-[12px] text-red-700 mt-0.5">
              {summary.errors} error{summary.errors !== 1 ? "s" : ""} found. Fix
              the issues below and re-upload your file.
            </div>
          </div>
          <button
            onClick={onReset}
            className="flex-shrink-0 flex items-center gap-2 bg-red-500 text-white font-bold text-[12px] px-4 py-2 rounded-xl hover:bg-red-600 transition-all shadow-sm"
          >
            <RotateCcw size={12} /> Re-upload
          </button>
        </div>
      )}

      {/* Summary grid */}
      <div>
        <div className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3">
          File Summary
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {SUMMARY_ITEMS.map(({ key, label, icon: Icon, color }) => (
            <StatCard
              key={key}
              title={label}
              value={summary[key] ?? 0}
              icon={Icon}
              color={color}
              variant="v9"
            />
          ))}
        </div>
      </div>

      {/* Errors */}
      {errors.length > 0 && (
        <div className="bg-white rounded-2xl border border-red-200 shadow-sm overflow-hidden">
          <div className="px-5 py-3 bg-red-50 border-b border-red-100 flex items-center gap-2">
            <XCircle size={13} className="text-red-500" />
            <span className="text-[12px] font-bold text-red-700">
              {errors.length} Error{errors.length !== 1 ? "s" : ""} to Fix
            </span>
          </div>
          <div className="divide-y divide-slate-50 max-h-64 overflow-y-auto">
            {errors.map((err, i) => (
              <div
                key={i}
                className="px-5 py-3 flex items-start gap-3 hover:bg-red-50/30 transition-colors"
              >
                <span className="flex-shrink-0 text-[10px] font-black text-red-500 bg-red-100 px-2 py-1 rounded-md mt-0.5 whitespace-nowrap">
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

      {/* Warnings */}
      {warnings.length > 0 && (
        <div className="bg-white rounded-2xl border border-amber-200 shadow-sm overflow-hidden">
          <div className="px-5 py-3 bg-amber-50 border-b border-amber-100 flex items-center gap-2">
            <AlertTriangle size={13} className="text-amber-500" />
            <span className="text-[12px] font-bold text-amber-700">
              {warnings.length} Warning{warnings.length !== 1 ? "s" : ""}
            </span>
          </div>
          <div className="divide-y divide-slate-50 max-h-64 overflow-y-auto">
            {warnings.map((w, i) => (
              <div
                key={i}
                className="px-5 py-3 flex items-start gap-3 hover:bg-amber-50/30"
              >
                <span className="flex-shrink-0 text-[10px] font-black text-amber-600 bg-amber-100 px-2 py-1 rounded-md mt-0.5 whitespace-nowrap">
                  Row {w.row}
                </span>
                <span className="text-[12px] text-slate-700 leading-relaxed">
                  {w.message}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
