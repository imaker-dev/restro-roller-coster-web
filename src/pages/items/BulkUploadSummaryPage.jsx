import React, { useEffect } from "react";
import PageHeader from "../../layout/PageHeader";
import { useDispatch, useSelector } from "react-redux";
import { fetchBulkUploadSummary } from "../../redux/slices/bulkUploadSlice";
import SmartTable from "../../components/SmartTable";
import { formatDate } from "../../utils/dateFormatter";
import { AlertCircle, CheckCircle2Icon } from "lucide-react";
import StatusBadge from "../../layout/StatusBadge";

const BulkUploadSummaryPage = () => {
  const dispatch = useDispatch();
  const { outletId } = useSelector((state) => state.auth);
  const { isFetchingSummmary, uploadSummary } = useSelector(
    (state) => state.bulkUpload,
  );

  useEffect(() => {
    dispatch(fetchBulkUploadSummary({ outletId }));
  }, [outletId]);

  const columns = [
    // Filename
    {
      key: "filename",
      label: "Filename",
      sortable: true,
      render: (row) => (
        <span className="text-sm font-medium text-gray-900">
          {row.filename}
        </span>
      ),
    },

    // Status
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (row) => (
        <StatusBadge
          value={
            row.status === "success"
              ? true
              : row.status === "error"
                ? false
                : null
          }
          trueText="Success"
          falseText="Failed"
        />
      ),
    },

    // Categories
    {
      key: "categories",
      label: "Categories",
      render: (row) => (
        <div className="text-center">
          <span className="inline-flex items-center justify-center rounded-lg bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-700">
            {row.summary?.categories}
          </span>
        </div>
      ),
    },

    // Items
    {
      key: "items",
      label: "Items",
      render: (row) => (
        <div className="text-center">
          <span className="inline-flex items-center justify-center rounded-lg bg-purple-100 px-3 py-1 text-sm font-semibold text-purple-700">
            {row.summary?.items}
          </span>
        </div>
      ),
    },

    // Variants
    {
      key: "variants",
      label: "Variants",
      render: (row) => (
        <div className="text-center">
          <span className="inline-flex items-center justify-center rounded-lg bg-pink-100 px-3 py-1 text-sm font-semibold text-pink-700">
            {row.summary?.variants}
          </span>
        </div>
      ),
    },

    // Addon Groups
    {
      key: "addonGroups",
      label: "Addon Groups",
      render: (row) => (
        <div className="text-center">
          <span className="inline-flex items-center justify-center rounded-lg bg-cyan-100 px-3 py-1 text-sm font-semibold text-cyan-700">
            {row.summary?.addonGroups}
          </span>
        </div>
      ),
    },

    // Addons
    {
      key: "addons",
      label: "Addons",
      render: (row) => (
        <div className="text-center">
          <span className="inline-flex items-center justify-center rounded-lg bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-700">
            {row.summary?.addons}
          </span>
        </div>
      ),
    },

    // Date
    {
      key: "date",
      label: "Date",
      sortable: true,
      render: (row) => (
        <span className="text-sm text-gray-600">
          {formatDate(row.createdAt, "longTime")}
        </span>
      ),
    },
  ];
  return (
    <div className="space-y-6">
      <PageHeader title="Upload History & Summary" showBackButton />

      <SmartTable
        title="Uploads"
        totalcount={uploadSummary?.length}
        data={uploadSummary}
        columns={columns}
        loading={isFetchingSummmary}
        showSr
      />
    </div>
  );
};

export default BulkUploadSummaryPage;
