import { useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  CalendarDays,
  Package,
  Layers,
  Users,
  CreditCard,
  Percent,
  PieChart,
  Monitor,
  BadgeIndianRupee,
  ReceiptIndianRupee,
  XCircle,
  BarChart3,
  ArrowUpRight,
  Search,
  ChevronRight,
  Wallet,
} from "lucide-react";
import PageHeader from "../../layout/PageHeader";
import SearchBar from "../../components/SearchBar";
import { ROUTE_PATHS } from "../../config/paths";

// ─── Data ─────────────────────────────────────────────────────────────────────
const GROUPS = [
  {
    key: "sales",
    label: "Sales",
    desc: "Revenue & performance",
    accent: "#6366f1",
    lightBg: "#f5f3ff",
    reports: [
      {
        name: "Daily Sales",
        path: ROUTE_PATHS.REPORTS_DAILY_SALES,
        icon: CalendarDays,
        desc: "Day-by-day revenue breakdown",
      },
      {
        name: "Item Sales",
        path: ROUTE_PATHS.REPORTS_ITEM_SALES,
        icon: Package,
        desc: "Menu item performance",
      },
      {
        name: "Category Sales",
        path: ROUTE_PATHS.REPORTS_CATEGORY_SALES,
        icon: Layers,
        desc: "Revenue split by category",
      },
      {
        name: "Staff Sales",
        path: ROUTE_PATHS.REPORTS_STAFF_SALES,
        icon: Users,
        desc: "Individual staff performance",
      },
      // {
      //   name: "Service Type",
      //   path: ROUTE_PATHS.REPORTS_SERVICE_TYPE_BREAKDOWN,
      //   icon: PieChart,
      //   desc: "Dine-in, takeaway & delivery",
      // },
    ],
  },
  {
    key: "financial",
    label: "Financial",
    desc: "Payments & deductions",
    accent: "#10b981",
    lightBg: "#f0fdf4",
    reports: [
      {
        name: "Payments",
        path: ROUTE_PATHS.REPORTS_PAYMENT_MODE,
        icon: CreditCard,
        desc: "Revenue by payment method",
      },
      {
        name: "Tax",
        path: ROUTE_PATHS.REPORTS_TAX,
        icon: Percent,
        desc: "GST & tax collected",
      },
      {
        name: "Discount",
        path: ROUTE_PATHS.REPORTS_DISCOUNT,
        icon: BadgeIndianRupee,
        desc: "Discounts applied to orders",
      },
      {
        name: "Adjustment",
        path: ROUTE_PATHS.REPORTS_ADJUSTMENT,
        icon: BarChart3,
        desc: "Manual price adjustments",
      },
      {
        name: "Outside Collection",
        path: ROUTE_PATHS.REPORTS_OUTSIDE_COLLECTION,
        icon: Wallet,
        desc: "Payments collected outside restaurant",
      },
    ],
  },
  {
    key: "operations",
    label: "Operations",
    desc: "Floor, station & dues",
    accent: "#f59e0b",
    lightBg: "#fffbeb",
    reports: [
      {
        name: "Station Sales",
        path: ROUTE_PATHS.REPORTS_STATION_SALES,
        icon: Monitor,
        desc: "Kitchen & bar station output",
      },
      {
        name: "Section Sales",
        path: ROUTE_PATHS.REPORTS_SECTION_SALES,
        icon: Layers,
        desc: "Floor & section revenue",
      },
      {
        name: "Due Report",
        path: ROUTE_PATHS.REPORTS_DUE,
        icon: BadgeIndianRupee,
        desc: "Outstanding customer balances",
      },
      {
        name: "No Charge Report",
        path: ROUTE_PATHS.REPORTS_NC,
        icon: ReceiptIndianRupee,
        desc: "Complimentary & no-charge items",
      },
      {
        name: "Cancellation Report",
        path: ROUTE_PATHS.REPORTS_CANCELLATION,
        icon: XCircle,
        desc: "Cancelled orders analysis",
      },
    ],
  },
];

const ALL_REPORTS = GROUPS.flatMap((g) =>
  g.reports.map((r) => ({
    ...r,
    groupLabel: g.label,
    accent: g.accent,
    lightBg: g.lightBg,
  })),
);

