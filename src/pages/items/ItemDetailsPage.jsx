import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useQueryParams } from "../../hooks/useQueryParams";
import { fetchItemsById } from "../../redux/slices/itemSlice";
import {
  Tag,
  ChefHat,
  Hash,
  Layers,
  Package,
  Plus,
  FlaskConical,
  IndianRupee,
  CheckCircle2,
  Utensils,
  ShieldCheck,
  ArrowUpRight,
  Pencil,
} from "lucide-react";
import { formatDate } from "../../utils/dateFormatter";
import { formatNumber, num } from "../../utils/numberFormatter";
import MetricPanel from "../../partial/report/daily-sales-report/MetricPanel";
import FoodTypeIcon from "../../partial/common/FoodTypeIcon";
import PageHeader from "../../layout/PageHeader";
import StatusBadge from "../../layout/StatusBadge";
import LoadingOverlay from "../../components/LoadingOverlay";
import { ROUTE_PATHS } from "../../config/paths";

const fmt = (v) => formatNumber(v, true);

function InfoRow({ label, value, last = false, mono = false, children }) {
  if (!children && !value && value !== 0) return null;
  return (
    <div
      className={`flex items-center justify-between gap-4 py-2.5 ${!last ? "border-b border-slate-100" : ""}`}
    >
      <span className="text-[11.5px] text-slate-500 font-medium flex-shrink-0">
        {label}
      </span>
      {children ?? (
        <span
          className={`text-[12px] font-bold text-slate-800 text-right truncate ${mono ? "font-mono" : ""}`}
        >
          {value}
        </span>
      )}
    </div>
  );
}

