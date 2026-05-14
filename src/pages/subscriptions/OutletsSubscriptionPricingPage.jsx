import React, { useEffect, useState } from "react";
import PageHeader from "../../layout/PageHeader";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchOutletSubscriptionPricing,
  removeOutletSubscriptionPricing,
  updateOutletSubscriptionPricing,
} from "../../redux/slices/subscriptionSlice";
import { formatDate } from "../../utils/dateFormatter";
import { formatNumber } from "../../utils/numberFormatter";
import { formatText } from "../../utils/utils";
import SmartTable from "../../components/SmartTable";
import StatusBadge from "../../layout/StatusBadge";
import SubscriptionBadge from "../../partial/subscription/SubscriptionBadge";
import SearchBar from "../../components/SearchBar";
import Pagination from "../../components/Pagination";
import { CircleMinus, Edit2, Trash2 } from "lucide-react";
import OutletPricingModal from "../../partial/subscription/OutletSubscriptionPricingModal";
import { handleResponse } from "../../utils/helpers";
import ModalAction from "../../components/ModalAction";

const OutletsSubscriptionPricingPage = () => {
  const dispatch = useDispatch();

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOutlet, setSelectedOutlet] = useState(null);
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false);

  const {
    outletSubscriptionPricing,
    isFetchingOutletSubscriptionPricing,
    isUpdatingOutletSubscriptionPricing,
    isRemovingOutletSubscriptionPricing,
  } = useSelector((state) => state.subscription);

  const { outlets, pagination } = outletSubscriptionPricing || {};

  const fetchPricing = () => {
    dispatch(
      fetchOutletSubscriptionPricing({
        page: currentPage,
        limit: itemsPerPage,
        search,
      }),
    );
  };

  useEffect(() => {
    fetchPricing();
  }, [currentPage, itemsPerPage, search]);

  const columns = [
    {
      key: "outlet",
      label: "Outlet",
      render: (row) => (
        <div className="flex flex-col min-w-[220px]">
          <span className="text-[13px] font-bold text-slate-800">
            {row.name}
          </span>

          <span className="text-[11px] text-slate-400 mt-1">
            {row.address?.city}, {row.address?.state}
          </span>
        </div>
      ),
    },

    {
      key: "subscription",
      label: "Subscription",
      render: (row) => {
        return (
          <div className="flex flex-col">
            <SubscriptionBadge status={row.subscription?.status} size="sm" />

            <span className="text-[10px] text-slate-400 mt-1">
              {row.subscription?.pricingSource
                ? `Source: ${formatText(row.subscription.pricingSource)}`
                : "No pricing"}
            </span>
          </div>
        );
      },
    },

    {
      key: "planValidity",
      label: "Validity",
      render: (row) => (
        <div className="flex flex-col">
          <span className="text-[12px] font-semibold text-slate-700">
            {row.subscription?.startDate
              ? formatDate(row.subscription.startDate, "long")
              : "-"}
          </span>

          <span className="text-[10px] text-slate-400 mt-0.5">
            Exp:
            {row.subscription?.endDate
              ? ` ${formatDate(row.subscription.endDate, "long")}`
              : " Lifetime"}
          </span>
        </div>
      ),
    },

    {
      key: "pricing",
      label: "Pricing",
      render: (row) => (
        <div className="flex flex-col">
          <span className="text-[14px] font-black text-slate-800 tabular-nums">
            {row.pricing?.totalPrice
              ? formatNumber(row.pricing.totalPrice, true)
              : "-"}
          </span>

          <span className="text-[10px] text-slate-400 mt-0.5">
            Base:{" "}
            {row.pricing?.basePrice
              ? formatNumber(row.pricing.basePrice, true)
              : "-"}
          </span>

          {row.pricing?.gstPercentage != null && (
            <span className="text-[10px] text-slate-400">
              GST: {row.pricing.gstPercentage}%
            </span>
          )}
        </div>
      ),
    },

    {
      key: "contact",
      label: "Contact",
      render: (row) => (
        <div className="flex flex-col">
          <span className="text-[12px] font-semibold text-slate-700">
            {row.contact?.phone || "-"}
          </span>

          <span className="text-[10px] text-slate-400 mt-0.5 break-all">
            {row.contact?.email || "No Email"}
          </span>
        </div>
      ),
    },

    {
      key: "createdBy",
      label: "Created By",
      render: (row) => (
        <div className="flex flex-col">
          <span className="text-[12px] font-semibold text-slate-700">
            {row.createdBy?.name || "-"}
          </span>

          <span className="text-[10px] text-slate-400 mt-0.5">
            {formatDate(row.createdAt, "long")}
          </span>
        </div>
      ),
    },
  ];

  const rowActions = [
    {
      label: "Update",
      icon: Edit2,
      color: "blue",
      onClick: (row) => {
        setSelectedOutlet(row);
        setIsModalOpen(true);
      },
    },
    {
      label: "Remove Pricing",
      icon: CircleMinus,
      color: "red",
      hidden: (row) => row.subscription?.pricingSource !== "outlet",
      onClick: (row) => {
        setSelectedOutlet(row);
        setShowRemoveConfirm(true);
      },
    },
  ];

  const resetPricingUi = () => {
    setIsModalOpen(false);
    setSelectedOutlet(null);
    setShowRemoveConfirm(false);
  };

  const handleUpdatePricing = async ({ outletId, values, resetForm }) => {
    await handleResponse(
      dispatch(updateOutletSubscriptionPricing({ outletId, values })),
      () => {
        fetchPricing();
        resetForm();
        resetPricingUi();
      },
    );
  };

  const handleRemoveOutletSubscriptionPricing = async ({ outletId }) => {
    await handleResponse(
      dispatch(removeOutletSubscriptionPricing({ outletId })),
      () => {
        fetchPricing();
        resetPricingUi();
      },
    );
  };

  return (
    <>
      <div className="space-y-6">
        <PageHeader
          title={"Outlet Pricing"}
          onRefresh={fetchPricing}
          isRefreshing={isFetchingOutletSubscriptionPricing}
          showBackButton
        />

        <SearchBar onSearch={(v) => setSearch(v)} debounceTime={500} />
        <SmartTable
          title="Outlet Pricing"
          totalcount={pagination?.total}
          data={outlets}
          columns={columns}
          actions={rowActions}
          loading={isFetchingOutletSubscriptionPricing}
        />
        <Pagination
          totalItems={pagination?.total}
          currentPage={currentPage}
          pageSize={itemsPerPage}
          totalPages={pagination?.totalPages}
          onPageChange={(page) => setCurrentPage(page)}
          maxPageNumbers={5}
          showPageSizeSelector={true}
          onPageSizeChange={(size) => {
            setCurrentPage(1);
            setItemsPerPage(size);
          }}
        />
      </div>

      {/* Pricing Update Modal */}
      <OutletPricingModal
        isOpen={isModalOpen}
        onClose={resetPricingUi}
        outlet={selectedOutlet}
        onSubmit={handleUpdatePricing}
        loading={isUpdatingOutletSubscriptionPricing}
      />

      {/* Remove Pricing Confirmation Modal */}
      <ModalAction
        id="remove-outlet-pricing-confirm"
        cfg="destructive"
        sz="sm"
        title="Remove Custom Pricing"
        description={`Are you sure you want to remove the custom pricing for "${selectedOutlet?.name}"? Default subscription pricing will be applied to this outlet.`}
        confirmText="Remove Pricing"
        cancelText="Cancel"
        loading={isRemovingOutletSubscriptionPricing}
        isOpen={showRemoveConfirm}
        onClose={resetPricingUi}
        onConfirm={() => {
          handleRemoveOutletSubscriptionPricing({
            outletId: selectedOutlet?.id,
          });
        }}
      />
    </>
  );
};

export default OutletsSubscriptionPricingPage;
