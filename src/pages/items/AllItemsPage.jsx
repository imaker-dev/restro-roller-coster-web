import React, { useEffect } from "react";
import PageHeader from "../../layout/PageHeader";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllItems } from "../../redux/slices/itemSlice";
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
import { formatNumber } from "../../utils/numberFormatter";
import { useDataTable } from "../../hooks/useDataTable";

const AllItemsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { outletId } = useSelector((state) => state.auth);
  const { query, updateQuery } = useDataTable({
    page: 1,
    limit: 10,
  });

  const {
    page,
    limit,
    search,
    categoryId,
    itemType,
    serviceType,
    includeInactive,
  } = query;

  const { allItems, loading } = useSelector((state) => state.item);
  const { data, pagination } = allItems || {};
  const { allCategories } = useSelector((state) => state.category);
  const { data: categoryData } = allCategories || {};

  const fetchItems = () => {
    dispatch(
      fetchAllItems({
        outletId,

        search,
        page: Number(page),
        limit: Number(limit),

        categoryId,
        itemType,
        serviceType,
        includeInactive,
      }),
    );
  };

  useEffect(() => {
    fetchItems();
  }, [
    outletId,
    search,
    page,
    limit,
    categoryId,
    itemType,
    serviceType,
    includeInactive,
  ]);

  useEffect(() => {
    dispatch(fetchAllCategories({ outletId }));
  }, [outletId]);

  const columns = [
    {
      key: "name",
      label: "Item",
      render: (row) => (
        <div className="flex items-start gap-3 min-w-0">
          <LightboxMedia
            src={row.image_url}
            alt={row.name}
            caption={row.name}
            className="h-10 w-10 rounded-lg flex-shrink-0"
          />

          <div className="flex flex-col min-w-0">
            <div className="flex items-start gap-2">
              <div className="mt-0.5 flex-shrink-0">
                <FoodTypeIcon type={row.item_type} />
              </div>

              <div className="min-w-0 flex flex-col">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-slate-800 truncate max-w-[320px] block">
                    {row.name}
                  </span>

                  {Number(row.is_bestseller) === 1 && (
                    <span className="px-2 py-0.5 text-[10px] rounded-full bg-amber-100 text-amber-700 font-semibold whitespace-nowrap">
                      Bestseller
                    </span>
                  )}
                </div>
                <div className="mt-1 flex items-center flex-wrap gap-2">
                  <span className="text-[11px] text-slate-400">
                    SKU: {row.sku}
                  </span>

                  {Number(row.has_variants) === 1 && (
                    <span className="text-[11px] font-medium text-slate-500">
                      • Variants
                    </span>
                  )}

                  {Number(row.has_addons) === 1 && (
                    <span className="text-[11px] font-medium text-slate-500">
                      • Add-ons
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
    },

    {
      key: "category_name",
      label: "Category",
      render: (row) => (
        <div className="max-w-[180px]">
          <span className="text-slate-700 font-medium break-words">
            {row.category_name}
          </span>
        </div>
      ),
    },

    {
      key: "pricing",
      label: "Pricing",
      render: (row) => (
        <div className="flex flex-col min-w-[120px]">
          <span className="font-semibold text-slate-800">
            {formatNumber(row.base_price, true)}
          </span>

          {row.tax_rate != null ? (
            <span className="text-xs text-slate-500 break-words">
              Tax: {Number(row.tax_rate).toFixed(2)}% • {row.tax_group_name}
            </span>
          ) : (
            <span className="text-xs text-slate-400">No tax</span>
          )}
        </div>
      ),
    },

    {
      key: "meta",
      label: "Station",
      render: (row) => (
        <div className="flex flex-col text-sm gap-1 min-w-[120px]">
          {row.kitchen_station_name ? (
            <div className="flex items-center gap-2">
              <span className="text-slate-700 font-medium break-words">
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
      render: (row) => (
        <div className="flex flex-col gap-1 min-w-[120px]">
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
  ];

  const categoryOptions =
    categoryData?.map((cat) => ({
      id: String(cat.id),
      label: cat.name,
      value: String(cat.id),
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
      <PageHeader
        title={"All Items"}
        actions={actions}
        onRefresh={fetchItems}
        isRefreshing={loading}
      />

      <div className="flex items-center justify-between gap-4">
        {/* Search Bar */}
        <SearchBar
          placeholder="Search items..."
          value={search || ""}
          onSearch={(value) =>
            updateQuery({
              search: value,
              page: 1,
            })
          }
        />
        <SidebarFilter
          filterGroups={menuFilterGroups}
          filters={{
            categoryId,
            itemType,
            serviceType,
            includeInactive,
          }}
          onApplyFilters={(filters) =>
            updateQuery({
              ...filters,
              page: 1,
            })
          }
        />
      </div>

      <SmartTable
        title="Items"
        totalcount={pagination?.total}
        data={data}
        columns={columns}
        actions={rowActions}
        loading={loading}
        emptyMessage="No Menu Items Found"
        emptyDescription="No menu items are available for this outlet or match the selected filters."
      />

      <Pagination
        totalItems={pagination?.total}
        currentPage={Number(page)}
        pageSize={Number(limit)}
        totalPages={pagination?.totalPages}
        maxPageNumbers={5}
        showPageSizeSelector={true}
        onPageChange={(page) => updateQuery({ page })}
        onPageSizeChange={(limit) =>
          updateQuery({
            limit,
            page: 1,
          })
        }
      />
    </div>
  );
};

export default AllItemsPage;
