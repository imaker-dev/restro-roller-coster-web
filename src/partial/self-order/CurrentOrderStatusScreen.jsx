// ─────────────────────────────────────────────────────────────────────────────
// ORDER STATUS SCREEN

import { AlertCircle, ChevronLeft, Receipt, Trash2 } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { handleResponse } from "../../utils/helpers";
import { cancelSelfOrder } from "../../redux/slices/publicMenuSlice";
import OrderBadge from "../order/OrderBadge";
import { formatDate } from "../../utils/dateFormatter";
import FoodTypeIcon from "../common/FoodTypeIcon";
import { formatNumber } from "../../utils/numberFormatter";

// ─────────────────────────────────────────────────────────────────────────────
function CurrentOrderStatusScreen({
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
          <p className="text-white/40 text-xs">#{order?.orderNumber}</p>
        </div>
      </div>

      <div className="w-full max-w-3xl mx-auto p-4">
        <div className="flex-1 pb-32 space-y-4 overflow-y-auto">
          {/* Order Status Banner */}
          <div
            className={`rounded-2xl p-4 border ${
              order?.status === "cancelled"
                ? "bg-red-50 border-red-100"
                : "bg-white border-black/[0.06]"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-bold text-[#1C1C1E]">
                Order #{order?.orderNumber}
              </h2>
              <OrderBadge value={order?.status} size="sm" />
            </div>
            <div className="text-xs text-[#8E8E93] space-y-1">
              <p>Placed: {formatDate(order?.createdAt, "longTime")}</p>
            </div>
          </div>

          {/* Items */}
          <div className="bg-white rounded-2xl border border-black/[0.05] shadow-sm overflow-hidden">
            <div className="p-4 border-b border-[#F2F2F7]">
              <h3 className="font-bold text-sm text-[#1C1C1E]">
                Items ({order?.items.length})
              </h3>
            </div>
            <div className="divide-y divide-[#F2F2F7]">
              {order?.items?.map((item) => (
                <div
                  key={item?.id}
                  className="p-4 hover:bg-[#FAF8F5] transition-colors"
                >
                  <div className="flex items-start justify-between mb-1">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <FoodTypeIcon type={item?.itemType} size="sm" />
                        <h4 className="font-semibold text-sm text-[#1C1C1E] truncate">
                          {item?.name}
                        </h4>
                      </div>
                      {item?.variantName && (
                        <p className="text-xs text-[#8E8E93] ml-6">
                          {item?.variantName}
                        </p>
                      )}
                    </div>
                    <OrderBadge value={item?.status} size="sm" />
                  </div>

                  {item?.specialInstructions && (
                    <p className="text-xs text-primary-500 mt-1 italic">
                      "{item?.specialInstructions}"
                    </p>
                  )}

                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-3 text-xs text-[#8E8E93]">
                      <span>Qty: {item?.quantity}</span>
                      <span>{formatNumber(item?.unitPrice, true)} each</span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-[#1C1C1E]">
                        {formatNumber(item?.totalPrice, true)}
                      </p>
                    </div>
                  </div>

                  {!canModifyItem(item?.status) &&
                    item?.status !== "pending" && (
                      <div className="mt-2 flex items-center gap-1.5 text-[10px] text-[#8E8E93] bg-[#F2F2F7] rounded-lg px-2 py-1.5">
                        <AlertCircle size={11} className="shrink-0" />
                        <span>
                          {item?.status === "cancelled"
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
                  {formatNumber(order?.subtotal, true)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#3A3A3C]">Tax</span>
                <span className="font-semibold text-[#1C1C1E]">
                  {formatNumber(order?.taxAmount, true)}
                </span>
              </div>
              <div className="h-px bg-[#F2F2F7] my-1" />
              <div className="flex justify-between">
                <span className="font-bold text-[#1C1C1E]">Total</span>
                <span className="font-bold text-primary-500 text-base">
                  {formatNumber(order?.totalAmount, true)}
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

        {!canCancelOrder() && order?.status !== "cancelled" && (
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

export default CurrentOrderStatusScreen;
