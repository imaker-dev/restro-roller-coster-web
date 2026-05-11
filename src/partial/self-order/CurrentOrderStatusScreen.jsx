// ORDER STATUS SCREEN

import {
  AlertCircle,
  ChevronLeft,
  Clock,
  Info,
  Receipt,
  ReceiptText,
  ShieldCheck,
  Trash2,
  X,
} from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { handleResponse } from "../../utils/helpers";
import { cancelSelfOrder } from "../../redux/slices/publicMenuSlice";
import OrderBadge from "../order/OrderBadge";
import { formatDate } from "../../utils/dateFormatter";
import FoodTypeIcon from "../common/FoodTypeIcon";
import { formatNumber } from "../../utils/numberFormatter";
import InfoCard from "../../components/InfoCard";

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

  const { hasOrder, order, pendingRequest } = orderData || {};

  const isPending = pendingRequest && !hasOrder;
  const activeOrder = isPending ? pendingRequest : order;

  if ((!hasOrder && !pendingRequest) || !activeOrder) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex flex-col items-center justify-center px-5">
        <div className="w-16 h-16 bg-[#F0EDE8] rounded-full flex items-center justify-center mb-4">
          <ReceiptText size={30} className="text-black/20" />
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
    if (isPending) return true;
    return (
      activeOrder?.status === "pending" || activeOrder?.status === "confirmed"
    );
  };

  const getOrderStatus = () => {
    if (isPending) return "pending";
    return activeOrder?.status;
  };

  const getOrderNumber = () => {
    return activeOrder?.orderNumber || "Pending";
  };

  const getOrderDate = () => {
    if (isPending) return activeOrder?.placedAt;
    return activeOrder?.createdAt;
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
          <p className="text-white/40 text-xs">#{getOrderNumber()}</p>
        </div>
      </div>

      <div className="w-full max-w-3xl mx-auto p-4">
        <div className="flex-1 pb-32 space-y-4 overflow-y-auto">
          {/* Order Status Banner - Same for both pending and confirmed */}
          <div
            className={`rounded-2xl p-4 border ${
              getOrderStatus() === "cancelled"
                ? "bg-red-50 border-red-100"
                : "bg-white border-black/[0.06]"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-bold text-[#1C1C1E]">
                Order #{getOrderNumber()}
              </h2>
              <OrderBadge value={getOrderStatus()} size="sm" />
            </div>
            <div className="text-xs text-[#8E8E93] space-y-1">
              <p>Placed: {formatDate(getOrderDate(), "longTime")}</p>
              {activeOrder?.cancelReason && (
                <p className="text-red-500">
                  Cancelled: {activeOrder.cancelReason}
                </p>
              )}
            </div>
          </div>

          {/* Pending Order Info Card */}
          {isPending && (
            <InfoCard
              title="Waiting for Confirmation"
              description={
                activeOrder?.message ||
                "Your order has been placed and is waiting for the restaurant staff to accept it. This usually takes less than a minute."
              }
              type="warning"
              size="md"
            />
          )}

          {/* Items */}
          <div className="bg-white rounded-2xl border border-black/[0.05] shadow-sm overflow-hidden">
            <div className="p-4 border-b border-[#F2F2F7] flex items-center justify-between">
              <h3 className="font-bold text-sm text-[#1C1C1E]">
                Items (
                {activeOrder?.itemCount || activeOrder?.items?.length || 0})
              </h3>
              {isPending && (
                <span className="text-[10px] font-medium text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full">
                  Pending
                </span>
              )}
            </div>
            <div className="divide-y divide-[#F2F2F7]">
              {activeOrder?.items?.map((item, index) => (
                <div key={item?.id || index} className="p-4">
                  {/* Row 1: Food Type + Name + Status */}
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      <FoodTypeIcon type={item?.itemType} size="sm" />
                      <div className="min-w-0 flex-1">
                        <h4 className="font-semibold text-sm text-[#1C1C1E] truncate">
                          {item?.name}
                          {item?.variantName && (
                            <span className="text-xs text-[#8E8E93] font-normal ml-1">
                              - {item?.variantName}
                            </span>
                          )}
                        </h4>
                      </div>
                    </div>
                    {!isPending && (
                      <OrderBadge value={item?.status} size="sm" />
                    )}
                  </div>

                  {/* Special Instructions */}
                  {item?.specialInstructions && (
                    <p className="text-[11px] text-primary-500/80 italic mb-2 ml-7">
                      "{item?.specialInstructions}"
                    </p>
                  )}

                  {/* Row 2: Qty × Price + Tax = Total */}
                  <div className="ml-7 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs flex-wrap">
                      <span className="text-[#8E8E93]">×{item?.quantity}</span>
                      <span className="text-[#C7C7CC]">•</span>
                      <span className="text-[#8E8E93]">
                        {formatNumber(item?.unitPrice, true)}
                      </span>
                      {item?.taxDetails && item.taxDetails.length > 0 && (
                        <>
                          <span className="text-[#C7C7CC]">•</span>
                          <span className="text-[#8E8E93]">
                            {item.taxDetails
                              .map(
                                (t) =>
                                  `${formatNumber(t.amount, true)} (${t.componentName})`,
                              )
                              .join(", ")}
                          </span>
                        </>
                      )}
                    </div>
                    <span className="text-sm font-bold text-[#1C1C1E] ml-3 shrink-0">
                      {formatNumber(item?.totalPrice, true)}
                    </span>
                  </div>

                  {/* Row 3: Status Message */}
                  {isPending && item?.status === "pending" && (
                    <div className="mt-2 ml-7 flex items-center gap-2 text-[11px] text-amber-700 bg-amber-50/70 rounded-lg px-3 py-2">
                      <Clock size={12} className="shrink-0" />
                      <span>Awaiting restaurant confirmation</span>
                    </div>
                  )}

                  {!isPending && item?.status !== "pending" && (
                    <div className="mt-2 ml-7 flex items-center gap-2 text-[11px] text-[#8E8E93] bg-[#F2F2F7] rounded-lg px-3 py-2">
                      <AlertCircle size={12} className="shrink-0" />
                      <span>
                        {item?.status === "cancelled"
                          ? "This item has been cancelled"
                          : item?.status === "sent_to_kitchen"
                            ? "Sent to kitchen for preparation"
                            : "This item has been sent to the kitchen and cannot be modified"}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Bill Summary */}
          <div className="bg-white rounded-2xl border border-black/[0.05] p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <ReceiptText size={16} className="text-[#8E8E93]" />
              <p className="text-xs font-bold text-[#8E8E93] uppercase tracking-wider">
                Bill Summary
              </p>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-[#3A3A3C]">Subtotal</span>
                <span className="font-medium text-[#1C1C1E]">
                  {formatNumber(activeOrder?.subtotal, true)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#3A3A3C]">Tax</span>
                <span className="font-medium text-[#1C1C1E]">
                  {formatNumber(activeOrder?.taxAmount, true)}
                </span>
              </div>
              {activeOrder?.specialInstructions && (
                <div className="bg-[#FAF8F5] rounded-lg p-3">
                  <span className="text-[11px] font-medium text-[#8E8E93] block mb-1">
                    Special Instructions
                  </span>
                  <span className="text-xs text-[#3A3A3C] italic">
                    "{activeOrder.specialInstructions}"
                  </span>
                </div>
              )}
              <div className="h-px bg-[#F2F2F7] my-1" />
              <div className="flex justify-between items-center">
                <span className="font-bold text-[#1C1C1E]">Total Amount</span>
                <span className="font-bold text-lg text-primary-500">
                  {formatNumber(activeOrder?.totalAmount, true)}
                </span>
              </div>
              {isPending && (
                <div className="flex items-center gap-2 text-[11px] text-[#8E8E93] bg-[#FAF8F5] rounded-lg p-3 mt-2">
                  <ShieldCheck size={14} className="text-green-500 shrink-0" />
                  <span>Payment will be processed once order is confirmed</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Actions Footer */}
      <div className="fixed bottom-0 left-0 right-0 z-30 px-4 pb-4 max-w-3xl mx-auto">
        {canCancelOrder() && (
          <button
            onClick={() => setShowCancelModal(true)}
            className="w-full bg-white text-red-500 font-bold text-sm py-3.5 rounded-2xl border-2 border-red-200 hover:border-red-300 hover:bg-red-50 active:scale-[0.98] transition-all shadow-lg shadow-red-100/50"
          >
            Cancel Order
          </button>
        )}

        {!canCancelOrder() && getOrderStatus() !== "cancelled" && (
          <div className="bg-[#F2F2F7] rounded-xl p-3 flex items-center gap-2">
            <Info size={16} className="text-[#8E8E93] shrink-0" />
            <p className="text-xs text-[#8E8E93]">
              Order cannot be cancelled — it is already being prepared. Please
              ask staff for assistance.
            </p>
          </div>
        )}
      </div>

      {/* Cancel Order Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowCancelModal(false)}
          />
          <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl p-6 animate-[scaleIn_0.3s_cubic-bezier(0.32,0.72,0,1)]">
            <button
              onClick={() => setShowCancelModal(false)}
              className="absolute top-4 right-4 w-8 h-8 bg-[#F2F2F7] rounded-full flex items-center justify-center hover:bg-[#E5E5EA] transition-colors"
            >
              <X size={16} className="text-[#8E8E93]" />
            </button>

            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-[#FFF3CD] flex items-center justify-center">
                <Info size={32} className="text-[#FFB800]" />
              </div>
            </div>

            <h3 className="text-lg font-bold text-[#1C1C1E] text-center mb-2">
              Need to Cancel?
            </h3>
            <p className="text-sm text-[#6C6C70] text-center mb-2">
              To cancel this order, please visit the counter and speak with our
              cashier or staff member.
            </p>
            <p className="text-xs text-[#8E8E93] text-center mb-6">
              They'll help you process the cancellation quickly.
            </p>

            <div className="h-px bg-[#F2F2F7] mb-4" />

            <div className="bg-[#FAF8F5] rounded-xl p-3 mb-6">
              <div className="flex items-center gap-2 text-sm text-[#3A3A3C]">
                <Info size={16} className="text-primary-500 shrink-0" />
                <span>Show this order number to staff:</span>
              </div>
              <p className="text-lg font-bold text-[#1C1C1E] mt-1.5 text-center tracking-wider">
                #{getOrderNumber()}
              </p>
            </div>

            <button
              onClick={() => setShowCancelModal(false)}
              className="w-full bg-primary-500 hover:bg-primary-600 text-white font-bold text-sm py-3.5 rounded-xl"
            >
              Got it, Thanks
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default CurrentOrderStatusScreen;
