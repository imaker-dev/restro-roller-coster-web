import React from "react";
import AllOutletsPage from "../pages/outlets/AllOutletsPage";
import AllUsersPage from "../pages/users/AllUsersPage";
import AllCategoriesPage from "../pages/categories/AllCategoriesPage";
import AllItemsPage from "../pages/items/AllItemsPage";
import AddItemPage from "../pages/items/AddItemPage";
import AllSettingsPage from "../pages/settings/AllSettingsPage";
import AllTaxGroupsPage from "../pages/settings/taxes/AllTaxGroupsPage";
import TaxGroupDetailsPage from "../pages/settings/taxes/TaxGroupDetailsPage";
import AddUserPage from "../pages/users/AddUserPage";
import { ROLES } from "../constants";
import Dashboard from "../pages/dashboard/Dashboard";
import OrderDashboard from "../pages/dashboard/OrderDashboard";
import AllTablesPage from "../pages/outlets/AllTablesPage";
import AllAddonsGroup from "../pages/addons/AllAddonsGroup";
import AllAddonItemsPage from "../pages/addons/AllAddonItemsPage";
import AllFloorsPage from "../pages/outlets/AllFloorsPage";
import TableHistoryPage from "../pages/tables/TableHistoryPage";
import TableReportPage from "../pages/tables/TableReportPage";
import TableKotPage from "../pages/tables/TableKotPage";
import OrderDetailsPage from "../pages/orders/OrderDetailsPage";
import StaffSalesReportPage from "../pages/reports/StaffSalesReportPage";
import CategorySalesReportPage from "../pages/reports/CategorySalesReportPage";
import ItemSalesReportPage from "../pages/reports/ItemSalesReportPage";
import DailySalesReportDetailsPage from "../pages/reports/DailySalesReportDetailsPage";
import DailySalesReportPage from "../pages/reports/DailySalesReportPage";
import PaymentModeReportPage from "../pages/reports/PaymentModeReportPage";
import TaxReportPage from "../pages/reports/TaxReportPage";
import AllOrdersPage from "../pages/orders/AllOrdersPage";
import UserDetailsPage from "../pages/users/UserDetailsPage";
import ItemDetailsPage from "../pages/items/ItemDetailsPage";
import ShiftHistoryPage from "../pages/shift/ShiftHistoryPage";
import ShiftHistoryDetailsPage from "../pages/shift/ShiftHistoryDetailsPage";
import AllStationsPage from "../pages/stations/AllStationsPage";
import AllPrintersPage from "../pages/printers/AllPrintersPage";
import SettingDetailsPage from "../pages/settings/SettingDetailsPage";
import RunningOrdersPage from "../pages/reports/RunningOrdersPage";
import ServiceTypeBreakdownReportPage from "../pages/reports/ServiceTypeBreakdownReportPage";
import DayEndSummaryPage from "../pages/reports/DayEndSummaryPage";
import AddOutletPage from "../pages/outlets/AddOutletPage";
import OutletDetails from "../pages/outlets/OutletDetails";
import AllVersionsPage from "../pages/versions/AllVersionsPage";
import AddVersionPage from "../pages/versions/AddVersionPage";
import OrderDisplayPage from "../pages/kitchen-display/OrderDisplayPage";
import AddBulkItemPage from "../pages/items/AddBulkItemPage";
import SetupGuide from "../pages/guide/SetupGuidePage";
import OutletDeletePage from "../pages/outlets/OutletDeletePage";
import AllCustomersPage from "../pages/customers/AllCustomersPage";
import CustomerDetailsPage from "../pages/customers/CustomerDetailsPage";
import SectionSalesPage from "../pages/reports/SectionSalesPage";
import StationSalesPage from "../pages/reports/StationSalesPage";
import CancellationReport from "../pages/reports/CancellationReport";
import RunningTablesPage from "../pages/reports/RunningTablesPage";
import DayEndSummaryDetailsPage from "../pages/reports/DayEndSummaryDetailsPage";
import TaxReportDetailsPage from "../pages/reports/TaxReportDetailsPage";
import OutletLogoPage from "../pages/outlets/OutletLogoPage";
import DueReportPage from "../pages/reports/DueReportPage";
import NcReportPage from "../pages/reports/NcReportPage";
import AllNcReasonsPage from "../pages/nc/AllNcReasonsPage";
import AllUnitsPage from "../pages/inventory/AllUnitsPage";
import AllVendorsPage from "../pages/inventory/AllVendorsPage";
import AddVendorPage from "../pages/inventory/AddVendorPage";
import InventoryCategoryPage from "../pages/inventory/InventoryCategoryPage";
import InventoryItemPage from "../pages/inventory/InventoryItemPage";
import AddInventoryItemPage from "../pages/inventory/AddInventoryItemPage";
import AllPurchaseOrdersPage from "../pages/inventory/AllPurchaseOrdersPage";
import AddPurchaseOrdersPage from "../pages/inventory/AddPurchaseOrdersPage";
import PurchaseOrderDetailsPage from "../pages/inventory/PurchaseOrderDetailsPage";
import IngredientsPage from "../pages/receipe/IngredientsPage";
import AddIngredientPage from "../pages/receipe/AddIngredientPage";
import AllRecipePage from "../pages/receipe/AllRecipePage";
import AddRecipePage from "../pages/receipe/AddRecipePage";
import RecipeDetailsPage from "../pages/receipe/RecipeDetailsPage";
import InventoryItemDetailsPage from "../pages/inventory/InventoryItemDetailsPage";
import InventoryMovementsPage from "../pages/inventory/InventoryMovementsPage";
import AllProductionRecipePage from "../pages/receipe/AllProductionRecipePage";
import AddProductionRecipePage from "../pages/receipe/AddProductionRecipePage";
import ProductionRecipeDetailsPage from "../pages/receipe/ProductionRecipeDetailsPage";
import VendorDetailsPage from "../pages/inventory/VendorDetailsPage";
import InventoryItemBatches from "../pages/inventory/InventoryItemBatches";
import inventorySummaryPage from "../pages/inventory/inventorySummaryPage";
import InventoryWastagePage from "../pages/inventory/InventoryWastagePage";
import BulkUploadSummaryPage from "../pages/items/BulkUploadSummaryPage";
import MenuMediaPage from "../pages/items/MenuMediaPage";
import QrCodesPage from "../pages/items/QrCodesPage";
import VersionDetailsPage from "../pages/versions/VersionDetailsPage";
import SupportChatPage from "../pages/support/SupportChatPage";
import LiveOrdersPage from "../pages/orders/LiveOrdersPage";
import DiscountReportPage from "../pages/reports/DiscountReportPage";
import AdjustmentReportPage from "../pages/reports/AdjustmentReportPage";
import AllReportsPage from "../pages/reports/AllReportsPage";
import { ROUTE_PATHS } from "./paths";
import LiveOperationsPage from "../pages/orders/LiveOperationsPage";
import OutsideCollectionReportPage from "../pages/reports/OutsideCollectionReportPage";
import AllRegistrationRequestPage from "../pages/registration-request/AllRegistrationRequestPage";
import TokenActivationLogsPage from "../pages/registration-request/TokenActivationLogsPage";
import TablesQrPage from "../pages/tables/TablesQrPage";
import AllSuperAdminsPage from "../pages/admins/AllSuperAdminsPage";
import AddSuperAdminPage from "../pages/admins/AddSuperAdminPage";
import SuperAdminDashboard from "../pages/dashboard/SuperAdminDashboard";
import AllSubscriptionsListPage from "../pages/subscriptions/AllSubscriptionsListPage";
import SubscriptionGlobalPricingPage from "../pages/subscriptions/SubscriptionGlobalPricingPage";
import SuperAdminSubcriptionPricingPage from "../pages/subscriptions/SuperAdminSubcriptionPricingPage";
import AddRegistrationRequestPage from "../pages/registration-request/AddRegistrationRequestPage";
import AllTaxComponentsPage from "../pages/settings/taxes/AllTaxComponentsPage";
import AllTaxTypesPage from "../pages/settings/taxes/AllTaxTypesPage";
import SubscriptionDashboard from "../pages/subscriptions/SubscriptionDashboard";
import MySubscriptionPage from "../pages/subscriptions/MySubscriptionPage";
import SuperAdminOutletsPricingPage from "../pages/subscriptions/SuperAdminOutletsPricingPage";
import MyProfilePage from "../pages/profile/MyProfilePage";

