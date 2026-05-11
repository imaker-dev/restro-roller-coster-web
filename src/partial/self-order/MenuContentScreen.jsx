import { useState, useRef, useCallback, memo } from "react";
import {
  Search,
  X,
  LayoutGrid,
  List,
  ChevronRight,
  ShoppingBag,
  MapPin,
  LogOut,
  ShoppingCart,
} from "lucide-react";
import { useSelector } from "react-redux";
import ModalAction from "../../components/ModalAction";
import ItemListRow from "./ItemListRow";
import ItemGridCard from "./ItemGridCard";
import ItemDetailSheet from "./ItemDetailSheet";
import { formatNumber } from "../../utils/numberFormatter";
import { FOOD_TYPES, LOGO, LOGO_ICON } from "../../constants";
import CurrencyIcon from "../../components/CurrencyIcon";
import Tooltip from "../../components/Tooltip";
import Shimmer from "../../layout/Shimmer";

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const FILTER_OPTIONS = {
  ALL: "all",
  VEG: FOOD_TYPES.VEG,
  NON_VEG: FOOD_TYPES.NON_VEG,
  EGG: FOOD_TYPES.EGG,
};

const VIEW_MODES = {
  LIST: "list",
  GRID: "grid",
};

// ─────────────────────────────────────────────────────────────────────────────
// SUB-COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────