// ─── Report Card ──────────────────────────────────────────────────────────────
const ReportCard = ({ report, accent, onClick }) => {
  const Icon = report.icon;
  return (
    <button
      onClick={onClick}
      className="group relative w-full bg-white border border-gray-100 rounded-2xl p-4 text-left overflow-hidden transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 hover:border-gray-200 focus:outline-none"
    >
      {/* Hover bg */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at 10% 10%, ${accent}0d 0%, transparent 65%)`,
        }}
      />

      <div className="relative">
        {/* Icon + arrow */}
        <div className="flex items-start justify-between mb-4">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all duration-200 group-hover:scale-110"
            style={{
              backgroundColor: `${accent}18`,
              border: `1.5px solid ${accent}28`,
            }}
          >
            <Icon size={17} style={{ color: accent }} strokeWidth={1.75} />
          </div>
          <div
            className="w-7 h-7 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all duration-200"
            style={{ backgroundColor: accent }}
          >
            <ArrowUpRight size={12} className="text-white" />
          </div>
        </div>

        {/* Name */}
        <p className="text-[13px] font-black text-gray-900 leading-tight mb-1">
          {report.name}
        </p>
        {/* Desc */}
        <p className="text-[11px] text-gray-400 leading-relaxed line-clamp-2">
          {report.desc}
        </p>
      </div>
    </button>
  );
};

// ─── Search Result Row ────────────────────────────────────────────────────────
const SearchRow = ({ report, onClick }) => {
  const Icon = report.icon;
  return (
    <button
      onClick={onClick}
      className="group w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors text-left"
    >
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
        style={{
          backgroundColor: `${report.accent}15`,
          border: `1px solid ${report.accent}25`,
        }}
      >
        <Icon size={14} style={{ color: report.accent }} strokeWidth={1.75} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-gray-900 leading-none mb-0.5">
          {report.name}
        </p>
        <p className="text-[11px] text-gray-400">{report.desc}</p>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <span
          className="text-[9px] font-bold px-2 py-0.5 rounded-full border"
          style={{
            backgroundColor: `${report.accent}10`,
            borderColor: `${report.accent}25`,
            color: report.accent,
          }}
        >
          {report.groupLabel}
        </span>
        <ChevronRight
          size={13}
          className="text-gray-300 group-hover:text-gray-500 transition-colors"
        />
      </div>
    </button>
  );
};

// ─── Group Section ────────────────────────────────────────────────────────────
const GroupSection = ({ group, navigate }) => (
  <section>
    {/* Header */}
    <div className="flex items-center gap-3 mb-4">
      <div
        className="w-1 h-6 rounded-full shrink-0"
        style={{ backgroundColor: group.accent }}
      />
      <h2 className="text-sm font-black text-gray-900">{group.label}</h2>
      <span className="text-xs text-gray-400">{group.desc}</span>
      <div className="flex-1 h-px bg-gray-100" />
      <span
        className="text-[10px] font-black px-2.5 py-1 rounded-full border shrink-0"
        style={{
          backgroundColor: `${group.accent}10`,
          borderColor: `${group.accent}25`,
          color: group.accent,
        }}
      >
        {group.reports.length}
      </span>
    </div>

    {/* Grid */}
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
      {group.reports.map((r) => (
        <ReportCard
          key={r.path}
          report={r}
          accent={group.accent}
          lightBg={group.lightBg}
          onClick={() => navigate(`${r.path}`)}
        />
      ))}
    </div>
  </section>
);

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
const AllReportsPage = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const filtered = search.trim()
    ? ALL_REPORTS.filter(
        (r) =>
          r.name.toLowerCase().includes(search.toLowerCase()) ||
          r.desc.toLowerCase().includes(search.toLowerCase()) ||
          r.groupLabel.toLowerCase().includes(search.toLowerCase()),
      )
    : [];

  const isSearching = search.trim().length > 0;

  return (
    <div className="space-y-6">
      {/* ── Hero ── */}
      <PageHeader title={"Reports"} />

      <div className="space-y-6">
        {/* Search */}
        <SearchBar
          placeholder="Search reports..."
          onSearch={(value) => setSearch(value)}
          className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 outline-none focus:border-gray-300 focus:bg-white transition-all"
          debounceTime={100}
        />

        {/* Search results */}
        {isSearching && (
          <div className="bg-white mt-2 border border-gray-100 rounded-xl overflow-hidden">
            {filtered.length > 0 ? (
              <div className="divide-y divide-gray-50">
                {filtered.map((r) => (
                  <SearchRow
                    key={r.path}
                    report={r}
                    onClick={() => {
                      setSearch("");
                      navigate(`${r.path}`);
                    }}
                  />
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center py-8 gap-2 text-gray-400">
                <Search size={16} />
                <span className="text-sm font-medium">
                  No reports match "{search}"
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Groups ── */}
      {!isSearching && (
        <div className="space-y-8 ">
          {GROUPS.map((group) => (
            <div key={group.key} id={`group-${group.key}`}>
              <GroupSection group={group} navigate={navigate} />
            </div>
          ))}
        </div>
      )}

      {/* ── Footer ── */}
      {!isSearching && (
        <p className="text-center text-[11px] text-gray-300 pb-2">
          All reports reflect real-time transaction data
        </p>
      )}
    </div>
  );
};

export default AllReportsPage;
