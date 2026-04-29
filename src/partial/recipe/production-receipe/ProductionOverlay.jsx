import {
  AlertCircle,
  ChefHat,
  Clock,
  Loader2,
  Package,
  Play,
  X,
} from "lucide-react";
import { useState } from "react";
import ModalBlank from "../../../components/ModalBlank";

// ─── Production Overlay ───────────────────────────────────────────────────────
export function ProductionOverlay({
  isOpen,
  onClose,
  recipe,
  onSubmit,
  loading,
}) {
  const [notes, setNotes] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      productionRecipeId: recipe?.id,
      notes: notes.trim() || undefined,
    });
  };

  return (
    <ModalBlank
      id={"prepare-production-receipe"}
      isOpen={isOpen}
      onClose={onClose}
      size="md"
    >
      <div>
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-600 flex items-center justify-center">
              <Play size={13} className="text-white" strokeWidth={2.5} />
            </div>
            <div>
              <p className="text-[13px] font-black text-slate-800 leading-none">
                Start Production
              </p>
              <p className="text-[10px] text-slate-400 font-medium mt-0.5">
                Log a production batch
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={loading}
            className="w-7 h-7 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-400 transition-colors"
          >
            <X size={14} strokeWidth={2.5} />
          </button>
        </div>

        {/* Recipe summary */}
        <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-100">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center flex-shrink-0">
              <ChefHat size={15} className="text-slate-600" strokeWidth={1.8} />
            </div>
            <div className="min-w-0">
              <p className="text-[13px] font-bold text-slate-800">
                {recipe?.name}
              </p>
              <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                <span className="flex items-center gap-1 text-[10px] text-slate-500">
                  <Package size={9} strokeWidth={2} />
                  {recipe?.outputQuantity} {recipe?.outputUnitAbbreviation} ·{" "}
                  {recipe?.outputItemName}
                </span>
                <span className="text-slate-300">·</span>
                <span className="flex items-center gap-1 text-[10px] text-slate-500">
                  <Clock size={9} strokeWidth={2} />
                  {recipe?.preparationTimeMins} min
                </span>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="px-5 py-4 space-y-3.5">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                Notes{" "}
                <span className="text-slate-400 font-normal normal-case">
                  (optional)
                </span>
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Morning batch, double quantity…"
                rows={3}
                disabled={loading}
                className="w-full form-input resize-none"
              />
            </div>
            <div className="flex items-start gap-2 px-3.5 py-2.5 bg-amber-50 border border-amber-200 rounded-xl">
              <AlertCircle
                size={12}
                className="text-amber-600 flex-shrink-0 mt-0.5"
                strokeWidth={2}
              />
              <p className="text-[11px] text-amber-700 font-medium leading-snug">
                This will deduct ingredients from inventory and create a
                production log entry.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 px-5 py-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 py-2.5 rounded-lg border border-slate-200 text-[12px] font-bold text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 rounded-lg text-[12px] font-black text-white flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-70"
            >
              {loading ? (
                <>
                  <Loader2 size={13} className="animate-spin" />
                  Running…
                </>
              ) : (
                <>
                  <Play size={13} strokeWidth={2.5} />
                  Run Production
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </ModalBlank>
  );
}
