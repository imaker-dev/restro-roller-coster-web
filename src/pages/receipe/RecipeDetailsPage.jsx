import { useEffect } from "react";
import PageHeader from "../../layout/PageHeader";
import { useQueryParams } from "../../hooks/useQueryParams";
import { useDispatch, useSelector } from "react-redux";
import { fetchRecipeById } from "../../redux/slices/recipeSlice";
import LoadingOverlay from "../../components/LoadingOverlay";
import { formatNumber } from "../../utils/numberFormatter";
import { formatDate } from "../../utils/dateFormatter";
import {
  ChefHat,
  BookOpen,
  FlaskConical,
  TrendingUp,
  TrendingDown,
  BadgeIndianRupee,
  CheckCircle2,
  Package,
} from "lucide-react";
import FoodTypeIcon from "../../partial/common/FoodTypeIcon";
import MetricPanel from "../../partial/report/daily-sales-report/MetricPanel";

/* ─── Info row ────────────────────────────────────────────────────────────── */
function Row({ label, value, accent }) {
  if (value === null || value === undefined || value === "") return null;
  return (
    <div className="flex items-center justify-between gap-4 py-2.5 border-b border-slate-50 last:border-0">
      <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex-shrink-0">
        {label}
      </span>
      <span
        className={`text-sm font-bold text-right ${accent ?? "text-slate-800"}`}
      >
        {value}
      </span>
    </div>
  );
}

/* ─── Food cost color ─────────────────────────────────────────────────────── */
function fcColor(pct) {
  if (pct <= 30)
    return {
      text: "text-emerald-600",
      bar: "bg-emerald-500",
      bg: "bg-emerald-50",
      border: "border-emerald-100",
    };
  if (pct <= 40)
    return {
      text: "text-amber-600",
      bar: "bg-amber-400",
      bg: "bg-amber-50",
      border: "border-amber-100",
    };
  return {
    text: "text-red-600",
    bar: "bg-red-500",
    bg: "bg-red-50",
    border: "border-red-100",
  };
}

