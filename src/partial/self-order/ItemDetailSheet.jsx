// ─────────────────────────────────────────────────────────────────────────────
// ITEM DETAIL BOTTOM SHEET

import {
  ChevronDown,
  ChevronLeft,
  Clock,
  Minus,
  Plus,
  Tag,
  Utensils,
} from "lucide-react";
import { useState } from "react";
import FoodTypeIcon from "../common/FoodTypeIcon";
import { formatNumber } from "../../utils/numberFormatter";

// ─────────────────────────────────────────────────────────────────────────────
function ItemDetailSheet({ item, cartItems, onClose, onAddToCart }) {
  const hasVariants = item.variants?.length > 0;
  const hasAddons = item.addons?.length > 0;

  const defaultVariant = hasVariants ? item.variants[0] : null;
  const [selectedVariant, setSelectedVariant] = useState(defaultVariant);
  const [selectedAddons, setSelectedAddons] = useState({});
  const [qty, setQty] = useState(1);
  const [note, setNote] = useState("");
  const [noteOpen, setNoteOpen] = useState(false);

  const basePrice = selectedVariant ? selectedVariant.price : item.price;
  const addonTotal = Object.values(selectedAddons)
    .flat()
    .reduce((s, o) => s + (o.price || 0), 0);
  const totalPrice = (basePrice + addonTotal) * qty;

  const toggleAddonOption = (group, option) => {
    setSelectedAddons((prev) => {
      const current = prev[group.id] || [];
      const exists = current.find((o) => o.id === option.id);
      if (group.max === 1) {
        return { ...prev, [group.id]: exists ? [] : [option] };
      }
      if (exists) {
        return {
          ...prev,
          [group.id]: current.filter((o) => o.id !== option.id),
        };
      }
      if (current.length < group.max) {
        return { ...prev, [group.id]: [...current, option] };
      }
      return prev;
    });
  };

  const handleAdd = () => {
    const addonList = Object.entries(selectedAddons).flatMap(([gid, opts]) =>
      opts.map((o) => ({
        addonId: o.id,
        addonGroupId: Number(gid),
        name: o.name,
        price: o.price,
        quantity: 1,
      })),
    );
    onAddToCart({
      itemId: item.id,
      variantId: selectedVariant?.id ?? null,
      name: item.name,
      variantName: selectedVariant?.name ?? null,
      quantity: qty,
      unitPrice: basePrice + addonTotal,
      specialInstructions: note.trim() || null,
      addons: addonList,
    });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Sheet */}
      <div className="relative w-full max-w-lg bg-[#FAF8F5] rounded-t-3xl shadow-2xl flex flex-col max-h-[92vh] animate-[slideUp_0.3s_cubic-bezier(0.32,0.72,0,1)]">
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1 shrink-0">
          <div className="w-10 h-1 bg-black/10 rounded-full" />
        </div>

        {/* Header image area */}
        <div className="relative h-44 shrink-0 mx-4 rounded-2xl overflow-hidden bg-[#F0EDE8]">
          {item.img ? (
            <img
              src={item.img}
              alt={item.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Utensils size={40} className="text-black/10" />
            </div>
          )}
          <button
            onClick={onClose}
            className="absolute top-3 left-3 w-8 h-8 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-sm"
          >
            <ChevronLeft size={16} className="text-[#1C1C1E]" />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-4 pt-4 pb-2">
          {/* Title row */}
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <FoodTypeIcon type={item.type} />
                {item.spiceLevel && (
                  <span className="text-[10px] font-semibold bg-orange-50 text-orange-600 px-1.5 py-0.5 rounded-md">
                    🌶 {item.spiceLevel}
                  </span>
                )}
              </div>
              <h2 className="text-lg font-bold text-[#1C1C1E] leading-snug">
                {item.name}
              </h2>
            </div>
            <div className="text-right shrink-0">
              <p className="text-xl font-bold text-primary-500">
                {formatNumber(basePrice, true)}
              </p>
              {hasVariants && (
                <p className="text-[10px] text-[#8E8E93] mt-0.5">onwards</p>
              )}
            </div>
          </div>

          {/* Meta */}
          <div className="flex items-center gap-2 mb-4">
            <span className="flex items-center gap-1 bg-white border border-black/[0.06] px-2 py-1 rounded-lg text-[11px] text-[#3A3A3C] font-medium shadow-sm">
              <Clock size={11} className="text-[#8E8E93]" />
              {item.prepTime} min
            </span>
            {item.taxRate && (
              <span className="flex items-center gap-1 bg-white border border-black/[0.06] px-2 py-1 rounded-lg text-[11px] text-[#3A3A3C] font-medium shadow-sm">
                <Tag size={11} className="text-[#8E8E93]" />
                {item.taxInclusive ? "Tax incl." : `+${item.taxRate}% tax`}
              </span>
            )}
          </div>

          {item.description && (
            <p className="text-sm text-[#6C6C70] leading-relaxed mb-4">
              {item.description}
            </p>
          )}

          {/* Variants */}
          {hasVariants && (
            <div className="mb-5">
              <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#8E8E93] mb-2">
                Choose Size
              </p>
              <div className="flex flex-wrap gap-2">
                {item.variants.map((v) => {
                  const active = selectedVariant?.id === v.id;
                  return (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVariant(v)}
                      className={`px-4 py-2 rounded-xl border text-sm font-semibold transition-all ${
                        active
                          ? "bg-primary-500 text-white border-primary-500 shadow-[0_2px_12px_rgba(232,76,30,0.25)]"
                          : "bg-white text-[#3A3A3C] border-black/[0.08] hover:border-primary-500/40"
                      }`}
                    >
                      {v.name}
                      <span
                        className={`ml-1.5 text-xs ${active ? "text-white/70" : "text-[#8E8E93]"}`}
                      >
                        {formatNumber(v.price, true)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Addons */}
          {hasAddons &&
            item.addons.map((group) => {
              const selected = selectedAddons[group.id] || [];
              return (
                <div key={group.id} className="mb-5">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#8E8E93]">
                      {group.name}
                    </p>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        group.required
                          ? "bg-red-50 text-red-500"
                          : "bg-[#F2F2F7] text-[#8E8E93]"
                      }`}
                    >
                      {group.required ? "Required" : "Optional"} · max{" "}
                      {group.max}
                    </span>
                  </div>
                  <div className="space-y-1.5">
                    {group.options.map((opt) => {
                      const isSelected = selected.some((o) => o.id === opt.id);
                      return (
                        <button
                          key={opt.id}
                          onClick={() => toggleAddonOption(group, opt)}
                          className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl border transition-all text-left ${
                            isSelected
                              ? "bg-primary-500/[0.06] border-primary-500/30"
                              : "bg-white border-black/[0.06] hover:border-primary-500/25"
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <div
                              className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${
                                isSelected
                                  ? "border-primary-500 bg-primary-500"
                                  : "border-black/20"
                              }`}
                            >
                              {isSelected && (
                                <div className="w-1.5 h-1.5 rounded-full bg-white" />
                              )}
                            </div>
                            <span className="text-sm font-medium text-[#3A3A3C]">
                              {opt.name}
                            </span>
                          </div>
                          {opt.price > 0 && (
                            <span className="text-sm font-semibold text-primary-500">
                              +{formatNumber(opt.price, true)}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}

          {/* Special instructions */}
          {item.allowNotes && (
            <div className="mb-3">
              <button
                onClick={() => setNoteOpen((v) => !v)}
                className="flex items-center gap-2 text-sm font-semibold text-primary-500 mb-2"
              >
                <Plus size={14} />
                Add special instructions
                <ChevronDown
                  size={14}
                  className={`transition-transform ${noteOpen ? "rotate-180" : ""}`}
                />
              </button>
              {noteOpen && (
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="e.g. Less spicy, no onion..."
                  rows={2}
                  maxLength={100}
                  className="w-full bg-white border border-black/[0.08] rounded-xl px-3.5 py-2.5 text-sm text-[#1C1C1E] placeholder-[#C7C7CC] outline-none focus:border-primary-500/50 resize-none transition-colors"
                />
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-4 border-t border-black/[0.05] bg-white shrink-0">
          <div className="flex items-center gap-3">
            {/* Qty */}
            <div className="flex items-center gap-2 bg-[#F2F2F7] rounded-xl px-2 py-1.5">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="w-7 h-7 rounded-lg bg-white border border-black/[0.08] flex items-center justify-center shadow-sm"
              >
                <Minus size={13} className="text-[#3A3A3C]" />
              </button>
              <span className="text-sm font-bold text-[#1C1C1E] w-5 text-center">
                {qty}
              </span>
              <button
                onClick={() =>
                  setQty((q) => Math.min(item.maxQty || 10, q + 1))
                }
                className="w-7 h-7 rounded-lg bg-primary-500 flex items-center justify-center shadow-sm shadow-primary-500/25"
              >
                <Plus size={13} className="text-white" />
              </button>
            </div>

            {/* Add button */}
            <button
              onClick={handleAdd}
              className="flex-1 bg-primary-500 text-white font-bold text-sm py-3 rounded-xl flex items-center justify-center gap-2 shadow-[0_4px_16px_rgba(232,76,30,0.3)] hover:bg-primary-600 active:scale-[0.98] transition-all"
            >
              Add to Order
              <span className="bg-white/20 text-white text-xs font-bold px-2 py-0.5 rounded-md">
                {formatNumber(totalPrice, true)}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
export default ItemDetailSheet;
