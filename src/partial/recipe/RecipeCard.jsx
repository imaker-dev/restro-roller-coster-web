import {
  ArrowUpRight,
  BookOpen,
  CheckCircle2,
  ChefHat,
  Clock,
  Hash,
  Layers,
  ShoppingBag,
} from "lucide-react";
import FoodTypeIcon from "../common/FoodTypeIcon";
import { formatNumber } from "../../utils/numberFormatter";
import { Link } from "react-router-dom";
import { formatDate } from "../../utils/dateFormatter";
import { useEffect, useState } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import Tooltip from "../../components/Tooltip";
import { ROUTE_PATHS } from "../../config/paths";

/* ─── Profit badge ────────────────────────────────────────────────────────── */
function ProfitBadge({ profit }) {
  const isProfit = profit >= 0;

  const label = isProfit ? "Profitable" : "Loss";

  return (
    <Tooltip content={label}>
      <span
        className={`inline-flex items-center justify-center w-6 h-6 rounded-full ring-1 ${
          isProfit
            ? "bg-emerald-50 text-emerald-600 ring-emerald-200"
            : "bg-red-50 text-red-600 ring-red-200"
        }`}
      >
        {isProfit ? (
          <TrendingUp className="w-3.5 h-3.5" />
        ) : (
          <TrendingDown className="w-3.5 h-3.5" />
        )}
      </span>
    </Tooltip>
  );
}

/* ─── Animated bar ────────────────────────────────────────────────────────── */
function Bar({ value, max, colorClass = "bg-emerald-500", h = "h-1.5" }) {
  const [w, setW] = useState(0);
  useEffect(() => {
    const t = setTimeout(
      () => setW(max > 0 ? Math.min(Math.round((value / max) * 100), 100) : 0),
      300,
    );
    return () => clearTimeout(t);
  }, [value, max]);
  return (
    <div className={`w-full bg-slate-100 rounded-full ${h} overflow-hidden`}>
      <div
        className={`${h} rounded-full ${colorClass} transition-all duration-1000 ease-out`}
        style={{ width: `${w}%` }}
      />
    </div>
  );
}

