import React, { useEffect, useState } from "react";
import PageHeader from "../../layout/PageHeader";
import { useDispatch, useSelector } from "react-redux";
import {
  createAddonGroup,
  fetchAllAddonGroups,
  updateAddonGroup,
} from "../../redux/slices/addonSlice";
import { useQueryParams } from "../../hooks/useQueryParams";
import SmartTable from "../../components/SmartTable";
import { Edit2, Eye, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { formatDate } from "../../utils/dateFormatter";
import AddonGroupModal from "../../partial/addons/AddonGroupModal";
import { handleResponse } from "../../utils/helpers";
import StatusBadge from "../../layout/StatusBadge";
import { ROUTE_PATHS } from "../../config/paths";

const AllAddonsGroup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { outletId } = useSelector((state) => state.auth);
  const fetchGroups = () => {
    dispatch(fetchAllAddonGroups(outletId));
  };

  const [showAddonGroup, setShowAddonGroup] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);

  useEffect(() => {
    fetchGroups();
  }, [outletId]);

  const {
    allAddonGroups,
    loading,
    isCreatingAddonGroup,
    isUpdatingAddonGroup,
  } = useSelector((state) => state.addon);

  const columns = [
    {
      key: "name",
      label: "Addon Group",
      render: (row) => (
        <div className="max-w-[280px]">
          <div className="flex items-center gap-2">
            <p className="font-semibold text-slate-800 truncate">{row.name}</p>

            {!row.is_active && (
              <span className="text-[10px] bg-slate-200 text-slate-600 px-2 py-0.5 rounded">
                Inactive
              </span>
            )}
          </div>

          {row.description && (
            <p
              title={row.description}
              className="text-xs text-slate-500 line-clamp-2 mt-1"
            >
              {row.description}
            </p>
          )}
        </div>
      ),
    },

    {
      key: "selection_type",
      label: "Selection Rules",
      render: (row) => {
        const isSingle = row.selection_type === "single";

        return (
          <div className="space-y-1">
            <span
              className={`px-2.5 py-1 text-xs rounded-md font-medium inline-block
              ${
                isSingle
                  ? "bg-indigo-50 text-indigo-700"
                  : "bg-emerald-50 text-emerald-700"
              }`}
            >
              {isSingle ? "Single Choice" : "Multiple Choice"}
            </span>

            {!isSingle && (
              <div className="text-xs text-slate-500">
                Min {row.min_selection} · Max {row.max_selection}
              </div>
            )}
          </div>
        );
      },
    },

    {
      key: "is_required",
      label: "Requirement",
      render: (row) => (
        <span
          className={`px-2.5 py-1 text-xs rounded-md font-medium
          ${
            row.is_required
              ? "bg-rose-50 text-rose-700"
              : "bg-slate-100 text-slate-600"
          }`}
        >
          {row.is_required ? "Mandatory" : "Optional"}
        </span>
      ),
    },

    {
      key: "addon_count",
      label: "Addons",
      render: (row) => (
        <div className="flex items-center gap-2">
          <span className="text-slate-800 font-semibold">
            {row.addon_count ?? 0}
          </span>

          <span className="text-xs text-slate-400">items</span>
        </div>
      ),
    },

    {
      key: "updated_at",
      label: "Last Updated",
      render: (row) => (
        <div className="text-sm text-slate-700">
          {formatDate(row.updated_at, "longTime")}
        </div>
      ),
    },

    {
      key: "status",
      label: "Status",
      render: (row) => (
        <div>
          <StatusBadge value={row.is_active} />
        </div>
      ),
    },
  ];

  const rowActions = [
    {
      label: "View",
      icon: Eye,
      color: "slate",
      onClick: (row) =>
        navigate(`${ROUTE_PATHS.ALL_ADDONS_ITEMS}?addonId=${row?.id}`),
    },
    {
      label: "Update",
      icon: Edit2,
      color: "blue",
      onClick: (row) => {
        (setSelectedGroup(row), setShowAddonGroup(true));
      },
    },
  ];

  const actions = [
    {
      label: "Add Addon Group",
      type: "primary",
      icon: Plus,
      onClick: () => setShowAddonGroup(true),
    },
  ];

  const resetAddonGroupStates = () => {
    setSelectedGroup(null);
    setShowAddonGroup(false);
  };

  const handleAddAddonGroup = async ({ id, values, resetForm }) => {
    const action = id
      ? updateAddonGroup({ id, values })
      : createAddonGroup(values);
    await handleResponse(dispatch(action), () => {
      resetAddonGroupStates();
      fetchGroups();
      resetForm();
    });
  };

  return (
    <>
      <div className="space-y-6">
        <PageHeader
          title="Addon Groups"
          description="Create, update, and manage groups of selectable add-ons for menu items."
          actions={actions}
        />

        {/* Table */}
        <div>
          <SmartTable
            title="Addons Group"
            totalcount={allAddonGroups?.length}
            data={allAddonGroups}
            columns={columns}
            loading={loading}
            actions={rowActions}
          />
        </div>
      </div>

      <AddonGroupModal
        isOpen={showAddonGroup}
        onClose={resetAddonGroupStates}
        onSubmit={handleAddAddonGroup}
        addonGroup={selectedGroup}
        outletId={outletId}
        loading={isCreatingAddonGroup || isUpdatingAddonGroup}
      />
    </>
  );
};

export default AllAddonsGroup;
