import React, { useEffect, useState } from "react";
import PageHeader from "../../layout/PageHeader";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllRegistrationRequests,
  generateActivationToken,
  updateRegistrationRequest,
} from "../../redux/slices/registrationSlice";
import Pagination from "../../components/Pagination";
import SmartTable from "../../components/SmartTable";
import { formatDate } from "../../utils/dateFormatter";
import { CheckCircle, Edit2, Eye, Verified, XCircle } from "lucide-react";
import { handleResponse } from "../../utils/helpers";
import ModalBasic from "../../components/ModalBasic";
import RegistrationActionModal from "../../partial/registration-request/RegistrationActionModal";
import RegistrationStatusBadge from "../../partial/registration-request/RegistrationStatusBadge";
import ActivateSubscriptionModal from "../../partial/registration-request/ActivateSubscriptionModal";
import PlanBadge from "../../partial/registration-request/PlanBadge";

const AllRegistrationRequestPage = () => {
  const dispatch = useDispatch();
  const {
    isFetchingAllRequests,
    allRegistrationRequests,
    isUpdatingRequest,
    isGeneratingActivationToken,
  } = useSelector((state) => state.registration);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [actionState, setActionState] = useState({
    open: false,
    type: null,
    row: null,
    notes: "",
  });

  const [subscriptionModal, setSubscriptionModal] = useState({
    open: false,
    row: null,
  });

  const { registrations, pagination } = allRegistrationRequests || {};

  const fetchRequests = () => {
    dispatch(
      fetchAllRegistrationRequests({ page: currentPage, limit: itemsPerPage }),
    );
  };

  useEffect(() => {
    fetchRequests();
  }, [currentPage, itemsPerPage]);

  const columns = [
    {
      key: "restaurant",
      label: "Restaurant",
      sortable: true,
      render: (row) => (
        <div className="flex flex-col">
          <span className="font-semibold text-slate-800">
            {row.restaurant_name}
          </span>
          <span className="text-xs text-slate-500">
            {row.city}, {row.state}
          </span>
        </div>
      ),
    },

    {
      key: "contact",
      label: "Contact Person",
      sortable: true,
      render: (row) => (
        <div className="flex flex-col">
          <span className="font-medium text-slate-700">
            {row.contact_person}
          </span>
          <span className="text-xs text-slate-500">{row.email}</span>
          <span className="text-xs text-slate-400">{row.phone}</span>
        </div>
      ),
    },

    {
      key: "plan",
      label: "Plan",
      sortable: true,
      render: (row) => <PlanBadge plan={row.plan_interest} />,
    },

    {
      key: "message",
      label: "Message",
      sortable: false,
      render: (row) => (
        <span className="text-sm text-slate-600">{row.message || "—"}</span>
      ),
    },

    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (row) => <RegistrationStatusBadge status={row.status} />,
    },

    {
      key: "created_at",
      label: "Requested On",
      sortable: true,
      render: (row) => (
        <span className="text-sm text-slate-600">
          {formatDate(row.created_at, "longTime")}
        </span>
      ),
    },
  ];

  const openActionModal = (row, type) => {
    setActionState({
      open: true,
      type,
      row,
      notes: "",
    });
  };

  const rowActions = [
    {
      label: "Approve",
      icon: CheckCircle,
      color: "green",
      disabled: (row) => row.status !== "pending",
      disabledTooltip: (row) =>
        row.status === "approved" ? "Already approved" : "Already rejected",
      onClick: (row) => openActionModal(row, "approved"),
      loading: isUpdatingRequest,
    },
    {
      label: "Reject",
      icon: XCircle,
      color: "red",
      disabled: (row) => row.status !== "pending",
      disabledTooltip: (row) =>
        row.status === "approved" ? "Already approved" : "Already rejected",
      onClick: (row) => openActionModal(row, "rejected"),
      loading: isUpdatingRequest,
    },
    {
      label: "Activate Subscription",
      icon: Verified,
      color: "blue",
      disabled: (row) => row.status !== "approved",
      disabledTooltip: () => "Approve this to activate",
      onClick: (row) => setSubscriptionModal({ open: true, row }),
    },
  ];

  const handleChangeStatus = async () => {
    const { row, type, notes } = actionState;

    if (!row) return;

    await handleResponse(
      dispatch(
        updateRegistrationRequest({
          id: row.id,
          values: {
            status: type,
            admin_notes: notes || null,
          },
        }),
      ),
      () => {
        setActionState({ open: false, type: null, row: null, notes: "" });
        fetchRequests();
      },
    );
  };

  const handleActivateSubscription = async (formData) => {
    const { row } = subscriptionModal;

    if (!row) return;

    const values = {
      restaurant: formData.restaurant,
      email: formData.email,
      phone: formData.phone,
      password: formData.password,
    };

    await handleResponse(dispatch(generateActivationToken(values)), () => {
      fetchRequests();
      setSubscriptionModal({ open: false, row: null });
    });
  };

  return (
    <>
      <div className="space-y-6">
        <PageHeader title={"All Requests"} showBackButton />

        <SmartTable
          title="Items"
          totalcount={pagination?.total}
          data={registrations}
          columns={columns}
          actions={rowActions}
          loading={isFetchingAllRequests}
        />

        <Pagination
          totalItems={pagination?.total}
          currentPage={currentPage}
          pageSize={itemsPerPage}
          totalPages={pagination?.pages}
          onPageChange={(page) => setCurrentPage(page)}
          maxPageNumbers={5}
          showPageSizeSelector={true}
          onPageSizeChange={(size) => {
            setCurrentPage(1);
            setItemsPerPage(size);
          }}
        />
      </div>

      <RegistrationActionModal
        actionState={actionState}
        setActionState={setActionState}
        onConfirm={handleChangeStatus}
        loading={isUpdatingRequest}
      />

      <ActivateSubscriptionModal
        isOpen={subscriptionModal.open}
        onClose={() => setSubscriptionModal({ open: false, row: null })}
        request={subscriptionModal.row}
        onConfirm={handleActivateSubscription}
        loading={isGeneratingActivationToken}
      />
    </>
  );
};

export default AllRegistrationRequestPage;
