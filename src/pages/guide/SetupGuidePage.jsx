import { useState } from "react";
import {
  Users, Zap, Layers, Grid3X3, Table2, Receipt, Tag, PlusCircle,
  ShoppingBag, ClipboardList, CreditCard, Package, BarChart3, Settings,
  ChevronRight, CheckCircle2, ArrowRight, BookOpen, Star, Menu, X,
  ChevronLeft
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const steps = [
  {
    id: 1,
    icon: Users,
    title: "Create Staff Accounts",
    subtitle: "Set up your team before anything else",
    color: "from-violet-500 to-purple-600",
    accent: "violet",
    description: "Create staff members for your outlet with role-based access control. Each member gets their own secure login credentials.",
    roles: ["Manager", "Captain", "Kitchen Staff", "Bar Staff", "Cashier"],
    details: [
      { label: "Email", desc: "Unique login email per staff" },
      { label: "Password", desc: "Secure account password" },
      { label: "Staff Code", desc: "Quick identification code" },
      { label: "PIN", desc: "Fast POS login pin" },
    ],
  },
  {
    id: 2,
    icon: Zap,
    title: "Set Up Stations",
    subtitle: "Configure kitchen & bar preparation areas",
    color: "from-amber-400 to-orange-500",
    accent: "amber",
    description: "Create preparation stations and assign printers. Real-time socket technology ensures instant updates across all devices.",
    roles: ["Kitchen Station", "Bar Station", "Custom Areas"],
    details: [
      { label: "Create Stations", desc: "Kitchen, bar, or custom areas" },
      { label: "Assign Printers", desc: "Auto-print KOT & BOT tickets" },
      { label: "Assign Users", desc: "Staff linked to their station" },
      { label: "Live Display", desc: "Real-time order status board" },
    ],
  },
  {
    id: 3,
    icon: Layers,
    title: "Create Floors",
    subtitle: "Map out your restaurant layout",
    color: "from-emerald-400 to-teal-500",
    accent: "emerald",
    description: "Set up all floors in your restaurant. Ground floor, rooftop, outdoor — create as many as your property requires.",
    roles: ["Ground Floor", "First Floor", "Rooftop", "Outdoor Area"],
    details: [
      { label: "Unlimited Floors", desc: "No cap on floor count" },
      { label: "Named Areas", desc: "Custom names for each floor" },
      { label: "Easy Management", desc: "Edit anytime from settings" },
      { label: "Visual Layout", desc: "Clear restaurant map view" },
    ],
  },
  {
    id: 4,
    icon: Grid3X3,
    title: "Create Sections",
    subtitle: "Organize seating within each floor",
    color: "from-sky-400 to-blue-500",
    accent: "sky",
    description: "Each floor can have multiple sections based on your seating arrangement — AC, Non-AC, Family, or any custom area.",
    roles: ["AC Section", "Non-AC Section", "Family Section", "Smoking Area"],
    details: [
      { label: "Multi-Section", desc: "Multiple sections per floor" },
      { label: "Flexible Naming", desc: "Name sections your way" },
      { label: "Staff Visibility", desc: "Staff see their assigned areas" },
      { label: "Easy Routing", desc: "Orders routed by section" },
    ],
  },
  {
    id: 5,
    icon: Table2,
    title: "Create & Manage Tables",
    subtitle: "Define tables within each section",
    color: "from-rose-400 to-pink-500",
    accent: "rose",
    description: "Create tables within sections with capacity, shape, and merge settings. Tables can be updated or merged anytime.",
    roles: ["Table Name/Number", "Seating Capacity", "Table Shape", "Merge Support"],
    details: [
      { label: "Table Details", desc: "Name, capacity, shape" },
      { label: "Merge Tables", desc: "Combine for large parties" },
      { label: "Live Status", desc: "Available or occupied view" },
      { label: "Editable", desc: "Update table details anytime" },
    ],
  },
  {
    id: 6,
    icon: Receipt,
    title: "Create Tax Groups",
    subtitle: "Configure taxes for your products",
    color: "from-slate-500 to-slate-700",
    accent: "slate",
    description: "Custom tax groups are supported alongside built-in defaults. Assign the right tax group to each product at creation time.",
    roles: ["GST 5%", "GST 12%", "GST 18%", "VAT 18%"],
    details: [
      { label: "Default Groups", desc: "GST & VAT preloaded" },
      { label: "Custom Groups", desc: "Create your own tax rules" },
      { label: "Product Linking", desc: "Assign per product" },
      { label: "Auto Split", desc: "CGST + SGST calculated auto" },
    ],
  },
  {
    id: 7,
    icon: Tag,
    title: "Create Categories",
    subtitle: "Organize your menu by service type",
    color: "from-fuchsia-400 to-purple-500",
    accent: "fuchsia",
    description: "Categories control menu visibility per staff type. Bar categories show to bar staff; restaurant categories to captains.",
    roles: ["Bar", "Restaurant", "Both"],
    details: [
      { label: "Service Type", desc: "Bar, restaurant, or both" },
      { label: "Role Visibility", desc: "Staff see relevant items only" },
      { label: "Menu Structure", desc: "Clean organized product list" },
      { label: "Flexible", desc: "Assign products to categories" },
    ],
  },
  {
    id: 8,
    icon: PlusCircle,
    title: "Create Add-On Groups",
    subtitle: "Build customizable product extras",
    color: "from-lime-400 to-green-500",
    accent: "lime",
    description: "Group customizable options for products — toppings, sides, beverages. Each add-on has its own price.",
    roles: ["Pizza Toppings", "Extra Sides", "Beverage Add-ons"],
    details: [
      { label: "Group Name", desc: "e.g. Pizza Toppings" },
      { label: "Add-on Items", desc: "Unlimited items per group" },
      { label: "Individual Pricing", desc: "Each add-on has a price" },
      { label: "Product Linking", desc: "Attach to any product" },
    ],
  },
  {
    id: 9,
    icon: ShoppingBag,
    title: "Create Products",
    subtitle: "Add your full menu with variants",
    color: "from-orange-400 to-red-500",
    accent: "orange",
    description: "Create complete menu items with type, tax, station, and unlimited variants. Manage everything from one place.",
    roles: ["Veg", "Non-Veg", "Egg"],
    details: [
      { label: "Product Info", desc: "Name, description, price" },
      { label: "Station Assign", desc: "Route to kitchen or bar" },
      { label: "Variants", desc: "Unlimited size/type variants" },
      { label: "Add-ons", desc: "Attach add-on groups" },
    ],
  },
  {
    id: 10,
    icon: ClipboardList,
    title: "Taking Orders",
    subtitle: "Captain places orders from mobile app",
    color: "from-cyan-400 to-blue-500",
    accent: "cyan",
    description: "Captains order from the mobile app. Items auto-route to kitchen/bar. KOT/BOT prints instantly. Chef marks ready — captain notified.",
    roles: ["Captain App", "Live KOT/BOT", "Real-time Status", "Push Notification"],
    details: [
      { label: "Mobile Ordering", desc: "Captain places from app" },
      { label: "Auto Routing", desc: "Sent to correct station" },
      { label: "KOT/BOT Print", desc: "Auto printed at station" },
      { label: "Ready Alerts", desc: "Captain notified instantly" },
    ],
  },
  {
    id: 11,
    icon: CreditCard,
    title: "Billing & Completion",
    subtitle: "Cashier closes the order and frees the table",
    color: "from-teal-400 to-emerald-500",
    accent: "teal",
    description: "Once dining is done, the cashier generates the bill, collects payment, and marks the order complete. Table is freed instantly.",
    roles: ["Generate Bill", "Collect Payment", "Complete Order", "Free Table"],
    details: [
      { label: "Bill Generation", desc: "One-click bill creation" },
      { label: "Payment Modes", desc: "Cash, card, UPI etc." },
      { label: "Order Closure", desc: "Mark complete with receipt" },
      { label: "Table Reset", desc: "Available again instantly" },
    ],
  },
  {
    id: 12,
    icon: Package,
    title: "Takeaway Orders",
    subtitle: "Manage pickups directly from the counter",
    color: "from-yellow-400 to-amber-500",
    accent: "yellow",
    description: "Cashiers can create and manage takeaway orders directly without a captain. Seamlessly handled from the same system.",
    roles: ["Counter Ordering", "No Table Required", "Direct Management"],
    details: [
      { label: "Cashier Creates", desc: "No captain needed" },
      { label: "No Table", desc: "Standalone takeaway flow" },
      { label: "Full KOT", desc: "Kitchen still gets ticket" },
      { label: "Quick Billing", desc: "Fast checkout at counter" },
    ],
  },
  {
    id: 13,
    icon: BarChart3,
    title: "Reports & Analytics",
    subtitle: "Full visibility into every aspect of your business",
    color: "from-indigo-400 to-violet-500",
    accent: "indigo",
    description: "Comprehensive reporting with day-wise filters across sales, staff, payments, taxes, and live running data.",
    roles: ["Sales", "Staff", "Tax", "Shift Summary"],
    details: [
      { label: "Sales Reports", desc: "Revenue & item-wise data" },
      { label: "Staff Reports", desc: "Performance per employee" },
      { label: "Running Data", desc: "Live orders & tables" },
      { label: "Day Filters", desc: "Filter by any date range" },
    ],
  },
  {
    id: 14,
    icon: Settings,
    title: "Settings Management",
    subtitle: "Full control for the admin",
    color: "from-gray-500 to-gray-700",
    accent: "gray",
    description: "Admins can configure and control all outlet preferences from the centralized Settings page — anytime, with full control.",
    roles: ["Outlet Config", "Preferences", "System Settings"],
    details: [
      { label: "Outlet Settings", desc: "Core restaurant config" },
      { label: "Preferences", desc: "Customize system behavior" },
      { label: "Admin Only", desc: "Role-protected access" },
      { label: "Live Changes", desc: "Updates apply instantly" },
    ],
  },
];

const accentMap = {
  violet: { pill: "bg-violet-100 text-violet-700", badge: "bg-violet-500", ring: "ring-violet-200", num: "text-violet-600" },
  amber: { pill: "bg-amber-100 text-amber-700", badge: "bg-amber-500", ring: "ring-amber-200", num: "text-amber-600" },
  emerald: { pill: "bg-emerald-100 text-emerald-700", badge: "bg-emerald-500", ring: "ring-emerald-200", num: "text-emerald-600" },
  sky: { pill: "bg-sky-100 text-sky-700", badge: "bg-sky-500", ring: "ring-sky-200", num: "text-sky-600" },
  rose: { pill: "bg-rose-100 text-rose-700", badge: "bg-rose-500", ring: "ring-rose-200", num: "text-rose-600" },
  slate: { pill: "bg-slate-100 text-slate-700", badge: "bg-slate-500", ring: "ring-slate-200", num: "text-slate-600" },
  fuchsia: { pill: "bg-fuchsia-100 text-fuchsia-700", badge: "bg-fuchsia-500", ring: "ring-fuchsia-200", num: "text-fuchsia-600" },
  lime: { pill: "bg-lime-100 text-lime-700", badge: "bg-lime-500", ring: "ring-lime-200", num: "text-lime-600" },
  orange: { pill: "bg-orange-100 text-orange-700", badge: "bg-orange-500", ring: "ring-orange-200", num: "text-orange-600" },
  cyan: { pill: "bg-cyan-100 text-cyan-700", badge: "bg-cyan-500", ring: "ring-cyan-200", num: "text-cyan-600" },
  teal: { pill: "bg-teal-100 text-teal-700", badge: "bg-teal-500", ring: "ring-teal-200", num: "text-teal-600" },
  yellow: { pill: "bg-yellow-100 text-yellow-700", badge: "bg-yellow-500", ring: "ring-yellow-200", num: "text-yellow-600" },
  indigo: { pill: "bg-indigo-100 text-indigo-700", badge: "bg-indigo-500", ring: "ring-indigo-200", num: "text-indigo-600" },
  gray: { pill: "bg-gray-100 text-gray-700", badge: "bg-gray-500", ring: "ring-gray-200", num: "text-gray-600" },
};

function StepCard({ step, isActive, onClick }) {
  const ac = accentMap[step.accent];
  const Icon = step.icon;
  return (
    <div
      onClick={onClick}
      className={`group cursor-pointer rounded-2xl border transition-all duration-300 overflow-hidden
        ${isActive
          ? `border-transparent shadow-xl ring-2 ${ac.ring} bg-white scale-[1.01]`
          : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-md"}`}
    >
      {/* Gradient top bar */}
      <div className={`h-1.5 w-full bg-gradient-to-r ${step.color}`} />

      <div className="p-5">
        {/* Header */}
        <div className="flex items-start gap-4 mb-4">
          <div className={`flex-shrink-0 w-11 h-11 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-md`}>
            <Icon size={20} className="text-white" strokeWidth={2} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <span className={`text-[10px] font-black uppercase tracking-widest ${ac.num}`}>
                Step {step.id}
              </span>
            </div>
            <h3 className="text-[15px] font-bold text-slate-900 leading-tight">{step.title}</h3>
            <p className="text-[12px] text-slate-500 mt-0.5 leading-snug">{step.subtitle}</p>
          </div>
          <ChevronRight
            size={16}
            className={`flex-shrink-0 text-slate-300 transition-all duration-200 mt-1
              ${isActive ? "rotate-90 text-slate-500" : "group-hover:text-slate-400"}`}
          />
        </div>

        {/* Description — only when active */}
        {isActive && (
          <div className="space-y-4">
            <p className="text-[13px] text-slate-600 leading-relaxed border-l-2 border-slate-200 pl-3">
              {step.description}
            </p>

            {/* Tags/Roles */}
            <div className="flex flex-wrap gap-1.5">
              {step.roles.map((r) => (
                <span key={r} className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${ac.pill}`}>
                  {r}
                </span>
              ))}
            </div>

            {/* Detail grid */}
            <div className="grid grid-cols-2 gap-2">
              {step.details.map((d) => (
                <div key={d.label} className="flex items-start gap-2 bg-slate-50 rounded-xl p-2.5">
                  <CheckCircle2 size={13} className={`flex-shrink-0 mt-0.5 ${ac.num}`} />
                  <div>
                    <div className="text-[11px] font-bold text-slate-800">{d.label}</div>
                    <div className="text-[10px] text-slate-500 leading-tight">{d.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Sidebar({ activeStep, setActiveStep, sidebarOpen, setSidebarOpen }) {
  const navigate = useNavigate();
  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside className={`
        fixed top-0 left-0 h-full z-30 w-72 bg-white border-r border-slate-100 flex flex-col transition-transform duration-300
        lg:static lg:translate-x-0 lg:flex lg:z-auto
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        {/* Logo */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-400 to-rose-500 flex items-center justify-center shadow">
              <ChevronLeft size={17} className="text-white" />
            </button>
            <div>
              <div className="text-[13px] font-black text-slate-900 tracking-tight">Setup Guide</div>
              <div className="text-[10px] text-slate-400 font-medium">Restaurant Management</div>
            </div>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-slate-400 hover:text-slate-600">
            <X size={18} />
          </button>
        </div>

        {/* Progress */}
        <div className="px-6 py-3 border-b border-slate-100">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Progress</span>
            <span className="text-[10px] font-bold text-slate-600">{activeStep}/{steps.length}</span>
          </div>
          <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-orange-400 to-rose-500 rounded-full transition-all duration-500"
              style={{ width: `${(activeStep / steps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Steps nav */}
        <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-0.5">
          {steps.map((step) => {
            const Icon = step.icon;
            const isActive = step.id === activeStep;
            const isDone = step.id < activeStep;
            const ac = accentMap[step.accent];
            return (
              <button
                key={step.id}
                onClick={() => { setActiveStep(step.id); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-150
                  ${isActive ? "bg-slate-900 text-white shadow-md" : "hover:bg-slate-50 text-slate-700"}`}
              >
                <div className={`flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-black transition-all
                  ${isActive
                    ? "bg-white/20 text-white"
                    : isDone
                    ? `bg-gradient-to-br ${step.color} text-white`
                    : "bg-slate-100 text-slate-500"}`}>
                  {isDone ? <CheckCircle2 size={13} /> : step.id}
                </div>
                <div className="flex-1 min-w-0">
                  <div className={`text-[12px] font-semibold truncate ${isActive ? "text-white" : "text-slate-800"}`}>
                    {step.title}
                  </div>
                </div>
                {isActive && <div className="w-1.5 h-1.5 rounded-full bg-orange-400 flex-shrink-0" />}
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100">
          <div className="flex items-center gap-2 text-[11px] text-slate-400">
            <Star size={11} className="text-amber-400" fill="#fbbf24" />
            <span>14 steps to get fully operational</span>
          </div>
        </div>
      </aside>
    </>
  );
}

export default function SetupGuidePage() {
  const [activeStep, setActiveStep] = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const currentStep = steps.find((s) => s.id === activeStep);
  const Icon = currentStep.icon;
  const ac = accentMap[currentStep.accent];

  const goNext = () => setActiveStep((p) => Math.min(p + 1, steps.length));
  const goPrev = () => setActiveStep((p) => Math.max(p - 1, 1));

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans max-w-9xl mx-auto">
      <Sidebar
        activeStep={activeStep}
        setActiveStep={setActiveStep}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {/* Main content */}
      <main className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Top bar */}
        <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-sm border-b border-slate-100 px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-slate-100 text-slate-600"
            >
              <Menu size={18} />
            </button>
            <div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                Step {currentStep.id} of {steps.length}
              </div>
              <div className="text-[15px] font-bold text-slate-900 leading-tight">
                {currentStep.title}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={goPrev}
              disabled={activeStep === 1}
              className="px-4 py-2 text-[12px] font-semibold rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              ← Prev
            </button>
            <button
              onClick={goNext}
              disabled={activeStep === steps.length}
              className={`px-4 py-2 text-[12px] font-semibold rounded-xl text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all bg-gradient-to-r ${currentStep.color} hover:opacity-90 shadow-sm`}
            >
              Next →
            </button>
          </div>
        </header>

        {/* Hero section */}
        <div className={`bg-gradient-to-br ${currentStep.color} px-8 py-10 relative overflow-hidden`}>
          {/* Decorative circles */}
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-20 w-40 h-40 rounded-full bg-black/5 translate-y-1/2" />

          <div className="relative z-10 max-w-3xl">
            <div className="flex items-center gap-2 mb-4">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-widest bg-white/20 text-white px-3 py-1 rounded-full">
                Step {currentStep.id}
              </span>
            </div>
            <div className="flex items-start gap-5">
              <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg border border-white/30">
                <Icon size={30} className="text-white" strokeWidth={1.8} />
              </div>
              <div>
                <h1 className="text-3xl font-black text-white tracking-tight mb-1">{currentStep.title}</h1>
                <p className="text-white/80 text-[15px] font-medium">{currentStep.subtitle}</p>
              </div>
            </div>
            <p className="mt-5 text-white/90 text-[14px] leading-relaxed max-w-2xl border-l-2 border-white/40 pl-4">
              {currentStep.description}
            </p>
          </div>
        </div>

        {/* Content area */}
        <div className="flex-1 px-6 py-8 w-full mx-auto">

          {/* Key attributes grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            {currentStep.details.map((d, i) => (
              <div
                key={d.label}
                className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm hover:shadow-md transition-all duration-200 group"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${currentStep.color} flex items-center justify-center mb-3 shadow-sm group-hover:scale-110 transition-transform`}>
                  <CheckCircle2 size={14} className="text-white" />
                </div>
                <div className="text-[13px] font-bold text-slate-900 mb-0.5">{d.label}</div>
                <div className="text-[11px] text-slate-500 leading-snug">{d.desc}</div>
              </div>
            ))}
          </div>

          {/* Roles / Tags section */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mb-6">
            <h2 className="text-[13px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <div className={`w-5 h-5 rounded-lg bg-gradient-to-br ${currentStep.color} flex items-center justify-center`}>
                <Star size={10} className="text-white" fill="white" />
              </div>
              Key Options
            </h2>
            <div className="flex flex-wrap gap-2">
              {currentStep.roles.map((r, i) => (
                <span
                  key={r}
                  className={`inline-flex items-center gap-1.5 text-[12px] font-semibold px-3.5 py-2 rounded-xl border transition-all hover:scale-105 ${ac.pill} border-transparent`}
                >
                  <ArrowRight size={11} />
                  {r}
                </span>
              ))}
            </div>
          </div>

          {/* Step navigation cards at bottom */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {activeStep > 1 && (
              <button
                onClick={goPrev}
                className="bg-white rounded-2xl border border-slate-200 p-4 text-left hover:shadow-md transition-all duration-200 group"
              >
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">← Previous</div>
                <div className="text-[13px] font-bold text-slate-800 group-hover:text-slate-900">
                  {steps[activeStep - 2].title}
                </div>
              </button>
            )}
            {activeStep < steps.length && (
              <button
                onClick={goNext}
                className={`rounded-2xl p-4 text-left hover:shadow-md transition-all duration-200 group bg-gradient-to-br ${currentStep.color} ${activeStep === 1 ? "col-span-full sm:col-span-2" : ""}`}
              >
                <div className="text-[10px] font-bold text-white/70 uppercase tracking-wider mb-1">Next Step →</div>
                <div className="text-[13px] font-bold text-white">
                  {steps[activeStep].title}
                </div>
              </button>
            )}
            {activeStep === steps.length && (
              <div className="bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl p-5 text-center col-span-full shadow-lg">
                <CheckCircle2 size={28} className="text-white mx-auto mb-2" />
                <div className="text-white font-black text-lg">You're all set! 🎉</div>
                <div className="text-white/80 text-[13px] mt-1">Your restaurant system is fully configured and ready to operate.</div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}