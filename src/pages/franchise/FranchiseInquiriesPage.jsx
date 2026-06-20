import React, { useEffect, useState } from "react";
import PageHeader from "../../layout/PageHeader";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchFranchiseInquiries,
  updateFranchiseInquiry,
} from "../../redux/slices/franchiseListingSlice";
import { useQueryParams } from "../../hooks/useQueryParams";
import { Edit2 } from "lucide-react";
import SmartTable from "../../components/SmartTable";
import StatusBadge from "../../layout/StatusBadge";
import { formatDate } from "../../utils/dateFormatter";
import UpdateFranchiseModal from "../../partial/franchise/UpdateFranchiseModal";
import { handleResponse } from "../../utils/helpers";
import { formatText } from "../../utils/utils";

const STATUS_STYLES = {
  contacted: "bg-amber-50 text-amber-700 border-amber-200",
  converted: "bg-emerald-50 text-emerald-700 border-emerald-200",
  ignored: "bg-slate-50 text-slate-700 border-slate-200",
};

const FranchiseInquiriesPage = () => {
  const { franchiseId } = useQueryParams();
  const dispatch = useDispatch();
  const {
    isFetchingFranchiseInquiries,
    allFranchiseInquiriesData,
    isUpdatingFranchiseInquiry,
  } = useSelector((state) => state.franchise);

  const { enquiries, pagination } = allFranchiseInquiriesData || {};

  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);

  const fetchInquiry = () => {
    dispatch(fetchFranchiseInquiries(franchiseId));
  };

  useEffect(() => {
    fetchInquiry();
  }, [franchiseId]);

  const inquiriesColumns = [
    {
      key: "lead",
      label: "Lead",
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="min-w-0">
            <p className="truncate font-semibold text-slate-800">
              {row.full_name}
            </p>
            <div className="mt-0.5 flex flex-col">
              <span className="truncate text-xs text-slate-500">
                {row.email}
              </span>
              <span className="text-xs text-slate-500">{row.phone}</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "franchise",
      label: "Interested Franchise",
      render: (row) => (
        <div>
          <p className="font-medium text-slate-800">{row.franchise_name}</p>
          <p className="mt-0.5 text-xs text-slate-400">{row.franchise_slug}</p>
        </div>
      ),
    },
    {
      key: "location",
      label: "Location",
      render: (row) => (
        <div className="flex flex-col">
          <span className="font-medium text-slate-700">{row.city}</span>
          <span className="text-xs text-slate-500">{row.state}</span>
        </div>
      ),
    },
    {
      key: "investment_budget",
      label: "Budget",
      render: (row) => (
        <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
          {row.investment_budget || "-"}
        </span>
      ),
    },
    {
      key: "business_experience",
      label: "Experience",
      render: (row) => (
        <span className="text-sm font-medium text-slate-700">
          {formatText(row.business_experience) || "-"}
        </span>
      ),
    },
    {
      key: "message",
      label: "Message",
      render: (row) => (
        <div className="max-w-[280px]">
          <p
            className="line-clamp-2 text-sm text-slate-600"
            title={row.message}
          >
            {row.message || "No message provided"}
          </p>
        </div>
      ),
    },
    {
      key: "created_at",
      label: "Received",
      render: (row) => (
        <div className="flex flex-col">
          <span className="text-sm font-medium text-slate-700">
            {formatDate(row.created_at, "long")}
          </span>
          <span className="text-xs text-slate-400">
            {formatDate(row.created_at, "time")}
          </span>
        </div>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (row) => (
        <span
          className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium capitalize ${
            STATUS_STYLES[row.status] ||
            "bg-slate-50 text-slate-700 border-slate-200"
          }`}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-current" />
          {row.status || "contacted"}
        </span>
      ),
    },
  ];

  const rowActions = [
    {
      label: "Update Status",
      icon: Edit2,
      color: "blue",
      onClick: (row) => {
        setSelectedInquiry(row);
        setIsStatusModalOpen(true);
      },
    },
  ];

  const handleChangeStatus = async (payload) => {
    await handleResponse(
      dispatch(
        updateFranchiseInquiry({
          id: selectedInquiry.id,
          values: payload,
        }),
      ),
      () => {
        setIsStatusModalOpen(false);
        setSelectedInquiry(null);
        fetchInquiry();
      },
    );
  };

  return (
    <>
      <div className="space-y-6">
        <PageHeader title="Franchise Inquiries" showBackButton />

        <SmartTable
          title="Inquiries"
          totalcount={pagination?.total}
          data={enquiries}
          columns={inquiriesColumns}
          actions={rowActions}
          loading={isFetchingFranchiseInquiries}
          emptyMessage="No Inquiries Found"
          emptyDescription="No franchise inquiries are available for this outlet or match the selected filters."
        />
      </div>

      <UpdateFranchiseModal
        isOpen={isStatusModalOpen}
        inquiry={selectedInquiry}
        onClose={() => {
          setIsStatusModalOpen(false);
          setSelectedInquiry(null);
        }}
        onSubmit={handleChangeStatus}
        loading={isUpdatingFranchiseInquiry}
      />
    </>
  );
};

export default FranchiseInquiriesPage;
