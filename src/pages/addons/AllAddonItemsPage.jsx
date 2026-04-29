import React, { useEffect, useState } from "react";
import PageHeader from "../../layout/PageHeader";
import { useQueryParams } from "../../hooks/useQueryParams";
import { useDispatch, useSelector } from "react-redux";
import {
  createAddonItem,
  fetchAddonGroupItems,
  updateAddonItem,
} from "../../redux/slices/addonSlice";
import SmartTable from "../../components/SmartTable";
import { formatDate } from "../../utils/dateFormatter";
import LightboxMedia from "../../components/LightboxMedia";
import { Edit2, Plus } from "lucide-react";
import AddonItemModal from "../../partial/addons/AddonItemModal";
import { handleResponse } from "../../utils/helpers";
import FoodTypeIcon from "../../partial/common/FoodTypeIcon";
import StatusBadge from "../../layout/StatusBadge";

const AllAddonItemsPage = () => {
  const dispatch = useDispatch();
  const { addonId } = useQueryParams();
  const {
    allAddonItems,
    isFetchingAddonItems,
    isCreatingAddonItem,
    isUpdatingAddonItem,
  } = useSelector((state) => state.addon);
  const [showAddonItemModal, setShowAddonItemModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const fetchAddonItems = () => {
    dispatch(fetchAddonGroupItems(addonId));
  };

  useEffect(() => {
    fetchAddonItems();
  }, [addonId]);

  const columns = [
    {
      key: "name",
      label: "Addon Name",
      render: (row) => (
        <div className="flex items-center gap-3">
          <FoodTypeIcon type={row.item_type} />
          <span className="font-medium text-slate-800">{row.name}</span>
        </div>
      ),
    },

    {
      key: "price",
      label: "Price",
      render: (row) => (
        <span className="text-slate-700 font-medium">
          ₹ {Number(row.price).toFixed(2)}
        </span>
      ),
    },

    {
      key: "is_default",
      label: "Default",
      render: (row) => (
        <span
          className={`px-2 py-1 text-xs rounded-md font-medium
        ${
          row.is_default
            ? "bg-blue-100 text-blue-700"
            : "bg-slate-100 text-slate-600"
        }`}
        >
          {row.is_default ? "Yes" : "No"}
        </span>
      ),
    },

    {
      key: "is_active",
      label: "Status",
      render: (row) => <StatusBadge value={row.is_active} />,
    },

    {
      key: "updated_at",
      label: "Last Updated",
      render: (row) => (
        <span className="text-slate-500">
          {formatDate(row.updated_at, "longTime")}
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
        (setSelectedItem(row), setShowAddonItemModal(true));
      },
    },
  ];

  const actions = [
    {
      label: "Add Addon Item",
      type: "primary",
      icon: Plus,
      onClick: () => setShowAddonItemModal(true),
    },
  ];

  const clearAddonStates = () => {
    setShowAddonItemModal(false);
    setSelectedItem(null);
  };
  const handleAddAddon = async ({ id, values, resetForm }) => {
    const action = id
      ? updateAddonItem({ id, values })
      : createAddonItem(values);
    await handleResponse(dispatch(action), () => {
      fetchAddonItems();
      clearAddonStates();
      resetForm();
    });
  };

  return (
    <>
      <div className="space-y-6">
        <PageHeader
          title="Addons"
          description="Create, update, and manage add-on items available across the menu."
          actions={actions}
          showBackButton
        />

        <SmartTable
          title="Addons"
          totalcount={allAddonItems?.length}
          data={allAddonItems}
          columns={columns}
          loading={isFetchingAddonItems}
          actions={rowActions}
        />
      </div>

      <AddonItemModal
        isOpen={showAddonItemModal}
        onClose={clearAddonStates}
        addonGroupId={addonId}
        onSubmit={handleAddAddon}
        addonItem={selectedItem}
        loading={isCreatingAddonItem || isUpdatingAddonItem}
      />
    </>
  );
};

export default AllAddonItemsPage;
