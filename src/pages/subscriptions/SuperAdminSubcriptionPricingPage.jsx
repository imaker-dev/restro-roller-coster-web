import React, { useEffect, useState } from "react";
import PageHeader from "../../layout/PageHeader";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllSuperAdminSubscriptionPricing,
  setCustomPricingForSuperAdmin,
} from "../../redux/slices/subscriptionSlice";
import { Building2, Eye, Plus, User } from "lucide-react";
import SuperAdminSpecialDiscountModal from "../../partial/subscription/SuperAdminSpecialDiscountModal";
import { handleResponse } from "../../utils/helpers";
import { formatDate } from "../../utils/dateFormatter";
import { formatNumber } from "../../utils/numberFormatter";
import SmartTable from "../../components/SmartTable";
import UserAvatar from "../../components/UserAvatar";
import { useNavigate } from "react-router-dom";
import { ROUTE_PATHS } from "../../config/paths";

const SuperAdminSubcriptionPricingPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    isFetchingSuperAdminSubscriptionPricing,
    allSuperAdminSubscriptionPricing,
    isSettingSuperAdminCustomPricing,
  } = useSelector((state) => state.subscription);

  const fetchPricing = () => {
    dispatch(fetchAllSuperAdminSubscriptionPricing());
  };

  useEffect(() => {
    fetchPricing();
  }, []);

  const columns = [
    {
      key: "user",
      label: "Super Admin",
      render: (row) => (
        <div className="flex items-center gap-3">
          <UserAvatar name={row.user_name} />
          <div className="flex flex-col min-w-0">
            <p className="text-xs font-extrabold text-slate-800 truncate">
              {row.user_name}
            </p>
            <p className="text-[11px] font-bold text-slate-500 truncate">
              {row.user_email}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "pricing",
      label: "Pricing",
      render: (row) => (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-extrabold text-slate-800 tabular-nums">
              {formatNumber(row.base_price, true)}
            </span>
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold text-blue-600">
              +{row.gst_percentage}%
            </span>
          </div>
          <p className="text-[11px] font-semibold text-emerald-600 tabular-nums mt-0.5">
            {formatNumber(row.total_price, true)} total
          </p>
        </div>
      ),
    },
    {
      key: "outlets",
      label: "Outlets",

      render: (row) => (
        <div className="flex items-center gap-1.5">
          <Building2 size={14} className="text-slate-400" />
          <span className="text-[12px] font-extrabold text-slate-800 tabular-nums">
            {row.outlet_count ?? 0}
          </span>
          <span className="text-[10px] text-slate-400 font-medium">
            outlets
          </span>
        </div>
      ),
    },
    {
      key: "notes",
      label: "Notes",
      render: (row) => (
        <div className="max-w-[200px]">
          {row.notes ? (
            <p className="text-[11px] font-medium text-slate-600 leading-relaxed line-clamp-2">
              {row.notes}
            </p>
          ) : (
            <span className="text-[10px] text-slate-300 italic font-medium">
              No notes
            </span>
          )}
        </div>
      ),
    },
    {
      key: "created_at",
      label: "Applied",
      render: (row) => (
        <div className="text-[11px] font-semibold text-slate-600">
          {formatDate(row.created_at, "longTime")}
        </div>
      ),
    },
  ];

  const rowActions = [
    {
      label: "Eye",
      icon: Eye,
      onClick: (row) =>
        navigate(
          `${ROUTE_PATHS.SUPER_ADMIN_OUTLET_SUBSCRIPTION}?userId=${row.user_id}`,
        ),
    },
  ];

  const actions = [
    {
      label: "Provide Special Discount",
      type: "primary",
      icon: Plus,
      onClick: () => setIsModalOpen(true),
    },
  ];

  const handleSpecialDiscount = async ({ adminId, values, resetForm }) => {
    await handleResponse(
      dispatch(setCustomPricingForSuperAdmin({ adminId, values })),
      () => {
        setIsModalOpen(false);
        resetForm();
        fetchPricing();
      },
    );
  };

  return (
    <>
      <div className="space-y-6">
        <PageHeader
          title={"Super Admin Subscriptions"}
          actions={actions}
          showBackButton
        />

        <SmartTable
          title="Super Admin Dicount"
          totalcount={allSuperAdminSubscriptionPricing?.length}
          data={allSuperAdminSubscriptionPricing}
          columns={columns}
          actions={rowActions}
          loading={isFetchingSuperAdminSubscriptionPricing}
        />
      </div>

      <SuperAdminSpecialDiscountModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSpecialDiscount}
        loading={isSettingSuperAdminCustomPricing}
      />
    </>
  );
};

export default SuperAdminSubcriptionPricingPage;
