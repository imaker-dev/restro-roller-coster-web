import { useEffect, useState, useMemo } from "react";
import PageHeader from "../../layout/PageHeader";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  createAdjustment,
  createWastage,
  fetchAllInventoryItems,
} from "../../redux/slices/inventorySlice";
import StatCard from "../../components/StatCard";
import { formatNumber } from "../../utils/numberFormatter";
import NoDataFound from "../../layout/NoDataFound";
import {
  Plus,
  Package,
  AlertTriangle,
  ShieldAlert,
  CheckCircle,
  XCircle,
  IndianRupee,
} from "lucide-react";
import InventoryItemCard from "../../partial/inventory/inventory/InventoryItemCard";
import StockAdjustOverlay from "../../partial/inventory/inventory/StockAdjustOverlay";
import SearchBar from "../../components/SearchBar";
import InventoryItemWastageoverlay from "../../partial/inventory/inventory/InventoryItemWastageoverlay";
import { handleResponse } from "../../utils/helpers";
import InventoryItemCardSkeleton from "../../partial/inventory/inventory/InventoryItemCardSkeleton";
import Pagination from "../../components/Pagination";
import { ROUTE_PATHS } from "../../config/paths";

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════════════════════════════════ */
const InventoryItemPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { outletId } = useSelector((state) => state.auth);
  const {
    allItemsData,
    isFetchingItems,
    isCreatingAdjustment,
    isCreatingWastage,
  } = useSelector((state) => state.inventory);

  const { items = [], pagination, summary } = allItemsData || {};

  const [showAdjust, setShowAdjust] = useState(false);
  const [showWastage, setShowWastage] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(9);

  const [searchQuery, setSearchQuery] = useState("");

  const fetchInventory = () => {
    dispatch(
      fetchAllInventoryItems({
        outletId,
        page: currentPage,
        limit: itemsPerPage,
        search: searchQuery,
      }),
    );
  };

  useEffect(() => {
    if (!outletId) return;
    fetchInventory();
  }, [outletId, currentPage, itemsPerPage, searchQuery]);

  const actions = [
    {
      label: "Add New Item",
      type: "primary",
      icon: Plus,
      onClick: () => navigate(ROUTE_PATHS.INVENTORY_ITEMS_ADD),
    },
  ];

  const resetStates = () => {
    setShowAdjust(false);
    setShowWastage(false);
    setSelectedItem(null);
  };

  async function handleAdjustConfirm(values, reset) {
    await handleResponse(
      dispatch(createAdjustment({ outletId, values })),
      () => {
        fetchInventory();
        resetStates();
        reset();
      },
    );
  }

  async function handleWastageConfirm(values, reset) {
    await handleResponse(dispatch(createWastage({ outletId, values })), () => {
      fetchInventory();
      resetStates();
      reset();
    });
  }

  const stats = [
    // Overview
    {
      title: "Total Items",
      value: formatNumber(summary?.totalItems),
      subtitle: "All inventory items",
      icon: Package,
      color: "slate",
    },

    // Status
    {
      title: "Active Items",
      value: formatNumber(summary?.activeItems),
      subtitle: "Currently in use",
      icon: CheckCircle,
      color: "green",
    },
    {
      title: "Inactive Items",
      value: formatNumber(summary?.inactiveItems),
      subtitle: "Not in use",
      icon: XCircle,
      color: "red",
    },

    // Value
    {
      title: "Total Stock Value",
      value: formatNumber(summary?.totalStockValue, true),
      subtitle: "Inventory worth",
      icon: IndianRupee,
      color: "blue",
    },
  ];

  return (
    <>
      <div className="space-y-5">
        <PageHeader title="Inventory Items" actions={actions} />

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {stats.map((s) => (
            <StatCard
              key={s.title}
              icon={s.icon}
              title={s.title}
              value={s.value}
              subtitle={s.subtitle}
              color={s.color}
              variant="v9"
              loading={isFetchingItems}
            />
          ))}
        </div>

        <SearchBar
          placeholder="Search by name, SKU, category…"
          onSearch={(value) => setSearchQuery(value)}
        />

        {/* ── Alerts strip ── */}
        {(summary?.lowStockItems > 0 || summary?.zeroStockItems > 0) && (
          <div className="flex flex-wrap gap-3">
            {summary?.zeroStockItems > 0 && (
              <div className="flex items-center gap-2.5 bg-red-50 border border-red-100 rounded-xl px-4 py-2.5">
                <ShieldAlert
                  size={14}
                  className="text-red-500 flex-shrink-0"
                  strokeWidth={2}
                />
                <p className="text-[12px] font-bold text-red-700">
                  {summary?.zeroStockItems} item
                  {summary?.zeroStockItems !== 1 ? "s" : ""} out of stock —
                  needs immediate restocking
                </p>
              </div>
            )}
            {summary?.lowStockItems > 0 && (
              <div className="flex items-center gap-2.5 bg-amber-50 border border-amber-100 rounded-xl px-4 py-2.5">
                <AlertTriangle
                  size={14}
                  className="text-amber-500 flex-shrink-0"
                  strokeWidth={2}
                />
                <p className="text-[12px] font-bold text-amber-700">
                  {summary?.lowStockItems} item
                  {summary?.lowStockItems !== 1 ? "s" : ""} running low —
                  reorder soon
                </p>
              </div>
            )}
          </div>
        )}

        {/* ── Item grid ── */}
        {isFetchingItems ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(3)].map((_, idx) => (
              <InventoryItemCardSkeleton key={idx} />
            ))}
          </div>
        ) : items.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((item) => (
              <InventoryItemCard
                key={item.id}
                item={item}
                onAdjust={(item) => {
                  (setSelectedItem(item), setShowAdjust(true));
                }}
                onWastage={(item) => {
                  (setSelectedItem(item), setShowWastage(true));
                }}
              />
            ))}
          </div>
        ) : (
          <NoDataFound
            icon={Package}
            title={
              items.length === 0
                ? "No inventory items yet"
                : "No items match your filters"
            }
            className="bg-white"
          />
        )}

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

      <StockAdjustOverlay
        isOpen={showAdjust}
        onClose={resetStates}
        item={selectedItem}
        onConfirm={handleAdjustConfirm}
        loading={isCreatingAdjustment}
      />

      <InventoryItemWastageoverlay
        isOpen={showWastage}
        onClose={resetStates}
        item={selectedItem}
        onConfirm={handleWastageConfirm}
        loading={isCreatingWastage}
      />
    </>
  );
};

export default InventoryItemPage;
