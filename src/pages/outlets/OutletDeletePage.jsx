import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useQueryParams } from "../../hooks/useQueryParams";
import {
  hardDeleteOutlet,
  outletDeletePreview,
  resetOutletPreview,
} from "../../redux/slices/outletSlice";
import PageHeader from "../../layout/PageHeader";
import {
  AlertTriangle,
  Trash2,
  ShieldAlert,
  Users,
  Tag,
  UtensilsCrossed,
  Layers,
  Table2,
  ShoppingBag,
  CreditCard,
  FileText,
  ChefHat,
  Printer,
  UserCircle,
  Wallet,
  Calendar,
  Zap,
  Upload,
  Hash,
  Building2,
  XCircle,
  Info,
} from "lucide-react";
import StatCard from "../../components/StatCard";
import OutletDeleteConfirmationModal from "../../partial/outlet/OutletDeleteConfirmationModal";
import { useNavigate } from "react-router-dom";
import { handleResponse } from "../../utils/helpers";
import NoDataFound from "../../layout/NoDataFound";
import { fetchMeData } from "../../redux/slices/authSlice";
import { ROUTE_PATHS } from "../../config/paths";

// ─── Table icon + color map ───────────────────────────────────────────────────
const TABLE_META = {
  users: {
    label: "Users",
    icon: Users,
    color: "violet",
  },
  user_roles: {
    label: "User Roles",
    icon: ShieldAlert,
    color: "purple",
  },
  categories: {
    label: "Categories",
    icon: Tag,
    color: "blue",
  },
  items: {
    label: "Menu Items",
    icon: UtensilsCrossed,
    color: "cyan",
  },
  addon_groups: {
    label: "Addon Groups",
    icon: Layers,
    color: "sky",
  },
  floors: {
    label: "Floors",
    icon: Building2,
    color: "indigo",
  },
  sections: {
    label: "Sections",
    icon: Hash,
    color: "slate",
  },
  tables: {
    label: "Tables",
    icon: Table2,
    color: "teal",
  },
  orders: {
    label: "Orders",
    icon: ShoppingBag,
    color: "orange",
  },
  payments: {
    label: "Payments",
    icon: CreditCard,
    color: "emerald",
  },
  invoices: {
    label: "Invoices",
    icon: FileText,
    color: "green",
  },
  kot_tickets: {
    label: "KOT Tickets",
    icon: ChefHat,
    color: "amber",
  },
  kitchen_stations: {
    label: "Kitchen Stations",
    icon: Zap,
    color: "yellow",
  },
  printers: {
    label: "Printers",
    icon: Printer,
    color: "rose",
  },
  customers: {
    label: "Customers",
    icon: UserCircle,
    color: "pink",
  },
  cash_drawer: {
    label: "Cash Drawer",
    icon: Wallet,
    color: "lime",
  },
  day_sessions: {
    label: "Day Sessions",
    icon: Calendar,
    color: "fuchsia",
  },
  print_jobs: {
    label: "Print Jobs",
    icon: Printer,
    color: "red",
  },
  bulk_upload_logs: {
    label: "Bulk Upload Logs",
    icon: Upload,
    color: "slate",
  },
};

