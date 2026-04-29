import {
  BarChart2,
  ChefHat,
  Clock,
  Eye,
  FlaskConical,
  Package,
  Pencil,
  Play,
} from "lucide-react";
import { ROUTE_PATHS } from "../../../config/paths";

// ─── Recipe card ──────────────────────────────────────────────────────────────
export function ProductionRecipeCard({ recipe, onProduce, navigate, delay }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col transition-all duration-200 hover:shadow-[0_8px_28px_-4px_rgba(0,0,0,0.10)] hover:-translate-y-0.5">
      {/* Body */}
      <div className="p-4 flex flex-col flex-1 gap-3">
        {/* Row 1: name + status */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center flex-shrink-0">
            <ChefHat size={16} className="text-white" strokeWidth={1.8} />
          </div>
          <div className="min-w-0">
            <p className="text-[14px] font-black text-slate-900 leading-tight truncate">
              {recipe.name}
            </p>
            {recipe.description && (
              <p className="text-[11px] text-slate-400 font-medium mt-0.5 truncate">
                {recipe.description}
              </p>
            )}
          </div>
        </div>

        {/* Row 2: output tile */}
        <div className="flex items-center gap-2.5 bg-slate-50 border border-slate-100 rounded-xl px-3 py-2.5">
          <Package
            size={13}
            className="text-slate-400 flex-shrink-0"
            strokeWidth={2}
          />
          <div className="min-w-0">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider leading-none mb-0.5">
              Output
            </p>
            <p className="text-[12.5px] font-bold text-slate-800 truncate">
              {recipe.outputQuantity} {recipe.outputUnitAbbreviation}
              <span className="text-slate-500 font-medium">
                {" "}
                · {recipe.outputItemName}
              </span>
            </p>
          </div>
        </div>

        {/* Row 3: 3 stat chips */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-100">
            <Clock size={10} className="text-slate-400" strokeWidth={2} />
            <span className="text-[11px] font-bold text-slate-700">
              {recipe.preparationTimeMins} min
            </span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-100">
            <FlaskConical
              size={10}
              className="text-slate-400"
              strokeWidth={2}
            />
            <span className="text-[11px] font-bold text-slate-700">
              {recipe.ingredientCount} ingredients
            </span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-100">
            <BarChart2 size={10} className="text-slate-400" strokeWidth={2} />
            <span className="text-[11px] font-bold text-slate-700">
              {recipe.productionCount || 0} runs
            </span>
          </div>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Row 4: action buttons */}
        <div className="flex items-center gap-1.5 pt-1 border-t border-slate-100">
          <button
            onClick={() =>
              navigate(
                `${ROUTE_PATHS.PREP_RECIPES_DETAILS}?recipeId=${recipe.id}`,
              )
            }
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold text-slate-600 border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all duration-150"
          >
            <Eye size={11} strokeWidth={2} />
            View
          </button>
          <button
            onClick={() =>
              navigate(`${ROUTE_PATHS.PREP_RECIPES_ADD}?recipeId=${recipe.id}`)
            }
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold text-slate-600 border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all duration-150"
          >
            <Pencil size={11} strokeWidth={2} />
            Edit
          </button>
          <button
            onClick={(e) => {
              (e.stopPropagation(), onProduce(recipe));
            }}
            disabled={!recipe.isActive}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-black text-white ml-auto transition-all duration-150 bg-emerald-600 hover:bg-emerald-700  disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-md hover:-translate-y-px"
          >
            <Play size={11} strokeWidth={2.5} />
            Produce
          </button>
        </div>
      </div>
    </div>
  );
}
