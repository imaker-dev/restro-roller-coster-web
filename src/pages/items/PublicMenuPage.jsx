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
import { connectSocket } from "../../socket/socket";
import { JOIN_OUTLET, SELF_ORDER_UPDATED } from "../../socket/socketEvents";
import ExpirationOverlay from "../../partial/self-order/ExpirationOverlay";

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
      <h1 className="text-xl font-bold text-[#1C1C1E] mb-2">Invalid QR Code</h1>
      <p className="text-[#6C6C70] text-sm max-w-xs">
        The restaurant or table information is missing from this QR code. Please
        contact the restaurant staff for assistance.
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
    (itemId) =>
      cart
        .filter((c) => c.itemId === itemId)
        .reduce((s, c) => s + c.quantity, 0),
    [cart],
  );

  const handleQuickAdd = useCallback((item) => {
    if (item.variants?.length > 0 || item.addons?.some((g) => g.required)) {
      return { shouldOpenDetail: true, item };
    }

    setCart((prev) => {
      const existing = prev.findIndex(
        (c) => c.itemId === item.id && !c.variantId && !c.addons?.length,
      );
      if (existing >= 0) {
        return prev.map((c, i) =>
          i === existing ? { ...c, quantity: c.quantity + 1 } : c,
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
        : categories.find((c) => c.name === filters.activeCategory)?.items ||
          [];

    if (filters.vegFilter !== "all") {
      items = items.filter((i) => i.type === filters.vegFilter);
    }
    if (filters.search.trim()) {
      const q = filters.search.toLowerCase();
      items = items.filter(
        (i) =>
          i.name.toLowerCase().includes(q) ||
          (i.description || "").toLowerCase().includes(q),
      );
    }
    return items;
  })();

  const updateFilters = useCallback((updates) => {
    setFilters((prev) => ({ ...prev, ...updates }));
  }, []);

  const handleCategoryClick = useCallback(
    (category) => {
      updateFilters({ activeCategory: category, search: "" });
    },
    [updateFilters],
  );

  return {
    filters,
    filteredItems,
    categories,
    allItems,
    updateFilters,
    handleCategoryClick,
  };
}

function useSelfOrderSocket(session, outletId, dispatch) {
  useEffect(() => {
    if (!session?.token || !outletId) return;

    // Connect with session token as guest
    const socket = connectSocket(session.token);

    const joinSelfOrderRoom = () => {
      socket.emit(
        // JOIN_SELF_ORDER,
        JOIN_OUTLET,
        // {
        // token: session.token,
        outletId,
        // tableId: session.tableId || session.table,
        // },
        (response) => {
          console.log("response", response);
          if (response?.success) {
            console.log("✅ Joined self-order room:", response);
          } else {
            console.error("❌ Failed to join self-order room:", response);
          }
        },
      );
    };

    // Join room when connected
    if (socket.connected) {
      joinSelfOrderRoom();
    }

    socket.on("connect", () => {
      console.log("✅ SOCKET CONNECTED", socket.id);

      joinSelfOrderRoom();
    });

    // Main event listener - all self-order events come through this channel
    socket.on(SELF_ORDER_UPDATED, (data) => {
      console.log("📡 Self-order update received:", data);

      // data structure: { outletId, tableId, orderId, orderNumber, type, ... }
      const {
        type,
        outletId: eventOutletId,
        tableId: eventTableId,
        orderNumber,
      } = data;

      // Check if this event is for current session
      if (
        eventOutletId !== outletId ||
        eventTableId !== (session.tableId || session.table)
      ) {
        return; // Not for this table, ignore
      }

      // switch (type) {
      //   case SELF_ORDER_EVENTS.NEW:
      //     console.log("📦 New self-order:", data);
      //     toast.success(`Order #${orderNumber} placed successfully!`);
      //     dispatch(fetchCurrentOrderStatus({ token: session.token }));
      //     break;

      //   case SELF_ORDER_EVENTS.ACCEPTED:
      //     console.log("✅ Order accepted:", data);
      //     toast.success(`Order #${orderNumber} has been accepted!`);
      //     dispatch(fetchCurrentOrderStatus({ token: session.token }));
      //     break;

      //   case SELF_ORDER_EVENTS.REJECTED:
      //     console.log("❌ Order rejected:", data);
      //     toast.error(data?.reason || `Order #${orderNumber} was rejected`);
      //     dispatch(fetchCurrentOrderStatus({ token: session.token }));
      //     break;

      //   case SELF_ORDER_EVENTS.ITEMS_ADDED:
      //     console.log("➕ Items added:", data);
      //     dispatch(fetchSelfOrderCart({ token: session.token }));
      //     break;

      //   case SELF_ORDER_EVENTS.ITEM_UPDATED:
      //     console.log("🔄 Item updated:", data);
      //     dispatch(fetchSelfOrderCart({ token: session.token }));
      //     break;

      //   case SELF_ORDER_EVENTS.ITEM_REMOVED:
      //     console.log("➖ Item removed:", data);
      //     dispatch(fetchSelfOrderCart({ token: session.token }));
      //     break;

      //   case SELF_ORDER_EVENTS.CANCELLED:
      //     console.log("🚫 Order cancelled:", data);
      //     toast(`Order #${orderNumber} has been cancelled`, { icon: "⚠️" });
      //     dispatch(fetchCurrentOrderStatus({ token: session.token }));
      //     dispatch(fetchSelfOrderCart({ token: session.token }));
      //     break;

      //   case SELF_ORDER_EVENTS.COMPLETED:
      //     console.log("✅ Order completed:", data);
      //     toast.success(`Order #${orderNumber} completed! Enjoy your meal!`);
      //     dispatch(fetchCurrentOrderStatus({ token: session.token }));
      //     break;

      //   default:
      //     console.log("📡 Unknown self-order event type:", type, data);
      //     break;
      // }
    });

    return () => {
      socket.off("connect", joinSelfOrderRoom);
      // socket.off(SELF_ORDER_UPDATED);
      // disconnectSocket();
    };
  }, [session?.token, outletId, dispatch]);
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

  // Add expiration overlay state
  const [showExpirationOverlay, setShowExpirationOverlay] = useState(false);
  const [expirationMessage, setExpirationMessage] = useState("");

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

  // CONNECT SOCKET HERE
  useSelfOrderSocket(session, outlet, dispatch);

  // Initialize
  useEffect(() => {
    getDeviceId();
  }, []);

  useEffect(() => {
    const handleExpiration = (event) => {
      setExpirationMessage(
        event.detail.message ||
          "Your order session has expired. Please start a new session.",
      );
      setShowExpirationOverlay(true);
    };

    // Listen directly for the event from axios interceptor
    window.addEventListener("self-order-expired", handleExpiration);

    return () => {
      window.removeEventListener("self-order-expired", handleExpiration);
    };
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
    dispatch(fetchCurrentSessionInfo({ token: sessionData.token }));
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

  const handleQuickAddWithDetail = useCallback(
    (item) => {
      const result = handleQuickAdd(item);
      if (result.shouldOpenDetail) {
        setSelectedItem(result.item);
      }
    },
    [handleQuickAdd],
  );

  const handleScreenChange = useCallback((updates) => {
    if (updates.screen) {
      setScreen(updates.screen);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem(TOKEN_KEYS.QR_SESSION);
    setScreen(SCREENS.SESSION);
  };

  // Handle expiration overlay close
  const handleExpirationClose = () => {
    setShowExpirationOverlay(false);
    setExpirationMessage("");
    setSession(null);
    setCart([]);
    setScreen(SCREENS.SESSION);
  };

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

      {/* Expiration Overlay - Rendered at root level so it appears above everything */}
      <ExpirationOverlay
        isOpen={showExpirationOverlay}
        message={expirationMessage}
        onClose={handleExpirationClose}
      />
    </>
  );
}
