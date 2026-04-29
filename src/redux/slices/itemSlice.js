import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import ItemServies from "../services/ItemServies";

export const fetchAllItems = createAsyncThunk(
  "/fetch/all/items",
  async ({
    outletId,
    search,
    page,
    limit,
    categoryId,
    itemType,
    serviceType,
    includeInactive
  }) => {
    const res = await ItemServies.getAllItemsApi(
      outletId,
      search,
      page,
      limit,
      categoryId,
      itemType,
      serviceType,
      includeInactive
    );
    return res.data;
  },
);
export const fetchAllItemsByCategory = createAsyncThunk(
  "/fetch/items/category",
  async (id) => {
    const res = await ItemServies.getAllItemsByCategoryApi(id);
    return res.data;
  },
);
export const fetchItemsById = createAsyncThunk(
  "/fetch/item/:id",
  async (id) => {
    const res = await ItemServies.getItemByIdApi(id);
    return res.data;
  },
);
export const createItem = createAsyncThunk("/create/item", async (values) => {
  const res = await ItemServies.createItemApi(values);
  return res.data;
});
export const updateItem = createAsyncThunk(
  "/update/item",
  async ({ id, values }) => {
    const res = await ItemServies.updateItemApi(id, values);
    return res.data;
  },
);

const itemSlice = createSlice({
  name: "item",
  initialState: {
    loading: false,
    allItems: null,
    isCreatingItem: false,
    isUpdatingItem: false,
    isFetchingItemDetails: false,
    itemDetails: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllItems.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllItems.fulfilled, (state, action) => {
        state.loading = false;
        state.allItems = action.payload;
      })
      .addCase(fetchAllItems.rejected, (state, action) => {
        state.loading = false;
        toast.error(action.error.message);
      })
      .addCase(fetchAllItemsByCategory.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllItemsByCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.allItems = action.payload.data;
      })
      .addCase(fetchAllItemsByCategory.rejected, (state, action) => {
        state.loading = false;
        toast.error(action.error.message);
      })
      .addCase(fetchItemsById.pending, (state) => {
        state.isFetchingItemDetails = true;
      })
      .addCase(fetchItemsById.fulfilled, (state, action) => {
        state.isFetchingItemDetails = false;
        state.itemDetails = action.payload.data;
      })
      .addCase(fetchItemsById.rejected, (state, action) => {
        state.isFetchingItemDetails = false;
        toast.error(action.error.message);
      })
      .addCase(createItem.pending, (state) => {
        state.isCreatingItem = true;
      })
      .addCase(createItem.fulfilled, (state, action) => {
        state.isCreatingItem = false;
        toast.success(action.payload.message);
      })
      .addCase(createItem.rejected, (state, action) => {
        state.isCreatingItem = false;
        toast.error(action.error.message);
      })
      .addCase(updateItem.pending, (state) => {
        state.isUpdatingItem = true;
      })
      .addCase(updateItem.fulfilled, (state, action) => {
        state.isUpdatingItem = false;
        toast.success(action.payload.message);
      })
      .addCase(updateItem.rejected, (state, action) => {
        state.isUpdatingItem = false;
        toast.error(action.error.message);
      });
  },
});

// Export reducer
const { reducer } = itemSlice;
export default reducer;
