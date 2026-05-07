import { useState, useRef, useCallback, memo } from "react";
import {
  Search,
  X,
  LayoutGrid,
  List,
  ChevronRight,
  ShoppingBag,
  Leaf,
  Flame,
  MapPin,
  LogOut,
} from "lucide-react";
import { useSelector } from "react-redux";
import ModalAction from "../../components/ModalAction";
import ItemListRow from "./ItemListRow";
import ItemGridCard from "./ItemGridCard";
import ItemDetailSheet from "./ItemDetailSheet";
import { formatNumber } from "../../utils/numberFormatter";
import { LOGO, LOGO_ICON } from "../../constants";
import CurrencyIcon from "../../components/CurrencyIcon";

const fmt = (p, i) => formatNumber(p, true);

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────
const FILTER_OPTIONS = {
  ALL: "all",
  VEG: "veg",
  NON_VEG: "non_veg",
};

const VIEW_MODES = {
  LIST: "list",
  GRID: "grid",
};

// ─────────────────────────────────────────────────────────────────────────────
// SUB-COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────

// Loading State
const LoadingState = memo(() => (
  <div className="flex flex-col items-center justify-center py-20 gap-3">
    <div className="w-8 h-8 border-2 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
    <p className="text-[#8E8E93] text-sm">Loading menu...</p>
  </div>
));

// Empty State
const EmptyState = memo(({ onClearFilters }) => (
  <div className="flex flex-col items-center justify-center py-20 text-center px-6">
    <div className="w-16 h-16 bg-[#F0EDE8] rounded-full flex items-center justify-center mb-4">
      <Search size={24} className="text-black/15" />
    </div>
    <h3 className="text-base font-bold text-[#1C1C1E] mb-1">Nothing found</h3>
    <p className="text-sm text-[#8E8E93] mb-5">
      Try adjusting your search or filters
    </p>
    <button
      onClick={onClearFilters}
      className="text-primary-500 text-sm font-bold flex items-center gap-1"
    >
      <X size={14} /> Clear filters
    </button>
  </div>
));

// Category Pills
const CategoryPills = memo(
  ({ categories, activeCategory, onCategoryClick, catScrollRef }) => (
    <div
      ref={catScrollRef}
      className="flex gap-2 overflow-x-auto px-4 pb-3 scrollbar-hide"
      style={{ scrollbarWidth: "none" }}
    >
      {["All", ...categories.map((c) => c.name)].map((cat) => (
        <button
          key={cat}
          data-cat={cat}
          onClick={() => onCategoryClick(cat)}
          className={`shrink-0 px-3.5 py-1.5 rounded-full text-[11px] font-bold transition-all duration-200 ${
            activeCategory === cat
              ? "bg-primary-500 text-white shadow-md shadow-primary-500/30"
              : "bg-white/[0.07] text-white/50 border border-white/[0.07] hover:bg-white/10"
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  ),
);

// Search Input
const SearchInput = memo(({ value, onChange, onClear }) => (
  <div className="relative flex-1">
    <Search
      size={14}
      className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30"
    />
    <input
      value={value}
      onChange={onChange}
      placeholder="Search dishes..."
      className="w-full bg-white/[0.08] border border-white/[0.07] rounded-xl pl-9 pr-8 py-2 text-white text-sm placeholder-white/25 outline-none focus:border-white/20 transition-colors"
    />
    {value && (
      <button
        onClick={onClear}
        className="absolute right-2.5 top-1/2 -translate-y-1/2"
      >
        <X size={13} className="text-white/40" />
      </button>
    )}
  </div>
));

// Filter Button
const FilterButton = memo(({ active, onClick, icon: Icon, activeColor }) => {
  const getStyles = () => {
    if (!active) return "bg-white/[0.07] border-white/[0.07]";
    if (activeColor === "emerald")
      return "bg-emerald-500 border-emerald-500 shadow-md shadow-emerald-500/30";
    return "bg-red-500 border-red-500 shadow-md shadow-red-500/30";
  };

  return (
    <button
      onClick={onClick}
      className={`w-9 h-9 rounded-xl flex items-center justify-center border transition-all shrink-0 ${getStyles()}`}
    >
      <Icon size={15} className={active ? "text-white" : "text-white/40"} />
    </button>
  );
});

// View Toggle
const ViewToggle = memo(({ currentView, onChange }) => (
  <div className="flex bg-white/[0.07] rounded-xl p-0.5 gap-0.5 shrink-0">
    {[
      { key: VIEW_MODES.LIST, icon: List },
      { key: VIEW_MODES.GRID, icon: LayoutGrid },
    ].map(({ key, icon: Icon }) => (
      <button
        key={key}
        onClick={() => onChange(key)}
        className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
          currentView === key ? "bg-white/15" : ""
        }`}
      >
        <Icon
          size={13}
          className={currentView === key ? "text-white" : "text-white/35"}
        />
      </button>
    ))}
  </div>
));

