import { AlertTriangle, ArrowRight, Clock, Hash, IndianRupee, Package, User } from "lucide-react";
import MetaPill from "../../../components/MetaPill";
import { formatNumber } from "../../../utils/numberFormatter";
import { formatDate } from "../../../utils/dateFormatter";
import { Link } from "react-router-dom";
import { ROUTE_PATHS } from "../../../config/paths";

  // ─── Item cancellation card ───────────────────────────────────────────────────
  export default function ItemCancelCard({ item, }) {
    return (
      <div
        className="bg-white rounded-2xl overflow-hidden border border-slate-200 transition-all duration-300 hover:shadow-[0_8px_24px_-4px_rgba(0,0,0,0.10)] group"
        style={{
          animation: `fadeUp 0.45s ease both`,
        }}
      >
        <div className="flex">
          <div
            className="w-1 flex-shrink-0 rounded-l-2xl"
            style={{ background: "linear-gradient(180deg,#f59e0b,#d97706)" }}
          />
          <div className="flex-1 p-4">
            {/* Top row */}
            <div className="flex items-start justify-between gap-2 mb-3">
              <div className="flex items-center gap-2 min-w-0">
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: "#fffbeb", border: "1px solid #fcd34d" }}
                >
                  <Package
                    size={13}
                    className="text-amber-500"
                    strokeWidth={2}
                  />
                </div>
                <div className="min-w-0">
                  <p className="text-[12px] font-black text-slate-800 leading-none truncate">
                    {item.item_name}
                  </p>
                  {item.variant_name && (
                    <p className="text-[9px] text-slate-400 font-medium mt-0.5">
                      {item.variant_name}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 border border-amber-200 flex-shrink-0">
                <Hash size={8} className="text-amber-600" />
                <span className="text-[9px] font-black text-amber-700">
                  {parseFloat(item.cancelled_quantity).toFixed(0)} qty
                </span>
              </div>
            </div>

            <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider mb-2">
              Order {item.order_number}
            </p>

            <div className="grid grid-cols-2 gap-2 mb-2">
              <MetaPill icon={User} label="By" value={item.cancelled_by_name} />
              <MetaPill
                icon={IndianRupee}
                label="Loss"
                value={formatNumber(item.cancelled_amount,true)}
                highlight
                amber
              />
              <MetaPill
                icon={AlertTriangle}
                label="Reason"
                value={item.reason || "—"}
              />
              <MetaPill
                icon={Clock}
                label="At"
                value={formatDate(item.cancelled_at,'long')}
                small
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