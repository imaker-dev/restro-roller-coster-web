// ─────────────────────────────────────────────────────────────────────────────
// LIST ROW

import { Minus, Plus, Utensils } from "lucide-react";
import { formatNumber } from "../../utils/numberFormatter";
import FoodTypeIcon from "../common/FoodTypeIcon";

// ─────────────────────────────────────────────────────────────────────────────
function ItemListRow({ item, cartQty, onSelect, onQuickAdd, onChangeQty }) {
  return (
    <div
      onClick={() => onSelect(item)}
      className="bg-white rounded-2xl border border-black/[0.06] shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer flex items-stretch overflow-hidden group"
      style={{ height: 80 }}
    >
      {/* Image */}
      <div className="w-[80px] shrink-0 bg-[#F5F1EC] relative">
        {item.img ? (
          <img
            src={item.img}
            alt={item.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Utensils size={20} className="text-black/10" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 px-3 py-2.5 flex flex-col justify-between">
        <div className="flex items-start gap-1.5">
          <FoodTypeIcon type={item.type} size="sm" />
          <p className="text-[13px] font-semibold text-[#1C1C1E] leading-snug line-clamp-2 flex-1">
            {item.name}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-[#1C1C1E]">
              {formatNumber(item.price,true)}
            </p>
            {item.variants?.length > 0 && (
              <p className="text-[10px] text-[#8E8E93] -mt-0.5">
                {item.variants.length} sizes
              </p>
            )}
          </div>

          {cartQty > 0 ? (
            <div
              className="flex items-center gap-1.5"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onChangeQty(item, -1);
                }}
                className="w-6 h-6 rounded-full border-[1.5px] border-primary-500 flex items-center justify-center"
              >
                <Minus size={10} className="text-primary-500" />
              </button>
              <span className="text-sm font-bold text-primary-500 w-4 text-center">
                {cartQty}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onQuickAdd(item);
                }}
                className="w-6 h-6 rounded-full bg-primary-500 flex items-center justify-center shadow-sm shadow-primary-500/25"
              >
                <Plus size={10} className="text-white" />
              </button>
            </div>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onQuickAdd(item);
              }}
              className="flex items-center gap-1 bg-primary-500/[0.08] hover:bg-primary-500 text-primary-500 hover:text-white border border-primary-500/30 hover:border-primary-500 px-2.5 py-1 rounded-lg text-xs font-bold transition-all"
            >
              <Plus size={11} /> Add
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ItemListRow;