import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import InventoryServices from "../services/InventoryServices";

// Fetch inventory stock summary
export const fetchStockSummary = createAsyncThunk(
  "/fetch/stock/summary",
  async (outletId) => {
    const res = await InventoryServices.getStockSummaryApi(outletId);
    return res.data;
  },
);

// Fetch all inventory categories
export const fetchAllInventoryCategories = createAsyncThunk(
  "/fetch/inventory/categories",
  async (outletId) => {
    const res = await InventoryServices.getAllInventoryCategoryApi(outletId);
    return res.data;
  },
);

// Create inventory category
export const createInventoryCategory = createAsyncThunk(
  "/create/inventory/category",
  async ({ outletId, values }) => {
    const res = await InventoryServices.createInventoryCategoryApi(
      outletId,
      values,
    );
    return res.data;
  },
);

// Update inventory category
export const updateInventoryCategory = createAsyncThunk(
  "/update/inventory/category",
  async ({ id, values }) => {
    const res = await InventoryServices.updateInventoryCategoryApi(id, values);
    return res.data;
  },
);

// Fetch all inventory items
export const fetchAllInventoryItems = createAsyncThunk(
  "/fetch/inventory/items",
  async ({ outletId, page, limit, search }) => {
    const res = await InventoryServices.getAllInventoryItemApi(
      outletId,
      page,
      limit,
      search,
    );
    return res.data;
  },
);

// Fetch inventory items details
export const fetchInventoryItemById = createAsyncThunk(
  "/fetch/inventory/item",
  async (id) => {
    const res = await InventoryServices.getInventoryItemByIdApi(id);
    return res.data;
  },
);

// Create inventory item
export const createInventoryItem = createAsyncThunk(
  "/create/inventory/item",
  async ({ outletId, values }) => {
    const res = await InventoryServices.createInventoryItemApi(
      outletId,
      values,
    );
    return res.data;
  },
);

// Update inventory item
export const updateInventoryItem = createAsyncThunk(
  "/update/inventory/item",
  async ({ id, values }) => {
    const res = await InventoryServices.updateInventoryItemApi(id, values);
    return res.data;
  },
);

// create purchase
export const createPurchase = createAsyncThunk(
  "/create/purchase",
  async ({ outletId, values }) => {
    const res = await InventoryServices.createPurchaseApi(outletId, values);
    return res.data;
  },
);

// fetch All purchases
export const fetchAllPurchase = createAsyncThunk(
  "/fetch/purchases",
  async ({ outletId, page, limit, search, dateRange }) => {
    const res = await InventoryServices.getAllPurchaseApi(
      outletId,
      page,
      limit,
      search,
      dateRange,
    );
    return res.data;
  },
);

// fetch purchase details
export const fetchPurchaseById = createAsyncThunk(
  "/fetch/purchase/:id",
  async (id) => {
    const res = await InventoryServices.getPurchaseByIdApi(id);
    return res.data;
  },
);

// update purchases payment
export const updatePurchasePayment = createAsyncThunk(
  "/update/purchases/payment",
  async ({ id, values }) => {
    const res = await InventoryServices.updatePurchasePaymentApi(id, values);
    return res.data;
  },
);

// cancel purchases payment
export const cancelPurchase = createAsyncThunk(
  "/cancel/purchases",
  async ({ id, reason }) => {
    const res = await InventoryServices.cancelPurchaseApi(id, reason);
    return res.data;
  },
);

// items movements
export const fetchAllMovements = createAsyncThunk(
  "/fetch/movements",
  async ({ outletId, page, limit, dateRange, search, type }) => {
    const res = await InventoryServices.getAllMovementsApi(
      outletId,
      page,
      limit,
      dateRange,
      search,
      type,
    );
    return res.data;
  },
);

// create adjustment
export const createAdjustment = createAsyncThunk(
  "/create/adjustment",
  async ({ outletId, values }) => {
    const res = await InventoryServices.createAdjustmentApi(outletId, values);
    return res.data;
  },
);

// create wastage
export const createWastage = createAsyncThunk(
  "/create/wastage",
  async ({ outletId, values }) => {
    const res = await InventoryServices.createWastageApi(outletId, values);
    return res.data;
  },
);

