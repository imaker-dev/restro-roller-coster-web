import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useQueryParams } from "../../hooks/useQueryParams";
import { fetchProductionRecipeById } from "../../redux/slices/recipeSlice";
import {
  ArrowLeft,
  ChefHat,
  Clock,
  Package,
  FlaskConical,
  IndianRupee,
  Pencil,
  Hash,
  AlertTriangle,
  CheckCircle2,
  Layers,
  FileText,
  TrendingUp,
} from "lucide-react";
import { formatDate } from "../../utils/dateFormatter";
import { formatNumber, num } from "../../utils/numberFormatter";
import PageHeader from "../../layout/PageHeader";
import MetricPanel from "../../partial/report/daily-sales-report/MetricPanel";
import StatCard from "../../components/StatCard";
import { ROUTE_PATHS } from "../../config/paths";

const fmt = (v) => formatNumber(v, true);

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function Skeleton() {
  return (
    <div className="animate-pulse space-y-5">
      <div className="h-[160px] rounded-2xl bg-slate-200" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-[88px] rounded-2xl bg-slate-100" />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <div className="h-[240px] rounded-2xl bg-slate-100" />
          <div className="h-[200px] rounded-2xl bg-slate-100" />
        </div>
        <div className="h-[260px] rounded-2xl bg-slate-100" />
      </div>
    </div>
  );
}

