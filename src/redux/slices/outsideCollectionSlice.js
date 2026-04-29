import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import OutsideCollectionServices from "../services/OutsideCollectionServices";

export const fetchAllOutsideCollection = createAsyncThunk(
  "/fetch/all/outside/collection",
  async ({ outletId, dateRange }) => {
    const res = await OutsideCollectionServices.getAllOutsideCollectionsApi({
      outletId,
      dateRange,
    });
    return res.data;
  },
);

const outsideCollectionSlice = createSlice({
  name: "outsideCollection",
  initialState: {
    isFetchingOutsideCollection: false,
    outsideCollections: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllOutsideCollection.pending, (state) => {
        state.isFetchingOutsideCollection = true;
      })
      .addCase(fetchAllOutsideCollection.fulfilled, (state, action) => {
        state.isFetchingOutsideCollection = false;
        state.outsideCollections = action.payload.data;
      })
      .addCase(fetchAllOutsideCollection.rejected, (state, action) => {
        state.isFetchingOutsideCollection = false;
        toast.error(action.error.message);
      });
  },
});

// Export reducer
const { reducer } = outsideCollectionSlice;
export default reducer;
