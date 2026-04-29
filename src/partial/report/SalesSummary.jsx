import {
  ShoppingCart,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  DollarSign,
  Utensils,
  Package,
  Banknote,
  QrCode,
  IndianRupee,
  CreditCard,
} from "lucide-react";
import StatCard from "../../components/StatCard";
import { formatNumber } from "../../utils/numberFormatter";

export default function SalesSummary({ data }) {
  const statCards = [
    {
      icon: ShoppingCart,
      label: "Total Orders",
      value: formatNumber(data?.totalOrders),
      subtitle: `${data?.completedOrders} completed, ${data?.activeOrders} active`,
      color: "blue",
    },
    {
      icon: DollarSign,
      label: "Net Sales",
      value: formatNumber(data?.netSales, true),
      subtitle: `Avg: ₹${data?.averageOrderValue}`,
      color: "green",
    },
    {
      icon: TrendingUp,
      label: "Gross Sales",
      value: formatNumber(data?.grossSales, true),
      subtitle: `Tax: ₹${data?.totalTax}`,
      color: "orange",
    },
    {
      icon: Banknote,
      label: "Total Paid",
      value: formatNumber(data?.totalPaid, true),
      subtitle: `Tips: ₹${data?.totalTips}`,
      color: "purple",
    },
  ];


const {paymentBreakdown} = data || {};

const paymentModes = [
  {
    key: "cash",
    label: "Cash",
    icon: Banknote,
    color: "text-emerald-600",
  },
  {
    key: "card",
    label: "Card",
    icon: CreditCard,
    color: "text-indigo-600",
  },
  {
    key: "upi",
    label: "UPI",
    icon: QrCode,
    color: "text-blue-600",
  },
  {
    key: "split",
    label: "Split",
    icon: ShoppingCart,
    color: "text-purple-600",
  },
];

  return (
    <div className="mb-8">
      {/* Main Summary Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {statCards.map((card) => (
          <StatCard
            key={card?.label}
            icon={card?.icon}
            title={card?.label}
            value={card?.value}
            subtitle={card?.subtitle}
            color={card?.color}
          />
        ))}
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Order Status Breakdown */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <h3 className="font-bold text-gray-900 flex items-center gap-2 border-b border-gray-200 p-4">
            <ShoppingCart size={18} className="text-primary-500" />
            Order Status
          </h3>
          <div className="space-y-3 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle size={16} className="text-green-600" />
                <span className="text-sm text-gray-700">Completed</span>
              </div>
              <span className="font-bold text-gray-900">
                {data?.completedOrders}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-blue-600" />
                <span className="text-sm text-gray-700">Active</span>
              </div>
              <span className="font-bold text-gray-900">
                {data?.activeOrders}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <XCircle size={16} className="text-red-600" />
                <span className="text-sm text-gray-700">Cancelled</span>
              </div>
              <span className="font-bold text-gray-900">
                {data?.cancelledOrders}
              </span>
            </div>
          </div>
        </div>

        {/* Order Type Breakdown */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <h3 className="font-bold text-gray-900 flex items-center gap-2 border-b border-gray-200 p-4">
            <Package size={18} className="text-primary-500" />
            Order Type
          </h3>
          <div className="space-y-3 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Utensils size={16} className="text-purple-600" />
                <span className="text-sm text-gray-700">Dine In</span>
              </div>
              <span className="font-bold text-gray-900">
                {data?.orderTypeBreakdown?.dine_in}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Package size={16} className="text-orange-600" />
                <span className="text-sm text-gray-700">Takeaway</span>
              </div>
              <span className="font-bold text-gray-900">
                {data?.orderTypeBreakdown?.takeaway}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingCart size={16} className="text-blue-600" />
                <span className="text-sm text-gray-700">Delivery</span>
              </div>
              <span className="font-bold text-gray-900">
                {data?.orderTypeBreakdown?.delivery}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Payment & Financial Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Payment Mode Breakdown */}
        <div className="bg-white rounded-xl border border-gray-200  shadow-sm">
          <h3 className="font-bold text-gray-900  flex items-center gap-2 border-b border-gray-200 p-4">
            <Banknote size={18} className="text-primary-500" />
            Payment Mode
          </h3>
          <div className="space-y-3 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Banknote size={16} className="text-green-600" />
                <span className="text-sm text-gray-700">Cash</span>
              </div>
              <span className="font-bold text-gray-900">
                {formatNumber(data?.paymentModeBreakdown?.cash, "long")}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <QrCode size={16} className="text-blue-600" />
                <span className="text-sm text-gray-700">UPI</span>
              </div>
              <span className="font-bold text-gray-900">
                {formatNumber(data?.paymentModeBreakdown?.upi, "long")}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingCart size={16} className="text-purple-600" />
                <span className="text-sm text-gray-700">Split</span>
              </div>
              <span className="font-bold text-gray-900">
                {formatNumber(data?.paymentModeBreakdown?.split, "long")}
              </span>
            </div>
          </div>
        </div>

        {/* Financial Breakdown */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <h3 className="font-bold text-gray-900  flex items-center gap-2 border-b border-gray-200 p-4">
            <IndianRupee size={18} className="text-primary-500" />
            Financial Breakdown
          </h3>
          <div className="space-y-3 p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Gross Sales</span>
              <span className="font-bold text-gray-900">
                {formatNumber(data?.grossSales, true)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Discount</span>
              <span className="font-bold text-red-600">
                -{formatNumber(data?.totalDiscount, true)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Tax</span>
              <span className="font-bold text-blue-600">
                +{formatNumber(data?.totalTax, true)}
              </span>
            </div>
          </div>
          <div className="border-t border-gray-200 p-4 flex items-center justify-between">
            <span className="text-sm font-semibold text-gray-900">
              Net Sales
            </span>
            <span className="text-lg font-bold text-green-600">
              {formatNumber(data?.netSales, true)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
