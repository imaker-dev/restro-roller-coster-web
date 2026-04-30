export const TOKEN_KEYS = {
  ACCESS: "_k_e7c1fa92",
  REFRESH: "_k_91bd04ce",
  OUTLET_ID: "_k_a19f3c77",
  LOGIN_SOURCE: "_k_ls_72ac91",
  QR_SESSION: "_k_qr_5f8d21",
  DEVICE_ID: "_k_dev_93f2c11", 
};

export const LOGO = "/Images/Logo.svg";
export const LOGO_ICON = "/Images/logo-icon.png";

export const ROLES = {
  SUPER_ADMIN: "super_admin",
  ADMIN: "admin",
  MANAGER: "manager",
  KITCHEN: "kitchen",
  BARTENDER: "bartender",
  CASHIER: "cashier",
  CAPTAIN: "captain",
  WAITER: "waiter",
  INVENTORY: "inventory",
};

export const FOOD_TYPES = {
  VEG: "veg",
  NON_VEG: "non_veg",
  EGG: "egg",
};

export const DATE_RANGES = {
  TODAY: "Today",
  YESTERDAY: "Yesterday",
  LAST_7_DAYS: "Last 7 Days",
  LAST_30_DAYS: "Last 30 Days",
  THIS_MONTH: "This Month",
  LAST_MONTH: "Last Month",
  CUSTOM: "Custom Range",
};

export const PREDEFINED_RANGES = Object.values(DATE_RANGES);

export const DEFAULT_DATE_RANGE = DATE_RANGES.LAST_7_DAYS;

export const SECTION_TYPES = {
  DINE_IN: "dine_in",
  TAKEAWAY: "takeaway",
  DELIVERY: "delivery",
  BAR: "bar",
  ROOFTOP: "rooftop",
  PRIVATE: "private",
  OUTDOOR: "outdoor",
  AC: "ac",
  NON_AC: "non_ac",
};

export const SERVICE_TYPES = {
  RESTAURANT: "restaurant",
  BAR: "bar",
  BOTH: "both", // default
};

export const STATION_TYPES = {
  KITCHEN: "kitchen",
  BAR: "bar",
  DESSERT: "dessert",
  MOCKTAIL: "mocktail",
  OTHER: "other",
};

// Order statuses
export const ORDER_STATUSES = {
  PENDING: "pending",
  CONFIRMED: "confirmed",
  SENT_TO_KITCHEN: "sent_to_kitchen",
  READY: "ready",
  SERVED: "served",
  BILLED: "billed",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
};

// Order types
export const ORDER_TYPES = {
  DINE_IN: "dine_in",
  TAKEAWAY: "takeaway",
  DELIVERY: "delivery",
};

// Payment statuses
export const PAYMENT_STATUSES = {
  COMPLETED: "completed",
  PENDING: "pending",
  PARTIAL: "partial",
  UNPAID: "unpaid",
};