// ─── Skeleton Loader ──────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 animate-pulse">
      <div className="h-3 bg-slate-200 rounded w-2/3 mb-3" />
      <div className="h-7 bg-slate-200 rounded w-1/3 mb-2" />
      <div className="h-2.5 bg-slate-100 rounded w-1/2" />
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
const OutletDeletePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { outletId } = useQueryParams();
  const { outletPreview, isOpeningDeletePreview, isDeletingOutlet } =
    useSelector((state) => state.outlet);

  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    dispatch(outletDeletePreview(outletId));

    return () => {
      dispatch(resetOutletPreview());
    };
  }, [outletId]);

  const handleDelete = async (confirmationCode) => {
    await handleResponse(
      dispatch(hardDeleteOutlet({ outletId, confirmationCode })),
      () => {
        dispatch(fetchMeData());
        navigate(ROUTE_PATHS.ALL_OUTLETS);
      },
    );
  };

  const { outlet, tables = {}, warning, totalRows } = outletPreview || {};
  const tableEntries = Object.entries(tables);

  return (
    <>
      <div className="space-y-6 pb-10">
        <PageHeader title="Delete Outlet Permanently" showBackButton />

        {isOpeningDeletePreview ? (
          <div className="space-y-5">
            <div className="h-28 bg-white rounded-2xl border border-slate-200 animate-pulse" />
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          </div>
        ) : outletPreview ? (
          <div className="space-y-6">
            {/* ── Outlet identity card ── */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-red-600 via-red-700 to-rose-800 p-6 text-white shadow-xl">
              <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/3" />
              <div className="absolute bottom-0 left-12 w-32 h-32 rounded-full bg-black/10 translate-y-1/2" />
              <div className="relative z-10 flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
                      <Building2 size={15} className="text-white" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-red-200">
                      Outlet to be Deleted
                    </span>
                  </div>
                  <h2 className="text-xl font-black tracking-tight mb-0.5">
                    {outlet?.name}
                  </h2>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[11px] font-bold text-red-200">
                      Code:
                    </span>
                    <span className="text-[11px] font-black font-mono bg-white/15 px-2 py-0.5 rounded-md text-white tracking-wider">
                      {outlet?.code}
                    </span>
                  </div>
                </div>
                <div className="flex-shrink-0 hidden sm:flex w-14 h-14 rounded-2xl bg-white/10 border border-white/20 items-center justify-center">
                  <Trash2
                    size={26}
                    className="text-white/60"
                    strokeWidth={1.5}
                  />
                </div>
              </div>
            </div>

            {/* ── Warning banner ── */}
            <div className="flex items-start gap-3 bg-amber-50 border border-amber-300 rounded-2xl px-5 py-4">
              <div className="w-9 h-9 rounded-xl bg-amber-400 flex items-center justify-center flex-shrink-0 shadow">
                <AlertTriangle
                  size={17}
                  className="text-white"
                  strokeWidth={2.5}
                />
              </div>
              <div>
                <div className="text-[13px] font-black text-amber-800 mb-0.5">
                  Permanent Action — Cannot Be Undone
                </div>
                <div className="text-[12px] text-amber-700 leading-relaxed">
                  {warning}
                </div>
              </div>
            </div>

            {/* ── Impact summary strip ── */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 text-center">
                <div className="text-2xl font-black text-red-600">
                  {totalRows}
                </div>
                <div className="text-[11px] font-bold text-slate-500 mt-0.5">
                  Total Rows Deleted
                </div>
              </div>
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 text-center">
                <div className="text-2xl font-black text-slate-800">
                  {tableEntries?.length}
                </div>
                <div className="text-[11px] font-bold text-slate-500 mt-0.5">
                  Tables Affected
                </div>
              </div>
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 text-center">
                <div className="text-2xl font-black text-orange-600">
                  {tables?.orders ?? 0}
                </div>
                <div className="text-[11px] font-bold text-slate-500 mt-0.5">
                  Orders Lost
                </div>
              </div>
            </div>

            {/* ── Data breakdown ── */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest">
                  Data Breakdown
                </span>
                <div className="flex-1 h-px bg-slate-100" />
                <span className="text-[10px] font-bold text-slate-500">
                  {tableEntries?.length} tables
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                {tableEntries?.map(([key, count]) => {
                  const meta = TABLE_META[key] || {
                    label: key.replace(/_/g, " "),
                    icon: Hash,
                    color: "gray",
                  };
                  return (
                    <StatCard
                      key={key}
                      icon={meta?.icon}
                      title={meta?.label}
                      value={count}
                      color={meta?.color}
                      variant="v5"
                    />
                  );
                })}
              </div>
            </div>

            {/* ── What happens note ── */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 flex gap-3">
              <Info size={15} className="text-slate-500 flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <div className="text-[12px] font-bold text-slate-700">
                  What happens after deletion?
                </div>
                <ul className="text-[12px] text-slate-500 space-y-1">
                  {[
                    "All staff accounts linked to this outlet will lose access",
                    "All orders, payments, and invoices will be permanently removed",
                    "All menu items, categories and add-ons will be erased",
                    "All floor, section and table configurations will be deleted",
                    "This outlet code cannot be reused or recovered",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <XCircle
                        size={11}
                        className="text-red-400 flex-shrink-0 mt-0.5"
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* ── Delete button ── */}
            <div className="flex items-center justify-end pt-1">
              <button
                onClick={(e) => {
                  (e.stopPropagation(), setShowConfirm(true));
                }}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold text-[13px] px-6 py-3 rounded-xl "
              >
                <Trash2 size={15} strokeWidth={2.5} />
                Delete Outlet Permanently
              </button>
            </div>
          </div>
        ) : (
          /* Error / empty state */
          <NoDataFound
            icon={AlertTriangle}
            title="Unable to load outlet data"
            description="Please go back and try again."
          />
        )}
      </div>

      <OutletDeleteConfirmationModal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        outlet={outlet}
        totalRows={totalRows}
        onConfirm={handleDelete}
        loading={isDeletingOutlet}
      />
    </>
  );
};

export default OutletDeletePage;
