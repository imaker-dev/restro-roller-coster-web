import { useState } from "react";
import {
  ChevronDown,
  Banknote,
  CreditCard,
  Layers,
  AlertCircle,
  AlertTriangle,
  SlidersHorizontal,
  Tag,
  UtensilsCrossed,
  ShoppingBag,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { formatNumber } from "../../utils/numberFormatter";
import Shimmer from "../../layout/Shimmer";

const fmt = (n) => formatNumber(n, true);
const pct = (v, t) => (t > 0 ? Math.round((v / t) * 100) : 0);

/* ── Animated bar ── */
function Bar({ pct: p, color }) {
  return (
    <div
      className="flex-1 h-1.5 rounded-full overflow-hidden"
      style={{ background: "rgba(0,0,0,0.06)" }}
    >
      <div
        className="h-full rounded-full transition-all duration-700 ease-out"
        style={{ width: `${p}%`, background: color }}
      />
    </div>
  );
}

/* ── Stat tile ── */
function StatTile({ label, value, accent }) {
  return (
    <div
      className="flex flex-col gap-0.5 rounded-xl px-3 py-2.5"
      style={{ background: accent + "12", border: `1px solid ${accent}22` }}
    >
      <span
        className="text-[10px] font-medium uppercase tracking-widest"
        style={{ color: accent + "CC" }}
      >
        {label}
      </span>
      <span
        className="text-sm font-bold"
        style={{ color: accent, letterSpacing: "-0.3px" }}
      >
        {value}
      </span>
    </div>
  );
}

/* ── Payment row ── */
function PayRow({ icon: Icon, label, amount, bar, color }) {
  return (
    <div className="flex items-center gap-3 py-2">
      <div
        className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0"
        style={{ background: color + "18" }}
      >
        <Icon size={12} style={{ color }} />
      </div>
      <span className="text-xs font-medium text-gray-600 w-9">{label}</span>
      <Bar pct={bar} color={color} />
      <span
        className="text-[10px] font-semibold w-7 text-right"
        style={{ color: color + "BB" }}
      >
        {bar}%
      </span>
      <span className="text-xs font-bold text-gray-800 w-20 text-right tabular-nums">
        {fmt(amount)}
      </span>
    </div>
  );
}

/* ── Deduction row ── */
function DeductRow({ icon: Icon, label, value, sub, color }) {
  return (
    <div
      className="flex items-center justify-between py-2 border-b last:border-0"
      style={{ borderColor: "rgba(0,0,0,0.05)" }}
    >
      <div className="flex items-center gap-2">
        <div
          className="w-5 h-5 rounded-md flex items-center justify-center"
          style={{ background: color + "15" }}
        >
          <Icon size={11} style={{ color }} />
        </div>
        <span className="text-xs text-gray-600">{label}</span>
        {sub && (
          <span
            className="text-[10px] rounded-full px-1.5 py-0.5 font-medium"
            style={{ background: color + "15", color }}
          >
            {sub}
          </span>
        )}
      </div>
      <span className="text-xs font-bold tabular-nums" style={{ color }}>
        {value}
      </span>
    </div>
  );
}

/* ── Section label ── */
function SectionLabel({ children }) {
  return (
    <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-gray-400 mb-2.5">
      {children}
    </p>
  );
}

export default function CollectionBreakup({ collection,loading=false }) {
  const { paymentBreakdown, orderTypeCount } = collection || {};
  const [open, setOpen] = useState(false);

  const d = {
    total: collection?.totalCollection ?? 0,
    fresh: collection?.freshCollection ?? 0,
    due_col: collection?.dueCollection ?? 0,
    total_due: collection?.totalDue ?? 0,
    cash: paymentBreakdown?.cash ?? 0,
    card: paymentBreakdown?.card ?? 0,
    upi: paymentBreakdown?.upi ?? 0,
    wallet: paymentBreakdown?.wallet ?? 0,
    nc_amount: collection?.totalNC ?? 0,
    nc_orders: collection?.ncOrderCount ?? 0,
    adj_count: collection?.adjustmentCount ?? 0,
    adj_amount: collection?.totalAdjustment ?? 0,
    discount: collection?.totalDiscount ?? 0,
    total_orders: collection?.totalOrderCount ?? 0,
    dine_in: orderTypeCount?.dineIn ?? 0,
    takeaway: orderTypeCount?.takeaway ?? 0,
  };

  if(loading) return (
        <div className="w-full">
      <div className="rounded-md border border-slate-200 bg-white overflow-hidden">
        
        {/* HEADER ONLY */}
        <div className="flex items-center justify-between px-4 py-3.5">
          
          {/* Left: Title */}
          <div className="flex flex-col gap-1">
            <Shimmer width="140px" height="14px" />
            <Shimmer width="100px" height="10px" />
          </div>

          {/* Right: Amount + icon */}
          <div className="flex items-center gap-3">
            <div className="flex flex-col items-end gap-1">
              <Shimmer width="60px" height="16px" />
              <Shimmer width="80px" height="10px" />
            </div>

            <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">
              <ChevronDown size={13} className="text-gray-300" />
            </div>
          </div>
        </div>

      </div>
    </div>
  )
  return (
    <>
      <style>{`
        .cb-expand {
          display: grid;
          grid-template-rows: 0fr;
          transition: grid-template-rows 0.35s cubic-bezier(0.4,0,0.2,1);
        }
        .cb-expand.open { grid-template-rows: 1fr; }
        .cb-expand-inner { overflow: hidden; }
        .cb-divider { height: 1px; background: rgba(0,0,0,0.06); }
      `}</style>

      <div className="w-full">
        <div
          className="rounded-md overflow-hidden"
          style={{
            background: "white",
            border: "1px solid rgba(0,0,0,0.08)",
          }}
        >
          {/* ── Header ── */}
          <button
            onClick={() => setOpen(!open)}
            className="w-full flex items-center justify-between px-4 py-3.5 text-left"
          >
            <div className="flex items-center gap-3">
              <div>
                <p
                  className="text-sm font-semibold text-gray-900"
                  style={{ letterSpacing: "-0.2px" }}
                >
                  Collection Breakup
                </p>
                <p className="text-[11px] text-gray-400 font-medium">
                  Payments, deductions & orders
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p
                  className="text-base font-bold text-gray-900 tabular-nums"
                  style={{ letterSpacing: "-0.5px" }}
                >
                  {fmt(d.total)}
                </p>
                <p className="text-[10px] text-gray-400 font-medium">
                  total collected
                </p>
              </div>
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center"
                style={{
                  background: "rgba(0,0,0,0.05)",
                  transition: "transform 0.25s ease",
                }}
              >
                <ChevronDown
                  size={13}
                  className="text-gray-500"
                  style={{
                    transform: open ? "rotate(180deg)" : "rotate(0deg)",
                    transition: "transform 0.25s ease",
                  }}
                />
              </div>
            </div>
          </button>

          {/* ── Expandable body ── */}
          <div className={`cb-expand ${open ? "open" : ""}`}>
            <div className="cb-expand-inner">
              <div className="cb-divider" />

              {/* ── Collection Summary ── */}
              <div className="px-4 pt-4 pb-3">
                <SectionLabel>Collection</SectionLabel>
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <StatTile
                    label="Fresh"
                    value={fmt(d.fresh)}
                    accent="#10B981"
                  />
                  <StatTile
                    label="From Dues"
                    value={fmt(d.due_col)}
                    accent="#8B5CF6"
                  />
                </div>

                {/* Payment breakdown */}
                <div
                  className="rounded-xl px-3 py-1"
                  style={{
                    background: "rgba(0,0,0,0.025)",
                    border: "1px solid rgba(0,0,0,0.05)",
                  }}
                >
                  <PayRow
                    icon={Banknote}
                    label="Cash"
                    amount={d.cash}
                    bar={pct(d.cash, d.total)}
                    color="#10B981"
                  />
                  <div style={{ height: 1, background: "rgba(0,0,0,0.04)" }} />
                  <PayRow
                    icon={Layers}
                    label="UPI"
                    amount={d.upi}
                    bar={pct(d.upi, d.total)}
                    color="#8B5CF6"
                  />
                  <div style={{ height: 1, background: "rgba(0,0,0,0.04)" }} />
                  <PayRow
                    icon={CreditCard}
                    label="Card"
                    amount={d.card}
                    bar={pct(d.card, d.total)}
                    color="#0EA5E9"
                  />
                  {d.wallet > 0 && (
                    <>
                      <div
                        style={{ height: 1, background: "rgba(0,0,0,0.04)" }}
                      />
                      <PayRow
                        icon={Wallet}
                        label="Wallet"
                        amount={d.wallet}
                        bar={pct(d.wallet, d.total)}
                        color="#F59E0B"
                      />
                    </>
                  )}
                </div>
              </div>

              <div className="cb-divider" />

              {/* ── Order Type Count ── */}
              <div className="px-4 pt-3.5 pb-3">
                <SectionLabel>Order types</SectionLabel>
                <div className="grid grid-cols-2 gap-2">
                  <div
                    className="col-span-1 rounded-xl px-3 py-2.5 flex flex-col gap-1"
                    style={{
                      background: "#F97316" + "10",
                      border: "1px solid #F9731622",
                    }}
                  >
                    <div className="flex items-center gap-1.5">
                      <UtensilsCrossed size={11} style={{ color: "#F97316" }} />
                      <span
                        className="text-[10px] font-semibold uppercase tracking-widest"
                        style={{ color: "#F97316CC" }}
                      >
                        Dine-in
                      </span>
                    </div>
                    <span
                      className="text-xl font-bold tabular-nums"
                      style={{ color: "#F97316", letterSpacing: "-1px" }}
                    >
                      {d.dine_in}
                    </span>
                  </div>

                  <div
                    className="col-span-1 rounded-xl px-3 py-2.5 flex flex-col gap-1"
                    style={{
                      background: "#06B6D410",
                      border: "1px solid #06B6D422",
                    }}
                  >
                    <div className="flex items-center gap-1.5">
                      <ShoppingBag size={11} style={{ color: "#06B6D4" }} />
                      <span
                        className="text-[10px] font-semibold uppercase tracking-widest"
                        style={{ color: "#06B6D4CC" }}
                      >
                        Takeaway
                      </span>
                    </div>
                    <span
                      className="text-xl font-bold tabular-nums"
                      style={{ color: "#06B6D4", letterSpacing: "-1px" }}
                    >
                      {d.takeaway}
                    </span>
                  </div>

                  {/* <div
                    className="col-span-1 rounded-xl px-3 py-2.5 flex flex-col gap-1"
                    style={{ background: "rgba(0,0,0,0.03)", border: "1px solid rgba(0,0,0,0.07)" }}
                  >
                    <span className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">Total</span>
                    <span className="text-xl font-bold tabular-nums text-gray-800" style={{ letterSpacing: "-1px" }}>{totalOrders}</span>
                    <span className="text-[10px] text-gray-400">orders</span>
                  </div> */}
                </div>
              </div>

              <div className="cb-divider" />

              {/* ── Deductions ── */}
              <div className="px-4 pt-3.5 pb-3">
                <SectionLabel>Deductions & exceptions</SectionLabel>
                <div
                  className="rounded-xl px-3 py-1 mb-2.5"
                  style={{
                    background: "rgba(0,0,0,0.025)",
                    border: "1px solid rgba(0,0,0,0.05)",
                  }}
                >
                  <DeductRow
                    icon={Tag}
                    label="Discount"
                    value={d.discount > 0 ? `− ${fmt(d.discount)}` : "—"}
                    color="#F43F5E"
                  />
                  <DeductRow
                    icon={AlertCircle}
                    label="NC Amount"
                    value={d.nc_amount > 0 ? `− ${fmt(d.nc_amount)}` : "—"}
                    sub={d.nc_orders > 0 ? `${d.nc_orders} orders` : null}
                    color="#F59E0B"
                  />
                  <DeductRow
                    icon={SlidersHorizontal}
                    label="Adjustments"
                    value={d.adj_amount > 0 ? `− ${fmt(d.adj_amount)}` : "—"}
                    sub={d.adj_count > 0 ? `${d.adj_count} entries` : null}
                    color="#EF4444"
                  />
                </div>

                {/* Pending due */}
                <div
                  className="flex items-center justify-between rounded-xl px-3.5 py-2.5"
                  style={{
                    background: d.total_due > 0 ? "#FEF2F2" : "#F0FDF4",
                    border: `1px solid ${d.total_due > 0 ? "#FCA5A5" : "#BBF7D0"}`,
                  }}
                >
                  <div className="flex items-center gap-2">
                    <AlertTriangle
                      size={13}
                      style={{ color: d.total_due > 0 ? "#EF4444" : "#22C55E" }}
                    />
                    <span
                      className="text-xs font-semibold"
                      style={{ color: d.total_due > 0 ? "#EF4444" : "#16A34A" }}
                    >
                      Due Amount
                    </span>
                  </div>
                  <span
                    className="text-sm font-bold tabular-nums"
                    style={{
                      color: d.total_due > 0 ? "#DC2626" : "#16A34A",
                      letterSpacing: "-0.3px",
                    }}
                  >
                    {fmt(d.total_due)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
