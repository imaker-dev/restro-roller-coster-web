import React, { useEffect, useState } from "react";
import PageHeader from "../../layout/PageHeader";
import { useQueryParams } from "../../hooks/useQueryParams";
import { useDispatch, useSelector } from "react-redux";
import { fetchSuperAdminById } from "../../redux/slices/adminSlice";
import {
  Mail,
  Phone,
  Shield,
  Clock,
  Building2,
  Hash,
  Layers,
  Table2,
  Copy,
  Check,
  MapPin,
  CreditCard,
  Loader2,
  Calendar,
  ChevronDown,
  ChevronUp,
  IndianRupee,
  UtensilsCrossed,
} from "lucide-react";
import UserAvatar from "../../components/UserAvatar";
import RoleBadge from "../../partial/user/RoleBadge";
import StatCard from "../../components/StatCard";
import { formatNumber } from "../../utils/numberFormatter";
import { formatDate } from "../../utils/dateFormatter";
import LoadingOverlay from "../../components/LoadingOverlay";
import SmartTable from "../../components/SmartTable";
import { formatText } from "../../utils/utils";
import StatusBadge from "../../layout/StatusBadge";

const SuperAdminDetailsPage = () => {
  const dispatch = useDispatch();
  const { userId } = useQueryParams();
  const { isFetchingSuperAdminDetails, superAdminDetails } = useSelector(
    (state) => state.admin,
  );
  const [copiedField, setCopiedField] = useState(null);
  const [expandedOutlet, setExpandedOutlet] = useState(null);

  useEffect(() => {
    dispatch(fetchSuperAdminById({ userId }));
  }, [userId]);

  const copyToClipboard = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  if (isFetchingSuperAdminDetails) {
    return <LoadingOverlay text="Loading super admin details..." />;
  }

  if (!superAdminDetails?.superAdmin) return null;

  const { superAdmin, summary, outlets } = superAdminDetails;

  const columns = [
    /* ===============================
     OUTLET
  =============================== */
    {
      key: "outlet",
      label: "Outlet",
      render: (row) => (
        <div className="flex items-start gap-3 min-w-0">
          <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
            <Building2 className="h-5 w-5 text-slate-500" />
          </div>

          <div className="flex flex-col min-w-0">
            <p className="text-xs font-extrabold text-slate-800 truncate">
              {row.name}
            </p>

            <p className="text-[11px] font-bold text-slate-500 truncate">
              {row.code}
            </p>

            {row.legal_name && (
              <p className="text-[10px] text-slate-400 truncate mt-0.5">
                {row.legal_name}
              </p>
            )}
          </div>
        </div>
      ),
    },

    /* ===============================
     LOCATION
  =============================== */
    {
      key: "location",
      label: "Location",

      render: (row) => (
        <div className="flex items-start gap-2">
          <MapPin size={14} className="text-slate-400 mt-0.5 shrink-0" />

          <div className="flex flex-col min-w-0">
            <span className="text-[12px] font-bold text-slate-700">
              {row.city || "-"}
            </span>

            <span className="text-[10px] text-slate-400">
              {row.state}
              {row.country ? ` • ${row.country}` : ""}
            </span>

            {row.postal_code && (
              <span className="text-[10px] text-slate-300">
                PIN: {row.postal_code}
              </span>
            )}
          </div>
        </div>
      ),
    },

    /* ===============================
     CONTACT
  =============================== */
    {
      key: "contact",
      label: "Contact",

      render: (row) => (
        <div className="flex flex-col gap-1">
          {row.phone && (
            <div className="flex items-center gap-1.5">
              <Phone size={13} className="text-slate-400" />

              <span className="text-[11px] font-semibold text-slate-700">
                {row.phone}
              </span>
            </div>
          )}

          {row.email && (
            <div className="flex items-center gap-1.5">
              <Mail size={13} className="text-slate-400" />

              <span className="text-[10px] text-slate-500 truncate max-w-[160px]">
                {row.email}
              </span>
            </div>
          )}
        </div>
      ),
    },

    /* ===============================
     SUBSCRIPTION
  =============================== */
    {
      key: "subscription",
      label: "Subscription",

      render: (row) => {
        const plan = row.subscription_plan;

        return (
          <div className="flex flex-col">
            <StatusBadge value={plan?.status} size="sm" />

            {plan?.end_date && (
              <span className="text-[10px] text-slate-500 mt-1">
                Ends: {formatDate(plan.end_date, "long")}
              </span>
            )}

            {plan?.grace_period_end && (
              <span className="text-[10px] text-orange-500">
                Grace: {formatDate(plan.grace_period_end, "long")}
              </span>
            )}
          </div>
        );
      },
    },

    /* ===============================
     PRICING
  =============================== */
    {
      key: "pricing",
      label: "Pricing",

      render: (row) => {
        const plan = row.subscription_plan;

        return (
          <div className="flex flex-col">
            {plan?.base_price ? (
              <>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-extrabold text-slate-800 tabular-nums">
                    {formatNumber(plan.base_price, true)}
                  </span>

                  {plan?.gst_percentage && (
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold text-blue-600">
                      +{plan.gst_percentage}%
                    </span>
                  )}
                </div>

                <p className="text-[11px] font-semibold text-emerald-600 tabular-nums mt-0.5">
                  {formatNumber(plan.price, true)} total
                </p>
              </>
            ) : (
              <span className="text-[10px] italic text-slate-300">
                No pricing
              </span>
            )}
          </div>
        );
      },
    },

    /* ===============================
     OPERATIONS
  =============================== */
    {
      key: "operations",
      label: "Operations",

      render: (row) => (
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <UtensilsCrossed size={13} className="text-slate-400" />

            <span className="text-[11px] font-bold text-slate-700">
              {formatText(row.outlet_type)}
            </span>
          </div>

          <div className="flex items-center gap-3 text-[10px] text-slate-500">
            <span>{row.floor_count ?? 0} floors</span>
            <span>{row.table_count ?? 0} tables</span>
          </div>
        </div>
      ),
    },

    /* ===============================
     TIMING
  =============================== */
    {
      key: "timing",
      label: "Timing",

      render: (row) => {
        if (row.is_24_hours) {
          return (
            <span className="px-2 py-1 text-[10px] font-bold rounded-full bg-emerald-100 text-emerald-700">
              24 Hours
            </span>
          );
        }

        return (
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-600">
            <Clock size={13} className="text-slate-400" />
            {row.opening_time?.slice(0, 5)} - {row.closing_time?.slice(0, 5)}
          </div>
        );
      },
    },

    /* ===============================
     STATUS
  =============================== */
    {
      key: "status",
      label: "Status",

      render: (row) => <StatusBadge value={row.is_active} size="sm" />,
    },

    /* ===============================
     CREATED
  =============================== */
    {
      key: "created_at",
      label: "Created",

      render: (row) => (
        <div className="text-[11px] font-semibold text-slate-600">
          {formatDate(row.created_at, "longTime")}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-8 pb-8">
      <PageHeader title="Super Admin Details" showBackButton />

      {/* Hero Section */}
      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
            <div className="relative">
              <UserAvatar
                name={superAdmin.name}
                size="xl"
                className="ring-4 ring-gray-50"
              />
              <span className="absolute bottom-1 right-1 h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-400" />
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                  {superAdmin.name}
                </h1>
                <RoleBadge role={superAdmin.role} size="sm" />
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-gray-500">
                <button
                  onClick={() => copyToClipboard(superAdmin.email, "email")}
                  className="inline-flex items-center gap-1.5 transition-colors hover:text-gray-900"
                >
                  <Mail className="h-4 w-4" />
                  {superAdmin.email}
                  {copiedField === "email" ? (
                    <Check className="h-3.5 w-3.5 text-emerald-500" />
                  ) : (
                    <Copy className="h-3 w-3 opacity-40" />
                  )}
                </button>
                {superAdmin.phone && (
                  <button
                    onClick={() => copyToClipboard(superAdmin.phone, "phone")}
                    className="inline-flex items-center gap-1.5 transition-colors hover:text-gray-900"
                  >
                    <Phone className="h-4 w-4" />
                    {superAdmin.phone}

                    {copiedField === "phone" ? (
                      <Check className="h-3.5 w-3.5 text-emerald-500" />
                    ) : (
                      <Copy className="h-3 w-3 opacity-40" />
                    )}
                  </button>
                )}

                <span className="inline-flex items-center gap-1.5">
                  <Hash className="h-4 w-4" />
                  {superAdmin.employeeCode}
                </span>
              </div>

              <div className="mt-3 flex items-center gap-2 text-xs text-gray-400">
                <Clock className="h-3.5 w-3.5" />
                Last active {formatDate(superAdmin.lastLoginAt, "longTime")}
              </div>
            </div>
          </div>

          {/* Subscription Value Banner */}
          <div className="flex items-center justify-between rounded-xl bg-gradient-to-r from-gray-50 to-gray-100/50 px-5 py-3 ring-1 ring-gray-200/50">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wider text-gray-400">
                Total Subscription Value
              </p>
              <p className="text-lg font-bold tracking-tight text-gray-900">
                {formatNumber(summary?.totalSubscriptionValue, true)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <SmartTable
        title="Outlets"
        totalcount={outlets?.length}
        data={outlets}
        columns={columns}
        // actions={rowActions}
        loading={isFetchingSuperAdminDetails}
      />

    </div>
  );
};

export default SuperAdminDetailsPage;
