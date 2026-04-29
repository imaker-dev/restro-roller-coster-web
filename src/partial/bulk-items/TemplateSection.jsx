import {
  ArrowRight,
  Download,
  FileSpreadsheet,
  Info,
  Loader2,
  Table,
} from "lucide-react";

const TEMPLATE_COLS = [
  {
    key: "Type",
    required: true,
    example: "CATEGORY / ITEM / VARIANT / ADDON_GROUP / ADDON",
    desc: "Row type identifier",
  },
  {
    key: "Name",
    required: true,
    example: "Paneer Tikka",
    desc: "Name of the item",
  },
  // {
  //   key: "Parent",
  //   required: false,
  //   example: "Starters",
  //   desc: "Parent category (for sub-categories & items)",
  // },
  { key: "Price", required: true, example: "250", desc: "Price in ₹" },
  {
    key: "Food Type",
    required: true,
    example: "veg / nonveg / egg",
    desc: "Food classification",
  },
  { key: "GST %", required: true, example: "5", desc: "GST percentage" },
  {
    key: "Station",
    required: true,
    example: "Main Kitchen",
    desc: "Preparation station",
  },
  {
    key: "Description",
    required: false,
    example: "Spicy paneer starter...",
    desc: "Optional description",
  },
];

export default function TemplateSection({ onDownload, onNext, loading }) {
  return (
    <div className="space-y-5">
      {/* Hero card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-600 via-emerald-700 to-emerald-800 p-7 text-white shadow-xl">
        <div className="absolute top-0 right-0 w-56 h-56 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-20 w-40 h-40 rounded-full bg-black/10 translate-y-1/2" />
        <div className="relative z-10 flex items-start justify-between gap-6">
          <div className="flex-1">
            <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest bg-white/20 text-emerald-100 px-2.5 py-1 rounded-full mb-3">
              <FileSpreadsheet size={10} /> Step 1 — Get Started
            </span>
            <h2 className="text-2xl font-black mb-2 tracking-tight">
              Download the Template
            </h2>
            <p className="text-emerald-200 text-[13px] leading-relaxed max-w-lg">
              Use the official CSV template to prepare your menu. Fill in your
              categories, items, variants, and add-ons following the exact
              format — then upload it in the next step.
            </p>
            <div className="flex flex-wrap gap-3 mt-5">
              <button
                onClick={onDownload}
                disabled={loading}
                className="flex items-center gap-2 bg-white text-emerald-700 font-bold text-[13px] px-5 py-2.5 rounded-xl hover:bg-emerald-50 transition-all shadow-lg active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    Downloading...
                  </>
                ) : (
                  <>
                    <Download size={14} strokeWidth={2.5} />
                    Download CSV Template
                  </>
                )}
              </button>
              <button
                onClick={onNext}
                className="flex items-center gap-2 bg-white/15 hover:bg-white/25 text-white font-semibold text-[13px] px-5 py-2.5 rounded-xl border border-white/20 transition-all"
              >
                I already have a file <ArrowRight size={13} />
              </button>
            </div>
          </div>
          <div className="hidden sm:flex w-20 h-20 rounded-2xl bg-white/10 border border-white/20 items-center justify-center flex-shrink-0">
            <Table size={36} className="text-white/50" strokeWidth={1} />
          </div>
        </div>
      </div>

      {/* Column reference */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-5 py-3.5 border-b border-slate-100 flex items-center gap-2">
          <Info size={13} className="text-slate-400" />
          <span className="text-[12px] font-bold text-slate-700">
            Template Column Reference
          </span>
          <span className="ml-auto text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
            {TEMPLATE_COLS.length} columns
          </span>
        </div>
        <div className="divide-y divide-slate-50">
          {TEMPLATE_COLS.map((col, i) => (
            <div
              key={col.key}
              className="px-5 py-3 flex items-center gap-4 hover:bg-slate-50 transition-colors"
            >
              <div className="w-6 h-6 rounded-md bg-slate-100 flex items-center justify-center flex-shrink-0">
                <span className="text-[9px] font-black text-slate-500">
                  {String.fromCharCode(65 + i)}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[12px] font-bold text-slate-800 font-mono">
                    {col.key}
                  </span>
                  {col.required ? (
                    <span className="text-[9px] font-black text-red-500 bg-red-50 px-1.5 py-0.5 rounded-full">
                      Required
                    </span>
                  ) : (
                    <span className="text-[9px] font-black text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-full">
                      Optional
                    </span>
                  )}
                </div>
                <span className="text-[11px] text-slate-400">{col.desc}</span>
              </div>
              <span className="text-[11px] text-slate-500 text-right max-w-[200px] truncate hidden sm:block">
                {col.example}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
