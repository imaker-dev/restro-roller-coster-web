// ─── CustomerDueCard.jsx ──────────────────────────────────────────────────────
import {
  AlertCircle,
  BadgeIndianRupee,
  Clock,
  Hash,
  Mail,
  Phone,
  ReceiptText,
  Users,
  ChevronRight,
  CheckCircle2,
} from "lucide-react";
import { useState } from "react";
import { formatNumber } from "../../../utils/numberFormatter";
import { formatDate } from "../../../utils/dateFormatter";
import { Link } from "react-router-dom";
import CustomerDueDrawer from "./CustomerDueDrawer";
import { ROUTE_PATHS } from "../../../config/paths";

// ─── Due Badge ────────────────────────────────────────────────────────────────
function DueBadge({ amount }) {
  if (!amount || amount <= 0)
    return (
      <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
        <CheckCircle2 size={9} /> Cleared
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1 bg-red-50 text-red-700 border border-red-200 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
      <span className="w-1 h-1 rounded-full bg-red-500 shrink-0" />
      Outstanding
    </span>
  );
}

// ─── Stat Mini ────────────────────────────────────────────────────────────────
function MiniStat({ label, value, icon: Icon, accent }) {
  return (
    <div className="bg-gray-50 border border-gray-100 rounded-xl px-3 py-2.5">
      <div className="flex items-center gap-1 mb-1">
        <Icon
          size={10}
          className={accent ?? "text-gray-400"}
          strokeWidth={2.5}
        />
        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">
          {label}
        </span>
      </div>
      <p
        className={`text-sm font-black tabular-nums leading-none ${accent ?? "text-gray-800"}`}
      >
        {value}
      </p>
    </div>
  );
}



// ─── Customer Due Card ────────────────────────────────────────────────────────
export function CustomerDueCard({ customer }) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const hasPending = customer.pendingOrders?.length > 0;
  const pctCollected =
    customer.totalDueCollected + (customer.dueBalance || 0) > 0
      ? (
          (customer.totalDueCollected /
            (customer.totalDueCollected + (customer.dueBalance || 0))) *
          100
        ).toFixed(0)
      : 0;

  const totalDue = customer.dueBalance || 0;

  return (
    <>
      {/* ── Card ── */}
      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden hover:border-gray-200 hover:shadow-md transition-all duration-200">
        {/* Header */}
        <div className="px-5 py-4">
          <div className="flex items-start justify-between gap-3 mb-4">
            {/* Avatar + info */}
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className="w-10 h-10 rounded-xl bg-primary-500 flex items-center justify-center shrink-0 shadow-sm shadow-primary-200">
                <span className="text-sm font-black text-white uppercase">
                  {customer.name?.charAt(0) ?? "?"}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-black text-gray-900 truncate">
                  {customer.name}
                </p>
                {customer.phone && (
                  <div className="flex items-center gap-1 mt-0.5">
                    <Phone size={10} className="text-gray-400" />
                    <span className="text-xs text-gray-400">
                      {customer.phone}
                    </span>
                  </div>
                )}
                {customer.email && (
                  <div className="flex items-center gap-1 mt-0.5">
                    <Mail size={10} className="text-gray-400" />
                    <span className="text-xs text-gray-400 truncate">
                      {customer.email}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Due amount */}
            <div className="flex flex-col items-end gap-1.5 shrink-0">
              <DueBadge amount={totalDue} />
              {totalDue > 0 && (
                <p className="text-lg font-black text-red-600 tabular-nums leading-none">
                  {formatNumber(totalDue, true)}
                </p>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            <MiniStat
              label="Total Orders"
              value={customer.totalOrders}
              icon={Hash}
            />
            <MiniStat
              label="Due Orders"
              value={customer.totalDueOrders}
              icon={AlertCircle}
              accent={
                customer.totalDueOrders > 0 ? "text-amber-600" : "text-gray-400"
              }
            />
            <MiniStat
              label="Collected"
              value={formatNumber(customer.totalDueCollected, true)}
              icon={BadgeIndianRupee}
              accent="text-emerald-600"
            />
          </div>

          {/* Progress bar */}
          {(customer.totalDueCollected > 0 || totalDue > 0) && (
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  Collection
                </span>
                <span className="text-[10px] font-bold text-emerald-600">
                  {pctCollected}% recovered
                </span>
              </div>
              <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-700"
                  style={{ width: `${pctCollected}%` }}
                />
              </div>
            </div>
          )}

          {/* Last due date */}
          {customer.lastDueDate && (
            <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-gray-100">
              <Clock size={11} className="text-gray-400" />
              <span className="text-[11px] text-gray-400">
                Last due: {formatDate(customer.lastDueDate, "long")} ·{" "}
                {formatDate(customer.lastDueDate, "time")}
              </span>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="flex border-t border-gray-100">
          <Link
            to={`${ROUTE_PATHS.CUSTOMER_DETAILS}?customerId=${customer.id}`}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-[11px] font-bold text-gray-500 hover:text-primary-600 hover:bg-primary-50 transition-all"
          >
            <Users size={12} />
            View Customer
          </Link>

          {hasPending && (
            <>
              <div className="w-px bg-gray-100" />
              <button
                onClick={() => setDrawerOpen(true)}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-[11px] font-bold text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-all"
              >
                <ReceiptText size={12} />
                {customer.pendingOrders.length} Pending Order
                {customer.pendingOrders.length > 1 ? "s" : ""}
                <ChevronRight size={11} />
              </button>
            </>
          )}
        </div>
      </div>

      {/* ── Drawer ── */}
      <CustomerDueDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        customer={customer}
        totalDue={totalDue}
      />
    </>
  );
}
