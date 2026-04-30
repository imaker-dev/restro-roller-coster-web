// ─────────────────────────────────────────────────────────────────────────────
// GRID CARD

import { Clock, Minus, Plus, Utensils } from "lucide-react";
import FoodTypeIcon from "../common/FoodTypeIcon";
import { formatNumber } from "../../utils/numberFormatter";

// ─────────────────────────────────────────────────────────────────────────────
function ItemGridCard({ item, cartQty, onSelect, onQuickAdd, onChangeQty }) {
  return (
    <div
      onClick={() => onSelect(item)}
      className="bg-white rounded-2xl overflow-hidden border border-black/[0.06] shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer group flex flex-col"
    >
      {/* Image */}
      <div className="relative h-24 bg-[#F5F1EC] shrink-0">
        {item.img ? (
          <img
            src={item.img}
            alt={item.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Utensils size={22} className="text-black/10" />
          </div>
        )}
        <div className="absolute top-2 left-2">
          <FoodTypeIcon type={item.type} size="sm" />
        </div>
      </div>

      {/* Body */}
      <div className="p-2.5 flex flex-col flex-1">
        <p className="text-xs font-bold text-[#1C1C1E] leading-snug line-clamp-2 mb-1.5">
          {item.name}
        </p>
        {item.prepTime && (
          <div className="flex items-center gap-1 mb-2">
            <Clock size={9} className="text-[#8E8E93]" />
            <span className="text-[10px] text-[#8E8E93]">{item.prepTime}m</span>
          </div>
        )}
        <div className="mt-auto flex items-center justify-between">
          <p className="text-xs font-bold text-[#1C1C1E]">{formatNumber(item.price,true)}</p>

          {cartQty > 0 ? (
            <div
              className="flex items-center gap-1"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onChangeQty(item, -1);
                }}
                className="w-5 h-5 rounded-full border border-primary-500 flex items-center justify-center"
              >
                <Minus size={9} className="text-primary-500" />
              </button>
              <span className="text-xs font-bold text-primary-500 w-4 text-center">
                {cartQty}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onQuickAdd(item);
                }}
                className="w-5 h-5 rounded-full bg-primary-500 flex items-center justify-center"
              >
                <Plus size={9} className="text-white" />
              </button>
            </div>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onQuickAdd(item);
              }}
              className="w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center shadow-sm shadow-primary-500/30 hover:bg-[#D44219] active:scale-90 transition-all"
            >
              <Plus size={12} className="text-white" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ItemGridCard;