// wastage logs
export const fetchWastageLogs = createAsyncThunk(
  "/fetch/wastage/logs",
  async ({ outletId, search, page, limit, dateRange }) => {
    const res = await InventoryServices.getAllWastageLogsApi({
      outletId,
      search,
      page,
      limit,
      dateRange,
    });
    return res.data;
  },
);

const inventorySlice = createSlice({
  name: "inventory",
  initialState: {
    isFetchingStockSummary: false,
    stockSummary: null,

    isFetchingCategories: false,
    isCreatingCategory: false,
    isUpdatingCategory: false,

    isFetchingItems: false,
    isCreatingItem: false,
    isUpdatingItem: false,

    allCategories: null,
    allItemsData: null,

    inventoryItemDetails: null,
    isFetchingItemDetails: false,

    isCreatingPurchase: false,
    isFetchingPurchase: false,
    allPurchaseData: null,

    isUpdatingPurchasePayment: false,
    isCancellingPurchase: false,

    isFetchingPurchaseDetails: false,
    purchaseDetails: null,

    isFetchingMovements: false,
    allMovements: null,

    //  in initialState
    isCreatingAdjustment: false,
    isCreatingWastage: false,

    isFetchingWastageLogs: false,
    allWastageLogs: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder

      // fetch stock summary
      .addCase(fetchStockSummary.pending, (state) => {
        state.isFetchingStockSummary = true;
      })
      .addCase(fetchStockSummary.fulfilled, (state, action) => {
        state.isFetchingStockSummary = false;
        state.stockSummary = action.payload;
      })
      .addCase(fetchStockSummary.rejected, (state, action) => {
        state.isFetchingStockSummary = false;
        toast.error(action.error.message);
      })

      // fetch categories
      .addCase(fetchAllInventoryCategories.pending, (state) => {
        state.isFetchingCategories = true;
      })
      .addCase(fetchAllInventoryCategories.fulfilled, (state, action) => {
        state.isFetchingCategories = false;
        state.allCategories = action.payload;
      })
      .addCase(fetchAllInventoryCategories.rejected, (state, action) => {
        state.isFetchingCategories = false;
        toast.error(action.error.message);
      })

      // create category
      .addCase(createInventoryCategory.pending, (state) => {
        state.isCreatingCategory = true;
      })
      .addCase(createInventoryCategory.fulfilled, (state, action) => {
        state.isCreatingCategory = false;
        toast.success(action.payload.message);
      })
      .addCase(createInventoryCategory.rejected, (state, action) => {
        state.isCreatingCategory = false;
        toast.error(action.error.message);
      })

      // update category
      .addCase(updateInventoryCategory.pending, (state) => {
        state.isUpdatingCategory = true;
      })
      .addCase(updateInventoryCategory.fulfilled, (state, action) => {
        state.isUpdatingCategory = false;
        toast.success(action.payload.message);
      })
      .addCase(updateInventoryCategory.rejected, (state, action) => {
        state.isUpdatingCategory = false;
        toast.error(action.error.message);
      })

      // fetch items
      .addCase(fetchAllInventoryItems.pending, (state) => {
        state.isFetchingItems = true;
      })
      .addCase(fetchAllInventoryItems.fulfilled, (state, action) => {
        state.isFetchingItems = false;
        state.allItemsData = action.payload;
      })
      .addCase(fetchAllInventoryItems.rejected, (state, action) => {
        state.isFetchingItems = false;
        toast.error(action.error.message);
      })

      // fetch item by id
      .addCase(fetchInventoryItemById.pending, (state) => {
        state.isFetchingItemDetails = true;
      })
      .addCase(fetchInventoryItemById.fulfilled, (state, action) => {
        state.isFetchingItemDetails = false;
        state.inventoryItemDetails = action.payload.data;
      })
      .addCase(fetchInventoryItemById.rejected, (state, action) => {
        state.isFetchingItemDetails = false;
        toast.error(action.error.message);
      })

      // create item
      .addCase(createInventoryItem.pending, (state) => {
        state.isCreatingItem = true;
      })
      .addCase(createInventoryItem.fulfilled, (state, action) => {
        state.isCreatingItem = false;
        toast.success(action.payload?.message || "Item created successfully");
      })
      .addCase(createInventoryItem.rejected, (state, action) => {
        state.isCreatingItem = false;
        toast.error(action.error.message);
      })

      // update item
      .addCase(updateInventoryItem.pending, (state) => {
        state.isUpdatingItem = true;
      })
      .addCase(updateInventoryItem.fulfilled, (state, action) => {
        state.isUpdatingItem = false;
        toast.success(action.payload?.message || "Item updated successfully");
      })
      .addCase(updateInventoryItem.rejected, (state, action) => {
        state.isUpdatingItem = false;
        toast.error(action.error.message);
      })

      // create purchase
      .addCase(createPurchase.pending, (state) => {
        state.isCreatingPurchase = true;
      })
      .addCase(createPurchase.fulfilled, (state, action) => {
        state.isCreatingPurchase = false;
        toast.success(action.payload.message);
      })
      .addCase(createPurchase.rejected, (state, action) => {
        state.isCreatingPurchase = false;
        toast.error(action.error.message);
      })

      // create purchase
      .addCase(fetchAllPurchase.pending, (state) => {
        state.isFetchingPurchase = true;
      })
      .addCase(fetchAllPurchase.fulfilled, (state, action) => {
        state.isFetchingPurchase = false;
        state.allPurchaseData = action.payload;
      })
      .addCase(fetchAllPurchase.rejected, (state, action) => {
        state.isFetchingPurchase = false;
        toast.error(action.error.message);
      })

      // create purchase
      .addCase(fetchPurchaseById.pending, (state) => {
        state.isFetchingPurchaseDetails = true;
      })
      .addCase(fetchPurchaseById.fulfilled, (state, action) => {
        state.isFetchingPurchaseDetails = false;
        state.purchaseDetails = action.payload.data;
      })
      .addCase(fetchPurchaseById.rejected, (state, action) => {
        state.isFetchingPurchaseDetails = false;
        toast.error(action.error.message);
      })

      // update purchase payment
      .addCase(updatePurchasePayment.pending, (state) => {
        state.isUpdatingPurchasePayment = true;
      })
      .addCase(updatePurchasePayment.fulfilled, (state, action) => {
        state.isUpdatingPurchasePayment = false;
        toast.success(action.payload.message);
      })
      .addCase(updatePurchasePayment.rejected, (state, action) => {
        state.isUpdatingPurchasePayment = false;
        toast.error(action.error.message);
      })

      // cancel purchase
      .addCase(cancelPurchase.pending, (state) => {
        state.isCancellingPurchase = true;
      })
      .addCase(cancelPurchase.fulfilled, (state, action) => {
        state.isCancellingPurchase = false;
        toast.success(action.payload.message);
      })
      .addCase(cancelPurchase.rejected, (state, action) => {
        state.isCancellingPurchase = false;
        toast.error(action.error.message);
      })

      // cancel purchase
      .addCase(fetchAllMovements.pending, (state) => {
        state.isFetchingMovements = true;
      })
      .addCase(fetchAllMovements.fulfilled, (state, action) => {
        state.isFetchingMovements = false;
        state.allMovements = action.payload;
      })
      .addCase(fetchAllMovements.rejected, (state, action) => {
        state.isFetchingMovements = false;
        toast.error(action.error.message);
      })

      // create adjustment
      .addCase(createAdjustment.pending, (state) => {
        state.isCreatingAdjustment = true;
      })
      .addCase(createAdjustment.fulfilled, (state, action) => {
        state.isCreatingAdjustment = false;
        toast.success(action.payload.message);
      })
      .addCase(createAdjustment.rejected, (state, action) => {
        state.isCreatingAdjustment = false;
        toast.error(action.error.message);
      })

      // create wastage
      .addCase(createWastage.pending, (state) => {
        state.isCreatingWastage = true;
      })
      .addCase(createWastage.fulfilled, (state, action) => {
        state.isCreatingWastage = false;
        toast.success(action.payload.message);
      })
      .addCase(createWastage.rejected, (state, action) => {
        state.isCreatingWastage = false;
        toast.error(action.error.message);
      })

      // fetch wastage logs
      .addCase(fetchWastageLogs.pending, (state) => {
        state.isFetchingWastageLogs = true;
      })
      .addCase(fetchWastageLogs.fulfilled, (state, action) => {
        state.isFetchingWastageLogs = false;
        state.allWastageLogs = action.payload.data;
      })
      .addCase(fetchWastageLogs.rejected, (state, action) => {
        state.isFetchingWastageLogs = false;
        toast.error(action.error.message);
      });
  },
});

const { reducer } = inventorySlice;
export default reducer;
