import { useState, useEffect } from "react";
import {
  UtensilsCrossed,
  ShoppingBag,
  Bike,
  Clock,
  ChefHat,
  Users,
  TrendingUp,
  Package,
  Bell,
  X,
  MapPin,
  Phone,
  User,
  Hash,
  Timer,
  Layers,
  AlertTriangle,
  Truck,
  Activity,
  ChevronRight,
  Flame,
  Coffee,
  Eye,
  ReceiptText,
} from "lucide-react";
import PageHeader from "../../layout/PageHeader";
import { useDispatch, useSelector } from "react-redux";
import { fetchRunningOrder } from "../../redux/slices/reportSlice";

const MOCK_ORDERS = [
  {
    id: "ORD-2401",
    type: "dinein",
    status: "new",
    createdAt: new Date(Date.now() - 3 * 60000),
    table: "T-07",
    covers: 4,
    waiter: "Ramesh K.",
    section: "Main Hall",
    customer: "Arjun Mehta",
    phone: "+91 98765 43210",
    items: [
      { name: "Paneer Tikka", qty: 2, price: 320, cat: "Starter" },
      { name: "Dal Makhani", qty: 1, price: 280, cat: "Main" },
      { name: "Butter Naan", qty: 4, price: 60, cat: "Bread" },
      { name: "Mango Lassi", qty: 2, price: 120, cat: "Beverage" },
    ],
    subtotal: 1360,
    tax: 163,
    total: 1523,
    notes: "No onion in dal",
    priority: true,
  },
  {
    id: "ORD-2402",
    type: "zomato",
    status: "preparing",
    createdAt: new Date(Date.now() - 14 * 60000),
    zomatoOrderId: "ZMT-88214",
    rider: "Suresh (On Way)",
    eta: "12 min",
    customer: "Priya Sharma",
    phone: "+91 91234 56789",
    address: "204, Sunrise Apt, Navrangpura",
    items: [
      { name: "Chicken Biryani", qty: 1, price: 380, cat: "Main" },
      { name: "Raita", qty: 1, price: 60, cat: "Side" },
      { name: "Gulab Jamun", qty: 2, price: 80, cat: "Dessert" },
    ],
    subtotal: 600,
    tax: 72,
    total: 672,
    notes: "",
    priority: false,
  },
  {
    id: "ORD-2403",
    type: "takeaway",
    status: "ready",
    createdAt: new Date(Date.now() - 24 * 60000),
    tokenNo: "TK-041",
    customer: "Amit Kapoor",
    phone: "+91 87654 32109",
    items: [
      { name: "Veg Thali", qty: 2, price: 250, cat: "Main" },
      { name: "Sweet Lassi", qty: 2, price: 80, cat: "Beverage" },
    ],
    subtotal: 660,
    tax: 79,
    total: 739,
    notes: "Extra pickle please",
    priority: false,
  },
  {
    id: "ORD-2404",
    type: "swiggy",
    status: "preparing",
    createdAt: new Date(Date.now() - 18 * 60000),
    swiggyOrderId: "SWG-44923",
    rider: "Pending assign",
    eta: "18 min",
    customer: "Neha Rathi",
    phone: "+91 76543 21098",
    address: "12B, Shahibaug Colony",
    items: [
      { name: "Masala Dosa", qty: 2, price: 180, cat: "Main" },
      { name: "Filter Coffee", qty: 2, price: 90, cat: "Beverage" },
      { name: "Idli Sambar", qty: 1, price: 160, cat: "Main" },
      { name: "Medu Vada", qty: 2, price: 120, cat: "Starter" },
      { name: "Coconut Chutney", qty: 1, price: 40, cat: "Side" },
      { name: "Pineapple Kesari", qty: 1, price: 90, cat: "Dessert" },
    ],
    subtotal: 1160,
    tax: 139,
    total: 1299,
    notes: "Extra sambar on the side",
    priority: false,
  },
  {
    id: "ORD-2405",
    type: "dinein",
    status: "preparing",
    createdAt: new Date(Date.now() - 22 * 60000),
    table: "T-02",
    covers: 2,
    waiter: "Kavita J.",
    section: "Terrace",
    customer: "Sanjay & Meera",
    phone: "+91 99887 76655",
    items: [
      { name: "Mixed Grill Platter", qty: 1, price: 850, cat: "Starter" },
      { name: "Garlic Naan", qty: 4, price: 60, cat: "Bread" },
      { name: "Butter Chicken", qty: 1, price: 420, cat: "Main" },
      { name: "Jeera Rice", qty: 2, price: 180, cat: "Rice" },
      { name: "Mango Kulfi", qty: 2, price: 150, cat: "Dessert" },
    ],
    subtotal: 2110,
    tax: 253,
    total: 2363,
    notes: "",
    priority: true,
  },
  {
    id: "ORD-2406",
    type: "zomato",
    status: "new",
    createdAt: new Date(Date.now() - 2 * 60000),
    zomatoOrderId: "ZMT-88391",
    rider: "Awaiting",
    eta: "—",
    customer: "Kavita Joshi",
    phone: "+91 88776 65544",
    address: "Shop 7, CG Road",
    items: [
      { name: "Veg Fried Rice", qty: 1, price: 220, cat: "Main" },
      { name: "Gobi Manchurian", qty: 1, price: 250, cat: "Starter" },
    ],
    subtotal: 470,
    tax: 56,
    total: 526,
    notes: "Less spicy",
    priority: false,
  },
  {
    id: "ORD-2407",
    type: "swiggy",
    status: "new",
    createdAt: new Date(Date.now() - 1 * 60000),
    swiggyOrderId: "SWG-44981",
    rider: "Awaiting",
    eta: "—",
    customer: "Arjun Pillai",
    phone: "+91 77665 54433",
    address: "B-304, Patel Nagar",
    items: [
      { name: "Chole Bhature", qty: 2, price: 200, cat: "Main" },
      { name: "Chaas", qty: 1, price: 60, cat: "Beverage" },
    ],
    subtotal: 460,
    tax: 55,
    total: 515,
    notes: "",
    priority: false,
  },
  {
    id: "ORD-2408",
    type: "takeaway",
    status: "new",
    createdAt: new Date(Date.now() - 5 * 60000),
    tokenNo: "TK-042",
    customer: "Meera Nair",
    phone: "+91 66554 43322",
    items: [
      { name: "Hakka Noodles", qty: 1, price: 240, cat: "Main" },
      { name: "Spring Roll", qty: 2, price: 140, cat: "Starter" },
      { name: "Manchow Soup", qty: 1, price: 180, cat: "Soup" },
    ],
    subtotal: 700,
    tax: 84,
    total: 784,
    notes: "No MSG please",
    priority: false,
  },
];

