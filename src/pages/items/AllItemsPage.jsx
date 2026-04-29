import React, { useEffect, useState } from "react";
import PageHeader from "../../layout/PageHeader";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllItems } from "../../redux/slices/itemSlice";
import { useQueryParams } from "../../hooks/useQueryParams";
import SmartTable from "../../components/SmartTable";
import { Edit2, Eye, Plus, RotateCcw } from "lucide-react";
import LightboxMedia from "../../components/LightboxMedia";
import FoodTypeIcon from "../../partial/common/FoodTypeIcon";
import { useNavigate } from "react-router-dom";
import StatusBadge from "../../layout/StatusBadge";
import SearchBar from "../../components/SearchBar";
import Pagination from "../../components/Pagination";
import SidebarFilter from "../../components/SidebarFilter";

import { fetchAllCategories } from "../../redux/slices/categorySlice";
import { SERVICE_TYPES } from "../../constants";
import { formatText } from "../../utils/utils";
import { FOOD_TYPE_OPTIONS } from "../../constants/selectOptions";
import { ROUTE_PATHS } from "../../config/paths";

const AllItemsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { outletId } = useSelector((state) => state.auth);
  const { categoryId: urlCategoryId } = useQueryParams();

  // const [filters, setFilters] = useState({});
  const [filters, setFilters] = useState(() => ({
    categoryId: urlCategoryId || "",
  }));

  useEffect(() => {
    if (urlCategoryId) {
      setFilters((prev) => ({
        ...prev,
        categoryId: urlCategoryId,
      }));
    }
  }, [urlCategoryId]);

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const { allItems, loading } = useSelector((state) => state.item);
  const { data, pagination } = allItems || {};
  const { allCategories } = useSelector((state) => state.category);
  const { data: categoryData } = allCategories || {};

  const fetchItems = () => {
    const { itemType, serviceType, categoryId, includeInactive } =
      filters || {};

    dispatch(
      fetchAllItems({
        outletId,
        search: searchTerm,
        page: currentPage,
        limit: itemsPerPage,
        categoryId,
        itemType,
        serviceType,
        includeInactive,
      }),
    );
  };

  useEffect(() => {
    fetchItems();
  }, [urlCategoryId, outletId, searchTerm, currentPage, itemsPerPage, filters]);

  useEffect(() => {
    if (!allCategories) {
      dispatch(fetchAllCategories({ outletId }));
    }
  }, [outletId]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, itemsPerPage, urlCategoryId]);

  const columns = [
    {
      key: "name",
      label: "Item",
      sortable: true,
      render: (row) => (
        <div className="flex items-start gap-3">
          {/* Image */}
          <div className="h-11 w-11 rounded-lg overflow-hidden bg-slate-100 shrink-0">
            <LightboxMedia
              src={row.image_url}
              alt={row.name}
              caption={row.name}
            />
          </div>

          {/* Info */}
          <div className="flex flex-col">
            <div className="flex items-center gap-2 flex-wrap">
              <FoodTypeIcon type={row.item_type} />
              <span className="font-semibold text-slate-800">{row.name}</span>

              {Number(row.is_bestseller) === 1 && (
                <span className="px-2 py-0.5 text-[10px] rounded-full bg-amber-100 text-amber-700 font-semibold">
                  Bestseller
                </span>
              )}
            </div>

            <span className="text-[11px] text-slate-400 mt-1">
              SKU: {row.sku} • {row.has_variants ? "Variants" : "Single"}
            </span>
          </div>
        </div>
      ),
    },

    {
      key: "category_name",
      label: "Category",
      sortable: true,
      render: (row) => (
        <span className="text-slate-700 font-medium">{row.category_name}</span>
      ),
    },

    {
      key: "pricing",
      label: "Pricing",
      sortable: true,
      sortValue: (row) => Number(row.base_price),
      render: (row) => (
        <div className="flex flex-col">
          <span className="font-semibold text-slate-800">
            ₹{Number(row.base_price).toFixed(2)}
          </span>

          <span className="text-xs text-slate-500">
            Tax: {Number(row.tax_rate || 0).toFixed(2)}% • {row.tax_group_name}
          </span>
        </div>
      ),
    },

    {
      key: "meta",
      label: "Station",
      sortable: false,
      render: (row) => (
        <div className="flex flex-col text-sm gap-1">
          {/* Kitchen Station */}
          {row.kitchen_station_name ? (
            <div className="flex items-center gap-2">
              <span className="text-slate-700 font-medium">
                {row.kitchen_station_name}
              </span>
            </div>
          ) : (
            <span className="text-xs text-slate-400">No kitchen assigned</span>
          )}
        </div>
      ),
    },

    {
      key: "availability",
      label: "Availability",
      sortable: true,
      sortValue: (row) => Number(row.is_available),
      render: (row) => (
        <div className="flex flex-col gap-1">
          <div className="w-fit">
            <StatusBadge
              value={Number(row.is_active)}
              trueText="Available"
              falseText="Unavailable"
            />
          </div>
        </div>
      ),
    },
  ];

  const rowActions = [
    {
      label: "Eye",
      icon: Eye,
      onClick: (row) =>
        navigate(`${ROUTE_PATHS.MENU_ITEMS_DETAILS}?itemId=${row.id}`),
    },
    {
      label: "Update",
      icon: Edit2,
      color: "blue",
      onClick: (row) =>
        navigate(`${ROUTE_PATHS.MENU_ITEMS_ADD}?itemId=${row.id}`),
    },
  ];

  const actions = [
    {
      label: "Add New Item",
      type: "primary",
      icon: Plus,
      onClick: () => navigate(ROUTE_PATHS.MENU_ITEMS_ADD),
    },
    {
      label: "Add Bulk Items",
      type: "export",
      icon: Plus,
      onClick: () => navigate(ROUTE_PATHS.MENU_ITEMS_BULK_ADD),
    },
    {
      label: "Refresh",
      type: "refresh",
      icon: RotateCcw,
      onClick: fetchItems,
      loading: loading,
      loadingText: "Refreshing...",
    },
  ];

  const categoryOptions =
    categoryData?.map((cat) => ({
      id: String(cat.id),
      label: cat.name,
      value: String(cat.id), // ✅ FIX
    })) || [];

  const SERVICE_TYPE_OPTIONS = Object.values(SERVICE_TYPES).map((status) => ({
    value: status,
    label: formatText(status),
  }));

  const menuFilterGroups = [
    {
      id: "categoryId",
      title: "Category",
      type: "radio",
      options: categoryOptions,
    },
    {
      id: "itemType",
      title: "Item Type",
      type: "radio",
      options: FOOD_TYPE_OPTIONS,
    },

    {
      id: "serviceType",
      title: "Service Type",
      type: "radio",
      options: SERVICE_TYPE_OPTIONS,
    },
    {
      id: "includeInactive",
      title: "Item Status",
      type: "radio",
      options: [
        // { id: "all", label: "All Items", value: "" },
        { id: "active", label: "Active Only", value: "false" },
        { id: "inactive", label: "Include Inactive", value: "true" },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title={"All Items"} actions={actions} />

      <div className="flex items-center justify-between gap-4">
        {/* Search Bar */}
        <SearchBar
          placeholder="Search items..."
          onSearch={(value) => setSearchTerm(value)}
        />
        <SidebarFilter
          filterGroups={menuFilterGroups}
          filters={filters}
          onApplyFilters={setFilters}
        />
      </div>

      <SmartTable
        title="Items"
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
  );
};

export default AllItemsPage;
