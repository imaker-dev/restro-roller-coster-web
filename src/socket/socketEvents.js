// CONNECTION
export const SOCKET_CONNECT = "connect";
export const SOCKET_DISCONNECT = "disconnect";
export const SOCKET_ERROR = "connect_error";

// ROOMS
export const JOIN_STATION = "join:station";

// KOT
export const KOT_UPDATED = "kot:updated";
export const KOT_CREATED = "kot:created";
export const KOT_ACCEPTED = "kot:accepted";
export const KOT_PREPARING = "kot:preparing";
export const KOT_ITEM_READY = "kot:item_ready";
export const KOT_READY = "kot:ready";
export const KOT_SERVED = "kot:served";
export const KOT_CANCELLED = "kot:cancelled";
export const ITEM_CANCELLED = "kot:item_cancelled";

// TABLE
export const TABLE_UPDATED = "table:updated";
export const TABLE_MERGED = "tables_merged";
export const TABLE_UNMERGED = "tables_unmerged";





// NEW: Self-Order Events
export const JOIN_OUTLET = "join:outlet";
export const SELF_ORDER_UPDATED = "selforder:updated";
export const SELF_ORDER_NEW = "selforder:new";
export const SELF_ORDER_ACCEPTED = "selforder:accepted";
export const SELF_ORDER_REJECTED = "selforder:rejected";
export const SELF_ORDER_ITEMS_ADDED = "selforder:items_added";
export const SELF_ORDER_ITEM_UPDATED = "selforder:item_updated";
export const SELF_ORDER_ITEM_REMOVED = "selforder:item_removed";
export const SELF_ORDER_CANCELLED = "selforder:cancelled";
export const SELF_ORDER_COMPLETED = "selforder:completed";
