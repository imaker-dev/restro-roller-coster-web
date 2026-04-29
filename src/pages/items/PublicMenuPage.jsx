import { useState, useRef, useEffect, useCallback } from "react";
import {
  Search,
  X,
  SlidersHorizontal,
  LayoutGrid,
  List,
  ChevronLeft,
  ChevronRight,
  Plus,
  Minus,
  ShoppingBag,
  Clock,
  Flame,
  Leaf,
  Star,
  CheckCircle2,
  Utensils,
  User,
  Phone,
  ArrowRight,
  Trash2,
  Tag,
  AlertCircle,
  ChevronDown,
  MapPin,
  Receipt,
  IndianRupee,
  LogOut,
  ReceiptIndianRupee,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  cancelSelfOrder,
  clearSessionState,
  fetchCurrentOrderStatus,
  fetchCurrentSessionInfo,
  // fetchSessionInfo,
  fetchPublicMenu,
  fetchSelfOrderCart,
  placeSelfOrder,
  saveSelfOrderCart,
  startSelfOrderSession,
  updateSelfOrderCustomerInfo,
} from "../../redux/slices/publicMenuSlice";
import { useQueryParams } from "../../hooks/useQueryParams";
import { handleResponse } from "../../utils/helpers";
import OrderBadge from "../../partial/order/OrderBadge";
import { formatDate } from "../../utils/dateFormatter";
import { TOKEN_KEYS } from "../../constants";
import ModalAction from "../../components/ModalAction";
import FoodTypeIcon from "../../partial/common/FoodTypeIcon";
import { formatNumber } from "../../utils/numberFormatter";
import toast from "react-hot-toast";
import { getDeviceId } from "../../utils/deviceId";
import SessionScreen from "../../partial/self-order/SessionScreen";
import CartScreen from "../../partial/self-order/CartScreen";

// ─────────────────────────────────────────────────────────────────────────────
// UTILITIES
// ─────────────────────────────────────────────────────────────────────────────
const fmt = (p) => formatNumber(p, true);

// ─────────────────────────────────────────────────────────────────────────────
// ITEM DETAIL BOTTOM SHEET
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
                {fmt(basePrice)}
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
                        {fmt(v.price)}
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
                              +{fmt(opt.price)}
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
                {fmt(totalPrice)}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// GRID CARD
