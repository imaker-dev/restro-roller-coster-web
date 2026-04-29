import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronRight,
  Circle,
  Clock,
  User,
  Phone,
  MapPin,
  Utensils,
  Wine,
  CreditCard,
  Wallet,
  Smartphone,
  Banknote,
  Receipt,
  CheckCircle,
  XCircle,
  AlertCircle,
  TrendingUp,
} from "lucide-react";

export default function OrdersList({ orders, onOrderClick }) {
  const navigate = useNavigate();

  const handleOrderClick = (orderId) => {
    if (onOrderClick) {
      onOrderClick(orderId);
    } else {
      navigate(`/orders/${orderId}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] relative overflow-hidden">
      {/* Ambient Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-radial from-violet-600/10 via-transparent to-transparent blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-radial from-cyan-600/10 via-transparent to-transparent blur-3xl" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMiI+PHBhdGggZD0iTTM2IDM0djItMnptMCAwdjJoLTJ2LTJoMnptLTIgMnYtMmgydjJoLTJ6bS0yIDB2Mmgydi0yaC0yem0yLTJ2Mmgydi0yaC0yem0wIDJ2LTJoLTJ2Mmgyem0yLTJ2Mmgydi0yaC0yem0wIDB2LTJoMnYyaC0yem0wLTJ2LTJoMnYyaC0yem0tMiAwdi0yaDJ2MmgtMnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-3">
            <div className="h-1 w-16 bg-gradient-to-r from-violet-500 to-cyan-500 rounded-full" />
            <Circle className="w-2 h-2 text-violet-400 fill-violet-400 animate-pulse" />
          </div>
          <h1 className="text-5xl sm:text-6xl font-bold text-white mb-4 tracking-tight">
            Orders
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">
              .
            </span>
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl">
            Real-time order tracking and management system
          </p>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            label="Total Orders"
            value={orders?.length || 0}
            icon={<Receipt className="w-5 h-5" />}
            gradient="from-violet-500 to-purple-600"
          />
          <StatCard
            label="Completed"
            value={orders?.filter((o) => o.status === "completed").length || 0}
            icon={<CheckCircle className="w-5 h-5" />}
            gradient="from-emerald-500 to-teal-600"
          />
          <StatCard
            label="Pending"
            value={orders?.filter((o) => o.status === "pending").length || 0}
            icon={<AlertCircle className="w-5 h-5" />}
            gradient="from-amber-500 to-orange-600"
          />
          <StatCard
            label="Revenue"
            value={`₹${orders?.reduce((sum, o) => sum + (o.totalAmount || 0), 0).toLocaleString("en-IN")}`}
            icon={<TrendingUp className="w-5 h-5" />}
            gradient="from-cyan-500 to-blue-600"
            isAmount
          />
        </div>

        {/* Orders Grid */}
        <div className="grid grid-cols-1 gap-6">
          {orders?.map((order, index) => (
            <OrderCard
              key={order.orderId}
              order={order}
              index={index}
              onClick={() => handleOrderClick(order.orderId)}
            />
          ))}
        </div>

        {/* Empty State */}
        {(!orders || orders.length === 0) && (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-violet-500/20 to-cyan-500/20 flex items-center justify-center mb-6 backdrop-blur-xl border border-white/10">
              <Receipt className="w-16 h-16 text-violet-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">No orders yet</h3>
            <p className="text-gray-400">Orders will appear here when available</p>
          </div>
        )}
      </div>
    </div>
  );
}

// Stat Card Component
function StatCard({ label, value, icon, gradient, isAmount }) {
  return (
    <div className="group relative">
      <div className="absolute inset-0 bg-gradient-to-r ${gradient} opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500" />
      <div className="relative bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all duration-300">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-xl bg-gradient-to-br ${gradient}`}>
            {icon}
          </div>
        </div>
        <p className="text-sm text-gray-400 mb-1 font-medium">{label}</p>
        <p className={`${isAmount ? "text-2xl" : "text-3xl"} font-bold text-white`}>
          {value}
        </p>
      </div>
    </div>
  );
}

// Order Card Component
function OrderCard({ order, index, onClick }) {
  const [isHovered, setIsHovered] = useState(false);

  const getStatusConfig = (status) => {
    const configs = {
      completed: {
        gradient: "from-emerald-500 to-teal-600",
        icon: CheckCircle,
        color: "text-emerald-400",
        glow: "shadow-emerald-500/50",
        bg: "bg-emerald-500/10",
        border: "border-emerald-500/30",
      },
      pending: {
        gradient: "from-amber-500 to-orange-600",
        icon: AlertCircle,
        color: "text-amber-400",
        glow: "shadow-amber-500/50",
        bg: "bg-amber-500/10",
        border: "border-amber-500/30",
      },
      cancelled: {
        gradient: "from-red-500 to-rose-600",
        icon: XCircle,
        color: "text-red-400",
        glow: "shadow-red-500/50",
        bg: "bg-red-500/10",
        border: "border-red-500/30",
      },
    };
    return configs[status] || configs.pending;
  };

  const getPaymentIcon = (mode) => {
    const icons = {
      cash: Banknote,
      card: CreditCard,
      upi: Smartphone,
      wallet: Wallet,
    };
    return icons[mode?.toLowerCase()] || CreditCard;
  };

  const statusConfig = getStatusConfig(order.status);
  const StatusIcon = statusConfig.icon;
  const PaymentIcon = getPaymentIcon(order.payments?.[0]?.paymentMode);

  return (
    <div
      className="group relative cursor-pointer"
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        animation: `slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.1}s both`,
      }}
    >
      {/* Hover Glow Effect */}
      <div
        className={`absolute -inset-1 bg-gradient-to-r ${statusConfig.gradient} rounded-3xl opacity-0 group-hover:opacity-20 blur-xl transition-all duration-500`}
      />

      {/* Main Card */}
      <div className="relative bg-gradient-to-br from-white/8 to-white/[0.02] backdrop-blur-2xl border border-white/10 rounded-2xl overflow-hidden group-hover:border-white/20 transition-all duration-300 group-hover:scale-[1.02]">
        {/* Top Accent Line */}
        <div className={`h-1.5 bg-gradient-to-r ${statusConfig.gradient}`} />

        <div className="p-6 sm:p-8">
          {/* Header Row */}
          <div className="flex items-start justify-between mb-6">
            {/* Left: Order Info */}
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-3">
                {/* Order Number Badge */}
                <div className="relative">
                  <div className={`absolute inset-0 bg-gradient-to-r ${statusConfig.gradient} blur-md opacity-50`} />
                  <div className={`relative px-4 py-2 bg-gradient-to-r ${statusConfig.gradient} rounded-xl`}>
                    <span className="text-sm font-bold text-white">
                      #{order.orderNumber}
                    </span>
                  </div>
                </div>

                {/* Status Badge */}
                <div className={`flex items-center gap-2 px-4 py-2 ${statusConfig.bg} border ${statusConfig.border} rounded-xl backdrop-blur-xl`}>
                  <StatusIcon className={`w-4 h-4 ${statusConfig.color}`} />
                  <span className={`text-sm font-semibold ${statusConfig.color} capitalize`}>
                    {order.status}
                  </span>
                </div>
              </div>

              {/* Time & Invoice */}
              <div className="flex items-center gap-6 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>
                    {new Date(order.createdAt).toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                {order.invoice?.invoiceNumber && (
                  <>
                    <div className="w-1 h-1 rounded-full bg-gray-600" />
                    <div className="flex items-center gap-2">
                      <Receipt className="w-4 h-4" />
                      <span>{order.invoice.invoiceNumber}</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Right: Amount */}
            <div className="text-right">
              <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400 mb-1">
                ₹{order.totalAmount.toLocaleString("en-IN")}
              </div>
              <div className="text-xs text-gray-500 font-medium">Total Amount</div>
            </div>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* Order Type */}
            <InfoPill
              icon={<Utensils className="w-4 h-4" />}
              label="Type"
              value={order.orderType.replace("_", " ")}
              gradient="from-purple-500/20 to-pink-500/20"
            />

            {/* Guests */}
            <InfoPill
              icon={<User className="w-4 h-4" />}
              label="Guests"
              value={`${order.guestCount} Guest${order.guestCount !== 1 ? "s" : ""}`}
              gradient="from-blue-500/20 to-cyan-500/20"
            />

            {/* Items */}
            <InfoPill
              icon={<Wine className="w-4 h-4" />}
              label="Items"
              value={`${order.items?.activeCount || 0} Items`}
              gradient="from-orange-500/20 to-red-500/20"
            />

            {/* Payment */}
            {order.payments?.[0] && (
              <InfoPill
                icon={<PaymentIcon className="w-4 h-4" />}
                label="Payment"
                value={order.payments[0].paymentMode.toUpperCase()}
                gradient="from-emerald-500/20 to-teal-500/20"
              />
            )}
          </div>

          {/* Customer Info (if available) */}
          {(order.customerName || order.customerPhone || order.tableNumber) && (
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4 mb-6">
              <div className="flex flex-wrap gap-x-6 gap-y-2">
                {order.tableNumber && (
                  <div className="flex items-center gap-2 text-sm text-gray-300">
                    <MapPin className="w-4 h-4 text-violet-400" />
                    <span className="font-medium">Table {order.tableNumber}</span>
                  </div>
                )}
                {order.customerName && (
                  <div className="flex items-center gap-2 text-sm text-gray-300">
                    <User className="w-4 h-4 text-cyan-400" />
                    <span className="font-medium">{order.customerName}</span>
                  </div>
                )}
                {order.customerPhone && (
                  <div className="flex items-center gap-2 text-sm text-gray-300">
                    <Phone className="w-4 h-4 text-emerald-400" />
                    <span className="font-medium">{order.customerPhone}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Items Preview */}
          <div className="mb-6">
            <div className="text-xs text-gray-500 font-semibold mb-3 uppercase tracking-wider">
              Order Items
            </div>
            <div className="flex flex-wrap gap-2">
              {order.items?.active?.slice(0, 4).map((item, idx) => (
                <div
                  key={idx}
                  className="group/item relative overflow-hidden backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 rounded-lg px-4 py-2.5 hover:border-white/20 transition-all duration-300"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-violet-400" />
                      <span className="text-sm font-semibold text-white">
                        {item.itemName}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <span>×{item.quantity}</span>
                      <span className="text-gray-600">•</span>
                      <span className="text-emerald-400 font-bold">
                        ₹{item.totalPrice.toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
              {order.items?.activeCount > 4 && (
                <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 flex items-center">
                  <span className="text-sm text-violet-400 font-semibold">
                    +{order.items.activeCount - 4} more
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Bottom Row */}
          <div className="flex items-center justify-between pt-6 border-t border-white/10">
            {/* Financial Summary */}
            <div className="flex items-center gap-6 text-sm">
              <div>
                <div className="text-gray-500 text-xs mb-1">Subtotal</div>
                <div className="text-white font-bold">
                  ₹{order.subtotal.toLocaleString("en-IN")}
                </div>
              </div>
              <div className="w-px h-8 bg-white/10" />
              <div>
                <div className="text-gray-500 text-xs mb-1">Tax</div>
                <div className="text-cyan-400 font-bold">
                  ₹{order.taxAmount.toFixed(2)}
                </div>
              </div>
              {order.discountAmount > 0 && (
                <>
                  <div className="w-px h-8 bg-white/10" />
                  <div>
                    <div className="text-gray-500 text-xs mb-1">Discount</div>
                    <div className="text-emerald-400 font-bold">
                      -₹{order.discountAmount.toLocaleString("en-IN")}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* View Details Button */}
            <div className="relative group/btn">
              <div className={`absolute inset-0 bg-gradient-to-r ${statusConfig.gradient} blur-md opacity-0 group-hover/btn:opacity-75 transition-opacity duration-300`} />
              <div className={`relative flex items-center gap-2 px-6 py-3 bg-gradient-to-r ${statusConfig.gradient} rounded-xl font-semibold text-white text-sm shadow-lg group-hover/btn:shadow-xl transition-all duration-300`}>
                <span>View Details</span>
                <ChevronRight
                  className={`w-4 h-4 transition-transform duration-300 ${isHovered ? "translate-x-1" : ""}`}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

// Info Pill Component
function InfoPill({ icon, label, value, gradient }) {
  return (
    <div className={`relative overflow-hidden backdrop-blur-xl bg-gradient-to-br ${gradient} border border-white/10 rounded-xl p-4 group/pill hover:border-white/20 transition-all duration-300`}>
      <div className="flex items-center gap-3">
        <div className="text-white/80">{icon}</div>
        <div>
          <div className="text-xs text-gray-400 mb-0.5">{label}</div>
          <div className="text-sm font-bold text-white capitalize">{value}</div>
        </div>
      </div>
    </div>
  );
}