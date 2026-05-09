import React, { useEffect, useState } from "react";
import PageHeader from "../../../layout/PageHeader";
import SmartTable from "../../../components/SmartTable";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllTaxComponents,
  createTaxComponent,
  updateTaxComponent,
} from "../../../redux/slices/taxSlice";
import { formatDate } from "../../../utils/dateFormatter";
import { RotateCcw, Plus, Edit2 } from "lucide-react";
import { handleResponse } from "../../../utils/helpers";
import AddTaxComponentModal from "../../../partial/tax/AddTaxComponentModal";
import StatusBadge from "../../../layout/StatusBadge";

const AllTaxComponentsPage = () => {
  const dispatch = useDispatch();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState(null);
  const {
    taxComponents,
    isFetchingTaxComponents,
    isCreatingTaxComponent,
    isUpdatingTaxComponent,
  } = useSelector((state) => state.tax);

  const fetchComponents = () => {
    dispatch(fetchAllTaxComponents());
  };

  useEffect(() => {
    fetchComponents();
  }, []);

  const handleAddComponent = async ({ id, values, resetForm }) => {
    const action = id
      ? updateTaxComponent({ id, values })
      : createTaxComponent({ values });

    await handleResponse(dispatch(action), () => {
      setIsAddModalOpen(false);
      resetForm();
      fetchComponents();
    });
  };

  const actions = [
    {
      label: "Add Component",
      type: "primary",
      icon: Plus,
      onClick: () => setIsAddModalOpen(true),
    },
    {
      label: "Refresh",
      type: "refresh",
      icon: RotateCcw,
      onClick: fetchComponents,
      loading: isFetchingTaxComponents,
      loadingText: "Refreshing...",
    },
  ];

  const columns = [
    {
      key: "name",
      label: "Component",
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
        <span className="inline-flex items-center px-2 py-1 rounded-md bg-slate-100 text-xs font-semibold text-slate-700">
          {row.code}
        </span>
      ),
    },
    {
      key: "tax_type",
      label: "Tax Type",
      sortValue: (row) => row.tax_type_name,
      render: (row) => (
        <div className="flex flex-col">
          <span className="font-medium text-slate-700">
            {row.tax_type_name}
          </span>
          <span className="text-xs text-slate-400">{row.tax_type_code}</span>
        </div>
      ),
    },
    {
      key: "rate",
      label: "Rate",
      render: (row) => (
        <span className="inline-flex items-center px-2 py-1 rounded-md bg-blue-50 text-sm font-bold text-blue-700">
          {row.rate}%
        </span>
      ),
    },
    {
      key: "is_active",
      label: "Status",
      render: (row) => <StatusBadge value={row.is_active} />,
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

  const rowActions = [
    {
      label: "Update",
      icon: Edit2,
      color: "blue",
      onClick: (row) => {
        setSelectedComponent(row);
        setIsAddModalOpen(true);
      },
    },
  ];

  return (
    <>
      <div className="space-y-6">
        <PageHeader
          title={"All Tax Components"}
          actions={actions}
          showBackButton
        />

        <SmartTable
          title="Tax Components"
          totalcount={taxComponents?.length}
          data={taxComponents}
          columns={columns}
          actions={rowActions}
          loading={isFetchingTaxComponents}
          emptyMessage="No Tax Components Found"
          emptyDescription="No tax components are currently available to display."
        />
      </div>

      <AddTaxComponentModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        initialData={selectedComponent}
        onSubmit={handleAddComponent}
        loading={isCreatingTaxComponent || isUpdatingTaxComponent}
      />
    </>
  );
};

export default AllTaxComponentsPage;
