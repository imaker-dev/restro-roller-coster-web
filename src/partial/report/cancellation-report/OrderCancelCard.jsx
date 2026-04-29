import {
  AlertTriangle,
  ArrowRight,
  Clock,
  IndianRupee,
  User,
  XCircle,
} from "lucide-react";
import MetaPill from "../../../components/MetaPill";
import { formatDate } from "../../../utils/dateFormatter";
import { formatNumber } from "../../../utils/numberFormatter";
import OrderBadge from "../../order/OrderBadge";
import { Link } from "react-router-dom";
import { ROUTE_PATHS } from "../../../config/paths";

// ─── Order cancellation card ──────────────────────────────────────────────────
export default function OrderCancelCard({ item }) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-slate-200 transition-all duration-300 hover:shadow-[0_8px_24px_-4px_rgba(0,0,0,0.10)] group">
      {/* Red left bar */}
      <div className="flex">
        <div
          className="w-1 flex-shrink-0 rounded-l-2xl"
          style={{ background: "linear-gradient(180deg,#f43f5e,#e11d48)" }}
        />
        <div className="flex-1 p-4">
          {/* Top row */}
          <div className="flex items-start justify-between gap-2 mb-3">
            <div className="flex items-center gap-2 min-w-0">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: "#fef2f2", border: "1px solid #fecaca" }}
              >
                <XCircle size={14} className="text-rose-500" strokeWidth={2} />
              </div>
              <div className="min-w-0">
                <p className="text-[12px] font-black text-slate-800 leading-none">
                  {item.order_number}
                </p>
                <p className="text-[9px] text-slate-400 font-medium mt-0.5">
                  Full Order Cancelled
                </p>
              </div>
            </div>
            <OrderBadge type="type" value={item.order_type} />
          </div>

          {/* Meta grid */}
          <div className="grid grid-cols-2 gap-2 mb-3">
            <MetaPill icon={User} label="By" value={item.cancelled_by_name} />
            <MetaPill
              icon={Clock}
              label="At"
              value={formatDate(item.cancelled_at, "long")}
              small
            />
            <MetaPill
              icon={AlertTriangle}
              label="Reason"
              value={item.reason || "—"}
            />
            <MetaPill
              icon={IndianRupee}
              label="Amount"
              value={formatNumber(item.total_amount, true)}
              highlight
            />
          </div>
          <Link
            to={`${ROUTE_PATHS.ORDER_DETAILS}?orderId=${item.order_id}`}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 text-[11px] font-bold text-gray-500 bg-primary-50 hover:bg-primary-100 rounded-md hover:text-primary-600 hover:bg-primary-50 transition-all"
          >
            View Order
            <ArrowRight size={12} />
          </Link>
        </div>
      </div>
    </div>
  );
}
