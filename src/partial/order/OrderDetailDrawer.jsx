import {
  Hash,
  MapPin,
  Users,
  Utensils,
  Clock,
  ChefHat,
  CheckCircle2,
  Loader2,
  Receipt,
  User,
  CircleDot,
  Flame,
  ShoppingBag,
} from "lucide-react";
import { formatNumber } from "../../utils/numberFormatter";
import OrderBadge from "./OrderBadge";
import Drawer from "../../components/Drawer";

// ─── Item Status Config ───────────────────────────────────────────────────────
const ITEM_STATUS = {
  ready: {
    label: "Ready",
    icon: CheckCircle2,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    ring: "ring-emerald-200",
    dot: "bg-emerald-400",
  },
  sent_to_kitchen: {
    label: "In Kitchen",
    icon: Flame,
    color: "text-orange-500",
    bg: "bg-orange-50",
    ring: "ring-orange-200",
    dot: "bg-orange-400",
  },
  served: {
    label: "Served",
    icon: CheckCircle2,
    color: "text-sky-600",
    bg: "bg-sky-50",
    ring: "ring-sky-200",
    dot: "bg-sky-400",
  },
  pending: {
    label: "Pending",
    icon: Loader2,
    color: "text-slate-400",
    bg: "bg-slate-50",
    ring: "ring-slate-200",
    dot: "bg-slate-300",
  },
};

// ─── Elapsed time helper ──────────────────────────────────────────────────────
function elapsed(d) {
  return Math.floor((Date.now() - new Date(d).getTime()) / 60000);
}

// ─── Drawer Title (rich header) ───────────────────────────────────────────────
function DrawerTitle({ table }) {
  const min = elapsed(table?.startedAt);
  const isCrit = min >= 45;
  const isWarn = min >= 30 && !isCrit;

  return (
    <div className="min-w-0">
      <div className="flex items-center gap-2">
        <h2 className="text-[15px] font-black text-slate-900 leading-tight">
          Table {table?.tableNumber}
        </h2>
        <OrderBadge type="status" value={table?.orderStatus} size="sm" />
      </div>
      <div className="flex items-center gap-2 mt-0.5 flex-wrap">
        <div className="flex items-center gap-1">
          <MapPin size={9} className="text-slate-400" />
          <span className="text-[11px] text-slate-400 font-medium">
            {table?.floorName}
          </span>
        </div>
        <span className="text-slate-200">·</span>
        <div className="flex items-center gap-1">
          <Users size={9} className="text-slate-400" />
          <span className="text-[11px] text-slate-400 font-medium">
            {table?.guestCount} guests
          </span>
        </div>
        <span className="text-slate-200">·</span>
        <div
          className={`flex items-center gap-1 ${
            isCrit
              ? "text-rose-500"
              : isWarn
                ? "text-amber-500"
                : "text-slate-400"
          }`}
        >
          <Clock size={9} />
          <span className="text-[11px] font-bold">{min}m</span>
        </div>
      </div>
    </div>
  );
}

// ─── Drawer Subtitle ──────────────────────────────────────────────────────────
function DrawerSubtitle({ table }) {
  return (
    <p className="text-[10px] font-semibold tracking-widest text-slate-400 uppercase mt-1 pl-[52px]">
      {table?.orderNumber}
    </p>
  );
}