// ─────────────────────────────────────────────────────────────────────────────
function GridCard({ item, cartQty, onSelect, onQuickAdd, onChangeQty }) {
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
          <p className="text-xs font-bold text-[#1C1C1E]">{fmt(item.price)}</p>

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

// ─────────────────────────────────────────────────────────────────────────────
// LIST ROW
// ─────────────────────────────────────────────────────────────────────────────
function ListRow({ item, cartQty, onSelect, onQuickAdd, onChangeQty }) {
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
              {fmt(item.price)}
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

// ─────────────────────────────────────────────────────────────────────────────
// SUCCESS SCREEN
// ─────────────────────────────────────────────────────────────────────────────
function SuccessScreen({ orderData, session, onContinue }) {
  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col items-center justify-center px-5 text-center">
      {/* Checkmark */}
      <div className="relative mb-6">
        <div className="w-24 h-24 rounded-full bg-emerald-500/10 flex items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center">
            <CheckCircle2
              size={36}
              className="text-emerald-500"
              strokeWidth={1.5}
            />
          </div>
        </div>
      </div>

      <h1 className="text-2xl font-bold text-[#1C1C1E] mb-2">
        Order Placed! 🎉
      </h1>
      <p className="text-[#6C6C70] text-sm mb-8 max-w-xs">
        Your order has been sent to the kitchen. We'll have it ready soon!
      </p>

      {/* Order Info Card */}
      <div className="w-full max-w-sm bg-white rounded-2xl border border-black/[0.06] shadow-sm p-4 mb-6">
        <div className="flex items-center gap-2 mb-3 pb-3 border-b border-[#F2F2F7]">
          <div className="w-8 h-8 bg-primary-500/10 rounded-lg flex items-center justify-center">
            <ReceiptIndianRupee size={15} className="text-primary-500" />
          </div>
          <div className="text-left">
            <p className="text-sm font-bold text-[#1C1C1E]">
              Order #{orderData?.orderNumber || "—"}
            </p>
            <p className="text-xs text-[#8E8E93]">Confirmed</p>
          </div>
        </div>
        <div className="space-y-2 text-sm text-left">
          <div className="flex justify-between">
            <span className="text-[#8E8E93]">Name</span>
            <span className="font-semibold text-[#1C1C1E]">
              {session.customerName}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#8E8E93]">Table</span>
            <span className="font-semibold text-[#1C1C1E]">
              {session.tableNumber || "—"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#8E8E93]">Status</span>
            <span className="font-semibold text-emerald-600">Preparing</span>
          </div>
        </div>
      </div>

      <button
        onClick={onContinue}
        className="btn bg-primary-500 hover:bg-primary-600 text-white"
      >
        Continue Browsing
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ORDER STATUS SCREEN
// ─────────────────────────────────────────────────────────────────────────────
function OrderStatusScreen({
  orderData,
  session,
  onBack,
  onOrderCancelled,
  token,
}) {
  const dispatch = useDispatch();
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [cancelling, setCancelling] = useState(false);

  const { hasOrder, order } = orderData || {};

  if (!hasOrder || !order) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex flex-col items-center justify-center px-5">
        <div className="w-16 h-16 bg-[#F0EDE8] rounded-full flex items-center justify-center mb-4">
          <Receipt size={30} className="text-black/20" />
        </div>
        <h2 className="text-lg font-bold text-[#1C1C1E] mb-2">
          No Active Order
        </h2>
        <p className="text-sm text-[#8E8E93] mb-6">
          You don't have any active orders
        </p>
        <button
          onClick={onBack}
          className="btn bg-primary-500 hover:bg-primary-600 text-white"
        >
          Browse Menu
        </button>
      </div>
    );
  }

  const canModifyItem = (itemStatus) => {
    return itemStatus === "pending";
  };

  const canCancelOrder = () => {
    return order.status === "pending" || order.status === "confirmed";
  };

  const handleCancelOrder = async () => {
    if (!cancelReason.trim()) {
      toast.error("Please provide a reason for cancellation", "error");
      return;
    }

    setCancelling(true);
    try {
      await handleResponse(
        dispatch(
          cancelSelfOrder({
            token,
            reason: cancelReason.trim(),
          }),
        ),
        (res) => {
          setShowCancelModal(false);
          setCancelReason("");
          onOrderCancelled();
        },
      );
    } catch {
      toast.error("Failed to cancel order. Please try again.", "error");
    } finally {
      setCancelling(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col">
      {/* Header */}
      <div className="bg-[#0F0F0F] px-4 py-3 flex items-center gap-3 sticky top-0 z-20">
        <button
          onClick={onBack}
          className="w-8 h-8 bg-white/10 rounded-xl flex items-center justify-center"
        >
          <ChevronLeft size={18} className="text-white" />
        </button>
        <div className="flex-1">
          <h1 className="text-white font-bold text-base">Order Status</h1>
          <p className="text-white/40 text-xs">#{order.orderNumber}</p>
        </div>
      </div>

      <div className="w-full max-w-3xl mx-auto p-4">
        <div className="flex-1 pb-32 space-y-4 overflow-y-auto">
          {/* Order Status Banner */}
          <div
            className={`rounded-2xl p-4 border ${
              order.status === "cancelled"
                ? "bg-red-50 border-red-100"
                : "bg-white border-black/[0.06]"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-bold text-[#1C1C1E]">
                Order #{order.orderNumber}
              </h2>
              <OrderBadge value={order.status} size="sm" />
            </div>
            <div className="text-xs text-[#8E8E93] space-y-1">
              <p>Placed: {formatDate(order.createdAt, "longTime")}</p>
            </div>
          </div>

          {/* Items */}
          <div className="bg-white rounded-2xl border border-black/[0.05] shadow-sm overflow-hidden">
            <div className="p-4 border-b border-[#F2F2F7]">
              <h3 className="font-bold text-sm text-[#1C1C1E]">
                Items ({order.items.length})
              </h3>
            </div>
            <div className="divide-y divide-[#F2F2F7]">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="p-4 hover:bg-[#FAF8F5] transition-colors"
                >
                  <div className="flex items-start justify-between mb-1">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <FoodTypeIcon type={item.itemType} size="sm" />
                        <h4 className="font-semibold text-sm text-[#1C1C1E] truncate">
                          {item.name}
                        </h4>
                      </div>
                      {item.variantName && (
                        <p className="text-xs text-[#8E8E93] ml-6">
                          {item.variantName}
                        </p>
                      )}
                    </div>
                    <OrderBadge value={item.status} size="sm" />
                  </div>

                    {item.specialInstructions && (
                        <p className="text-xs text-primary-500 mt-1 italic">
                          "{item.specialInstructions}"
                        </p>
                      )}

                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-3 text-xs text-[#8E8E93]">
                      <span>Qty: {item.quantity}</span>
                      <span>{fmt(item.unitPrice)} each</span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-[#1C1C1E]">
                        {fmt(item.totalPrice)}
                      </p>
                    </div>
                  </div>

                  {!canModifyItem(item.status) && item.status !== "pending" && (
                    <div className="mt-2 flex items-center gap-1.5 text-[10px] text-[#8E8E93] bg-[#F2F2F7] rounded-lg px-2 py-1.5">
                      <AlertCircle size={11} className="shrink-0" />
                      <span>
                        {item.status === "cancelled"
                          ? "This item has been cancelled"
                          : "This item has been sent to the kitchen and cannot be modified"}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Bill Summary */}
          <div className="bg-white rounded-2xl border border-black/[0.05] p-4 shadow-sm">
            <p className="text-xs font-bold text-[#8E8E93] uppercase tracking-wider mb-3">
              Bill Summary
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-[#3A3A3C]">Subtotal</span>
                <span className="font-semibold text-[#1C1C1E]">
                  {fmt(order.subtotal)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#3A3A3C]">Tax</span>
                <span className="font-semibold text-[#1C1C1E]">
                  {fmt(order.taxAmount)}
                </span>
              </div>
              <div className="h-px bg-[#F2F2F7] my-1" />
              <div className="flex justify-between">
                <span className="font-bold text-[#1C1C1E]">Total</span>
                <span className="font-bold text-primary-500 text-base">
                  {fmt(order.totalAmount)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Actions Footer */}
      <div className="fixed bottom-0 left-0 right-0 z-30 px-4 pb-4 max-w-3xl mx-auto">
        {canCancelOrder() && (
          <button
            onClick={() => setShowCancelModal(true)}
            className="w-full bg-white text-red-500 font-bold text-sm py-3 rounded-2xl border-2 border-red-200 hover:border-red-300 hover:bg-red-50 active:scale-[0.98] transition-all"
          >
            Cancel Order
          </button>
        )}

        {!canCancelOrder() && order.status !== "cancelled" && (
          <p className="text-xs text-[#8E8E93] text-center px-2">
            Order cannot be cancelled — it is already being prepared. Please ask
            staff for assistance.
          </p>
        )}
      </div>

      {/* Cancel Order Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowCancelModal(false)}
          />
          <div className="relative w-full max-w-lg bg-white rounded-t-3xl shadow-2xl p-6 animate-[slideUp_0.3s_cubic-bezier(0.32,0.72,0,1)]">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center">
                <AlertCircle size={24} className="text-red-500" />
              </div>
            </div>

            <h3 className="text-lg font-bold text-[#1C1C1E] text-center mb-2">
              Cancel Order?
            </h3>
            <p className="text-sm text-[#8E8E93] text-center mb-4">
              Are you sure you want to cancel this order? This action cannot be
              undone.
            </p>

            <div className="mb-4">
              <label className="text-xs font-bold text-[#8E8E93] uppercase tracking-wider mb-2 block">
                Reason for Cancellation
              </label>
              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="e.g. Changed my mind, Taking too long..."
                rows={2}
                maxLength={200}
                className="w-full bg-[#F2F2F7] rounded-xl px-3.5 py-2.5 text-sm text-[#1C1C1E] placeholder-[#C7C7CC] outline-none focus:border-red-400/50 resize-none border border-transparent focus:bg-white focus:border-red-300 transition-all"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  setShowCancelModal(false);
                  setCancelReason("");
                }}
                className="flex-1 bg-[#F2F2F7] text-[#3A3A3C] font-bold text-sm py-3 rounded-xl hover:bg-[#E5E5EA] active:scale-[0.98] transition-all"
              >
                Keep Order
              </button>
              <button
                onClick={handleCancelOrder}
                disabled={cancelling || !cancelReason.trim()}
                className="flex-1 bg-red-500 text-white font-bold text-sm py-3 rounded-xl hover:bg-red-600 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {cancelling ? (
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Trash2 size={16} />
                    Cancel Order
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN MENU PAGE
// ─────────────────────────────────────────────────────────────────────────────
export default function PublicMenuPage() {
  const dispatch = useDispatch();
  const { outlet, table, sessionToken } = useQueryParams();
  const {
    qrSessionToken,
    isStartingSelfOrderSession,
    publicMenuData,
    isFetchingPublicMenu,
    isFetchingCart,
    selfOrderCartData,

    isFetchingCurrentSession,
    currentSessionInfo,

    isFetchingCurrentOrderStatus,
    currentOrderStatus,

    isSavingCart,
    isPlacingSelfOrder
  } = useSelector((s) => s.publicMenu);

  const isValidUrl = outlet && table;

  // Show fallback if outlet or table is missing
  if (!isValidUrl) {
    return <InvalidUrlFallback />;
  }

  // Screens: "session" | "menu" | "cart" | "success" | ""
  const [screen, setScreen] = useState("session");
  const [session, setSession] = useState(null);
  const [cart, setCart] = useState([]);
  const [orderResult, setOrderResult] = useState(null);

  // Menu state
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [vegFilter, setVegFilter] = useState("all"); // "all" | "veg" | "non_veg"
  const [viewMode, setViewMode] = useState("list");
  const [selectedItem, setSelectedItem] = useState(null);

  const catScrollRef = useRef(null);

  useEffect(() => {
    getDeviceId(); // just initializes once
  }, []);

  // Check existing session on mount
  useEffect(() => {
    if (qrSessionToken) {
      dispatch(fetchPublicMenu({ outletId: outlet }));
      dispatch(fetchSelfOrderCart({ token: qrSessionToken }));
      dispatch(fetchCurrentSessionInfo({ token: qrSessionToken }));
      dispatch(fetchCurrentOrderStatus({ token: qrSessionToken }));
      setScreen("menu");
    }
  }, []);

  // Update session info when currentSessionInfo changes
  useEffect(() => {
    if (currentSessionInfo) {
      setSession((prev) => ({
        ...prev,
        ...currentSessionInfo,
        outletName: currentSessionInfo.outletName,
        tableNumber: currentSessionInfo.tableNumber,
        tableName: currentSessionInfo.tableName,
        floorName: currentSessionInfo.floorName,
      }));
    }
  }, [currentSessionInfo]);

  // Load saved cart from redux
  useEffect(() => {
    if (selfOrderCartData?.items?.length) setCart(selfOrderCartData.items);
  }, [selfOrderCartData]);

  const handleSessionSuccess = async (sessionData) => {
    await handleResponse(
      dispatch(fetchCurrentSessionInfo({ token: sessionData.token })),
    );

    dispatch(fetchPublicMenu({ outletId: outlet }));
    setScreen("menu");
  };

  const categories = publicMenuData?.menu || [];

  // Build flat all-items map
  const allItems = categories.flatMap((c) => c.items || []);

  // Filtered items for current view
  const getFilteredItems = () => {
    let items =
      activeCategory === "All"
        ? allItems
        : categories.find((c) => c.name === activeCategory)?.items || [];

    if (vegFilter !== "all") items = items.filter((i) => i.type === vegFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      items = items.filter(
        (i) =>
          i.name.toLowerCase().includes(q) ||
          (i.description || "").toLowerCase().includes(q),
      );
    }
    return items;
  };

  const cartItemCount = cart.reduce((s, i) => s + i.quantity, 0);
  const cartItemQty = (itemId) =>
    cart.filter((c) => c.itemId === itemId).reduce((s, c) => s + c.quantity, 0);

  const handleQuickAdd = (item) => {
    // If item has variants/required addons, open detail sheet
    if (item.variants?.length > 0 || item.addons?.some((g) => g.required)) {
      setSelectedItem(item);
      return;
    }
    setCart((prev) => {
      const existing = prev.findIndex(
        (c) => c.itemId === item.id && !c.variantId && !c.addons?.length,
      );
      if (existing >= 0) {
        return prev.map((c, i) =>
          i === existing ? { ...c, quantity: c.quantity + 1 } : c,
        );
      }
      return [
        ...prev,
        {
          itemId: item.id,
          variantId: null,
          name: item.name,
          variantName: null,
          quantity: 1,
          unitPrice: item.price,
          specialInstructions: null,
          addons: [],
        },
      ];
    });

    toast.success(`${item.name} added`, "success");
  };

  const handleChangeQty = (item, delta) => {
    setCart((prev) => {
      const idx = prev.findLastIndex((c) => c.itemId === item.id);
      if (idx < 0) return prev;
      const updated = [...prev];
      if (updated[idx].quantity + delta <= 0) {
        return updated.filter((_, i) => i !== idx);
      }
      updated[idx] = {
        ...updated[idx],
        quantity: updated[idx].quantity + delta,
      };
      return updated;
    });
  };

  const handleAddFromSheet = (cartEntry) => {
    setCart((prev) => [...prev, cartEntry]);
    toast.success(`${cartEntry.name} added`, "success");
  };

  const scrollToCategory = (cat) => {
    setActiveCategory(cat);
    setSearch("");
    if (catScrollRef.current) {
      const btns = catScrollRef.current.querySelectorAll("[data-cat]");
      btns.forEach((btn) => {
        if (btn.dataset.cat === cat) {
          btn.scrollIntoView({
            behavior: "smooth",
            inline: "center",
            block: "nearest",
          });
        }
      });
    }
  };

  // Add this handler for order cancellation:
  const handleOrderCancelled = () => {
    // Refresh order status
    if (qrSessionToken) {
      dispatch(fetchCurrentOrderStatus({ token: qrSessionToken }));
      dispatch(fetchPublicMenu({ outletId: outlet }));
    }
    setScreen("menu");
  };

  const filteredItems = getFilteredItems();
  const showGrouped =
    activeCategory === "All" && !search.trim() && vegFilter === "all";

  // ── MENU SCREEN ──────────────────────────────────────────────────────────
  const MenuContent = ({ onLogout }) => {
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    const handleEndSession = async () => {
      dispatch(clearSessionState());
      onLogout();
      setShowLogoutModal(false);
    };

    return (
      <div className="min-h-screen bg-[#FAF8F5] flex flex-col">
        {/* ── HEADER ── */}
        <div className="bg-[#0F0F0F] sticky top-0 z-20 shadow-xl">
          {/* Top bar */}
          <div className="px-4 pt-3.5 pb-2.5 flex items-center gap-3">
            <div className="w-8 h-8 bg-primary-500 rounded-xl flex items-center justify-center shadow-md shadow-primary-500/30 shrink-0">
              <Utensils size={15} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-bold text-sm leading-tight truncate">
                {session?.outletName || "Restaurant"}
              </p>
              <div className="flex items-center gap-1">
                <MapPin size={10} className="text-white/30" />
                <p className="text-white/40 text-[11px] truncate">
                  {session?.tableName || session?.tableNumber || "Table"}
                </p>
              </div>
            </div>
            {/* Order Status */}
            {currentOrderStatus?.hasOrder && (
              <button
                onClick={() => setScreen("orderStatus")}
                className="relative bg-blue-600 w-9 h-9 rounded-xl flex items-center justify-center shadow-md shadow-blue-600/30 shrink-0"
                title="View Order Status"
              >
                <ReceiptIndianRupee size={16} className="text-white" />
              </button>
            )}

            {/* Cart */}
            <button
              onClick={() => setScreen("cart")}
              className="relative bg-primary-500 w-9 h-9 rounded-xl flex items-center justify-center shadow-md shadow-primary-500/30 shrink-0"
              title="View Cart"
            >
              <ShoppingBag size={16} className="text-white" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-white text-primary-500 text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
                  {cartItemCount > 9 ? "9+" : cartItemCount}
                </span>
              )}
            </button>

            {/* End Session */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowLogoutModal(true);
              }}
              className="w-9 h-9 bg-red-500/10 rounded-xl flex items-center justify-center shrink-0 hover:bg-red-500/20 transition-colors"
              title="End Session"
            >
              <LogOut
                size={16}
                className="text-red-400 hover:text-red-500 transition-colors"
              />
            </button>
          </div>

          {/* Search row */}
          <div className="px-4 pb-2.5">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30"
                />
                <input
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setActiveCategory("All");
                  }}
                  placeholder="Search dishes..."
                  className="w-full bg-white/[0.08] border border-white/[0.07] rounded-xl pl-9 pr-8 py-2.5 text-white text-sm placeholder-white/25 outline-none focus:border-white/20 transition-colors"
                />
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2"
                  >
                    <X size={13} className="text-white/40" />
                  </button>
                )}
              </div>
              {/* Veg filter */}
              <button
                onClick={() =>
                  setVegFilter((v) => (v === "veg" ? "all" : "veg"))
                }
                className={`w-9 h-9 rounded-xl flex items-center justify-center border transition-all shrink-0 ${
                  vegFilter === "veg"
                    ? "bg-emerald-500 border-emerald-500 shadow-md shadow-emerald-500/30"
                    : "bg-white/[0.07] border-white/[0.07]"
                }`}
              >
                <Leaf
                  size={15}
                  className={
                    vegFilter === "veg" ? "text-white" : "text-white/40"
                  }
                />
              </button>
              <button
                onClick={() =>
                  setVegFilter((v) => (v === "non_veg" ? "all" : "non_veg"))
                }
                className={`w-9 h-9 rounded-xl flex items-center justify-center border transition-all shrink-0 ${
                  vegFilter === "non_veg"
                    ? "bg-red-500 border-red-500 shadow-md shadow-red-500/30"
                    : "bg-white/[0.07] border-white/[0.07]"
                }`}
              >
                <Flame
                  size={15}
                  className={
                    vegFilter === "non_veg" ? "text-white" : "text-white/40"
                  }
                />
              </button>
              {/* View toggle */}
              <div className="flex bg-white/[0.07] rounded-xl p-0.5 gap-0.5 shrink-0">
                {["list", "grid"].map((v) => (
                  <button
                    key={v}
                    onClick={() => setViewMode(v)}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                      viewMode === v ? "bg-white/15" : ""
                    }`}
                  >
                    {v === "grid" ? (
                      <LayoutGrid
                        size={13}
                        className={
                          viewMode === v ? "text-white" : "text-white/35"
                        }
                      />
                    ) : (
                      <List
                        size={13}
                        className={
                          viewMode === v ? "text-white" : "text-white/35"
                        }
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Category pills */}
          <div
            ref={catScrollRef}
            className="flex gap-2 overflow-x-auto px-4 pb-3 scrollbar-none"
            style={{ scrollbarWidth: "none" }}
          >
            {["All", ...categories.map((c) => c.name)].map((cat) => (
              <button
                key={cat}
                data-cat={cat}
                onClick={() => scrollToCategory(cat)}
                className={`shrink-0 px-3.5 py-1.5 rounded-full text-[11px] font-bold transition-all ${
                  activeCategory === cat
                    ? "bg-primary-500 text-white shadow-md shadow-primary-500/30"
                    : "bg-white/[0.07] text-white/50 border border-white/[0.07] hover:bg-white/10"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* ── CONTENT ── */}
        <div className="flex-1 px-3 pt-3 pb-28 max-w-3xl w-full mx-auto">
          {isFetchingPublicMenu ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <div className="w-8 h-8 border-2 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
              <p className="text-[#8E8E93] text-sm">Loading menu...</p>
            </div>
          ) : showGrouped ? (
            categories.map((cat) => (
              <div key={cat.id} className="mb-5">
                <div className="flex items-center justify-between mb-2 px-0.5">
                  <h2 className="text-sm font-bold text-[#1C1C1E]">
                    {cat.name}
                    <span className="ml-1.5 text-xs font-normal text-[#8E8E93]">
                      ({cat.count || cat.items?.length || 0})
                    </span>
                  </h2>
                </div>
                {viewMode === "grid" ? (
                  <div className="grid grid-cols-3 gap-2">
                    {(cat.items || []).map((item) => (
                      <GridCard
                        key={item.id}
                        item={item}
                        cartQty={cartItemQty(item.id)}
                        onSelect={setSelectedItem}
                        onQuickAdd={handleQuickAdd}
                        onChangeQty={handleChangeQty}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    {(cat.items || []).map((item) => (
                      <ListRow
                        key={item.id}
                        item={item}
                        cartQty={cartItemQty(item.id)}
                        onSelect={setSelectedItem}
                        onQuickAdd={handleQuickAdd}
                        onChangeQty={handleChangeQty}
                      />
                    ))}
                  </div>
                )}
              </div>
            ))
          ) : filteredItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center px-6">
              <div className="w-16 h-16 bg-[#F0EDE8] rounded-full flex items-center justify-center mb-4">
                <Search size={24} className="text-black/15" />
              </div>
              <h3 className="text-base font-bold text-[#1C1C1E] mb-1">
                Nothing found
              </h3>
              <p className="text-sm text-[#8E8E93] mb-5">
                Try adjusting your search or filters
              </p>
              <button
                onClick={() => {
                  setSearch("");
                  setVegFilter("all");
                  setActiveCategory("All");
                }}
                className="text-primary-500 text-sm font-bold flex items-center gap-1"
              >
                <X size={14} /> Clear filters
              </button>
            </div>
          ) : (
            <>
              <p className="text-xs text-[#8E8E93] mb-2.5 px-0.5">
                {filteredItems.length} dishes
              </p>
              {viewMode === "grid" ? (
                <div className="grid lg:grid-cols-3 gap-2">
                  {filteredItems.map((item) => (
                    <GridCard
                      key={item.id}
                      item={item}
                      cartQty={cartItemQty(item.id)}
                      onSelect={setSelectedItem}
                      onQuickAdd={handleQuickAdd}
                      onChangeQty={handleChangeQty}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  {filteredItems.map((item) => (
                    <ListRow
                      key={item.id}
                      item={item}
                      cartQty={cartItemQty(item.id)}
                      onSelect={setSelectedItem}
                      onQuickAdd={handleQuickAdd}
                      onChangeQty={handleChangeQty}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* ── CART BAR ── */}
        {cartItemCount > 0 && (
          <div className="fixed bottom-0 left-0 right-0 z-30 px-4 pb-4 max-w-2xl mx-auto">
            <button
              onClick={() => setScreen("cart")}
              className="w-full bg-[#0F0F0F] text-white rounded-2xl px-4 py-3.5 flex items-center justify-between shadow-[0_8px_30px_rgba(0,0,0,0.25)] hover:bg-[#1A1A1A] active:scale-[0.98] transition-all"
            >
              <div className="flex items-center gap-3">
                <span className="bg-primary-500 text-white text-xs font-black px-2 py-0.5 rounded-lg">
                  {cartItemCount}
                </span>
                <span className="font-bold text-sm">View Cart</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm">
                  {fmt(cart.reduce((s, i) => s + i.unitPrice * i.quantity, 0))}
                </span>
                <ChevronRight size={16} className="text-white/50" />
              </div>
            </button>
          </div>
        )}

        {/* Item Detail Sheet */}
        {selectedItem && (
          <ItemDetailSheet
            item={selectedItem}
            cartItems={cart}
            onClose={() => setSelectedItem(null)}
            onAddToCart={handleAddFromSheet}
          />
        )}

        <ModalAction
          id="logout-modal"
          variant="minimal"
          isOpen={showLogoutModal}
          onClose={() => setShowLogoutModal(false)}
          onConfirm={handleEndSession}
          title="End Session?"
          description="This will clear your current session and you'll need to scan the QR code again to order."
          theme="danger"
          confirmText="End Session"
          cancelText="Cancel"
        />
      </div>
    );
  };

  function InvalidUrlFallback() {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex flex-col items-center justify-center px-5 text-center">
        <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mb-6">
          <AlertCircle size={40} className="text-red-500" />
        </div>

        <h1 className="text-xl font-bold text-[#1C1C1E] mb-2">
          Invalid QR Code
        </h1>

        <p className="text-[#6C6C70] text-sm max-w-xs">
          The restaurant or table information is missing from this QR code.
          Please contact the restaurant staff for assistance.
        </p>
      </div>
    );
  }

  // ── SCREEN ROUTER ──────────────────────────────────────────────────────────
  if (screen === "session") {
    return (
      <SessionScreen
        outletId={outlet}
        tableId={table}
        qrToken={sessionToken}
        onSuccess={handleSessionSuccess}
        loading={isStartingSelfOrderSession}
      />
    );
  }

  if (screen === "cart") {
    return (
      <CartScreen
        cart={cart}
        session={session}
        onBack={() => setScreen("menu")}
        onUpdateCart={setCart}
        onOrderSuccess={(res) => {
          setOrderResult(res);
          setCart([]);
          setScreen("success");
        }}
        token={qrSessionToken}
        loading={(isSavingCart || isPlacingSelfOrder)}
      />
    );
  }

  if (screen === "success") {
    return (
      <SuccessScreen
        orderData={orderResult}
        session={session}
        onContinue={() => setScreen("menu")}
      />
    );
  }

  if (screen === "orderStatus") {
    return (
      <OrderStatusScreen
        orderData={currentOrderStatus}
        session={session}
        onBack={() => setScreen("menu")}
        onOrderCancelled={handleOrderCancelled}
        token={qrSessionToken}
      />
    );
  }

  return <MenuContent onLogout={() => setScreen("session")} />;
}
