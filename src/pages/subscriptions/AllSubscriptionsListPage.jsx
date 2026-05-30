import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  extendSubscription,
  fetchAllSubscriptions,
  forceActivateSubscription,
  forceDeactivateSubscription,
} from "../../redux/slices/subscriptionSlice";
import PageHeader from "../../layout/PageHeader";
import SmartTable from "../../components/SmartTable";
import { formatDate } from "../../utils/dateFormatter";
import { formatNumber } from "../../utils/numberFormatter";
import { CalendarPlus, Pause, Play } from "lucide-react";
import ActivateSubscriptionModal from "../../partial/subscription/ActivateSubscriptionModal";
import DeactivateSubscriptionModal from "../../partial/subscription/DeactivateSubscriptionModal";
import ExtendSubscriptionModal from "../../partial/subscription/ExtendSubscriptionModal";
import { handleResponse } from "../../utils/helpers";
import Pagination from "../../components/Pagination";
import SearchBar from "../../components/SearchBar";
import SubscriptionBadge from "../../partial/subscription/SubscriptionBadge";

const AllSubscriptionsListPage = () => {
  const dispatch = useDispatch();

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  const [modalState, setModalState] = useState({
    type: null, // 'activate' | 'deactivate' | 'extend'
    row: null,
  });

  const {
    isFetchingSubscriptions,
    allSubscriptions,
    isActivatingSubscription,
    isDeactivatingSubscription,
    isExtendingSubscription,
  } = useSelector((state) => state.subscription);

  const { subscriptions, pagination } = allSubscriptions || {};

  const fetchSubscriptions = () => {
    dispatch(
      fetchAllSubscriptions({
        page: currentPage,
        limit: itemsPerPage,
        search: searchTerm,
      }),
    );
  };
  useEffect(() => {
    fetchSubscriptions();
  }, [currentPage, itemsPerPage, searchTerm]);

  const closeModal = () => {
    setModalState({ type: null, row: null });
  };

  const handleActivate = async ({ id, data, resetForm }) => {
    await handleResponse(
      dispatch(forceActivateSubscription({ outletId: id, values: data })),
      () => {
        fetchSubscriptions();
        resetForm();
        closeModal();
      },
    );
  };

  const handleDeactivate = async ({ id, data, resetForm }) => {
    await handleResponse(
      dispatch(forceDeactivateSubscription({ outletId: id, values: data })),
      () => {
        fetchSubscriptions();
        resetForm();
        closeModal();
      },
    );
  };

  const handleExtend = async ({ id, data, resetForm }) => {
    await handleResponse(
      dispatch(extendSubscription({ outletId: id, values: data })),
      () => {
        fetchSubscriptions();
        resetForm();
        closeModal();
      },
    );
  };

  const columns = [
    /* ---------------- OUTLET ---------------- */
    {
      key: "outlet",
      label: "Outlet",
      render: (row) => (
        <div className="flex flex-col ">
          <p className="text-[13px] font-bold text-slate-800 truncate">
            {row.outlet_name}
          </p>

          {row.outlet_email && (
            <p className="text-[11px] text-slate-500 truncate mt-0.5">
              {row.outlet_email}
            </p>
          )}

          {row.outlet_phone && (
            <p className="text-[11px] text-slate-400 mt-0.5">
              {row.outlet_phone}
            </p>
          )}
        </div>
      ),
    },

    /* ---------------- STATUS ---------------- */
    {
      key: "status",
      label: "Status",
      render: (row) => <SubscriptionBadge type="status" value={row.status} size="sm" />,
    },

    /* ---------------- SUBSCRIPTION PERIOD ---------------- */
    {
      key: "subscription",
      label: "Subscription Period",
      render: (row) => (
        <div className="flex flex-col ">
          <p className="text-[11px] font-semibold text-slate-700">
            {formatDate(row.subscription_start, "long")}
          </p>

          <p className="text-[10px] text-slate-400 my-0.5">to</p>

          <p className="text-[11px] font-bold text-slate-800">
            {formatDate(row.subscription_end, "long")}
          </p>

          {row.grace_period_end && (
            <p className="text-[10px] text-amber-600 font-medium mt-1">
              Grace till {formatDate(row.grace_period_end, "long")}
            </p>
          )}
        </div>
      ),
    },

    /* ---------------- PAYMENT ---------------- */
    {
      key: "payment",
      label: "Last Payment",
      render: (row) => (
        <div className="flex flex-col ">
          {row.last_paid_amount ? (
            <>
              <p className="text-[13px] font-bold text-emerald-600">
                {formatNumber(row.last_paid_amount, true)}
              </p>

              <p className="text-[11px] text-slate-500 mt-0.5">
                {formatDate(row.last_paid_at, "long")}
              </p>

              <p className="text-[10px] text-slate-400 capitalize mt-1">
                {row.last_payment_status}
              </p>
            </>
          ) : (
            <>
              <p className="text-[11px] font-medium text-slate-500">
                No Payment
              </p>

              <p className="text-[10px] text-slate-400 mt-0.5">
                Awaiting payment
              </p>
            </>
          )}
        </div>
      ),
    },

    /* ---------------- PRICING ---------------- */
    {
      key: "pricing",
      label: "Pricing Source",
      render: (row) => (
        <div className="flex flex-col ">
          <p className="text-[11px] font-semibold text-slate-700 capitalize">
            {row.pricing_source}
          </p>

          {row.payment_pricing_source && (
            <p className="text-[10px] text-slate-400 mt-0.5 capitalize">
              Payment via {row.payment_pricing_source}
            </p>
          )}
        </div>
      ),
    },

    /* ---------------- NOTES ---------------- */
    {
      key: "notes",
      label: "Notes",
      render: (row) => (
        <div className="max-w-[200px] ">
          {row.notes ? (
            <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-2">
              {row.notes}
            </p>
          ) : (
            <span className="text-[10px] text-slate-300">No notes</span>
          )}
        </div>
      ),
    },

    /* ---------------- CREATED ---------------- */
    {
      key: "created",
      label: "Created",
      render: (row) => (
        <div className="flex flex-col ">
          <p className="text-[11px] font-semibold text-slate-700">
            {formatDate(row.created_at, "long")}
          </p>

          <p className="text-[10px] text-slate-400 mt-0.5">
            Updated {formatDate(row.updated_at, "time")}
          </p>
        </div>
      ),
    },
  ];

  const rowActions = [
    {
      label: "Activate",
      icon: Play,
      color: "emerald",
      disabled: (row) => row.status === "active",
      disabledTooltip: (row) =>
        row.status === "active" ? "Subscription is already active" : "",
      onClick: (row) => setModalState({ type: "activate", row }),
    },
    {
      label: "Deactivate",
      icon: Pause,
      color: "red",
      disabled: (row) => row.status !== "active",
      disabledTooltip: (row) =>
        row.status !== "active"
          ? `Cannot deactivate ${row.status} subscription`
          : "",
      onClick: (row) => setModalState({ type: "deactivate", row }),
    },
    {
      label: "Extend",
      icon: CalendarPlus,
      color: "indigo",
      disabled: (row) =>
        row.status !== "active" && row.status !== "grace_period",
      disabledTooltip: (row) => {
        if (row.status === "expired")
          return "Cannot extend expired subscription";
        if (row.status === "cancelled")
          return "Cannot extend cancelled subscription";
        if (row.status === "pending")
          return "Cannot extend pending subscription";
        return "";
      },
      onClick: (row) => setModalState({ type: "extend", row }),
    },
  ];

  return (
    <>
      <div className="space-y-6">
        <PageHeader title={"All Subscriptions"} onRefresh={fetchSubscriptions} isRefreshing={isFetchingSubscriptions} showBackButton />

        <SearchBar onSearch={(v) => setSearchTerm(v)} />
        <SmartTable
          title="Subscriptions"
          totalcount={pagination?.total}
          data={subscriptions}
          columns={columns}
          actions={rowActions}
          loading={isFetchingSubscriptions}
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

      {/* Activate Modal */}
      <ActivateSubscriptionModal
        isOpen={modalState.type === "activate"}
        onClose={closeModal}
        onSubmit={handleActivate}
        subscription={modalState.row}
        loading={isActivatingSubscription}
      />

      {/* Deactivate Modal */}
      <DeactivateSubscriptionModal
        isOpen={modalState.type === "deactivate"}
        onClose={closeModal}
        onSubmit={handleDeactivate}
        subscription={modalState.row}
        loading={isDeactivatingSubscription}
      />

      {/* Extend Modal */}
      <ExtendSubscriptionModal
        isOpen={modalState.type === "extend"}
        onClose={closeModal}
        onSubmit={handleExtend}
        subscription={modalState.row}
        loading={isExtendingSubscription}
      />
    </>
  );
};

export default AllSubscriptionsListPage;
