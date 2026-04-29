import React, { useEffect, useState } from "react";
import PageHeader from "../../layout/PageHeader";
import {
  createCategory,
  fetchAllCategories,
  updateCategory,
} from "../../redux/slices/categorySlice";
import { useDispatch, useSelector } from "react-redux";
import SmartTable from "../../components/SmartTable";
import { formatDate } from "../../utils/dateFormatter";
import { Edit2, Eye, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import CategoryModal from "../../partial/category/CategoryModal";
import { handleResponse } from "../../utils/helpers";
import StatusBadge from "../../layout/StatusBadge";
import ServiceTypeBadge from "../../partial/category/ServiceTypeBadge";
import LightboxMedia from "../../components/LightboxMedia";
import Pagination from "../../components/Pagination";
import SearchBar from "../../components/SearchBar";
import { SERVICE_TYPES } from "../../constants";
import { formatText } from "../../utils/utils";
import { ROUTE_PATHS } from "../../config/paths";

const AllCategoriesPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { outletId } = useSelector((state) => state.auth);

  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [serviceType, setServiceType] = useState("");

  const { allCategories, loading, isCreatingCategory, isUpdatingCategory } =
    useSelector((state) => state.category);

  const { data, pagination } = allCategories || {};

  const fetchCategories = () => {
    dispatch(
      fetchAllCategories({
        outletId,
        page: currentPage,
        limit: itemsPerPage,
        serviceType: serviceType,
        search: searchTerm,
      }),
    );
  };

  useEffect(() => {
    fetchCategories();
  }, [outletId, currentPage, itemsPerPage, serviceType, searchTerm]);

  useEffect(() => {
    setCurrentPage(1);
  }, [serviceType, searchTerm]);

  const columns = [
    {
      key: "name",
      label: "Category",
      render: (row) => {
        const desc = row?.description?.trim?.();

        return (
          <div className="flex items-start gap-3 max-w-[320px]">
            {/* Image / Icon */}
            {row.image_url ? (
              <div className="h-11 w-11 rounded-lg overflow-hidden bg-slate-100 shrink-0">
                <LightboxMedia
                  src={row.image_url}
                  alt={row.name}
                  caption={row.name}
                />
              </div>
            ) : (
              <div
                className="w-11 h-11 rounded-lg flex items-center justify-center text-lg border border-slate-200 shrink-0"
                style={{ backgroundColor: row.color_code || "#f1f5f9" }}
              >
                {row.icon || "📂"}
              </div>
            )}

            {/* Name + Description */}
            <div className="flex flex-col min-w-0">
              <span
                className="font-semibold text-slate-800 truncate"
                title={row.name}
              >
                {row.name}
              </span>

              <span
                className={`text-xs truncate max-w-[240px] ${
                  desc ? "text-slate-500" : "text-slate-400 italic"
                }`}
                title={desc || "No Description"}
              >
                {desc || "No Description"}
              </span>
            </div>
          </div>
        );
      },
    },

    // 🔥 Service + Items merged
    {
      key: "service_meta",
      label: "Service",
      render: (row) => (
        <div className="flex flex-col gap-1">
          <div className="w-fit">
            <ServiceTypeBadge value={row.service_type} />
          </div>

          <span className="text-xs text-slate-500">
            {row.item_count} item{row.item_count !== 1 && "s"}
          </span>
        </div>
      ),
    },

    {
      key: "is_active",
      label: "Status",
      render: (row) => <StatusBadge value={row.is_active} />,
    },

    {
      key: "updated_at",
      label: "updated",
      render: (row) => (
        <span className="text-sm text-slate-600 whitespace-nowrap">
          {row.updated_at ? formatDate(row.updated_at, "longTime") : "—"}
        </span>
      ),
    },
  ];

  const rowActions = [
    {
      label: "View",
      icon: Eye,
      onClick: (row) =>
        navigate(`${ROUTE_PATHS.ALL_MENU_ITEMS}?categoryId=${row.id}`),
    },
    {
      label: "Update",
      icon: Edit2,
      color: "blue",
      onClick: (row) => {
        (setSelectedCategory(row), setShowAddModal(true));
      },
    },
  ];

  const actions = [
    {
      label: "Add Category",
      type: "primary",
      icon: Plus,
      onClick: () => setShowAddModal(true),
    },
  ];

  const clearCategoryStates = () => {
    setSelectedCategory(null);
    setShowAddModal(false);
  };

  const handleUpdateCategory = async ({ id, values, resetForm }) => {
    const action = id ? updateCategory({ id, values }) : createCategory(values);
    await handleResponse(dispatch(action), () => {
      fetchCategories();
      clearCategoryStates();
      resetForm();
    });
  };

  return (
    <>
      <div className="space-y-6">
        <PageHeader title={"All Categories"} actions={actions} />

        <div className="flex items-center justify-between gap-4">
          {/* Search Bar */}
          <SearchBar
            placeholder="Search categories..."
            onSearch={(value) => setSearchTerm(value)}
          />

          <select
            className="form-select"
            value={serviceType}
            onChange={(e) => setServiceType(e.target.value)}
          >
            <option value="">All</option>
            {Object.values(SERVICE_TYPES).map((value) => (
              <option key={value} value={value}>
                {formatText(value)}
              </option>
            ))}
          </select>
        </div>

        <SmartTable
          title="Categories"
          totalcount={pagination?.total}
          data={data}
          columns={columns}
          actions={rowActions}
          loading={loading}
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

      <CategoryModal
        isOpen={showAddModal}
        onClose={clearCategoryStates}
        onSubmit={handleUpdateCategory}
        outletId={outletId}
        category={selectedCategory}
        loading={isCreatingCategory || isUpdatingCategory}
      />
    </>
  );
};

export default AllCategoriesPage;