// ─── MAIN PAGE ─────────────────────────────────────────────────────────────────
const ItemDetailsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { itemId } = useQueryParams();
  const { itemDetails: item, isFetchingItemDetails } = useSelector(
    (s) => s.item,
  );

  useEffect(() => {
    if (itemId) dispatch(fetchItemsById(itemId));
  }, [itemId]);

  if (isFetchingItemDetails) return <LoadingOverlay />;

  return (
    <div className="space-y-5">
      <PageHeader onlyBack backLabel="Back to Menu" />

      {/* ══ HERO ══════════════════════════════════════════════ */}
      <div
        className="bg-white rounded-2xl border border-slate-200 overflow-hidden"
        style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}
      >
        <div className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-start gap-6">
            {/* Left: icon + identity */}

            <div className="min-w-0 flex-1">
              {/* Name row */}
              <div className="flex flex-wrap items-center gap-2.5 mb-2">
                <FoodTypeIcon type={item?.item_type} size="lg" />
                <h1 className="text-[22px] font-black text-slate-900 leading-none">
                  {item?.name}
                </h1>
                <StatusBadge value={item?.is_active} />

                {/* {item.is_recommended && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black bg-amber-50 text-amber-700 border border-amber-200">
                        <Star size={8} fill="currentColor" strokeWidth={0} />
                        Recommended
                      </span>
                    )}
                    {item.is_bestseller && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black bg-amber-50 text-amber-700 border border-amber-200">
                        <Zap size={8} fill="currentColor" strokeWidth={0} />
                        Bestseller
                      </span>
                    )}
                    {item.is_new && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black bg-blue-50 text-blue-700 border border-blue-200">
                        New
                      </span>
                    )} */}
              </div>

              {/* Meta chips */}
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
                <span className="flex items-center gap-1.5 text-[12px] text-slate-500 font-medium">
                  <Tag size={11} className="text-slate-400" strokeWidth={2} />
                  {item?.category_name}
                </span>
                <span className="text-slate-300">·</span>
                <span className="flex items-center gap-1.5 text-[12px] text-slate-500 font-medium">
                  <Hash size={11} className="text-slate-400" strokeWidth={2} />
                  {item?.sku}
                </span>
                <span className="text-slate-300">·</span>
                <span className="flex items-center gap-1.5 text-[12px] text-slate-500 font-medium">
                  <ChefHat
                    size={11}
                    className="text-slate-400"
                    strokeWidth={2}
                  />
                  {item?.kitchen_station_name}
                </span>
                <span className="text-slate-300">·</span>
                <span className="flex items-center gap-1.5 text-[12px] text-slate-500 font-medium capitalize">
                  <Layers
                    size={11}
                    className="text-slate-400"
                    strokeWidth={2}
                  />
                  {item?.service_type?.replace("_", " ")}
                </span>
              </div>
            </div>

            {/* Right: price block */}
            <div className="flex-shrink-0 sm:text-right">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.15em] mb-1">
                {item?.has_variants ? "Starting from" : "Base Price"}
              </p>
              {item?.has_variants ? (
                <p className="text-[28px] font-black text-slate-900 tabular-nums leading-none">
                  {fmt(Math.min(...item?.variants.map((v) => num(v.price))))}
                </p>
              ) : (
                <p className="text-[28px] font-black text-slate-900 tabular-nums leading-none">
                  {num(item?.base_price) > 0 ? fmt(item?.base_price) : "—"}
                </p>
              )}
              <p className="text-[11px] text-slate-400 font-medium mt-1.5">
                {item?.tax_group_name} · {item?.tax_rate}%{" "}
                {item?.tax_inclusive ? "(incl.)" : ""}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ══ MAIN GRID ═════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* ── LEFT (2 cols) ── */}
        <div className="lg:col-span-2 space-y-4">
          {/* Item Details */}
          <MetricPanel icon={Utensils} title="Item Details">
            <InfoRow label="Name" value={item?.name} />
            <InfoRow label="Short Name" value={item?.short_name} />
            <InfoRow label="SKU" value={item?.sku} mono />
            <InfoRow label="Category" value={item?.category_name} />
            <InfoRow
              label="Type"
              value={
                item?.item_type === "veg" ? "Vegetarian" : "Non-Vegetarian"
              }
            />
            <InfoRow
              label="Service Type"
              value={item?.service_type?.replace(/_/g, " ")}
            />
            <InfoRow
              label="Kitchen Station"
              value={`${item?.kitchen_station_name} (${item?.kitchen_station_code})`}
            />
            <InfoRow
              label="Tax"
              value={`${item?.tax_group_name} · ${item?.tax_rate}%${item?.tax_inclusive ? " incl." : ""}`}
            />
            <InfoRow label="Display Order" value={item?.display_order} last />
          </MetricPanel>

          {/* Pricing */}
          <MetricPanel icon={IndianRupee} title={"Pricing"}>
            <InfoRow
              label="Base Price"
              value={num(item?.base_price) > 0 ? fmt(item?.base_price) : "—"}
            />
            <InfoRow
              label="Cost Price"
              value={num(item?.cost_price) > 0 ? fmt(item?.cost_price) : "—"}
            />
            <InfoRow label="Min Qty" value={item?.min_quantity} />
            <InfoRow label="Max Qty" value={item?.max_quantity ?? "No limit"} />
            <InfoRow label="Step Qty" value={item?.step_quantity} last />
          </MetricPanel>

          {/* Variants — shown inline if exists */}
          {item?.variants?.length > 0 && (
            <MetricPanel
              icon={Layers}
              title="Variants"
              desc={`${item?.variants.length} size / portion options`}
              noPad
            >
              <div className="divide-y divide-slate-100">
                {item?.variants.map((v) => (
                  <div
                    key={v?.id}
                    className="flex items-center gap-4 px-5 py-3.5 hover:bg-slate-50/60 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="text-[13px] font-bold text-slate-800">
                          {v?.name}
                        </p>
                      </div>
                      <p className="text-[10px] text-slate-400 font-mono">
                        {v?.sku}
                      </p>
                    </div>
                    <div className="hidden sm:block text-center flex-shrink-0">
                      <p className="text-[10px] text-slate-400 font-medium">
                        Multiplier
                      </p>
                      <p className="text-[12px] font-bold text-slate-600">
                        {v?.inventory_multiplier}×
                      </p>
                    </div>
                    {v?.tax_group_name && (
                      <div className="hidden md:block text-center flex-shrink-0">
                        <p className="text-[10px] text-slate-400 font-medium">
                          Tax
                        </p>
                        <p className="text-[12px] font-bold text-slate-600">
                          {v?.tax_group_name}
                        </p>
                      </div>
                    )}
                    <div className="text-right flex-shrink-0 w-20">
                      <p className="text-[16px] font-black text-slate-900 tabular-nums">
                        {fmt(v?.price)}
                      </p>
                      {num(v?.cost_price) > 0 && (
                        <p className="text-[10px] text-slate-400 mt-0.5">
                          Cost: {fmt(v?.cost_price)}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </MetricPanel>
          )}

          {/* Add-ons — shown inline if exists */}
          {item?.addonGroups?.length > 0 && (
            <div className="space-y-3">
              {item?.addonGroups.map((group) => (
                <MetricPanel
                  icon={Plus}
                  title={group?.name}
                  desc={`${group?.selection_type === "single" ? "Single" : "Multiple"} selection · ${group?.addons?.length} options`}
                  right={
                    group?.is_required ? (
                      <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200">
                        Required
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200">
                        Optional
                      </span>
                    )
                  }
                  noPad
                >
                  <div className="divide-y divide-slate-100">
                    {group?.addons?.map((addon) => (
                      <div
                        key={addon?.id}
                        className="flex items-center gap-3 px-5 py-3 hover:bg-slate-50/60 transition-colors"
                      >
                        <FoodTypeIcon type={addon?.item_type} size="sm" />
                        <div className="flex-1 min-w-0">
                          <p className="text-[12.5px] font-bold text-slate-800">
                            {addon?.name}
                          </p>
                        </div>
                        <p
                          className={`text-[13px] font-bold tabular-nums flex-shrink-0 ${num(addon?.price) > 0 ? "text-slate-800" : "text-slate-400"}`}
                        >
                          {num(addon?.price) > 0
                            ? `+${fmt(addon?.price)}`
                            : "Free"}
                        </p>
                      </div>
                    ))}
                  </div>
                </MetricPanel>
              ))}
            </div>
          )}
        </div>

        {/* ── RIGHT SIDEBAR ── */}
        <div className="space-y-4">
          {/* Recipes */}
          {item?.recipes?.length > 0 && (
            <MetricPanel
              icon={FlaskConical}
              title={`Recipe${item?.recipes.length > 1 ? "s" : ""}`}
              desc={`${item?.recipes.length} linked recipe${item?.recipes.length > 1 ? "s" : ""}`}
              noPad
            >
              <div className="divide-y divide-slate-100">
                {item?.recipes.map((recipe) => (
                  <button
                    key={recipe?.id}
                    onClick={() =>
                      navigate(
                        `${ROUTE_PATHS.RECIPES_DETAILS}?recipeId=${recipe?.id}`,
                      )
                    }
                    className="group w-full text-left flex items-center gap-4 px-5 py-3.5 hover:bg-slate-50 transition-colors duration-100"
                  >
                    {/* Icon */}
                    <div className="w-9 h-9 rounded-xl bg-primary-50 border border-primary-200 flex items-center justify-center flex-shrink-0">
                      <FlaskConical
                        size={15}
                        className="text-primary-500"
                        strokeWidth={2}
                      />
                    </div>

                    {/* Name + meta */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-[13px] font-bold text-slate-800 truncate">
                          {recipe?.name}
                        </p>
                        {recipe?.isCurrent && (
                          <span className="inline-flex items-center gap-1 text-[9px] font-black text-primary-600 bg-primary-50 px-1.5 py-0.5 rounded-full border border-primary-200 flex-shrink-0">
                            <span className="w-1 h-1 rounded-full bg-primary-500" />
                            Current
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        {recipe?.portionSize && (
                          <span className="flex items-center gap-1 text-[10px] text-slate-400 font-medium">
                            <Package size={9} strokeWidth={2} />
                            {recipe?.portionSize}
                          </span>
                        )}
                        {recipe?.portionSize &&
                          recipe?.ingredients?.length > 0 && (
                            <span className="text-slate-300 text-[10px]">
                              ·
                            </span>
                          )}
                        {recipe?.ingredients?.length > 0 && (
                          <span className="flex items-center gap-1 text-[10px] text-slate-400 font-medium">
                            <FlaskConical size={9} strokeWidth={2} />
                            {recipe?.ingredients.length} ingredients
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Cost */}
                    <div className="text-right flex-shrink-0">
                      <p className="text-[15px] font-black text-slate-900 tabular-nums">
                        {fmt(recipe?.totalCostPerPortion)}
                      </p>
                      <p className="text-[9px] text-slate-400 font-medium mt-0.5">
                        per portion
                      </p>
                    </div>

                    {/* Arrow */}
                    <ArrowUpRight
                      size={14}
                      className="text-slate-300 group-hover:text-primary-500 transition-colors flex-shrink-0"
                      strokeWidth={2}
                    />
                  </button>
                ))}
              </div>
            </MetricPanel>
          )}

          {/* Status & Flags */}
          <MetricPanel icon={ShieldCheck} title="Status & Flags" noPad>
            <div className="px-5 py-3 space-y-1.5">
              {[
                { label: "Active", val: item?.is_active },
                { label: "Available", val: item?.is_available },
                { label: "Recommended", val: item?.is_recommended },
                { label: "Bestseller", val: item?.is_bestseller },
                { label: "New", val: item?.is_new },
                { label: "Customizable", val: item?.is_customizable },
                { label: "Special Notes", val: item?.allow_special_notes },
                { label: "Has Variants", val: item?.has_variants },
                { label: "Has Add-ons", val: item?.has_addons },
              ].map(({ label, val }) => (
                <div
                  key={label}
                  className="flex items-center justify-between py-1"
                >
                  <span className="text-[12px] text-slate-500 font-medium">
                    {label}
                  </span>
                  <span
                    className={`flex items-center gap-1 text-[11px] font-bold ${val ? "text-emerald-600" : "text-slate-300"}`}
                  >
                    {val ? (
                      <>
                        <CheckCircle2 size={12} strokeWidth={2.5} />
                        Yes
                      </>
                    ) : (
                      <span className="text-[11px] font-medium text-slate-400">
                        No
                      </span>
                    )}
                  </span>
                </div>
              ))}
            </div>
          </MetricPanel>

          {/* Meta */}
          <MetricPanel icon={Hash} title="Meta" noPad>
            <div className="px-5 py-1 pb-3">
              <InfoRow label="ID" value={`#${item?.id}`} mono />
              <InfoRow label="Slug" value={item?.slug} mono />
              <InfoRow
                label="Spice Level"
                value={
                  item?.spice_level > 0 ? `${item?.spice_level}/5` : "None"
                }
              />
              <InfoRow label="Calories" value={item?.calories ?? "—"} />
              <InfoRow label="Allergens" value={item?.allergens ?? "—"} />
              <InfoRow
                label="Created"
                value={formatDate(item?.created_at, "long")}
              />
              <InfoRow
                label="Updated"
                value={formatDate(item?.updated_at, "long")}
                last
              />
            </div>
          </MetricPanel>

          {/* Edit button */}
          <button
            onClick={() =>
              navigate(`${ROUTE_PATHS.MENU_ITEMS_ADD}?itemId=${item?.id}`)
            }
            className="btn w-full flex items-center justify-center rounded-lg gap-2 py-2.5 text-[12px] bg-primary-500 text-white transition-all hover:bg-primary-600 hover:shadow-md hover:-translate-y-px"
          >
            <Pencil size={13} strokeWidth={2} />
            Edit Item
          </button>
        </div>
      </div>
    </div>
  );
};

export default ItemDetailsPage;