// Cart Bar
const CartBar = memo(({ cartItemCount, cartTotal, onViewCart }) => (
  <div className="fixed bottom-0 left-0 right-0 z-30 px-4 pb-4 max-w-2xl mx-auto animate-slide-up">
    <button
      onClick={onViewCart}
      className="w-full bg-[#0F0F0F] text-white rounded-2xl px-4 py-3.5 flex items-center justify-between shadow-[0_8px_30px_rgba(0,0,0,0.25)] hover:bg-[#1A1A1A] active:scale-[0.98] transition-all"
    >
      <div className="flex items-center gap-3">
        <span className="bg-primary-500 text-white text-xs font-black px-2 py-0.5 rounded-lg">
          {cartItemCount}
        </span>
        <span className="font-bold text-sm">View Cart</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="font-bold text-sm">{fmt(cartTotal)}</span>
        <ChevronRight size={16} className="text-white/50" />
      </div>
    </button>
  </div>
));

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
function MenuContentScreen({
  session,
  cartItemCount,
  isFetchingPublicMenu,
  categories,
  activeCategory,
  search,
  vegFilter,
  viewMode,
  filteredItems,
  currentOrderStatus,
  cartTotal,
  cartItemQty,
  onSettingsChange,
  onCategoryClick,
  onViewCart,
  onLogout,
  onSelectItem,
  onQuickAdd,
  onChangeQty,
}) {
  const catScrollRef = useRef(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Handlers
  const handleEndSession = useCallback(() => {
    onLogout();
    setShowLogoutModal(false);
  }, [onLogout]);

  const handleSearchChange = useCallback(
    (e) => {
      onSettingsChange({
        search: e.target.value,
        activeCategory: "All", // Reset to All when searching
      });
    },
    [onSettingsChange],
  );

  const handleClearSearch = useCallback(() => {
    onSettingsChange({ search: "" });
  }, [onSettingsChange]);

  const handleVegFilterToggle = useCallback(() => {
    onSettingsChange({
      vegFilter:
        vegFilter === FILTER_OPTIONS.VEG
          ? FILTER_OPTIONS.ALL
          : FILTER_OPTIONS.VEG,
    });
  }, [vegFilter, onSettingsChange]);

  const handleNonVegFilterToggle = useCallback(() => {
    onSettingsChange({
      vegFilter:
        vegFilter === FILTER_OPTIONS.NON_VEG
          ? FILTER_OPTIONS.ALL
          : FILTER_OPTIONS.NON_VEG,
    });
  }, [vegFilter, onSettingsChange]);

  const handleViewModeToggle = useCallback(
    (mode) => {
      onSettingsChange({ viewMode: mode });
    },
    [onSettingsChange],
  );

  const handleClearFilters = useCallback(() => {
    onSettingsChange({
      search: "",
      vegFilter: FILTER_OPTIONS.ALL,
      activeCategory: "All",
    });
  }, [onSettingsChange]);

  const showGrouped =
    activeCategory === "All" &&
    !search.trim() &&
    vegFilter === FILTER_OPTIONS.ALL;

  return (
    <div className="min-h-[100dvh] bg-[#FAF8F5] flex flex-col">
      {/* ── HEADER ── */}
      <header className="bg-[#0F0F0F] sticky top-0 z-20 shadow-xl">
        {/* Top bar */}
        <div className="px-4 pt-3.5 pb-2.5 flex items-center gap-3">
          <div className="w-8 h-8 overflow-hidden">
            <img
              src={LOGO_ICON}
              className="w-full h-full object-cover rounded-md"
              alt="Logo"
            />
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-white font-bold text-sm leading-tight truncate">
              {session?.outletName || "Restaurant"}
            </p>
            <div className="flex items-center gap-1">
              <MapPin size={10} className="text-white/30" />
              <p className="text-white/40 text-[11px] truncate">
                {session?.tableName || session?.tableNumber || "Table"}
              </p>
            </div>
          </div>

          {/* Order Status Button */}
          {currentOrderStatus?.hasOrder && (
            <button
              onClick={() => onSettingsChange({ screen: "orderStatus" })}
              className="relative bg-blue-600 w-9 h-9 rounded-xl flex items-center justify-center shadow-md shadow-blue-600/30 shrink-0"
              title="View Order Status"
            >
              <CurrencyIcon size={16} className="text-white" />
            </button>
          )}

          {/* Cart Button */}
          <button
            onClick={onViewCart}
            className="relative bg-primary-500 w-9 h-9 rounded-xl flex items-center justify-center shadow-md shadow-primary-500/30 shrink-0"
            title="View Cart"
          >
            <ShoppingBag size={16} className="text-white" />
            {cartItemCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-white text-primary-500 text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
                {cartItemCount > 9 ? "9+" : cartItemCount}
              </span>
            )}
          </button>

          {/* End Session Button */}
          <button
            onClick={() => setShowLogoutModal(true)}
            className="w-9 h-9 bg-red-500/10 rounded-xl flex items-center justify-center shrink-0 hover:bg-red-500/20 transition-colors"
            title="End Session"
          >
            <LogOut
              size={16}
              className="text-red-400 hover:text-red-500 transition-colors"
            />
          </button>
        </div>

        {/* Search and Filters Row */}
        <div className="px-4 pb-2.5">
          <div className="flex items-center gap-2">
            <SearchInput
              value={search}
              onChange={handleSearchChange}
              onClear={handleClearSearch}
            />

            <FilterButton
              active={vegFilter === FILTER_OPTIONS.VEG}
              onClick={handleVegFilterToggle}
              icon={Leaf}
              activeColor="emerald"
            />

            <FilterButton
              active={vegFilter === FILTER_OPTIONS.NON_VEG}
              onClick={handleNonVegFilterToggle}
              icon={Flame}
              activeColor="red"
            />

            <ViewToggle
              currentView={viewMode}
              onChange={handleViewModeToggle}
            />
          </div>
        </div>

        {/* Category Pills */}
        <CategoryPills
          categories={categories}
          activeCategory={activeCategory}
          onCategoryClick={onCategoryClick}
          catScrollRef={catScrollRef}
        />
      </header>

      {/* ── CONTENT ── */}
      <main className="flex-1 px-3 pt-3 pb-28 max-w-3xl w-full mx-auto">
        {isFetchingPublicMenu ? (
          <LoadingState />
        ) : showGrouped ? (
          // Grouped by category
          categories.map((cat) => (
            <section key={cat.id} className="mb-5">
              <div className="flex items-center justify-between mb-2 px-0.5">
                <h2 className="text-sm font-bold text-[#1C1C1E]">
                  {cat.name}
                  <span className="ml-1.5 text-xs font-normal text-[#8E8E93]">
                    ({cat.count || cat.items?.length || 0})
                  </span>
                </h2>
              </div>

              {viewMode === VIEW_MODES.GRID ? (
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
                  {(cat.items || []).map((item) => (
                    <ItemGridCard
                      key={item.id}
                      item={item}
                      cartQty={cartItemQty(item.id)}
                      onSelect={onSelectItem}
                      onQuickAdd={onQuickAdd}
                      onChangeQty={onChangeQty}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  {(cat.items || []).map((item) => (
                    <ItemListRow
                      key={item.id}
                      item={item}
                      cartQty={cartItemQty(item.id)}
                      onSelect={onSelectItem}
                      onQuickAdd={onQuickAdd}
                      onChangeQty={onChangeQty}
                    />
                  ))}
                </div>
              )}
            </section>
          ))
        ) : filteredItems.length === 0 ? (
          <EmptyState onClearFilters={handleClearFilters} />
        ) : (
          // Filtered view
          <>
            <p className="text-xs text-[#8E8E93] mb-2.5 px-0.5">
              {filteredItems.length} dishes
            </p>
            {viewMode === VIEW_MODES.GRID ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {filteredItems.map((item) => (
                  <ItemGridCard
                    key={item.id}
                    item={item}
                    cartQty={cartItemQty(item.id)}
                    onSelect={onSelectItem}
                    onQuickAdd={onQuickAdd}
                    onChangeQty={onChangeQty}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {filteredItems.map((item) => (
                  <ItemListRow
                    key={item.id}
                    item={item}
                    cartQty={cartItemQty(item.id)}
                    onSelect={onSelectItem}
                    onQuickAdd={onQuickAdd}
                    onChangeQty={onChangeQty}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </main>

      {/* ── CART BAR ── */}
      {cartItemCount > 0 && (
        <CartBar
          cartItemCount={cartItemCount}
          cartTotal={cartTotal}
          onViewCart={onViewCart}
        />
      )}

      {/* ── LOGOUT MODAL ── */}
      <ModalAction
        id="logout-modal"
        variant="minimal"
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleEndSession}
        title="End Session?"
        description="This will clear your current session and you'll need to scan the QR code again to order."
        theme="danger"
        confirmText="End Session"
        cancelText="Cancel"
      />
    </div>
  );
}

export default MenuContentScreen;
