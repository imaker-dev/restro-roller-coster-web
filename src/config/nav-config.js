import {
  Home,
  Building2,
  Users,
  Package,
  UtensilsCrossed,
  ShoppingCart,
  ReceiptText,
  BarChart3,
  Settings,
  Table,
  Truck,
  Percent,
  Layers,
  Warehouse,
  Info,
  SlidersHorizontal,
  Monitor,
  Printer,
  Smartphone,
  XCircle,
  Clock,
  CalendarCheck,
  LayoutGrid,
  Image,
  ClipboardList,
  FlaskConical,
  Headphones,
  Activity,
  QrCode,
} from "lucide-react";

import { ROLES } from "../constants";
import { ROUTE_PATHS } from "./paths";

export const navConfig = [
  {
    title: "Overview",
    roles: [ROLES.MASTER, ROLES.SUPER_ADMIN, ROLES.ADMIN],
    items: [
      {
        name: "Dashboard",
        icon: Home,
        path: ROUTE_PATHS.HOME,
        roles: [ROLES.MASTER, ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER],
      },
      {
        name: "Kitchen Dashboard",
        icon: Home,
        path: ROUTE_PATHS.HOME,
        roles: [ROLES.KITCHEN, ROLES.BARTENDER],
      },
    ],
  },

  {
    title: "Reports",
    roles: [ROLES.MASTER, ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER],
    items: [
      {
        name: "Live Operations",
        icon: Activity,
        path: ROUTE_PATHS.REPORTS_LIVE_OPERATIONS,
        roles: [ROLES.MASTER, ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER],
      },

      {
        name: "Shift History",
        icon: Clock,
        path: ROUTE_PATHS.REPORTS_SHIFT_HISTORY,
        roles: [ROLES.MASTER, ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER],
      },
      {
        name: "Day End Summary",
        icon: CalendarCheck,
        path: ROUTE_PATHS.REPORTS_DAY_END_SUMMARY,
        roles: [ROLES.MASTER, ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER],
      },
      {
        name: "Other Reports",
        icon: BarChart3,
        path: ROUTE_PATHS.ALL_REPORTS,
        roles: [ROLES.MASTER, ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER],
      },
    ],
  },

  {
    title: "Operations",
    roles: [ROLES.MASTER, ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER],
    items: [
      {
        name: "Orders",
        icon: ShoppingCart,
        path: ROUTE_PATHS.ALL_ORDERS,
        roles: [ROLES.MASTER, ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER],
      },
      {
        name: "Customers",
        icon: Users,
        path: ROUTE_PATHS.ALL_CUSTOMERS,
        roles: [ROLES.MASTER, ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER],
      },
      {
        name: "Stations",
        icon: Monitor,
        path: ROUTE_PATHS.ALL_STATIONS,
        roles: [ROLES.MASTER, ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER],
      },
      {
        name: "Printers",
        icon: Printer,
        path: ROUTE_PATHS.ALL_PRINTERS,
        roles: [ROLES.MASTER, ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER],
      },
      {
        name: "Tables & Floors",
        icon: LayoutGrid,
        path: ROUTE_PATHS.ALL_FLOORS,
        roles: [ROLES.MASTER, ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER],
      },
      {
        name: "Tables QR",
        icon: QrCode,
        path: ROUTE_PATHS.ALL_TABLE_QR,
        roles: [ROLES.MASTER, ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER],
      },
      {
        name: "Order Display",
        icon: Monitor,
        path: ROUTE_PATHS.ORDER_DISPLAY,
        roles: [ROLES.MASTER, ROLES.KITCHEN, ROLES.BARTENDER],
      },
    ],
  },

  {
    title: "Menu Management",
    roles: [ROLES.MASTER, ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER],
    items: [
      {
        name: "Menu Categories",
        icon: Layers,
        path: ROUTE_PATHS.ALL_MENU_CATEGORIES,
        roles: [ROLES.MASTER, ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER],
      },
      {
        name: "Menu Items",
        icon: UtensilsCrossed,
        path: ROUTE_PATHS.ALL_MENU_ITEMS,
        roles: [ROLES.MASTER, ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER],
      },
      {
        name: "Modifiers / Add-ons",
        icon: SlidersHorizontal,
        path: ROUTE_PATHS.ALL_ADDONS_GROUPS,
        roles: [ROLES.MASTER, ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER],
      },
      {
        name: "Tax Groups",
        icon: Percent,
        path: ROUTE_PATHS.ALL_TAX_GROUPS,
        roles: [ROLES.MASTER, ROLES.SUPER_ADMIN, ROLES.ADMIN],
      },
      {
        name: "NC (No Charge) Reasons",
        icon: XCircle,
        path: ROUTE_PATHS.ALL_NC_REASONS,
        roles: [ROLES.MASTER, ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER],
      },
      {
        name: "Menu Media",
        icon: Image,
        path: ROUTE_PATHS.MENU_MEDIA,
        roles: [ROLES.MASTER, ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER],
      },
    ],
  },

  {
    title: "Inventory",
    roles: [ROLES.MASTER, ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER],
    items: [
      {
        name: "Stock Overview",
        icon: Warehouse,
        path: ROUTE_PATHS.INVENTORY_SUMMARY,
        roles: [ROLES.MASTER, ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER],
      },
      {
        name: "Stock Operations",
        icon: BarChart3,
        roles: [ROLES.MASTER, ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER],
        children: [
          {
            name: "Stock Movements",
            icon: BarChart3,
            path: ROUTE_PATHS.ALL_INVENTORY_MOVEMENTS,
            roles: [
              ROLES.MASTER,
              ROLES.SUPER_ADMIN,
              ROLES.ADMIN,
              ROLES.MANAGER,
            ],
          },
          {
            name: "Purchase Orders",
            icon: ReceiptText,
            path: ROUTE_PATHS.ALL_PURCHASE_ORDERS,
            roles: [
              ROLES.MASTER,
              ROLES.SUPER_ADMIN,
              ROLES.ADMIN,
              ROLES.MANAGER,
            ],
          },
          {
            name: "Vendors",
            icon: Truck,
            path: ROUTE_PATHS.ALL_VENDORS,
            roles: [
              ROLES.MASTER,
              ROLES.SUPER_ADMIN,
              ROLES.ADMIN,
              ROLES.MANAGER,
            ],
          },
          {
            name: "Inventory Wastage",
            icon: Truck,
            path: ROUTE_PATHS.ALL_INVENTORY_WASTAGE,
            roles: [
              ROLES.MASTER,
              ROLES.SUPER_ADMIN,
              ROLES.ADMIN,
              ROLES.MANAGER,
            ],
          },
        ],
      },
      {
        name: "Production",
        icon: ClipboardList,
        roles: [ROLES.MASTER, ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER],
        children: [
          {
            name: "Recipes",
            icon: ClipboardList,
            path: ROUTE_PATHS.ALL_RECIPES,
            roles: [
              ROLES.MASTER,
              ROLES.SUPER_ADMIN,
              ROLES.ADMIN,
              ROLES.MANAGER,
            ],
          },
          {
            name: "Prep Recipes",
            icon: FlaskConical,
            path: ROUTE_PATHS.ALL_PREP_RECIPES,
            roles: [
              ROLES.MASTER,
              ROLES.SUPER_ADMIN,
              ROLES.ADMIN,
              ROLES.MANAGER,
            ],
          },
        ],
      },
      {
        name: "Setup",
        icon: Layers,
        roles: [ROLES.MASTER, ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER],
        children: [
          {
            name: "Inventory Items",
            icon: Package,
            path: ROUTE_PATHS.ALL_INVENTORY_ITEMS,
            roles: [
              ROLES.MASTER,
              ROLES.SUPER_ADMIN,
              ROLES.ADMIN,
              ROLES.MANAGER,
            ],
          },
          {
            name: "Ingredients",
            icon: Package,
            path: ROUTE_PATHS.ALL_INVENTORY_INGREDIENTS,
            roles: [
              ROLES.MASTER,
              ROLES.SUPER_ADMIN,
              ROLES.ADMIN,
              ROLES.MANAGER,
            ],
          },
          {
            name: "Inventory Categories",
            icon: Layers,
            path: ROUTE_PATHS.ALL_INVENTORY_CATEGORIES,
            roles: [
              ROLES.MASTER,
              ROLES.SUPER_ADMIN,
              ROLES.ADMIN,
              ROLES.MANAGER,
            ],
          },
          {
            name: "Units",
            icon: Layers,
            path: ROUTE_PATHS.ALL_INVENTORY_UNITS,
            roles: [ROLES.MASTER, ROLES.SUPER_ADMIN, ROLES.ADMIN],
          },
        ],
      },
    ],
  },

  {
    title: "Organization",
    roles: [ROLES.MASTER, ROLES.SUPER_ADMIN, ROLES.ADMIN],
    items: [
      {
        name: "Registration Requests",
        icon: ClipboardList,
        path: ROUTE_PATHS.REGISTRATION_REQUESTS,
        roles: [ROLES.MASTER, ROLES.SUPER_ADMIN],
      },
      {
        name: "Token Generation Logs",
        icon: Activity,
        path: ROUTE_PATHS.TOKEN_GENERATION_LOGS,
        roles: [ROLES.MASTER, ROLES.SUPER_ADMIN],
      },
      {
        name: "Outlets / Restaurants",
        icon: Building2,
        path: ROUTE_PATHS.ALL_OUTLETS,
        roles: [ROLES.MASTER, ROLES.SUPER_ADMIN, ROLES.ADMIN],
      },
      {
        name: "Outlet Logo",
        path: ROUTE_PATHS.OUTLET_LOGO,
        icon: Image,
        roles: [ROLES.MASTER, ROLES.SUPER_ADMIN, ROLES.ADMIN],
      },
      {
        name: "Users & Staff",
        icon: Users,
        path: ROUTE_PATHS.ALL_USERS,
        roles: [ROLES.MASTER, ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER],
      },
      {
        name: "Super Admins",
        icon: Users,
        path: ROUTE_PATHS.ALL_SUPER_ADMINS,
        roles: [ROLES.MASTER, ROLES.SUPER_ADMIN],
      },
    ],
  },

  {
    title: "System",
    roles: [ROLES.MASTER, ROLES.SUPER_ADMIN, ROLES.ADMIN],
    items: [
      {
        name: "Settings",
        icon: Settings,
        path: ROUTE_PATHS.ALL_SETTINGS,
        roles: [ROLES.MASTER, ROLES.SUPER_ADMIN, ROLES.ADMIN],
      },
      {
        name: "App Versions",
        icon: Smartphone,
        path: ROUTE_PATHS.ALL_VERSIONS,
        roles: [ROLES.MASTER, ROLES.SUPER_ADMIN],
      },
    ],
  },

  {
    title: "Support",
    items: [
      {
        name: "Guide",
        icon: Info,
        path: ROUTE_PATHS.GUIDE,
        public: true,
        roles: null,
      },
      {
        name: "Support",
        icon: Headphones,
        path: ROUTE_PATHS.SUPPORT_CHAT,
        roles: [ROLES.MASTER, ROLES.SUPER_ADMIN],
      },
    ],
  },
];