const routeConfig = [
  {
    path: ROUTE_PATHS.HOME,
    elements: {
      [ROLES.MASTER]: SuperAdminDashboard,
      [ROLES.SUPER_ADMIN]: SuperAdminDashboard,
      [ROLES.ADMIN]: Dashboard,
      [ROLES.MANAGER]: Dashboard,
      [ROLES.KITCHEN]: OrderDashboard,
      [ROLES.BARTENDER]: OrderDashboard,
    },
    roles: [ROLES.MASTER,ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER, ROLES.KITCHEN, ROLES.BARTENDER],
  },
  {path: ROUTE_PATHS.OUTLET_DASHBOARD, element: Dashboard, roles: [ROLES.MASTER, ROLES.SUPER_ADMIN],},

  { path: ROUTE_PATHS.ORDER_DISPLAY, element: OrderDisplayPage, roles: [ROLES.BARTENDER, ROLES.KITCHEN] },

  { path: ROUTE_PATHS.MY_PROFILE, element: MyProfilePage, public:true,},

  // Reports
  { path: ROUTE_PATHS.ALL_REPORTS, element: AllReportsPage, roles: [ROLES.MASTER,ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER] },
  { path: ROUTE_PATHS.REPORTS_DAILY_SALES, element: DailySalesReportPage, roles: [ROLES.MASTER,ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER] },
  { path: ROUTE_PATHS.REPORTS_DAILY_SALES_DETAILS, element: DailySalesReportDetailsPage, roles: [ROLES.MASTER,ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER] },
  { path: ROUTE_PATHS.REPORTS_ITEM_SALES, element: ItemSalesReportPage, roles: [ROLES.MASTER,ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER] },
  { path: ROUTE_PATHS.REPORTS_CATEGORY_SALES, element: CategorySalesReportPage, roles: [ROLES.MASTER,ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER] },
  { path: ROUTE_PATHS.REPORTS_SECTION_SALES, element: SectionSalesPage, roles: [ROLES.MASTER,ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER] },
  { path: ROUTE_PATHS.REPORTS_STATION_SALES, element: StationSalesPage, roles: [ROLES.MASTER,ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER] },
  { path: ROUTE_PATHS.REPORTS_STAFF_SALES, element: StaffSalesReportPage, roles: [ROLES.MASTER,ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER] },
  { path: ROUTE_PATHS.REPORTS_PAYMENT_MODE, element: PaymentModeReportPage, roles: [ROLES.MASTER,ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER] },
  { path: ROUTE_PATHS.REPORTS_TAX, element: TaxReportPage, roles: [ROLES.MASTER,ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER] },
  { path: ROUTE_PATHS.REPORTS_TAX_DETAILS, element: TaxReportDetailsPage, roles: [ROLES.MASTER,ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER] },
  { path: ROUTE_PATHS.REPORTS_SERVICE_TYPE_BREAKDOWN, element: ServiceTypeBreakdownReportPage, roles: [ROLES.MASTER,ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER] },
  { path: ROUTE_PATHS.REPORTS_OUTSIDE_COLLECTION, element: OutsideCollectionReportPage, roles: [ROLES.MASTER,ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER] },
  { path: ROUTE_PATHS.REPORTS_SHIFT_HISTORY, element: ShiftHistoryPage, roles: [ROLES.MASTER,ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER] },
  { path: ROUTE_PATHS.REPORTS_SHIFT_HISTORY_DETAILS, element: ShiftHistoryDetailsPage, roles: [ROLES.MASTER,ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER] },
  { path: ROUTE_PATHS.REPORTS_DUE, element: DueReportPage, roles: [ROLES.MASTER,ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER] },
  { path: ROUTE_PATHS.REPORTS_NC, element: NcReportPage, roles: [ROLES.MASTER,ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER] },
  { path: ROUTE_PATHS.REPORTS_CANCELLATION, element: CancellationReport, roles: [ROLES.MASTER,ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER] },
  { path: ROUTE_PATHS.REPORTS_DISCOUNT, element: DiscountReportPage, roles: [ROLES.MASTER,ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER] },
  { path: ROUTE_PATHS.REPORTS_ADJUSTMENT, element: AdjustmentReportPage, roles: [ROLES.MASTER,ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER] },
  { path: ROUTE_PATHS.REPORTS_RUNNING_ORDERS, element: RunningOrdersPage, roles: [ROLES.MASTER,ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER] },
  { path: ROUTE_PATHS.REPORTS_RUNNING_TABLES, element: RunningTablesPage, roles: [ROLES.MASTER,ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER] },
  { path: ROUTE_PATHS.REPORTS_DAY_END_SUMMARY, element: DayEndSummaryPage, roles: [ROLES.MASTER,ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER] },
  { path: ROUTE_PATHS.REPORTS_DAY_END_SUMMARY_DETAILS, element: DayEndSummaryDetailsPage, roles: [ROLES.MASTER,ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER] },
  { path: ROUTE_PATHS.REPORTS_LIVE_ORDERS, element: LiveOrdersPage, roles: [ROLES.MASTER,ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER] },
  { path: ROUTE_PATHS.REPORTS_LIVE_OPERATIONS, element: LiveOperationsPage, roles: [ROLES.MASTER,ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER] },

  // NC Reasons
  { path: ROUTE_PATHS.ALL_NC_REASONS, element: AllNcReasonsPage, roles: [ROLES.MASTER,ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER] },

  // Inventory
  { path: ROUTE_PATHS.INVENTORY_SUMMARY, element: inventorySummaryPage, roles: [ROLES.MASTER,ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER] },
  { path: ROUTE_PATHS.ALL_INVENTORY_UNITS, element: AllUnitsPage, roles: [ROLES.MASTER,ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER] },
  { path: ROUTE_PATHS.ALL_VENDORS, element: AllVendorsPage, roles: [ROLES.MASTER,ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER] },
  { path: ROUTE_PATHS.VENDORS_ADD, element: AddVendorPage, roles: [ROLES.MASTER,ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER] },
  { path: ROUTE_PATHS.VENDORS_DETAILS, element: VendorDetailsPage, roles: [ROLES.MASTER,ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER] },
  { path: ROUTE_PATHS.ALL_INVENTORY_CATEGORIES, element: InventoryCategoryPage, roles: [ROLES.MASTER,ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER] },
  { path: ROUTE_PATHS.ALL_INVENTORY_ITEMS, element: InventoryItemPage, roles: [ROLES.MASTER,ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER] },
  { path: ROUTE_PATHS.INVENTORY_ITEMS_ADD, element: AddInventoryItemPage, roles: [ROLES.MASTER,ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER] },
  { path: ROUTE_PATHS.INVENTORY_ITEMS_DETAILS, element: InventoryItemDetailsPage, roles: [ROLES.MASTER,ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER] },
  { path: ROUTE_PATHS.INVENTORY_ITEMS_BATCHES, element: InventoryItemBatches, roles: [ROLES.MASTER,ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER] },
  { path: ROUTE_PATHS.ALL_INVENTORY_MOVEMENTS, element: InventoryMovementsPage, roles: [ROLES.MASTER,ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER] },
  { path: ROUTE_PATHS.ALL_INVENTORY_WASTAGE, element: InventoryWastagePage, roles: [ROLES.MASTER,ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER] },
  { path: ROUTE_PATHS.ALL_PURCHASE_ORDERS, element: AllPurchaseOrdersPage, roles: [ROLES.MASTER,ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER] },
  { path: ROUTE_PATHS.PURCHASE_ORDERS_DETAILS, element: PurchaseOrderDetailsPage, roles: [ROLES.MASTER,ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER] },
  { path: ROUTE_PATHS.PURCHASE_ORDERS_ADD, element: AddPurchaseOrdersPage, roles: [ROLES.MASTER,ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER] },
  { path: ROUTE_PATHS.ALL_INVENTORY_INGREDIENTS, element: IngredientsPage, roles: [ROLES.MASTER,ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER] },
  { path: ROUTE_PATHS.INVENTORY_INGREDIENTS_ADD, element: AddIngredientPage, roles: [ROLES.MASTER,ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER] },

  // Recipes
  { path: ROUTE_PATHS.ALL_RECIPES, element: AllRecipePage, roles: [ROLES.MASTER,ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER] },
  { path: ROUTE_PATHS.RECIPES_ADD, element: AddRecipePage, roles: [ROLES.MASTER,ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER] },
  { path: ROUTE_PATHS.RECIPES_DETAILS, element: RecipeDetailsPage, roles: [ROLES.MASTER,ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER] },
  { path: ROUTE_PATHS.ALL_PREP_RECIPES, element: AllProductionRecipePage, roles: [ROLES.MASTER,ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER] },
  { path: ROUTE_PATHS.PREP_RECIPES_ADD, element: AddProductionRecipePage, roles: [ROLES.MASTER,ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER] },
  { path: ROUTE_PATHS.PREP_RECIPES_DETAILS, element: ProductionRecipeDetailsPage, roles: [ROLES.MASTER,ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER] },

  // Organization
  { path: ROUTE_PATHS.ALL_OUTLETS, element: AllOutletsPage, roles: [ROLES.MASTER,ROLES.SUPER_ADMIN, ROLES.ADMIN] },
  { path: ROUTE_PATHS.OUTLET_LOGO, element: OutletLogoPage, roles: [ROLES.MASTER,ROLES.SUPER_ADMIN, ROLES.ADMIN] },
  { path: ROUTE_PATHS.OUTLET_DETAILS, element: OutletDetails, roles: [ROLES.MASTER,ROLES.SUPER_ADMIN, ROLES.ADMIN] },
  { path: ROUTE_PATHS.OUTLET_ADD, element: AddOutletPage, roles: [ROLES.MASTER,ROLES.SUPER_ADMIN] },
  { path: ROUTE_PATHS.OUTLET_DELETE, element: OutletDeletePage, roles: [ROLES.MASTER,ROLES.SUPER_ADMIN] },
  { path: ROUTE_PATHS.REGISTRATION_REQUESTS, element: AllRegistrationRequestPage, roles: [ROLES.MASTER,ROLES.SUPER_ADMIN] },
  { path: ROUTE_PATHS.REGISTRATION_REQUESTS_ADD, element: AddRegistrationRequestPage, roles: [ROLES.MASTER,ROLES.SUPER_ADMIN] },
  { path: ROUTE_PATHS.TOKEN_GENERATION_LOGS, element: TokenActivationLogsPage, roles: [ROLES.MASTER,ROLES.SUPER_ADMIN] },

  // Menu Management
  { path: ROUTE_PATHS.ALL_MENU_CATEGORIES, element: AllCategoriesPage, roles: [ROLES.MASTER,ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER] },
  { path: ROUTE_PATHS.MENU_MEDIA, element: MenuMediaPage, roles: [ROLES.MASTER,ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER] },
  { path: ROUTE_PATHS.MENU_MEDIA_QR_CODES, element: QrCodesPage, roles: [ROLES.MASTER,ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER] },
  { path: ROUTE_PATHS.ALL_MENU_ITEMS, element: AllItemsPage, roles: [ROLES.MASTER,ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER] },
  { path: ROUTE_PATHS.MENU_ITEMS_DETAILS, element: ItemDetailsPage, roles: [ROLES.MASTER,ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER] },
  { path: ROUTE_PATHS.MENU_ITEMS_ADD, element: AddItemPage, roles: [ROLES.MASTER,ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER] },
  { path: ROUTE_PATHS.MENU_ITEMS_BULK_ADD, element: AddBulkItemPage, roles: [ROLES.MASTER,ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER] },
  { path: ROUTE_PATHS.MENU_ITEMS_BULK_ADD_SUMMARY, element: BulkUploadSummaryPage, roles: [ROLES.MASTER,ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER] },
  { path: ROUTE_PATHS.ALL_ADDONS_GROUPS, element: AllAddonsGroup, roles: [ROLES.MASTER,ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER] },
  { path: ROUTE_PATHS.ALL_ADDONS_ITEMS, element: AllAddonItemsPage, roles: [ROLES.MASTER,ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER] },
  { path: ROUTE_PATHS.ALL_TAX_TYPES, element: AllTaxTypesPage, roles: [ROLES.MASTER,ROLES.SUPER_ADMIN, ROLES.ADMIN] },
  { path: ROUTE_PATHS.ALL_TAX_COMPONENTS, element: AllTaxComponentsPage, roles: [ROLES.MASTER,ROLES.SUPER_ADMIN, ROLES.ADMIN] },
  { path: ROUTE_PATHS.ALL_TAX_GROUPS, element: AllTaxGroupsPage, roles: [ROLES.MASTER,ROLES.SUPER_ADMIN, ROLES.ADMIN] },
  { path: ROUTE_PATHS.TAX_GROUPS_DETAILS, element: TaxGroupDetailsPage, roles: [ROLES.MASTER,ROLES.SUPER_ADMIN, ROLES.ADMIN] },

  // Operations
  { path: ROUTE_PATHS.ALL_STATIONS, element: AllStationsPage, roles: [ROLES.MASTER,ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER] },
  { path: ROUTE_PATHS.ALL_PRINTERS, element: AllPrintersPage, roles: [ROLES.MASTER,ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER] },
  { path: ROUTE_PATHS.ALL_FLOORS, element: AllFloorsPage, roles: [ROLES.MASTER,ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER] },
  { path: ROUTE_PATHS.FLOORS_TABLES, element: AllTablesPage, roles: [ROLES.MASTER,ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER] },
  { path: ROUTE_PATHS.ALL_TABLE_QR, element: TablesQrPage, roles: [ROLES.MASTER,ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER] },
  { path: ROUTE_PATHS.FLOORS_SECTIONS_TABLES, element: AllTablesPage, roles: [ROLES.MASTER,ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER] },
  { path: ROUTE_PATHS.ALL_USERS, element: AllUsersPage, roles: [ROLES.MASTER,ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER] },
  { path: ROUTE_PATHS.USER_DETAILS, element: UserDetailsPage, roles: [ROLES.MASTER,ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER] },
  { path: ROUTE_PATHS.ALL_SUPER_ADMINS, element: AllSuperAdminsPage, roles: [ROLES.MASTER,ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER] },
  { path: ROUTE_PATHS.SUPER_ADMIN_ADD, element: AddSuperAdminPage, roles: [ROLES.MASTER,ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER] },
  { path: ROUTE_PATHS.USER_ADD, element: AddUserPage, roles: [ROLES.MASTER,ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER] },
  { path: ROUTE_PATHS.ALL_ORDERS, element: AllOrdersPage, roles: [ROLES.MASTER,ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER] },
  { path: ROUTE_PATHS.ORDER_DETAILS, element: OrderDetailsPage, roles: [ROLES.MASTER,ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER] },
  { path: ROUTE_PATHS.TABLE_HISTORY, element: TableHistoryPage, roles: [ROLES.MASTER,ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER] },
  { path: ROUTE_PATHS.TABLE_REPORT, element: TableReportPage, roles: [ROLES.MASTER,ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER] },
  { path: ROUTE_PATHS.TABLE_KOT, element: TableKotPage, roles: [ROLES.MASTER,ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER] },
  { path: ROUTE_PATHS.ALL_CUSTOMERS, element: AllCustomersPage, roles: [ROLES.MASTER,ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER] },
  { path: ROUTE_PATHS.CUSTOMER_DETAILS, element: CustomerDetailsPage, roles: [ROLES.MASTER,ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER] },
  
  
  //Subscriptions
  { path: ROUTE_PATHS.SUBSCRIPTION_DASHBOARD, element: SubscriptionDashboard, roles: [ROLES.MASTER,ROLES.SUPER_ADMIN] },
  { path: ROUTE_PATHS.MY_SUBSCRIPTION, element: MySubscriptionPage, roles: [ROLES.ADMIN,ROLES.MANAGER] },
  { path: ROUTE_PATHS.SUBSCRIPTION_LIST, element: AllSubscriptionsListPage, roles: [ROLES.MASTER] },
  { path: ROUTE_PATHS.SUBSCRIPTION_GLOBAL_PRICING, element: SubscriptionGlobalPricingPage, roles: [ROLES.MASTER] },
  { path: ROUTE_PATHS.SUPER_ADMIN_SUBSCRIPTION_PRICING, element: SuperAdminSubcriptionPricingPage, roles: [ROLES.MASTER] },
  { path: ROUTE_PATHS.SUPER_ADMIN_OUTLET_SUBSCRIPTION, element: SuperAdminOutletsPricingPage, roles: [ROLES.MASTER] },

  // System
  { path: ROUTE_PATHS.ALL_SETTINGS, element: AllSettingsPage, roles: [ROLES.MASTER,ROLES.SUPER_ADMIN, ROLES.ADMIN] },
  { path: ROUTE_PATHS.SETTING_DETAILS, element: SettingDetailsPage, roles: [ROLES.MASTER,ROLES.SUPER_ADMIN, ROLES.ADMIN] },
  { path: ROUTE_PATHS.SUPPORT_CHAT, element: SupportChatPage, roles: [ROLES.MASTER,ROLES.SUPER_ADMIN] },
  { path: ROUTE_PATHS.ALL_VERSIONS, element: AllVersionsPage, roles: [ROLES.MASTER,ROLES.SUPER_ADMIN] },
  { path: ROUTE_PATHS.VERSION_ADD, element: AddVersionPage, roles: [ROLES.MASTER,ROLES.SUPER_ADMIN] },
  { path: ROUTE_PATHS.VERSION_DETAILS, element: VersionDetailsPage, roles: [ROLES.MASTER,ROLES.SUPER_ADMIN] },

  // Public
  { path: ROUTE_PATHS.GUIDE, element: SetupGuide, public: true },
];

export default routeConfig;