// ─── Ingredient row ───────────────────────────────────────────────────────────
function IngredientRow({ ingredient, index, totalCost, last }) {
  const costShare =
    num(totalCost) > 0 ? (num(ingredient.liveCost) / num(totalCost)) * 100 : 0;
  const stockOk = num(ingredient.currentStock) > 0;

  return (
    <div
      className={`flex items-center gap-4 px-5 py-3.5 ${!last ? "border-b border-slate-100" : ""} hover:bg-slate-50/60 transition-colors duration-100`}
    >
      {/* Index */}
      <div className="w-6 h-6 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
        <span className="text-[10px] font-black text-slate-600">
          {index + 1}
        </span>
      </div>

      {/* Name + SKU */}
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-bold text-slate-800 leading-tight">
          {ingredient.itemName}
        </p>
        <div className="flex items-center gap-1.5 mt-0.5">
          <p className="text-[10px] text-slate-400 font-mono">
            {ingredient.itemSku}
          </p>
          {ingredient.notes && (
            <>
              <span className="text-slate-300 text-[10px]">·</span>
              <p className="text-[10px] text-slate-400 italic">
                {ingredient.notes}
              </p>
            </>
          )}
        </div>
      </div>

      {/* Quantity */}
      <div className="text-right flex-shrink-0 hidden sm:block">
        <p className="text-[13px] font-bold text-slate-800 tabular-nums">
          {num(ingredient.quantity)} {ingredient.unitAbbreviation}
        </p>
        <p className="text-[10px] text-slate-400 mt-0.5">required</p>
      </div>

      {/* Stock */}
      <div className="text-right flex-shrink-0 hidden md:block w-24">
        <div
          className={`flex items-center justify-end gap-1 ${stockOk ? "text-emerald-600" : "text-rose-500"}`}
        >
          {stockOk ? (
            <CheckCircle2 size={10} strokeWidth={2.5} />
          ) : (
            <AlertTriangle size={10} strokeWidth={2.5} />
          )}
          <p className="text-[11px] font-bold tabular-nums">
            {num(ingredient.currentStock)} {ingredient.stockUnitAbbreviation}
          </p>
        </div>
        <p className="text-[9px] text-slate-400 mt-0.5 text-right">in stock</p>
      </div>

      {/* Cost + share bar */}
      <div className="text-right flex-shrink-0 w-20">
        <p className="text-[13px] font-bold text-slate-900 tabular-nums">
          {fmt(ingredient.liveCost)}
        </p>
      </div>
    </div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
const ProductionRecipeDetailsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { recipeId } = useQueryParams();

  const { isFetchingProductionRecipeDetails, productionRecipeDetails: recipe } =
    useSelector((s) => s.recipe);

  useEffect(() => {
    if (!recipeId) return;
    dispatch(fetchProductionRecipeById(recipeId));
  }, [recipeId]);

  const KPI_TILES = [
    {
      icon: IndianRupee,
      label: "Total Input Cost",
      value: fmt(recipe?.totalInputCost),
      sub: "All ingredients",
      color: "primary",
      dark: true,
    },
    {
      icon: TrendingUp,
      label: "Cost Per Output",
      value: fmt(recipe?.costPerOutputUnit),
      sub: `per ${recipe?.outputUnitAbbreviation}`,
      color: "blue",
    },
    {
      icon: Package,
      label: "Output Quantity",
      value: `${recipe?.outputQuantity} ${recipe?.outputUnitAbbreviation}`,
      sub: recipe?.outputItemName,
      color: "purple",
    },
    {
      icon: Clock,
      label: "Prep Time",
      value: `${recipe?.preparationTimeMins}m`,
      sub: "Minutes required",
      color: "amber",
    },
  ];

  return (
    <div className="space-y-5 pb-10">
      <PageHeader onlyBack backLabel="Back to Recipes" />

      {isFetchingProductionRecipeDetails && <Skeleton />}

      {recipe && !isFetchingProductionRecipeDetails && (
        <>
          {/* ── RECIPE HERO (UNIVERSAL STYLE) ── */}
          <div
            className="relative rounded-3xl overflow-hidden shadow-lg"
            style={{
              background:
                "linear-gradient(135deg, var(--color-primary-600), var(--color-primary-700))",
            }}
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

            <div className="relative z-10 px-6 py-5 text-white">
              {/* ── Top Row ── */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
                {/* Left Section */}
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  {/* Icon */}
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-white/15 border border-white/20 backdrop-blur text-[20px] font-black">
                    <ChefHat size={20} />
                  </div>

                  <div className="min-w-0">
                    <p className="text-[9px] font-semibold text-white/70 uppercase tracking-widest">
                      Pre Production Recipe
                    </p>

                    <h1 className="text-[20px] font-bold leading-tight truncate">
                      {recipe.name}
                    </h1>

                    <div className="flex flex-wrap items-center gap-3 mt-1 text-[11px] text-white/75">
                      {recipe.isActive ? (
                        <span className="flex items-center gap-1 text-emerald-300">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-300" />
                          Active
                        </span>
                      ) : (
                        <span className="text-white/50">Inactive</span>
                      )}

                      {recipe.outputItemName && (
                        <span>{recipe.outputItemName}</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Section */}
                <div className="sm:text-right flex-shrink-0">
                  <p className="text-[9px] font-semibold text-white/70 uppercase tracking-wide">
                    Cost Per Unit
                  </p>

                  <p className="text-[30px] sm:text-[34px] font-extrabold tabular-nums leading-none">
                    {fmt(recipe.costPerOutputUnit)}
                  </p>

                  <p className="text-[11px] text-white/70 mt-1">
                    per {recipe.outputUnitAbbreviation}
                  </p>
                </div>
              </div>

              {/* ── Metric Strip ── */}
              <div className="grid grid-cols-3 gap-3 mt-5">
                {[
                  {
                    label: "Output",
                    value: `${recipe.outputQuantity} ${recipe.outputUnitAbbreviation}`,
                  },
                  {
                    label: "Prep Time",
                    value: `${recipe.preparationTimeMins} min`,
                  },
                  {
                    label: "Ingredients",
                    value: recipe.ingredients?.length || 0,
                  },
                ].map(({ label, value }) => (
                  <div
                    key={label}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-white/10 border border-white/20 backdrop-blur-sm"
                  >
                    <div className="min-w-0">
                      <p className="text-[9px] font-semibold text-white/70 uppercase tracking-wide mb-2">
                        {label}
                      </p>

                      <p className="text-[14px] font-bold tabular-nums leading-none truncate">
                        {value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── 4 KPI TILES ──────────────────────────────────── */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {KPI_TILES?.map((stat) => (
              <StatCard
                icon={stat.icon}
                title={stat.label}
                value={stat.value}
                subtitle={stat.sub}
                color={stat.color}
                variant="v9"
                mode={stat.dark ? "solid" : "light"}
              />
            ))}
          </div>

          {/* ── MAIN GRID ────────────────────────────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* LEFT: ingredients + instructions */}
            <div className="lg:col-span-2 space-y-4">
              {/* Ingredients */}
              <MetricPanel
                icon={FlaskConical}
                title={"Ingredients"}
                desc={`${recipe.ingredients?.length || 0} components · ${fmt(recipe.totalInputCost)} total`}
                noPad
              >
                {recipe.ingredients?.length > 0 ? (
                  <>
                    {recipe.ingredients.map((ing, i) => (
                      <IngredientRow
                        key={ing.id}
                        ingredient={ing}
                        index={i}
                        totalCost={recipe.totalInputCost}
                        last={i === recipe.ingredients.length - 1}
                      />
                    ))}
                    {/* Cost footer */}
                    <div className="flex items-center justify-between px-5 py-3 bg-slate-50 border-t border-slate-200">
                      <span className="text-[11px] font-semibold text-slate-500">
                        Total ingredient cost
                      </span>
                      <span className="text-[14px] font-black text-slate-900 tabular-nums">
                        {fmt(recipe.totalInputCost)}
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12">
                    <FlaskConical
                      size={24}
                      className="text-slate-300 mb-2"
                      strokeWidth={1.3}
                    />
                    <p className="text-[12px] font-bold text-slate-400">
                      No ingredients added
                    </p>
                  </div>
                )}
              </MetricPanel>

              {/* Recipe Instruction  */}
              {recipe?.instructions && (
                <MetricPanel
                  icon={FileText}
                  title="Preparation Instructions"
                  desc="Step-by-step guide"
                >
                  <div className="space-y-1.5">
                    {recipe.instructions
                      .split("\n")
                      .filter(Boolean)
                      .map((step, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <span className="text-[11px] font-black text-slate-400 tabular-nums mt-0.5 flex-shrink-0 w-4">
                            {i + 1}.
                          </span>
                          <p className="text-[12.5px] text-slate-700 font-medium leading-snug">
                            {step.replace(/^\d+\.\s*/, "")}
                          </p>
                        </div>
                      ))}
                  </div>
                </MetricPanel>
              )}
            </div>

            {/* RIGHT: recipe info + output item */}
            <div className="space-y-4">
              {/* Output item */}
              <MetricPanel
                icon={Package}
                title="Output Item"
                desc="What this recipe produces"
              >
                <div className="min-w-0">
                  <p className="text-[14px] font-black text-slate-800 leading-tight">
                    {recipe.outputItemName}
                  </p>
                  <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                    {recipe.outputItemSku}
                  </p>
                </div>
                <div className="space-y-0">
                  {[
                    {
                      label: "Quantity",
                      value: `${recipe.outputQuantity} ${recipe.outputUnitAbbreviation}`,
                    },
                    { label: "Unit", value: recipe.outputUnitName },
                    {
                      label: "Unit Cost",
                      value: fmt(recipe.costPerOutputUnit),
                    },
                  ].map(({ label, value }, i, arr) => (
                    <div
                      key={label}
                      className={`flex items-center justify-between py-2.5 ${i < arr.length - 1 ? "border-b border-slate-100" : ""}`}
                    >
                      <span className="text-[12px] text-slate-500 font-medium">
                        {label}
                      </span>
                      <span className="text-[12px] font-bold text-slate-800 tabular-nums">
                        {value}
                      </span>
                    </div>
                  ))}
                </div>
              </MetricPanel>

              {/* Recipe info */}
              <MetricPanel icon={Hash} title="Recipe Info" noPad>
                <div className="px-5 py-1 pb-3">
                  {[
                    { label: "Recipe ID", value: `#${recipe.id}` },
                    {
                      label: "Created",
                      value: recipe.createdAt
                        ? formatDate(recipe.createdAt, "long")
                        : "—",
                    },
                    {
                      label: "Updated",
                      value: recipe.updatedAt
                        ? formatDate(recipe.updatedAt, "long")
                        : "—",
                    },
                    { label: "Created By", value: recipe.createdByName || "—" },
                    { label: "Runs", value: recipe.productionCount || 0 },
                  ].map(({ label, value }, i, arr) => (
                    <div
                      key={label}
                      className={`flex items-center justify-between py-2.5 ${i < arr.length - 1 ? "border-b border-slate-100" : ""}`}
                    >
                      <span className="text-[12px] text-slate-500 font-medium">
                        {label}
                      </span>
                      <span className="text-[12px] font-bold text-slate-800 tabular-nums">
                        {value}
                      </span>
                    </div>
                  ))}
                </div>
              </MetricPanel>

              {/* Edit CTA */}
              <button
                onClick={() =>
                  navigate(
                    `${ROUTE_PATHS.PREP_RECIPES_ADD}?recipeId=${recipe.id}`,
                  )
                }
                className="btn w-full bg-primary-500 hover:bg-primary-600 text-white transition-all hover:shadow-md hover:-translate-y-px"
              >
                <Pencil size={13} strokeWidth={2} className="mr-2" />
                Edit Recipe
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ProductionRecipeDetailsPage;