/* ═══════════════════════════════════════════════════════════════════════════
   PAGE
═══════════════════════════════════════════════════════════════════════════ */
const RecipeDetailsPage = () => {
  const dispatch = useDispatch();
  const { recipeId } = useQueryParams();
  const { isFetchingRecipeDetails, recipeDetails } = useSelector(
    (state) => state.recipe,
  );

  useEffect(() => {
    if (recipeId) dispatch(fetchRecipeById(recipeId));
  }, [recipeId]);

  if (isFetchingRecipeDetails) return <LoadingOverlay />;

  const d = recipeDetails;

  if (!d)
    return (
      <div className="space-y-4">
        <PageHeader title="Recipe Details" showBackButton />
        <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center">
          <p className="text-sm font-semibold text-slate-400">
            No recipe data found.
          </p>
        </div>
      </div>
    );

  const cs = d.costSummary ?? {};
  const isVeg = d.itemType?.toLowerCase() === "veg";
  const isProfit = cs.status === "profitable";
  const fc = fcColor(cs.foodCostPercentage ?? 0);
  const totalCost = (d.ingredients ?? []).reduce(
    (s, i) => s + (i.cost?.totalCost ?? 0),
    0,
  );
  const largestIngredient = [...(d.ingredients ?? [])].sort(
    (a, b) => (b.cost?.totalCost ?? 0) - (a.cost?.totalCost ?? 0),
  )[0];

  return (
    <div className="space-y-4">
      <PageHeader title="Recipe Details" showBackButton />

      {/* ── HERO CARD ── */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {/* Identity row */}
        <div className="flex flex-wrap items-start justify-between gap-4 px-5 py-5 border-b border-slate-50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center flex-shrink-0">
              <ChefHat size={22} className="text-white" strokeWidth={1.6} />
            </div>
            <div>
              <p className="text-lg font-extrabold text-slate-900 leading-tight">
                {" "}
                {d.name}
              </p>
              <div className="flex flex-wrap items-center gap-2 mt-1 text-sm">
                {/* Food type and menu item */}
                <div className="flex items-center gap-1 text-slate-700 font-medium">
                  <FoodTypeIcon type={d.itemType} /> {d.menuItemName}
                </div>

                {/* Separator between menu item and category */}
                <span className="text-slate-400 font-semibold">•</span>

                {/* Category */}
                <span className="text-slate-500 font-semibold">
                  {d.categoryName}
                </span>

                {/* Separator before SKU */}
                <span className="text-slate-400 font-semibold">•</span>

                {/* SKU badge */}
                <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                  {d.menuItemSku}
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {/* Profit status */}
            <span
              className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide ring-1 ${
                isProfit
                  ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
                  : "bg-red-50 text-red-700 ring-red-200"
              }`}
            >
              <span
                className={`w-1 h-1 rounded-full ${isProfit ? "bg-emerald-500" : "bg-red-500"} flex-shrink-0`}
              />
              {isProfit ? "Profitable" : "At Loss"}
            </span>
            {/* Version */}
            <span className="inline-flex items-center gap-1 bg-sky-50 text-sky-700 ring-1 ring-sky-200 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide">
              <CheckCircle2 size={9} strokeWidth={2.5} />v{d.version} · Current
            </span>
          </div>
        </div>

        {/* KPI strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-y sm:divide-y-0 divide-slate-50">
          {[
            {
              label: "Making Cost",
              value: cs.makingCost,
              color: "text-slate-900",
            },
            {
              label: "Selling Price",
              value: cs.sellingPrice,
              color: "text-violet-600",
            },
            {
              label: "Profit",
              value: cs.profit,
              color: isProfit ? "text-emerald-600" : "text-red-600",
            },
            {
              label: "Ingredients",
              value: cs.ingredientCount,
              color: "text-slate-700",
            },
          ].map(({ label, value, color }) => (
            <div key={label} className="flex flex-col gap-1 px-5 py-4">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                {label}
              </span>
              <p
                className={`text-2xl font-extrabold tabular-nums tracking-tight ${color}`}
              >
                {value}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ── MAIN 2-COL ── */}
      <div className="grid lg:grid-cols-3 gap-4">
        {/* ── LEFT (2/3) ── */}
        <div className="lg:col-span-2 space-y-4">
          {/* Ingredients table */}
          <MetricPanel
            title="Ingredients"
            desc={`${d.ingredients?.length ?? 0} ingredient${d.ingredients?.length !== 1 ? "s" : ""} · ${cs.costingMethod} costing`}
            icon={FlaskConical}
            noPad
          >
            {!d.ingredients?.length ? (
              <div className="px-5 py-10 text-center">
                <Package
                  size={28}
                  className="text-slate-200 mx-auto mb-2"
                  strokeWidth={1.5}
                />
                <p className="text-sm font-semibold text-slate-400">
                  No ingredients added yet.
                </p>
              </div>
            ) : (
              <>
                {/* Table header */}
                <div className="hidden sm:grid grid-cols-12 gap-2 px-5 py-2.5 bg-slate-50 border-b border-slate-100 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
                  <div className="col-span-3">Ingredient</div>
                  <div className="col-span-2 text-center">Qty</div>
                  <div className="col-span-1 text-center">Wastage</div>
                  <div className="col-span-1 text-center">Yield</div>
                  <div className="col-span-2 text-right">Rate / Base</div>
                  <div className="col-span-2 text-right">Total Cost</div>
                  <div className="col-span-1 text-right">Share</div>
                </div>

                {d.ingredients.map((ing, i) => {
                  const share =
                    totalCost > 0
                      ? Math.round(
                          ((ing.cost?.totalCost ?? 0) / totalCost) * 100,
                        )
                      : 0;
                  const isLargest = ing.id === largestIngredient?.id;

                  return (
                    <div
                      key={ing.id}
                      className={`border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors`}
                    >
                      {/* Desktop row */}
                      <div className="hidden sm:grid grid-cols-12 gap-2 items-center px-5 py-3.5">
                        {/* Name */}
                        <div className="col-span-3 flex items-center gap-2.5 min-w-0">
                          <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                            <span className="text-[10px] font-extrabold text-slate-500">
                              {String(i + 1).padStart(2, "0")}
                            </span>
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-slate-800 truncate">
                              {ing.ingredientName}
                            </p>
                            {ing.notes && (
                              <p className="text-[10px] text-slate-400 font-medium truncate">
                                {ing.notes}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Qty */}
                        <div className="col-span-2 text-center">
                          <p className="text-xs font-bold text-slate-700 tabular-nums">
                            {ing.quantity} {ing.unitAbbreviation}
                          </p>
                          <p className="text-[10px] text-slate-400">
                            {ing.unitName}
                          </p>
                        </div>

                        {/* Wastage */}
                        <div className="col-span-1 text-center">
                          <p
                            className={`text-xs font-bold tabular-nums ${ing.wastagePercentage > 0 ? "text-amber-600" : "text-slate-400"}`}
                          >
                            {ing.wastagePercentage}%
                          </p>
                        </div>

                        {/* Yield */}
                        <div className="col-span-1 text-center">
                          <p
                            className={`text-xs font-bold tabular-nums ${ing.yieldPercentage < 100 ? "text-amber-600" : "text-emerald-600"}`}
                          >
                            {ing.yieldPercentage}%
                          </p>
                        </div>

                        {/* Rate */}
                        <div className="col-span-2 text-right">
                          <p className="text-xs font-bold text-slate-700 tabular-nums">
                            {formatNumber(ing.cost?.pricePerBase, true)}
                          </p>
                          <p className="text-[10px] text-slate-400">
                            per {ing.unitAbbreviation}
                          </p>
                        </div>

                        {/* Total cost */}
                        <div className="col-span-2 text-right">
                          <p className="text-sm font-extrabold text-slate-900 tabular-nums">
                            {formatNumber(ing.cost?.totalCost, true)}
                          </p>
                        </div>

                        {/* Share bar */}
                        <div className="col-span-1 flex flex-col items-end gap-1">
                          <span
                            className={`text-[10px] font-extrabold tabular-nums ${isLargest ? "text-violet-600" : "text-slate-500"}`}
                          >
                            {share}%
                          </span>
                        </div>
                      </div>

                      {/* Mobile card */}
                      <div className="sm:hidden px-4 py-4">
                        <div className="flex items-start justify-between gap-2 mb-3">
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                              <span className="text-[10px] font-extrabold text-slate-500">
                                {String(i + 1).padStart(2, "0")}
                              </span>
                            </div>
                            <div>
                              <p className="text-sm font-bold text-slate-800">
                                {ing.ingredientName}
                              </p>
                              {ing.notes && (
                                <p className="text-[10px] text-slate-400">
                                  {ing.notes}
                                </p>
                              )}
                            </div>
                          </div>
                          <p className="text-sm font-extrabold text-slate-900 tabular-nums">
                            {formatNumber(ing.cost?.totalCost, true)}
                          </p>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          {[
                            {
                              l: "Qty",
                              v: `${ing.quantity} ${ing.unitAbbreviation}`,
                            },
                            { l: "Wastage", v: `${ing.wastagePercentage}%` },
                            { l: "Yield", v: `${ing.yieldPercentage}%` },
                          ].map(({ l, v }) => (
                            <div
                              key={l}
                              className="bg-slate-50 rounded-lg px-2.5 py-2"
                            >
                              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">
                                {l}
                              </p>
                              <p className="text-xs font-bold text-slate-700 tabular-nums">
                                {v}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Cost total footer */}
                <div className="flex items-center justify-between px-5 py-3.5 bg-slate-50 border-t border-slate-100">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                    Total Ingredient Cost
                  </p>
                  <p className="text-base font-extrabold text-slate-900 tabular-nums">
                    {formatNumber(totalCost, true)}
                  </p>
                </div>
              </>
            )}
          </MetricPanel>

          {/* Instructions */}
          {d.instructions && (
            <MetricPanel
              title="Preparation Instructions"
              subtitle="Step-by-step method"
              icon={BookOpen}
            >
              <div className="space-y-3">
                {d.instructions
                  .split("\n")
                  .filter(Boolean)
                  .map((step, i) => (
                    <div key={i} className="flex items-start gap-3 group">
                      <div className="w-6 h-6 rounded-lg bg-slate-100 group-hover:bg-slate-900 flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors duration-200">
                        <span className="text-[10px] font-extrabold text-slate-500 group-hover:text-white transition-colors">
                          {i + 1}
                        </span>
                      </div>
                      <p className="text-[13px] text-slate-600 leading-relaxed font-medium pt-0.5 flex-1">
                        {step.replace(/^\d+\.\s*/, "")}
                      </p>
                    </div>
                  ))}
              </div>
            </MetricPanel>
          )}
        </div>

        {/* ── RIGHT SIDEBAR (1/3) ── */}
        <div className="space-y-4">
          {/* Cost summary */}
          <MetricPanel
            title="Cost Summary"
            subtitle="Profitability breakdown"
            icon={BadgeIndianRupee}
          >
            {/* Big profit number */}
            <div
              className={`${isProfit ? "bg-emerald-50 border-emerald-100" : "bg-red-50 border-red-100"} border rounded-xl px-4 py-4 mb-4 flex items-center justify-between`}
            >
              <div>
                <p
                  className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${isProfit ? "text-emerald-600" : "text-red-600"}`}
                >
                  {isProfit ? "Profit per Portion" : "Loss per Portion"}
                </p>
                <p
                  className={`text-2xl font-extrabold tabular-nums ${isProfit ? "text-emerald-700" : "text-red-700"}`}
                >
                  {isProfit ? "+" : "-"}
                  {formatNumber(Math.abs(cs.profit, true))}
                </p>
              </div>
              {isProfit ? (
                <TrendingUp
                  size={28}
                  className="text-emerald-400"
                  strokeWidth={1.5}
                />
              ) : (
                <TrendingDown
                  size={28}
                  className="text-red-400"
                  strokeWidth={1.5}
                />
              )}
            </div>

            {/* Line items */}
            <Row
              label="Making Cost"
              value={formatNumber(cs.makingCost, true)}
              accent="text-slate-700"
            />
            <Row
              label="Selling Price"
              value={formatNumber(cs.sellingPrice, true)}
              accent="text-violet-600"
            />
            <div className="h-px bg-slate-100 my-2" />
            <Row
              label="Food Cost %"
              value={`${cs.foodCostPercentage}%`}
              accent={fc.text}
            />
            <Row
              label="Profit %"
              value={`${cs.profitPercentage}%`}
              accent="text-emerald-600"
            />
          </MetricPanel>

          {/* Recipe info */}
          <MetricPanel title="Recipe Info" icon={ChefHat}>
            <Row label="Portion Size" value={d.portionSize ?? "—"} />
            <Row label="Prep Time" value={`${d.preparationTimeMins} min`} />
            <Row
              label="Version"
              value={`v${d.version}${d.isCurrent ? " (Current)" : ""}`}
            />
            <Row label="Costing Method" value={cs.costingMethod} />
            <Row label="Created By" value={d.createdByName} />
            <Row
              label="Created"
              value={`${formatDate(d.createdAt, "long")} · ${formatDate(d.createdAt, "time")}`}
            />
            <Row
              label="Updated"
              value={`${formatDate(d.updatedAt, "long")} · ${formatDate(d.updatedAt, "time")}`}
            />
            {d.description && <Row label="Description" value={d.description} />}
          </MetricPanel>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetailsPage;
