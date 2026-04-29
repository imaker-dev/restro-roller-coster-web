import React, { useEffect, useState } from "react";
import PageHeader from "../../layout/PageHeader";
import { useDispatch, useSelector } from "react-redux";
import {
  createInventoryCategory,
  fetchAllInventoryCategories,
  updateInventoryCategory,
} from "../../redux/slices/inventorySlice";
import { Edit2, Plus } from "lucide-react";
import InventoryCategoryModal from "../../partial/inventory/inventory/InventoryCategoryModal";
import { handleResponse } from "../../utils/helpers";
import StatusBadge from "../../layout/StatusBadge";
import SmartTable from "../../components/SmartTable";
import { formatDate } from "../../utils/dateFormatter";

const InventoryCategoryPage = () => {
  const dispatch = useDispatch();
  const { outletId } = useSelector((state) => state.auth);
  const {
    allCategories,
    isFetchingCategories,
    isCreatingCategory,
    isUpdatingCategory,
  } = useSelector((state) => state.inventory);

  const { categories, pagination } = allCategories || {};

  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const fetchCategory = () => {
    dispatch(fetchAllInventoryCategories(outletId));
  };

  useEffect(() => {
    if (!outletId) return;
    fetchCategory();
  }, [outletId]);

  const actions = [
    {
      label: "Add New Category",
      type: "primary",
      icon: Plus,
      onClick: () => setShowCategoryModal(true),
    },
  ];

  const resetCategoryStates = () => {
    setShowCategoryModal(false);
  };

  const handleAddCategory = async ({ id, values, resetForm }) => {
    const action = id
      ? updateInventoryCategory({ id, values })
      : createInventoryCategory({ outletId, values });

    await handleResponse(dispatch(action), () => {
      fetchCategory();
      resetForm();
      resetCategoryStates();
    });
  };

  const columns = [
    {
      key: "name",
      label: "Category",
      render: (row) => (
        <span className="font-semibold text-slate-800">{row.name}</span>
      ),
    },

    {
      key: "description",
      label: "Description",
      render: (row) => (
        <span className="text-sm text-slate-600">{row.description}</span>
      ),
    },

    {
      key: "itemCount",
      label: "Items",
      render: (row) => (
        <span className="text-slate-700 font-medium">{row.itemCount}</span>
      ),
    },

    {
      key: "createdAt",
      label: "Created",
      render: (row) => (
        <span className="text-sm text-slate-600">
          {formatDate(row.createdAt, "long")}
        </span>
      ),
    },

    {
      key: "status",
      label: "Status",
      sortValue: (row) => Number(row.isActive),
      render: (row) => <StatusBadge value={Number(row.isActive)} />,
    },
  ];

  const rowActions = [
    {
      label: "Update",
      icon: Edit2,
      color: "blue",
      onClick: (row) => {
        setShowCategoryModal(true);
        setSelectedCategory(row);
      },
    },
  ];

  return (
    <>
      <div className="space-y-6">
        <PageHeader title={"Inventory Categories"} actions={actions} />

        <SmartTable
          title="Categories"
          totalcount={categories?.length}
          data={categories}
          columns={columns}
          actions={rowActions}
          loading={isFetchingCategories}
        />
      </div>

      <InventoryCategoryModal
        isOpen={showCategoryModal}
        onClose={resetCategoryStates}
        category={selectedCategory}
        onConfirm={handleAddCategory}
        loading={isCreatingCategory || isUpdatingCategory}
      />
    </>
  );
};

export default InventoryCategoryPage;
