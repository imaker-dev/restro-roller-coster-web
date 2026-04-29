import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import ItemBatchServices from "../services/ItemBatchServices";

// Fetch all ingredients
export const fetchItemBatches = createAsyncThunk(
  "/fetch/item/batches",
  async ({itemId,page,limit}) => {
    const res = await ItemBatchServices.getItemBatchApi(itemId,page,limit);
    return res.data;
  },
);

const itemBatchSlice = createSlice({
  name: "itemBatch",
  initialState: {
    isFetchingItemBatches: false,
    itemBatchData: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder

      // Fetch all ingredients
      .addCase(fetchItemBatches.pending, (state) => {
        state.isFetchingItemBatches = true;
      })
      .addCase(fetchItemBatches.fulfilled, (state, action) => {
        state.isFetchingItemBatches = false;
        state.itemBatchData = action.payload;
      })
      .addCase(fetchItemBatches.rejected, (state, action) => {
        state.isFetchingItemBatches = false;
        toast.error(action.error.message);
      });
  },
});

export default itemBatchSlice.reducer;
