import { configureStore } from "@reduxjs/toolkit";
import authSlice from "../src/redux/slices/authSlice";
import outletSlice from "../src/redux/slices/outletSlice";
import floorSlice from "../src/redux/slices/floorSlice";
import userSlice from "../src/redux/slices/userSlice";
import sectionSlice from "../src/redux/slices/sectionSlice";
import roleSlice from "../src/redux/slices/roleSlice";
import permissionSlice from "../src/redux/slices/permissionSlice";
import tableSlice from "../src/redux/slices/tableSlice";
import categorySlice from "../src/redux/slices/categorySlice";
import itemSlice from "../src/redux/slices/itemSlice";
import taxSlice from "../src/redux/slices/taxSlice";
import kitchenSlice from "../src/redux/slices/kitchenSlice";
import addonSlice from "../src/redux/slices/addonSlice";
import kotSlice from "../src/redux/slices/kotSlice";
import socketSlice from "../src/redux/slices/socketSlice";
import uiSlice from "./redux/slices/uiSlice";
import reportSlice from "./redux/slices/reportSlice";
import dashboardSlice from "./redux/slices/dashboardSlice";
import orderSlice from "./redux/slices/orderSlice";
import shiftSlice from "./redux/slices/shiftSlice";
import stationSlice from "./redux/slices/stationSlice";
import printerSlice from "./redux/slices/printerSlice";
import settingSlice from "./redux/slices/settingSlice";
import versionSlice from "./redux/slices/versionSlice";
import bulkUploadSlice from "./redux/slices/bulkUploadSlice";
import customerSlice from "./redux/slices/customerSlice";
import exportReportSlice from "./redux/slices/exportReportSlice";
import ncSlice from "./redux/slices/ncSlice";
import unitSlice from "./redux/slices/unitSlice";
import vendorSlice from "./redux/slices/vendorSlice";
import inventorySlice from "./redux/slices/inventorySlice";
import ingredientSlice from "./redux/slices/ingredientSlice";
import recipeSlice from "./redux/slices/recipeSlice";
import itemBatchSlice from "./redux/slices/itemBatchSlice";
import menuMediaSlice from "./redux/slices/menuMediaSlice";
import outsideCollectionSlice from "./redux/slices/outsideCollectionSlice";
import registrationSlice from "./redux/slices/registrationSlice";
import publicMenuSlice from "./redux/slices/publicMenuSlice";
import qrSlice from "./redux/slices/qrSlice";
import adminSlice from "./redux/slices/adminSlice";
import superAdminDashboardSlice from "./redux/slices/superAdminDashboardSlice";
import subscriptionSlice from "./redux/slices/subscriptionSlice";
import paymentSlice from "./redux/slices/paymentSlice";
import transactionSlice from "./redux/slices/transactionSlice";

const reducer = {
  auth: authSlice,
  outlet: outletSlice,
  floor: floorSlice,
  user: userSlice,
  section: sectionSlice,
  role: roleSlice,
  permission: permissionSlice,
  table: tableSlice,
  category: categorySlice,
  item: itemSlice,
  tax: taxSlice,
  kitchen: kitchenSlice,
  addon: addonSlice,
  kot: kotSlice,
  socket: socketSlice,
  ui: uiSlice,
  report: reportSlice,
  dashboard: dashboardSlice,
  order: orderSlice,
  shift: shiftSlice,
  station: stationSlice,
  printer: printerSlice,
  setting: settingSlice,
  version: versionSlice,
  bulkUpload: bulkUploadSlice,
  customer: customerSlice,
  exportReport: exportReportSlice,
  nc: ncSlice,
  unit: unitSlice,
  vendor: vendorSlice,
  inventory: inventorySlice,
  ingredient: ingredientSlice,
  recipe: recipeSlice,
  itemBatch: itemBatchSlice,
  menuMedia: menuMediaSlice,
  outsideCollection: outsideCollectionSlice,
  registration: registrationSlice,
  publicMenu: publicMenuSlice,
  qr: qrSlice,
  admin: adminSlice,
  superAdminDashboard: superAdminDashboardSlice,
  subscription: subscriptionSlice,
  payment: paymentSlice,
  transaction: transactionSlice,
};

const store = configureStore({
  reducer,
});

export default store;