/* ─── Recipe card ─────────────────────────────────────────────────────────── */
export function RecipeCard({ recipe }) {
  const foodCostColor =
    recipe.foodCostPercentage <= 30
      ? "text-emerald-600"
      : recipe.foodCostPercentage <= 40
        ? "text-amber-600"
        : "text-red-600";

  const barColor =
    recipe.foodCostPercentage <= 30
      ? "bg-emerald-500"
      : recipe.foodCostPercentage <= 40
        ? "bg-amber-400"
        : "bg-red-500";

  return (
    <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden hover:border-slate-200 hover:shadow-md transition-all duration-200 group flex flex-col">
      <div className="px-5 py-4 flex-1">
        {/* Top row */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-start gap-3 min-w-0 flex-1">
            <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center flex-shrink-0">
              <ChefHat size={16} className="text-white" strokeWidth={1.8} />
            </div>
            <div className="min-w-0">
              <div className="text-sm font-extrabold text-slate-900 leading-snug truncate flex items-center gap-1">
                <FoodTypeIcon type={recipe.itemType} />
                {recipe.name}
              </div>
              {/* <p className="text-[11px] text-slate-500 font-semibold truncate mt-0.5">
                {recipe.menuItemName}
              </p> */}
              <p className="text-[11px] text-slate-500 font-semibold truncate mt-0.5">
                <Link
                  to={`${ROUTE_PATHS.MENU_ITEMS_DETAILS}?itemId=${recipe.menuItemId}`}
                  onClick={(e) => e.stopPropagation()}
                  className="hover:text-primary-600 hover:underline transition-all duration-150"
                >
                  {recipe.menuItemName}
                </Link>
              </p>
            </div>
          </div>
          <ProfitBadge profit={recipe.profit} />
        </div>

        {/* Meta row */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-4">
          <div className="flex items-center gap-1">
            <Hash size={10} className="text-slate-400" strokeWidth={2} />
            <span className="text-[11px] font-semibold text-slate-500">
              {recipe.menuItemSku}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Layers size={10} className="text-slate-400" strokeWidth={2} />
            <span className="text-[11px] font-medium text-slate-400">
              {recipe.categoryName}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Clock size={10} className="text-slate-400" strokeWidth={2} />
            <span className="text-[11px] font-medium text-slate-400">
              {recipe.preparationTimeMins} min
            </span>
          </div>
          {recipe.portionSize && (
            <div className="flex items-center gap-1">
              <ShoppingBag
                size={10}
                className="text-slate-400"
                strokeWidth={2}
              />
              <span className="text-[11px] font-medium text-slate-400">
                {recipe.portionSize}
              </span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <BookOpen size={10} className="text-slate-400" strokeWidth={2} />
            <span className="text-[11px] font-medium text-slate-400">
              {recipe.ingredientCount} ingredients
            </span>
          </div>
        </div>

        {/* Cost vs Sell 3-col tiles */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="bg-slate-50 border border-slate-100 rounded-xl px-3 py-2.5">
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">
              Making Cost
            </p>
            <p className="text-sm font-extrabold text-slate-700 tabular-nums">
              {formatNumber(recipe.makingCost, true)}
            </p>
          </div>
          <div className="bg-slate-50 border border-slate-100 rounded-xl px-3 py-2.5">
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">
              Selling Price
            </p>
            <p className="text-sm font-extrabold text-violet-600 tabular-nums">
              {formatNumber(recipe.sellingPrice, true)}
            </p>
          </div>
          <div
            className={`border rounded-xl px-3 py-2.5 ${recipe.profit >= 0 ? "bg-emerald-50 border-emerald-100" : "bg-red-50 border-red-100"}`}
          >
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">
              Profit
            </p>
            <p
              className={`text-sm font-extrabold tabular-nums ${recipe.profit >= 0 ? "text-emerald-600" : "text-red-600"}`}
            >
              {recipe.profit >= 0 ? "+" : ""}
              {formatNumber(recipe.profit, true)}
            </p>
          </div>
        </div>

        {/* Food cost % bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Food Cost
            </span>
            <div className="flex items-center gap-1.5">
              <span
                className={`text-[11px] font-extrabold tabular-nums ${foodCostColor}`}
              >
                {recipe.foodCostPercentage}%
              </span>
              <span className="text-[10px] text-slate-400 font-medium">
                · profit {recipe.profitPercentage}%
              </span>
            </div>
          </div>
          <Bar
            value={recipe.foodCostPercentage}
            max={100}
            colorClass={barColor}
          />
        </div>

        {/* Footer meta */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-50">
          <div className="flex items-center gap-2">
            {recipe.isCurrent && (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-sky-600 bg-sky-50 ring-1 ring-sky-200 px-2 py-0.5 rounded-full">
                <CheckCircle2 size={9} strokeWidth={2.5} />v{recipe.version}
              </span>
            )}
            <span className="text-[11px] text-slate-400 font-medium">
              {formatDate(recipe.createdAt, "long")}
            </span>
          </div>
          <span className="text-[11px] text-slate-400 font-medium">
            by {recipe.createdByName}
          </span>
        </div>
      </div>

      {/* Action footer */}
      <div className="flex border-t border-slate-100">
        <Link
          to={`${ROUTE_PATHS.RECIPES_DETAILS}?recipeId=${recipe.id}`}
          className="flex-1 flex items-center justify-center gap-1.5 py-3 text-[11px] font-bold text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-all duration-150 border-r border-slate-100"
        >
          View Details
          <ArrowUpRight size={11} strokeWidth={2.5} />
        </Link>
        <Link
          to={`${ROUTE_PATHS.RECIPES_ADD}?recipeId=${recipe.id}`}
          className="px-5 flex items-center justify-center gap-1.5 py-3 text-[11px] font-bold text-primary-600 hover:bg-primary-50 transition-all duration-150"
        >
          Edit
        </Link>
      </div>
    </div>
  );
}
