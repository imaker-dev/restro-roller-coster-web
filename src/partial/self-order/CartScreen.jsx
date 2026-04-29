// ─────────────────────────────────────────────────────────────────────────────
// CART SCREEN

import {
  ChevronLeft,
  Minus,
  Plus,
  ReceiptIndianRupee,
  ShoppingBag,
  Trash2,
} from "lucide-react";
import { formatNumber } from "../../utils/numberFormatter";
import FoodTypeIcon from "../common/FoodTypeIcon";
import toast from "react-hot-toast";
import { handleResponse } from "../../utils/helpers";
import {
  fetchCurrentOrderStatus,
  placeSelfOrder,
  saveSelfOrderCart,
} from "../../redux/slices/publicMenuSlice";
import { useDispatch } from "react-redux";
import { useState } from "react";

// ─────────────────────────────────────────────────────────────────────────────
function CartScreen({
  cart,
  session,
  onBack,
  onOrderSuccess,
  onUpdateCart,
  token,
  loading = false,
}) {
  const dispatch = useDispatch();
  const [specialNote, setSpecialNote] = useState("");

  const subtotal = cart.reduce((s, i) => s + i.unitPrice * i.quantity, 0);
  const taxes = Math.round(subtotal * 0.05);
  const total = subtotal + taxes;

  const handleRemove = (idx) => {
    const updated = cart.filter((_, i) => i !== idx);
    onUpdateCart(updated);
  };

  const handleQty = (idx, delta) => {
    const updated = cart.map((item, i) =>
      i === idx
        ? { ...item, quantity: Math.max(1, item.quantity + delta) }
        : item,
    );
    onUpdateCart(updated);
  };

  const handlePlaceOrder = async () => {
    if (!cart.length) return;

    // Save cart first
    // Place order
    const orderPayload = {
      customerName: session.customerName,
      customerPhone: session.customerPhone,
      specialInstructions: specialNote.trim() || null,
      items: cart.map((i) => ({
        itemId: i.itemId,
        variantId: i.variantId ?? null,
        quantity: i.quantity,
        specialInstructions: i.specialInstructions ?? null,
        addons: (i.addons || []).map((a) => ({
          addonId: a.addonId,
          addonGroupId: a.addonGroupId,
          quantity: a.quantity,
        })),
      })),
    };

    await handleResponse(
      dispatch(placeSelfOrder({ token, values: orderPayload })),
      (res) => {
        dispatch(fetchCurrentOrderStatus({ token }));
        onOrderSuccess(res.payload.data);
      },
    );

    // await handleResponse(
    //   dispatch(saveSelfOrderCart({ token, values: cart })),
    //   async () => {
    //     // Place order
    //     const orderPayload = {
    //       customerName: session.customerName,
    //       customerPhone: session.customerPhone,
    //       specialInstructions: specialNote.trim() || null,
    //       items: cart.map((i) => ({
    //         itemId: i.itemId,
    //         variantId: i.variantId ?? null,
    //         quantity: i.quantity,
    //         specialInstructions: i.specialInstructions ?? null,
    //         addons: (i.addons || []).map((a) => ({
    //           addonId: a.addonId,
    //           addonGroupId: a.addonGroupId,
    //           quantity: a.quantity,
    //         })),
    //       })),
    //     };

    //     await handleResponse(
    //       dispatch(placeSelfOrder({ token, values: orderPayload })),
    //       (res) => {
    //         dispatch(fetchCurrentOrderStatus({ token }));
    //         onOrderSuccess(res.payload.data);
    //       },
    //     );
    //   },
    // );
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
          <h1 className="text-white font-bold text-base">Your Order</h1>
          <p className="text-white/40 text-xs">
            {cart.length} item{cart.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      <div className="w-full max-w-3xl mx-auto">
        {cart.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
            <div className="w-20 h-20 bg-[#F0EDE8] rounded-full flex items-center justify-center mb-4">
              <ShoppingBag size={30} className="text-black/20" />
            </div>
            <h2 className="text-lg font-bold text-[#1C1C1E] mb-1">
              Cart is empty
            </h2>
            <p className="text-sm text-[#8E8E93] mb-6">
              Add items from the menu to get started
            </p>
            <button
              onClick={onBack}
              className="btn bg-primary-500 hover:bg-primary-600 text-white"
            >
              Browse Menu
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 px-4 pt-4 pb-32 space-y-3 overflow-y-auto">
              {/* Cart Items */}
              {cart.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-2xl border border-black/[0.05] p-3.5 shadow-sm"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <FoodTypeIcon type="veg" size="sm" />
                        <p className="text-sm font-bold text-[#1C1C1E] leading-snug">
                          {item.name}
                        </p>
                      </div>
                      {item.variantName && (
                        <p className="text-xs text-[#8E8E93] mb-0.5">
                          {item.variantName}
                        </p>
                      )}
                      {item.addons?.length > 0 && (
                        <p className="text-xs text-[#8E8E93] mb-0.5">
                          + {item.addons.map((a) => a.name).join(", ")}
                        </p>
                      )}
                      {item.specialInstructions && (
                        <p className="text-xs text-primary-500 mt-1 italic">
                          "{item.specialInstructions}"
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => handleRemove(idx)}
                      className="w-7 h-7 bg-[#F2F2F7] rounded-lg flex items-center justify-center shrink-0"
                    >
                      <Trash2 size={13} className="text-[#8E8E93]" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    <p className="text-sm font-bold text-primary-500">
                      {formatNumber(item.unitPrice * item.quantity, true)}
                    </p>
                    <div className="flex items-center gap-2 bg-[#F2F2F7] rounded-xl px-2 py-1">
                      <button
                        onClick={() => handleQty(idx, -1)}
                        className="w-6 h-6 rounded-lg bg-white border border-black/[0.07] flex items-center justify-center shadow-sm"
                      >
                        <Minus size={11} className="text-[#3A3A3C]" />
                      </button>
                      <span className="text-sm font-bold text-[#1C1C1E] w-5 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleQty(idx, 1)}
                        className="w-6 h-6 rounded-lg bg-primary-500 flex items-center justify-center shadow-sm shadow-primary-500/20"
                      >
                        <Plus size={11} className="text-white" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Special Instructions */}
              <div className="bg-white rounded-2xl border border-black/[0.05] p-3.5 shadow-sm">
                <label className="text-xs font-bold text-[#8E8E93] uppercase tracking-wider mb-2 block">
                  Order Instructions
                </label>
                <textarea
                  value={specialNote}
                  onChange={(e) => setSpecialNote(e.target.value)}
                  placeholder="Any special instructions for the kitchen?"
                  rows={2}
                  maxLength={200}
                  className="w-full bg-[#F2F2F7] rounded-xl px-3 py-2.5 text-sm text-[#1C1C1E] placeholder-[#C7C7CC] outline-none resize-none"
                />
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
                      {formatNumber(subtotal, true)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#3A3A3C]">GST (5%)</span>
                    <span className="font-semibold text-[#1C1C1E]">
                      {formatNumber(taxes, true)}
                    </span>
                  </div>
                  <div className="h-px bg-[#F2F2F7] my-1" />
                  <div className="flex justify-between">
                    <span className="font-bold text-[#1C1C1E]">Total</span>
                    <span className="font-bold text-primary-500 text-base">
                      {formatNumber(total, true)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Place Order Footer */}
            <div className="fixed bottom-0 left-0 right-0 max-w-2xl mx-auto  px-4 py-4">
              <button
                onClick={handlePlaceOrder}
                disabled={loading}
                className="w-full bg-[#0F0F0F] text-white font-bold text-sm py-3 rounded-2xl flex items-center justify-between px-5 shadow-lg hover:bg-[#1A1A1A] active:scale-[0.98] transition-all disabled:opacity-50"
              >
                <div className="flex items-center gap-2">
                  {loading ? (
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <ReceiptIndianRupee size={16} />
                  )}
                  {loading ? "Placing Order..." : "Place Order"}
                </div>
                <span className="bg-primary-500 text-white text-sm font-bold px-3 py-1 rounded-xl">
                  {formatNumber(total, true)}
                </span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default CartScreen;
