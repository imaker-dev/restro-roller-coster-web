import React, { useEffect, useState } from "react";
import PageHeader from "../../../layout/PageHeader";
import { useDispatch, useSelector } from "react-redux";
import {
  createTaxGroup,
  fetchAllTaxGroups,
  updateTaxGroup,
} from "../../../redux/slices/taxSlice";
import SmartTable from "../../../components/SmartTable";
import { Edit3, Eye, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import TaxGroupModal from "../../../partial/tax/TaxGroupModal";
import StatusBadge from "../../../layout/StatusBadge";
import { handleResponse } from "../../../utils/helpers";
import { ROUTE_PATHS } from "../../../config/paths";

const AllTaxGroupsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showTaxGroupModal, setShowTaxGroupModal] = useState(false);
  const [selectedTaxGroup, setSelectedTaxGroup] = useState(null);

  const { outletId } = useSelector((state) => state.auth);
  const { allTaxGroup, loading, isCreatingTaxGroup, isUpdatingTaxGroup } =
    useSelector((state) => state.tax);

  const fetchTaxGroups = () => {
    dispatch(fetchAllTaxGroups(outletId));
  };

  useEffect(() => {
    fetchTaxGroups();
  }, [outletId]);

  const clearTaxStates = () => {
    setShowTaxGroupModal(false);
    setSelectedTaxGroup(null);
  };

  const columns = [
    {
      key: "name",
      label: "Tax",
      render: (row) => {
        const isDefault = Number(row?.is_default) === 1;
        const isOutletSpecific = Boolean(row?.outlet_id);

        return (
          <div className="flex flex-col">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-slate-800">{row?.name}</span>

              {isDefault && (
                <span className="px-2 py-0.5 text-[10px] font-semibold rounded-full bg-indigo-100 text-indigo-700">
                  Default
                </span>
              )}

              <span
                className={`px-2 py-0.5 text-[10px] font-medium rounded-full ${
                  isOutletSpecific
                    ? "bg-blue-100 text-blue-700"
                    : "bg-slate-100 text-slate-600"
                }`}
              >
                {isOutletSpecific ? "Outlet" : "Global"}
              </span>
            </div>

            <span className="text-xs text-slate-500 mt-1 line-clamp-1">
              {row?.description || "—"}
            </span>
          </div>
        );
      },
    },

    {
      key: "code",
      label: "Code",
      render: (row) => (
        <span className="text-xs font-mono uppercase tracking-wide text-slate-600">
          {row?.code}
        </span>
      ),
    },

    {
      key: "total_rate",
      label: "Rate",
      sortValue: (row) => Number(row?.total_rate),
      render: (row) => {
        const inclusive = Number(row?.is_inclusive) === 1;

        return (
          <div className="flex flex-col">
            <span className="font-semibold text-slate-800">
              {Number(row?.total_rate || 0).toFixed(2)}%
            </span>

            <span
              className={`text-xs mt-1 px-2 py-0.5 rounded-full w-fit ${
                inclusive
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-amber-100 text-amber-700"
              }`}
            >
              {inclusive ? "Inclusive" : "Exclusive"}
            </span>
          </div>
        );
      },
    },

    {
      key: "components",
      label: "Components",
      render: (row) => {
        const components = row?.components || [];

        return (
          <div className="flex flex-wrap gap-1 max-w-xs">
            {components.slice(0, 2).map((comp) => (
              <span
                key={comp?.id}
                className="px-2 py-1 bg-slate-100 text-slate-700 text-xs rounded-md border border-slate-200"
              >
                {comp?.name}
                <span className="text-slate-500">
                  {" "}
                  ({Number(comp?.rate || 0).toFixed(2)}%)
                </span>
              </span>
            ))}

            {components.length > 2 && (
              <span className="px-2 py-1 bg-slate-200 text-slate-600 text-xs rounded-md">
                +{components.length - 2} more
              </span>
            )}

            {components.length === 0 && (
              <span className="text-xs text-slate-400 italic">
                No components
              </span>
            )}
          </div>
        );
      },
    },

    {
      key: "is_active",
      label: "Status",
      sortValue: (row) => Number(row?.is_active),
      render: (row) => (
        <StatusBadge
          value={Number(row?.is_active)}
          trueText="Active"
          falseText="Inactive"
        />
      ),
    },
  ];

  const rowActions = [
    {
      label: "View",
      icon: Eye,
      color: "slate",
      onClick: (row) =>
        navigate(`${ROUTE_PATHS.TAX_GROUPS_DETAILS}?groupId=${row?.id}`),
    },
    {
      label: "Update",
      icon: Edit3,
      color: "blue",
      onClick: (row) => {
        (setSelectedTaxGroup(row), setShowTaxGroupModal(true));
      },
    },
  ];

  const actions = [
    {
      label: "Add New Group",
      type: "primary",
      icon: Plus,
      onClick: () => setShowTaxGroupModal(true),
    },
  ];

  const handleAddTaxGroup = async ({ id, values, resetForm }) => {
    const action = id ? updateTaxGroup({ id, values }) : createTaxGroup(values);
    await handleResponse(dispatch(action), () => {
      fetchTaxGroups();
      clearTaxStates();
      resetForm();
    });
  };

  return (
    <>
      <div className="space-y-6">
        <PageHeader title={"All Tax Groups"} actions={actions} showBackButton />

        <SmartTable
          title="All Tax groups"
          totalcount={allTaxGroup?.length ?? 0}
          data={allTaxGroup}
          columns={columns}
          actions={rowActions}
          loading={loading}
        />
      </div>
      <TaxGroupModal
        isOpen={showTaxGroupModal}
        onClose={clearTaxStates}
        taxGroup={selectedTaxGroup}
        outletId={outletId}
        onSubmit={handleAddTaxGroup}
        loading={isCreatingTaxGroup || isUpdatingTaxGroup}
      />
    </>
  );
};

export default AllTaxGroupsPage;