// ─── Drawer Body ──────────────────────────────────────────────────────────────
function DrawerBody({ table }) {
  const kotGroups = table?.items?.reduce((acc, item) => {
    const key = item.kotId;
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});

  return (
    <div className="px-5 py-4 space-y-5">
      {/* ── Quick stats strip ── */}
      <div className="grid grid-cols-3 gap-2">
        {[
          {
            label: "Total",
            value: formatNumber(table?.orderAmount, true),
            icon: Receipt,
            accent: "bg-violet-50 text-violet-600",
            iconBg: "bg-violet-100",
          },
          {
            label: "KOTs",
            value: table?.kotCount,
            sub: `${table?.pendingKotCount} pending`,
            icon: ChefHat,
            accent: "bg-amber-50 text-amber-600",
            iconBg: "bg-amber-100",
          },
          {
            label: "Captain",
            value: table?.captainName,
            icon: User,
            accent: "bg-sky-50 text-sky-600",
            iconBg: "bg-sky-100",
          },
        ].map(({ label, value, sub, icon: Icon, accent, iconBg }) => (
          <div
            key={label}
            className={`rounded-2xl p-3 space-y-2 ${accent.split(" ")[0]} border border-transparent`}
          >
            <div
              className={`w-7 h-7 rounded-lg flex items-center justify-center ${iconBg}`}
            >
              <Icon size={13} className={accent.split(" ")[1]} />
            </div>
            <div>
              <p className="text-[12px] font-black text-slate-900 leading-tight truncate">
                {value}
              </p>
              <p className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider mt-0.5">
                {label}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Order Items header ── */}
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-lg bg-slate-100 flex items-center justify-center">
          <Utensils size={12} className="text-slate-500" />
        </div>
        <p className="text-[11px] font-black text-slate-600 uppercase tracking-widest">
          Order Items
        </p>
        <div className="flex-1 h-px bg-slate-100" />
        <span className="text-[10px] font-bold text-slate-400">
          {table?.itemCount} items
        </span>
      </div>

      {/* ── KOT Groups ── */}
      {kotGroups &&
        Object.entries(kotGroups).map(([kotId, items], gi) => {
          // Derive KOT-level color accent based on index
          const kotAccents = [
            {
              header: "bg-violet-50 border-violet-100",
              badge: "bg-violet-100 text-violet-700",
              hashColor: "text-violet-400",
            },
            {
              header: "bg-sky-50 border-sky-100",
              badge: "bg-sky-100 text-sky-700",
              hashColor: "text-sky-400",
            },
            {
              header: "bg-amber-50 border-amber-100",
              badge: "bg-amber-100 text-amber-700",
              hashColor: "text-amber-400",
            },
          ];
          const accent = kotAccents[gi % kotAccents.length];

          return (
            <div
              key={kotId}
              className="rounded-2xl border border-slate-100 overflow-hidden shadow-sm"
            >
              {/* KOT header */}
              <div
                className={`flex items-center justify-between px-4 py-2.5 border-b ${accent.header}`}
              >
                <div className="flex items-center gap-1.5">
                  <Hash size={11} className={accent.hashColor} />
                  <span className="text-[11px] font-black text-slate-700 uppercase tracking-wide">
                    KOT {kotId}
                  </span>
                </div>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${accent.badge}`}
                >
                  {items.length} item{items.length !== 1 ? "s" : ""}
                </span>
              </div>

              {/* Items list */}
              <div className="divide-y divide-slate-50 bg-white">
                {items.map((item, idx) => {
                  const st = ITEM_STATUS[item.status] || ITEM_STATUS.pending;
                  const StatusIcon = st.icon;

                  return (
                    <div
                      key={item.itemId}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50/80 transition-colors group"
                    >
                      {/* Index */}
                      <span className="w-5 h-5 rounded-lg bg-slate-100 group-hover:bg-slate-200 text-slate-500 text-[10px] font-black flex items-center justify-center shrink-0 transition-colors">
                        {idx + 1}
                      </span>

                      {/* Name + variant */}
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-semibold text-slate-900 truncate leading-tight">
                          {item.itemName}
                          {item.isNC && (
                            <span className="ml-1.5 text-[9px] font-black text-rose-500 uppercase bg-rose-50 border border-rose-100 px-1.5 py-0.5 rounded-full">
                              NC
                            </span>
                          )}
                          {item.isComplimentary && (
                            <span className="ml-1.5 text-[9px] font-black text-violet-500 uppercase bg-violet-50 border border-violet-100 px-1.5 py-0.5 rounded-full">
                              Comp
                            </span>
                          )}
                        </p>
                        {item.variantName && (
                          <p className="text-[10px] text-slate-400 font-medium mt-0.5">
                            {item.variantName}
                          </p>
                        )}
                      </div>

                      {/* Qty × price */}
                      <div className="text-right shrink-0 mr-1.5">
                        <p className="text-[12px] font-black text-slate-900 font-mono">
                          {formatNumber(item.totalPrice, true)}
                        </p>
                        <p className="text-[10px] text-slate-400 font-medium">
                          {item.quantity} × {formatNumber(item.unitPrice, true)}
                        </p>
                      </div>

                      {/* Status chip */}
                      {/* <div
                        className={`shrink-0 flex items-center gap-1 px-2 py-1 rounded-lg ring-1 ${st.bg} ${st.ring}`}
                      >
                        <StatusIcon size={10} className={st.color} />
                        <span
                          className={`text-[9px] font-bold hidden sm:block ${st.color}`}
                        >
                          {st.label}
                        </span>
                      </div> */}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

      {/* ── Status legend ── */}
      {/* <div className="rounded-xl border border-dashed border-slate-200 px-4 py-3">
        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2.5">
          Item Status
        </p>
        <div className="flex flex-wrap gap-x-4 gap-y-1.5">
          {Object.entries(ITEM_STATUS).map(
            ([key, { label, icon: Icon, color, bg }]) => (
              <div key={key} className="flex items-center gap-1.5">
                <div
                  className={`w-5 h-5 rounded-md flex items-center justify-center ${bg}`}
                >
                  <Icon size={10} className={color} />
                </div>
                <span className="text-[10px] text-slate-500 font-semibold">
                  {label}
                </span>
              </div>
            ),
          )}
        </div>
      </div> */}
    </div>
  );
}

// ─── Drawer Footer (Bill Summary) ─────────────────────────────────────────────
function DrawerFooter({ table }) {
  const tax = (table?.orderAmount || 0) - (table?.orderSubtotal || 0);
  const taxPct =
    table?.orderSubtotal > 0
      ? ((tax / table.orderSubtotal) * 100).toFixed(1)
      : 0;

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center gap-2 mb-1">
        <div className="w-5 h-5 rounded-lg bg-slate-100 flex items-center justify-center">
          <ShoppingBag size={11} className="text-slate-500" />
        </div>
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
          Bill Summary
        </p>
      </div>

      {/* Line items */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-[13px] text-slate-500 font-medium">
            Subtotal
          </span>
          <span className="text-[13px] text-slate-800 font-semibold font-mono">
            {formatNumber(table?.orderSubtotal, true)}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-[13px] text-slate-500 font-medium flex items-center gap-1.5">
            Taxes & Charges
            {taxPct > 0 && (
              <span className="text-[9px] font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-full">
                {taxPct}%
              </span>
            )}
          </span>
          <span className="text-[13px] text-slate-800 font-semibold font-mono">
            {formatNumber(tax, true)}
          </span>
        </div>
      </div>

      {/* Total row */}
      <div className="flex justify-between items-center pt-2.5 border-t border-slate-200">
        <span className="text-[14px] text-slate-900 font-black">
          Total Payable
        </span>
        <span className="text-[20px] text-slate-900 font-black font-mono tracking-tight">
          {formatNumber(table?.orderAmount, true)}
        </span>
      </div>
    </div>
  );
}

// ─── Main Export ──────────────────────────────────────────────────────────────
export default function OrderDetailDrawer({ table, isOpen, onClose }) {
  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={<DrawerTitle table={table} />}
      // subtitle={<DrawerSubtitle table={table} />}
      footer={<DrawerFooter table={table} />}
      closeOnBackdrop={true}
    >
      <DrawerBody table={table} />
    </Drawer>
  );
}