// Loading State
const LoadingState = memo(({ viewMode }) => (
  <div className="flex flex-col gap-6 py-4">
    {/* Skeleton Category Sections */}
    {[1, 2, 3].map((section) => (
      <div key={section}>
        {/* Category Name Skeleton */}
        <div className="flex items-center gap-2 mb-3 px-0.5">
          <Shimmer
            width="80px"
            height="20px"
            rounded="lg"
            className="bg-[#E5E5EA]"
          />
          <Shimmer
            width="30px"
            height="16px"
            rounded="md"
            className="bg-[#F0EDE8]"
          />
        </div>

        {viewMode === VIEW_MODES.GRID ? (
          // Grid View Skeleton
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="bg-white rounded-2xl overflow-hidden border border-black/[0.06] shadow-sm"
              >
                {/* Image placeholder */}
                <Shimmer
                  width="100%"
                  height="128px"
                  rounded="none"
                  className="bg-[#F0EDE8]"
                />

                {/* Content */}
                <div className="p-3 space-y-2">
                  {/* Food type and spice level */}
                  <div className="flex items-center gap-1.5">
                    <Shimmer
                      width="12px"
                      height="12px"
                      rounded="full"
                      className="bg-[#E5E5EA]"
                    />
                    <Shimmer
                      width="48px"
                      height="12px"
                      rounded="md"
                      className="bg-[#E5E5EA]"
                    />
                  </div>

                  {/* Item name */}
                  <div className="space-y-1.5">
                    <Shimmer
                      width="75%"
                      height="16px"
                      rounded="lg"
                      className="bg-[#E5E5EA]"
                    />
                    <Shimmer
                      width="50%"
                      height="16px"
                      rounded="lg"
                      className="bg-[#F0EDE8]"
                    />
                  </div>

                  {/* Description */}
                  <Shimmer
                    width="100%"
                    height="12px"
                    rounded="md"
                    className="bg-[#F5F3F0]"
                  />

                  {/* Price and add button */}
                  <div className="flex items-center justify-between pt-2">
                    <Shimmer
                      width="64px"
                      height="20px"
                      rounded="lg"
                      className="bg-[#E5E5EA]"
                    />
                    <Shimmer
                      width="80px"
                      height="32px"
                      rounded="xl"
                      className="bg-[#E5E5EA]"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // List View Skeleton
          <div className="flex flex-col gap-2">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="bg-white rounded-2xl overflow-hidden border border-black/[0.06] shadow-sm flex"
              >
                {/* Image placeholder */}
                <Shimmer
                  width="100px"
                  height="100px"
                  rounded="none"
                  className="bg-[#F0EDE8] shrink-0"
                />

                {/* Content */}
                <div className="flex-1 p-3 space-y-1.5 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    {/* Food type indicator */}
                    <div className="flex items-center gap-1.5">
                      <Shimmer
                        width="12px"
                        height="12px"
                        rounded="full"
                        className="bg-[#E5E5EA]"
                      />
                      <Shimmer
                        width="48px"
                        height="12px"
                        rounded="md"
                        className="bg-[#E5E5EA]"
                      />
                    </div>

                    {/* Item name */}
                    <Shimmer
                      width="70%"
                      height="16px"
                      rounded="lg"
                      className="bg-[#E5E5EA]"
                    />

                    {/* Description */}
                    <Shimmer
                      width="90%"
                      height="12px"
                      rounded="md"
                      className="bg-[#F5F3F0]"
                    />
                  </div>

                  {/* Price and prep time */}
                  <div className="flex items-center gap-2">
                    <Shimmer
                      width="64px"
                      height="20px"
                      rounded="lg"
                      className="bg-[#E5E5EA]"
                    />
                    <Shimmer
                      width="48px"
                      height="16px"
                      rounded="md"
                      className="bg-[#F0EDE8]"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    ))}
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

const FILTER_ORDER = [
  FILTER_OPTIONS.ALL,
  FILTER_OPTIONS.VEG,
  FILTER_OPTIONS.NON_VEG,
  FILTER_OPTIONS.EGG,
];

const FILTER_STYLES = {
  all: {
    border: "border-white/15",
    bg: "bg-white/[0.07]",
    dot: "bg-white/40",
  },

  veg: {
    border: "border-emerald-500",
    bg: "bg-emerald-500",
    dot: "bg-emerald-500",
  },

  non_veg: {
    border: "border-red-500",
    bg: "bg-red-500",
    dot: "bg-red-500",
  },

  egg: {
    border: "border-amber-400",
    bg: "bg-amber-400",
    dot: "bg-amber-400",
  },
};

const FILTER_LABELS = {
  all: "All Items",
  veg: "Veg Only",
  non_veg: "Non-Veg Only",
  egg: "Egg Only",
};

const FoodFilterButton = ({ value, onChange }) => {
  const current = FILTER_STYLES[value];

  const currentIndex = FILTER_ORDER.indexOf(value);
  const next = FILTER_ORDER[(currentIndex + 1) % FILTER_ORDER.length];

  const handleClick = () => {
    onChange(next);
  };

  const isAll = value === FILTER_OPTIONS.ALL;
  

  return (
    <Tooltip
      content={
        <div className="text-xs">
          <p className="font-semibold">{FILTER_LABELS[value]}</p>

          <p className="text-white/60">Tap for {FILTER_LABELS[next]}</p>
        </div>
      }
      position="bottom"
      animation="shift-away"
      delay={[100, 50]}
      theme="dark"
    >
      <button
        onClick={handleClick}
        aria-label={FILTER_LABELS[value]}
        className={`
          relative
          w-9 h-9 rounded-xl border flex items-center justify-center
          ${
            isAll
              ? `${current.bg} ${current.border}`
              : `${current.bg} ${current.border} shadow-md`
          }
        `}
      >
        <div
          className={`
            w-4 h-4 rounded-[4px] border-2 flex items-center justify-center
            ${isAll ? "border-white/40" : "border-white"}
          `}
        >
          <div
            className={`
              w-1.5 h-1.5 rounded-full
              ${isAll ? current.dot : "bg-white"}
            `}
          />
        </div>
      </button>
    </Tooltip>
  );
};

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
        <span className="font-bold text-sm">
          {formatNumber(cartTotal, true)}
        </span>
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
                {session?.tableNumber || session?.tableName || "Table"}
              </p>
            </div>
          </div>

          {/* Order Status Button */}
          {/* {currentOrderStatus?.hasOrder && ( */}
          <button
            onClick={() => onSettingsChange({ screen: "orderStatus" })}
            className="relative bg-blue-600 w-9 h-9 rounded-xl flex items-center justify-center shadow-md shadow-blue-600/30 shrink-0"
            title="View Order Status"
          >
            <ShoppingBag size={16} className="text-white" />
          </button>
          {/* )} */}

          {/* Cart Button */}
          <button
            onClick={onViewCart}
            className="relative bg-primary-500 w-9 h-9 rounded-xl flex items-center justify-center shadow-md shadow-primary-500/30 shrink-0"
            title="View Cart"
          >
            <ShoppingCart size={16} className="text-white" />
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

            <FoodFilterButton
              value={vegFilter}
              onChange={(value) => onSettingsChange({ vegFilter: value })}
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
          <LoadingState viewMode={viewMode} />
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