const T = {
  dinein: {
    label: "Dine In",
    color: "#4F46E5",
    light: "#EEF2FF",
    text: "#3730A3",
    Icon: UtensilsCrossed,
  },
  takeaway: {
    label: "Takeaway",
    color: "#0D9488",
    light: "#F0FDFA",
    text: "#0F766E",
    Icon: ShoppingBag,
  },
  zomato: {
    label: "Zomato",
    color: "#E11D48",
    light: "#FFF1F2",
    text: "#BE123C",
    Icon: Bike,
  },
  swiggy: {
    label: "Swiggy",
    color: "#EA580C",
    light: "#FFF7ED",
    text: "#C2410C",
    Icon: Truck,
  },
};

const S = {
  new: {
    label: "New",
    color: "#DC2626",
    bg: "#FEF2F2",
    dot: "#EF4444",
    pulse: true,
  },
  preparing: {
    label: "Preparing",
    color: "#B45309",
    bg: "#FFFBEB",
    dot: "#F59E0B",
    pulse: false,
  },
  ready: {
    label: "Ready",
    color: "#047857",
    bg: "#ECFDF5",
    dot: "#10B981",
    pulse: false,
  },
};

function elapsed(d) {
  return Math.floor((Date.now() - new Date(d).getTime()) / 60000);
}

