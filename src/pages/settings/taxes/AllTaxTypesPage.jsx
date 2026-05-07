import React, { useEffect, useState } from "react";
import PageHeader from "../../../layout/PageHeader";
import SmartTable from "../../../components/SmartTable";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllTaxTypes,
  createTaxType,
} from "../../../redux/slices/taxSlice";
import { formatDate } from "../../../utils/dateFormatter";
import { RotateCcw, Plus } from "lucide-react";
import { handleResponse } from "../../../utils/helpers";
import AddTaxTypeModal from "../../../partial/tax/AddTaxTypeModal";

const AllTaxTypesPage = () => {
  const dispatch = useDispatch();
  const { isFetchingTaxTypes, allTaxTypes, isCreatingTaxType } = useSelector(
    (state) => state.tax,
  );
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const fetchTypes = () => {
    dispatch(fetchAllTaxTypes());
  };

  useEffect(() => {
    fetchTypes();
  }, []);

  const handleAddTaxType = async ({ values, resetForm }) => {
    await handleResponse(dispatch(createTaxType({ values })), () => {
      setIsAddModalOpen(false);
      resetForm();
      fetchTypes();
    });
  };

  const actions = [
    {
      label: "Add Tax Type",
      type: "primary",
      icon: Plus,
      onClick: () => setIsAddModalOpen(true),
    },
    {
      label: "Refresh",
      type: "refresh",
      icon: RotateCcw,
      onClick: fetchTypes,
      loading: isFetchingTaxTypes,
      loadingText: "Refreshing...",
    },
  ];

  const columns = [
    {
      key: "name",
      label: "Tax Name",
      render: (row) => (
        <div className="flex flex-col">
          <span className="font-semibold text-slate-800">{row.name}</span>
          <span className="text-xs text-slate-500">
            {row.description || "—"}
          </span>
        </div>
      ),
    },
    {
      key: "code",
      label: "Code",
      render: (row) => (
        <span className="inline-flex items-center px-2 py-1 rounded-md bg-slate-100 text-xs font-semibold text-slate-700 uppercase">
          {row.code}
        </span>
      ),
    },
    {
      key: "is_active",
      label: "Status",
      render: (row) => (
        <span
          className={`inline-flex items-center rounded-md px-2 py-1 text-[11px] font-semibold capitalize
            ${
              row.is_active
                ? "bg-emerald-50 text-emerald-700"
                : "bg-red-50 text-red-700"
            }`}
        >
          {row.is_active ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      key: "created_at",
      label: "Created",
      render: (row) => (
        <span className="text-sm text-slate-600">
          {formatDate(row.created_at, "longTime")}
        </span>
      ),
    },
  ];

  return (
    <>
      <div className="space-y-6">
        <PageHeader title={"All Tax Types"} actions={actions} showBackButton />

        <SmartTable
          title="Tax Types"
          totalcount={allTaxTypes?.length}
          data={allTaxTypes}
          columns={columns}
          loading={isFetchingTaxTypes}
        />
      </div>

      <AddTaxTypeModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddTaxType}
        loading={isCreatingTaxType}
      />
    </>
  );
};

export default AllTaxTypesPage;
