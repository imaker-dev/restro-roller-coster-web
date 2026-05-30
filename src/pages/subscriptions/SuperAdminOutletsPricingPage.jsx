import React, { useEffect } from "react";
import PageHeader from "../../layout/PageHeader";
import SmartTable from "../../components/SmartTable";
import { useQueryParams } from "../../hooks/useQueryParams";
import { useDispatch, useSelector } from "react-redux";
import { fetchSuperAdminOutletsPricing } from "../../redux/slices/subscriptionSlice";
import { formatDate } from "../../utils/dateFormatter";
import { formatNumber } from "../../utils/numberFormatter";
import {
  Store,
  Calendar,
  Banknote,
  User,
  Phone,
  Mail,
  ChevronRight,
  CreditCard,
} from "lucide-react";
import SubscriptionBadge from "../../partial/subscription/SubscriptionBadge";
import UserAvatar from "../../components/UserAvatar";

const SuperAdminOutletsPricingPage = () => {
  const dispatch = useDispatch();
  const { userId } = useQueryParams();

  const { isFetchingSuperAdminOutletsPricing, superAdminOutletsPricing } =
    useSelector((state) => state.subscription);

  useEffect(() => {
    dispatch(fetchSuperAdminOutletsPricing({ userId }));
  }, [userId]);

  const { superAdmin, pricing, outlets } = superAdminOutletsPricing || {};

  const columns = [
    {
      key: "outlet",
      label: "Outlet",
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center">
            <Store size={15} className="text-slate-500" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900">
              {row.outlet_name}
            </p>
            <p className="text-xs text-slate-500">{row.outlet_code}</p>
          </div>
        </div>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (row) => <SubscriptionBadge type="status" value={row.status} />,
    },
    {
      key: "period",
      label: "Period",

      render: (row) => (
        <div className="text-sm">
          <p className="text-slate-700">
            {formatDate(row.subscription_start, "long")}
          </p>
          <p className="text-slate-400 text-xs">
            to {formatDate(row.subscription_end, "long")}
          </p>
        </div>
      ),
    },
    {
      key: "payment",
      label: "Payment",

      render: (row) => (
        <div>
          {row.last_paid_amount ? (
            <>
              <p className="text-sm font-semibold text-slate-900">
                {formatNumber(row.last_paid_amount, true)}
              </p>
              <p className="text-xs text-slate-400">
                {formatDate(row.last_paid_at, "long")}
              </p>
            </>
          ) : (
            <span className="text-sm text-slate-400">—</span>
          )}
        </div>
      ),
    },
    {
      key: "contact",
      label: "Contact",

      render: (row) => (
        <div className="text-sm">
          {row.outlet_phone && (
            <p className="text-slate-700">{row.outlet_phone}</p>
          )}
          {row.outlet_email && (
            <p className="text-xs text-slate-500">{row.outlet_email}</p>
          )}
          {!row.outlet_phone && !row.outlet_email && (
            <span className="text-slate-400">—</span>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-8">
      <PageHeader title="Subscription Pricing" showBackButton />

      {/* Top Section */}
      {superAdmin && pricing && (
        <div className="bg-white rounded-2xl border border-slate-100 p-5">
          <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-0">
            {/* Admin Info */}
            <div className="flex items-center gap-3 md:flex-1">
              <UserAvatar name={superAdmin.name} />
              <div className="min-w-0">
                <h2 className="text-sm font-bold text-slate-900 truncate">
                  {superAdmin.name}
                </h2>
                <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-slate-500 mt-0.5">
                  <span className="truncate">{superAdmin.email}</span>
                  <span className="w-1 h-1 rounded-full bg-slate-300 hidden sm:block"></span>
                  <span className="hidden sm:block">{superAdmin.phone}</span>
                </div>
                <span className="text-xs text-slate-500 sm:hidden mt-0.5">
                  {superAdmin.phone}
                </span>
              </div>
            </div>

            {/* Divider - hidden on mobile */}
            <div className="hidden md:block w-px h-10 bg-slate-200 mx-6 shrink-0"></div>

            {/* Pricing */}
            <div className="flex items-center gap-6 sm:gap-8 md:shrink-0">
              <div className="text-center">
                <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider mb-1">
                  Base
                </p>
                <p className="text-sm sm:text-base font-bold text-slate-900 tabular-nums">
                  {formatNumber(pricing.basePrice, true)}
                </p>
              </div>

              <div className="text-center">
                <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider mb-1">
                  GST
                </p>
                <p className="text-sm sm:text-base font-bold text-slate-700 tabular-nums">
                  {pricing.gstPercentage}%
                </p>
              </div>

              <div className="text-center">
                <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider mb-1">
                  Total
                </p>
                <p className="text-sm sm:text-base font-bold text-emerald-600 tabular-nums">
                  {formatNumber(pricing.totalPrice, true)}
                </p>
              </div>
            </div>
          </div>

          {/* Notes */}
          {pricing.notes && (
            <div className="mt-3 pt-3 border-t border-slate-100">
              <p className="text-xs text-slate-500">{pricing.notes}</p>
            </div>
          )}
        </div>
      )}

      {/* Outlets Table */}
      <SmartTable
        title={"Outlets"}
        totalcount={outlets?.length}
        data={outlets}
        columns={columns}
        loading={isFetchingSuperAdminOutletsPricing}
      />
    </div>
  );
};

export default SuperAdminOutletsPricingPage;
