import { useState, useRef, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import {
  fetchPublicMenu,
  fetchSelfOrderCart,
  fetchCurrentSessionInfo,
  fetchCurrentOrderStatus,
  clearSessionState,
} from "../../redux/slices/publicMenuSlice";
import { useQueryParams } from "../../hooks/useQueryParams";
import { getDeviceId } from "../../utils/deviceId";
import { handleResponse } from "../../utils/helpers";
import { formatNumber } from "../../utils/numberFormatter";
import SessionScreen from "../../partial/self-order/SessionScreen";
import CartScreen from "../../partial/self-order/CartScreen";
import OrderSuccessScreen from "../../partial/self-order/OrderSuccessScreen";
import CurrentOrderStatusScreen from "../../partial/self-order/CurrentOrderStatusScreen";
import ItemDetailSheet from "../../partial/self-order/ItemDetailSheet";
import { AlertCircle } from "lucide-react";
import MenuContentScreen from "../../partial/self-order/MenuContentScreen";
import { TOKEN_KEYS } from "../../constants";

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────
const SCREENS = {
  SESSION: "session",
  MENU: "menu",
  CART: "cart",
  SUCCESS: "success",
  ORDER_STATUS: "orderStatus",
};

const FILTER_DEFAULTS = {
  activeCategory: "All",
  search: "",
  vegFilter: "all",
  viewMode: "list",
};

// ─────────────────────────────────────────────────────────────────────────────
// SUB-COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────
function InvalidUrlFallback() {
  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col items-center justify-center px-5 text-center">
      <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mb-6">
        <AlertCircle size={40} className="text-red-500" />
      </div>
      <h1 className="text-xl font-bold text-[#1C1C1E] mb-2">
        Invalid QR Code
      </h1>
      <p className="text-[#6C6C70] text-sm max-w-xs">
        The restaurant or table information is missing from this QR code.
        Please contact the restaurant staff for assistance.
      </p>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CUSTOM HOOKS
// ─────────────────────────────────────────────────────────────────────────────

// Cart management hook
function useCartManagement() {
  const [cart, setCart] = useState([]);
  
  const cartItemCount = cart.reduce((s, i) => s + i.quantity, 0);
  const cartTotal = cart.reduce((s, i) => s + i.unitPrice * i.quantity, 0);
  
  const cartItemQty = useCallback(
    (itemId) => cart.filter((c) => c.itemId === itemId).reduce((s, c) => s + c.quantity, 0),
    [cart]
  );
  
  const handleQuickAdd = useCallback((item) => {
    if (item.variants?.length > 0 || item.addons?.some((g) => g.required)) {
      return { shouldOpenDetail: true, item };
    }
    
    setCart((prev) => {
      const existing = prev.findIndex(
        (c) => c.itemId === item.id && !c.variantId && !c.addons?.length
      );
      if (existing >= 0) {
        return prev.map((c, i) =>
          i === existing ? { ...c, quantity: c.quantity + 1 } : c
        );
      }
      return [
        ...prev,
        {
          itemId: item.id,
          variantId: null,
          name: item.name,
          variantName: null,
          quantity: 1,
          unitPrice: item.price,
          specialInstructions: null,
          addons: [],
        },
      ];
    });
    
    toast.success(`${item.name} added`, "success");
    return { shouldOpenDetail: false };
  }, []);
  
  const handleChangeQty = useCallback((item, delta) => {
    setCart((prev) => {
      const idx = prev.findLastIndex((c) => c.itemId === item.id);
      if (idx < 0) return prev;
      const updated = [...prev];
      if (updated[idx].quantity + delta <= 0) {
        return updated.filter((_, i) => i !== idx);
      }
      updated[idx] = {
        ...updated[idx],
        quantity: updated[idx].quantity + delta,
      };
      return updated;
    });
  }, []);
  
  const handleAddFromSheet = useCallback((cartEntry) => {
    setCart((prev) => [...prev, cartEntry]);
    toast.success(`${cartEntry.name} added`, "success");
  }, []);
  
  return {
    cart,
    setCart,
    cartItemCount,
    cartTotal,
    cartItemQty,
    handleQuickAdd,
    handleChangeQty,
    handleAddFromSheet,
  };
}

// Menu filtering hook
function useMenuFiltering(publicMenuData) {
  const [filters, setFilters] = useState(FILTER_DEFAULTS);
  
  const categories = publicMenuData?.menu || [];
  const allItems = categories.flatMap((c) => c.items || []);
  
  const filteredItems = (() => {
    let items =
      filters.activeCategory === "All"
        ? allItems
        : categories.find((c) => c.name === filters.activeCategory)?.items || [];
    
    if (filters.vegFilter !== "all") {
      items = items.filter((i) => i.type === filters.vegFilter);
    }
    if (filters.search.trim()) {
      const q = filters.search.toLowerCase();
      items = items.filter(
        (i) =>
          i.name.toLowerCase().includes(q) ||
          (i.description || "").toLowerCase().includes(q)
      );
    }
    return items;
  })();
  
  const updateFilters = useCallback((updates) => {
    setFilters((prev) => ({ ...prev, ...updates }));
  }, []);
  
  const handleCategoryClick = useCallback((category) => {
    updateFilters({ activeCategory: category, search: "" });
  }, [updateFilters]);
  
  return {
    filters,
    filteredItems,
    categories,
    allItems,
    updateFilters,
    handleCategoryClick,
  };
}



// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
export default function PublicMenuPage() {
  const dispatch = useDispatch();
  const { outlet, table, sessionToken } = useQueryParams();
  const {
    qrSessionToken,
    isStartingSelfOrderSession,
    publicMenuData,
    isFetchingPublicMenu,
    selfOrderCartData,
    currentSessionInfo,
    currentOrderStatus,
    isSavingCart,
    isPlacingSelfOrder,
  } = useSelector((s) => s.publicMenu);
  
  const isValidUrl = outlet && table;
  
  // State
  const [screen, setScreen] = useState(SCREENS.SESSION);
  const [session, setSession] = useState(null);
  const [orderResult, setOrderResult] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  
  // Custom hooks
  const {
    cart,
    setCart,
    cartItemCount,
    cartTotal,
    cartItemQty,
    handleQuickAdd,
    handleChangeQty,
    handleAddFromSheet,
  } = useCartManagement();
  
  const {
    filters,
    filteredItems,
    categories,
    updateFilters,
    handleCategoryClick,
  } = useMenuFiltering(publicMenuData);
  
  // Initialize
  useEffect(() => {
    getDeviceId();
  }, []);
  
  // Check existing session
  useEffect(() => {
    if (qrSessionToken) {
      dispatch(fetchPublicMenu({ outletId: outlet }));
      dispatch(fetchSelfOrderCart({ token: qrSessionToken }));
      dispatch(fetchCurrentSessionInfo({ token: qrSessionToken }));
      dispatch(fetchCurrentOrderStatus({ token: qrSessionToken }));
      setScreen(SCREENS.MENU);
    }
  }, [qrSessionToken]);
  
  // Update session from API
  useEffect(() => {
    if (currentSessionInfo) {
      setSession((prev) => ({
        ...prev,
        ...currentSessionInfo,
      }));
    }
  }, [currentSessionInfo]);
  
  // Sync cart from Redux
  useEffect(() => {
    if (selfOrderCartData?.items?.length) {
      setCart(selfOrderCartData.items);
    }
  }, [selfOrderCartData]);
  
  // Handlers
  const handleSessionSuccess = async (sessionData) => {
    await handleResponse(
      dispatch(fetchCurrentSessionInfo({ token: sessionData.token }))
    );
    dispatch(fetchPublicMenu({ outletId: outlet }));
    setScreen(SCREENS.MENU);
  };
  
  const handleOrderCancelled = useCallback(() => {
    if (qrSessionToken) {
      dispatch(fetchCurrentOrderStatus({ token: qrSessionToken }));
      dispatch(fetchPublicMenu({ outletId: outlet }));
    }
    setScreen(SCREENS.MENU);
  }, [qrSessionToken, dispatch, outlet]);
  
  const handleSelectItem = useCallback((item) => {
    setSelectedItem(item);
  }, []);
  
  const handleQuickAddWithDetail = useCallback((item) => {
    const result = handleQuickAdd(item);
    if (result.shouldOpenDetail) {
      setSelectedItem(result.item);
    }
  }, [handleQuickAdd]);
  
  const handleScreenChange = useCallback((updates) => {
    if (updates.screen) {
      setScreen(updates.screen);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem(TOKEN_KEYS.QR_SESSION)
    setScreen(SCREENS.SESSION)
  }
  
  // Show fallback if invalid URL
  if (!isValidUrl) {
    return <InvalidUrlFallback />;
  }
  
  // ── SCREEN ROUTER ──────────────────────────────────────────────────────────
  if (screen === SCREENS.SESSION) {
    return (
      <SessionScreen
        outletId={outlet}
        tableId={table}
        qrToken={sessionToken}
        onSuccess={handleSessionSuccess}
        loading={isStartingSelfOrderSession}
      />
    );
  }
  
  if (screen === SCREENS.CART) {
    return (
      <CartScreen
        cart={cart}
        session={session}
        onBack={() => setScreen(SCREENS.MENU)}
        onUpdateCart={setCart}
        onOrderSuccess={(res) => {
          setOrderResult(res);
          setCart([]);
          setScreen(SCREENS.SUCCESS);
        }}
        token={qrSessionToken}
        loading={isSavingCart || isPlacingSelfOrder}
      />
    );
  }
  
  if (screen === SCREENS.SUCCESS) {
    return (
      <OrderSuccessScreen
        orderData={orderResult}
        session={session}
        onContinue={() => setScreen(SCREENS.MENU)}
      />
    );
  }
  
  if (screen === SCREENS.ORDER_STATUS) {
    return (
      <CurrentOrderStatusScreen
        orderData={currentOrderStatus}
        session={session}
        onBack={() => setScreen(SCREENS.MENU)}
        onOrderCancelled={handleOrderCancelled}
        token={qrSessionToken}
      />
    );
  }
  
  return (
    <>
      <MenuContentScreen
        session={session}
        cartItemCount={cartItemCount}
        isFetchingPublicMenu={isFetchingPublicMenu}
        categories={categories}
        activeCategory={filters.activeCategory}
        search={filters.search}
        vegFilter={filters.vegFilter}
        viewMode={filters.viewMode}
        filteredItems={filteredItems}
        currentOrderStatus={currentOrderStatus}
        cartTotal={cartTotal}
        cartItemQty={cartItemQty} 
        onSettingsChange={(updates) => {
          updateFilters(updates);
          handleScreenChange(updates);
        }}
        onCategoryClick={handleCategoryClick}
        onViewCart={() => setScreen(SCREENS.CART)}
        onLogout={() => handleLogout()}
        onSelectItem={handleSelectItem}
        onQuickAdd={handleQuickAddWithDetail}
        onChangeQty={handleChangeQty}
      />
      
      {/* Item Detail Sheet - rendered here to maintain state */}
      {selectedItem && (
        <ItemDetailSheet
          item={selectedItem}
          cartItems={cart}
          onClose={() => setSelectedItem(null)}
          onAddToCart={handleAddFromSheet}
        />
      )}
    </>
  );
}