function OrderCard({ order, onClick }) {
  const tc = T[order.type];
  const sc = S[order.status];
  const min = elapsed(order.createdAt);
  const delayed = min > 20 && order.status !== "ready";

  const meta = {
    dinein: `${order.table}  ·  ${order.covers} covers  ·  ${order.waiter}`,
    takeaway: `Token ${order.tokenNo}  ·  ${order.customer}`,
    zomato: `${order.zomatoOrderId}  ·  ETA ${order.eta}`,
    swiggy: `${order.swiggyOrderId}  ·  ETA ${order.eta}`,
  }[order.type];

  return (
    <button
      onClick={onClick}
      className="group w-full text-left bg-white rounded-2xl overflow-hidden flex flex-col transition-all duration-150 hover:shadow-lg hover:-translate-y-px active:scale-[0.98]"
      style={{
        border: "1px solid #E5E7EB",
        borderLeft: `3px solid ${tc.color}`,
      }}
    >
      <div className="px-4 pt-4 pb-3 flex-1">
        {/* Top row */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-1.5 flex-wrap flex-1 min-w-0">
            <span
              className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md"
              style={{ background: tc.light, color: tc.text }}
            >
              <tc.Icon size={9} />
              {tc.label}
            </span>
            {order.priority && (
              <span className="inline-flex items-center gap-0.5 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-400 text-amber-900">
                <Flame size={8} />
                HOT
              </span>
            )}
            {delayed && (
              <span className="inline-flex items-center gap-0.5 text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-600">
                <AlertTriangle size={8} />
                DELAY
              </span>
            )}
          </div>
          <span className="text-sm font-bold text-gray-900 flex-shrink-0">
            ₹{order.total.toLocaleString()}
          </span>
        </div>

        {/* Order ID + timer */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-mono text-gray-400">
            {order.id}
          </span>
          <span
            className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full
            ${delayed ? "bg-red-100 text-red-600" : min > 10 ? "bg-amber-100 text-amber-700" : "bg-gray-100 text-gray-500"}`}
          >
            <Timer size={9} />
            {min}m
          </span>
        </div>

        {/* Meta line */}
        <p className="text-[11px] text-gray-500 truncate mb-3 leading-relaxed">
          {meta}
        </p>

        {/* Status + item count */}
        <div className="flex items-center justify-between">
          <span
            className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full"
            style={{ background: sc.bg, color: sc.color }}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${sc.pulse ? "animate-pulse" : ""}`}
              style={{ background: sc.dot }}
            />
            {sc.label}
          </span>
          <span className="flex items-center gap-1 text-[11px] text-gray-400">
            <Layers size={10} />
            {order.items.length} items
            <ChevronRight
              size={11}
              className="text-gray-300 group-hover:text-gray-500 group-hover:translate-x-0.5 transition-all"
            />
          </span>
        </div>
      </div>
    </button>
  );
}

function DRow({ icon: Icon, label, value, mono = false }) {
  return (
    <div className="flex gap-3 py-2.5 border-b border-gray-50 last:border-0 items-start">
      <div className="w-7 h-7 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0 mt-0.5">
        <Icon size={12} className="text-gray-400" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider mb-0.5">
          {label}
        </p>
        <p
          className={`text-sm font-semibold text-gray-800 break-words ${mono ? "font-mono text-xs" : ""}`}
        >
          {value}
        </p>
      </div>
    </div>
  );
}

function Drawer({ order, onClose }) {
  const tc = T[order.type];
  const sc = S[order.status];
  const min = elapsed(order.createdAt);
  const grouped = order.items.reduce((a, i) => {
    (a[i.cat] = a[i.cat] || []).push(i);
    return a;
  }, {});

  useEffect(() => {
    const fn = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", fn);
    return () => document.removeEventListener("keydown", fn);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/40 " onClick={onClose} />
      <div
        className="relative w-full max-w-[420px] bg-white h-full flex flex-col shadow-2xl"
        style={{ animation: "slideIn .2s cubic-bezier(.22,1,.36,1)" }}
      >
        {/* Drawer header */}
        <div
          style={{ borderTop: `3px solid ${tc.color}` }}
          className="px-5 py-4 border-b border-gray-100 flex items-center gap-3 flex-shrink-0"
        >
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: tc.light }}
          >
            <tc.Icon size={16} style={{ color: tc.color }} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="font-bold text-gray-900">{order.id}</p>
              <span
                className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2 py-0.5 rounded-full"
                style={{ background: sc.bg, color: sc.color }}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${sc.pulse ? "animate-pulse" : ""}`}
                  style={{ background: sc.dot }}
                />
                {sc.label}
              </span>
            </div>
            <p className="text-[11px] text-gray-400">
              {tc.label} · {min} min ago
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center flex-shrink-0 transition-colors"
          >
            <X size={14} className="text-gray-500" />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto">
          {/* Channel-specific details */}
          <div className="px-5 py-4 border-b border-gray-100">
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">
              Order Info
            </p>
            {order.type === "dinein" && (
              <>
                <DRow
                  icon={MapPin}
                  label="Table & Section"
                  value={`${order.table} · ${order.section}`}
                />
                <DRow
                  icon={Users}
                  label="Covers"
                  value={`${order.covers} guests`}
                />
                <DRow icon={User} label="Attended By" value={order.waiter} />
                <DRow icon={User} label="Customer" value={order.customer} />
                <DRow icon={Phone} label="Phone" value={order.phone} mono />
              </>
            )}
            {order.type === "takeaway" && (
              <>
                <DRow
                  icon={Hash}
                  label="Token Number"
                  value={order.tokenNo}
                  mono
                />
                <DRow
                  icon={User}
                  label="Customer Name"
                  value={order.customer}
                />
                <DRow icon={Phone} label="Phone" value={order.phone} mono />
              </>
            )}
            {order.type === "zomato" && (
              <>
                <DRow
                  icon={Hash}
                  label="Zomato Order ID"
                  value={order.zomatoOrderId}
                  mono
                />
                <DRow icon={User} label="Customer" value={order.customer} />
                <DRow icon={Phone} label="Phone" value={order.phone} mono />
                <DRow
                  icon={MapPin}
                  label="Delivery Address"
                  value={order.address}
                />
                <DRow icon={Bike} label="Rider" value={order.rider} />
                <DRow icon={Timer} label="Rider ETA" value={order.eta} />
              </>
            )}
            {order.type === "swiggy" && (
              <>
                <DRow
                  icon={Hash}
                  label="Swiggy Order ID"
                  value={order.swiggyOrderId}
                  mono
                />
                <DRow icon={User} label="Customer" value={order.customer} />
                <DRow icon={Phone} label="Phone" value={order.phone} mono />
                <DRow
                  icon={MapPin}
                  label="Delivery Address"
                  value={order.address}
                />
                <DRow icon={Truck} label="Rider" value={order.rider} />
                <DRow icon={Timer} label="Rider ETA" value={order.eta} />
              </>
            )}
            <div className="flex items-center gap-3 mt-1 bg-gray-50 rounded-xl px-3 py-2.5">
              <Clock size={12} className="text-gray-400 flex-shrink-0" />
              <div>
                <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">
                  Placed At
                </p>
                <p className="text-sm font-semibold text-gray-800">
                  {new Date(order.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                  <span className="ml-2 text-xs font-normal text-gray-400">
                    ({min} min ago)
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Items grouped by category */}
          <div className="px-5 py-4 border-b border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                Items
              </p>
              <span className="text-[11px] text-gray-400 font-semibold">
                {order.items.length} items
              </span>
            </div>
            <div className="space-y-4">
              {Object.entries(grouped).map(([cat, items]) => (
                <div key={cat}>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-gray-300 mb-1.5 px-1">
                    {cat}
                  </p>
                  <div className="bg-gray-50 rounded-xl overflow-hidden">
                    {items.map((item, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between px-3 py-2.5 border-b border-gray-100 last:border-0"
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="w-5 h-5 rounded-md bg-white border border-gray-200 flex items-center justify-center text-[10px] font-bold text-gray-600 flex-shrink-0">
                            {item.qty}
                          </span>
                          <span className="text-sm text-gray-700">
                            {item.name}
                          </span>
                        </div>
                        <span className="text-sm font-semibold text-gray-800 ml-2 flex-shrink-0">
                          ₹{(item.price * item.qty).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Chef note */}
          {order.notes ? (
            <div className="px-5 py-4 border-b border-gray-100">
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">
                Special Instructions
              </p>
              <div className="bg-amber-50 border border-amber-100 rounded-xl px-3 py-2.5 flex items-start gap-2">
                <AlertTriangle
                  size={13}
                  className="text-amber-500 mt-0.5 flex-shrink-0"
                />
                <p className="text-sm text-amber-800">{order.notes}</p>
              </div>
            </div>
          ) : null}

          {/* Bill summary */}
          <div className="px-5 py-4">
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">
              Bill Summary
            </p>
            <div className="bg-gray-50 rounded-xl p-3.5 space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Subtotal</span>
                <span className="font-medium">
                  ₹{order.subtotal.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-sm text-gray-400">
                <span>GST (12%)</span>
                <span>₹{order.tax}</span>
              </div>
              <div className="flex justify-between font-bold text-base text-gray-900 pt-2 mt-1 border-t border-gray-200">
                <span>Total Payable</span>
                <span>₹{order.total.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-gray-100 bg-gray-50 flex-shrink-0">
          <div className="flex items-center gap-2 text-[11px] text-gray-400">
            <Eye size={11} />
            <span>Admin view · Status changes are handled by the cashier</span>
          </div>
        </div>
      </div>

      <style>{`@keyframes slideIn{from{transform:translateX(100%);opacity:.6}to{transform:translateX(0);opacity:1}}`}</style>
    </div>
  );
}

const TABS = [
  {
    key: "dinein",
    label: "Dine In",
    logo: "/Icons/dining.svg",
    color: "#10B981",
  },
  {
    key: "takeaway",
    label: "Takeaway",
    logo: "/Icons/takeaway.svg",
    color: "#3B82F6",
  },
  {
    key: "zomato",
    label: "Zomato",
    logo: "/Icons/zomato.png",
    color: "#E23744",
  },
  {
    key: "swiggy",
    label: "Swiggy",
    logo: "/Icons/swiggy.png",
    color: "#FC8019",
  },
];

export default function LiveOrdersPage() {
  const dispatch = useDispatch();
  const { outletId } = useSelector((state) => state.auth);

  
  const [tab, setTab] = useState("dinein");

  const fetchOrders = () => {
    dispatch(fetchRunningOrder({outletId,status:tab}));
  };

  const {isFetchingRunningOrder,runningOrders} = useSelector((state) => state.report);

  console.log(isFetchingRunningOrder,runningOrders)

  useEffect(() => {
    if (outletId) {
      fetchOrders(outletId);
    }
  }, [outletId,tab]);

  const [selected, setSelected] = useState(null);
  const [, tick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => tick((n) => n + 1), 30000);
    return () => clearInterval(id);
  }, []);

  const orders = MOCK_ORDERS;
  const filtered = orders
    .filter((o) => tab === "all" || o.type === tab)
    .sort((a, b) => {
      if (a.priority !== b.priority) return a.priority ? -1 : 1;
      return (
        { new: 0, preparing: 1, ready: 2 }[a.status] -
        { new: 0, preparing: 1, ready: 2 }[b.status]
      );
    });

  const cnt = (t) =>
    t === "all" ? orders.length : orders.filter((o) => o.type === t).length;
  const newCount = orders.filter((o) => o.status === "new").length;

  return (
    <div>
      <div className="space-y-6">
        <PageHeader
          title={"Live Orders"}
          badge={
            newCount > 0 && (
              <div className="flex items-center gap-1.5 bg-red-50 border border-red-100 text-red-600 text-xs font-bold px-3 py-2 rounded-xl">
                <Bell size={12} className="animate-bounce" />
                {newCount} new {newCount === 1 ? "order" : "orders"} awaiting
              </div>
            )
          }
        />

        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto hide-scrollbar">
          {TABS.map(({ key, label, logo, color, bg }) => {
            const isActive = tab === key;
            const count = cnt(key);

            return (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={`relative flex items-center gap-2.5 px-4 py-2.5 rounded-2xl border-2 transition-all duration-200 shrink-0 ${
                  isActive
                    ? "shadow-md"
                    : "bg-white border-gray-100 hover:border-gray-200 hover:bg-gray-50"
                }`}
                style={
                  isActive
                    ? { backgroundColor: bg, borderColor: color + "55" }
                    : {}
                }
              >
                {/* Logo */}
                <div>
                  <img
                    src={logo}
                    alt={label}
                    className="w-8 h-8 object-contain"
                  />
                </div>

                {/* Label */}
                <span
                  className={`font-bold transition-colors ${
                    isActive ? "text-gray-900" : "text-gray-500"
                  }`}
                >
                  {label}
                </span>

                {/* Count badge */}
                {count > 0 && (
                  <span
                    className={`text-[11px] font-black px-2 py-0.5 rounded-full transition-all ${
                      isActive ? "text-white" : "bg-gray-100 text-gray-500"
                    }`}
                    style={isActive ? { backgroundColor: color } : {}}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="w-14 h-14 bg-white rounded-2xl border border-gray-100 flex items-center justify-center mb-4 shadow-sm">
              <Coffee size={22} className="text-gray-300" />
            </div>
            <p className="text-sm font-semibold text-gray-500">
              No orders here
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Try adjusting your filters
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {filtered.map((o) => (
              <OrderCard key={o.id} order={o} onClick={() => setSelected(o)} />
            ))}
          </div>
        )}
      </div>

      {selected && (
        <Drawer order={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}
