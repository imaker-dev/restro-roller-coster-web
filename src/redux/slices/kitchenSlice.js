import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import KitchenServices from "../services/KitchenServices";

export const fetchAllKitchenStations = createAsyncThunk(
  "/fetch/kitchen/stations",
  async (id) => {
    const res = await KitchenServices.getAllKitchenStationsAPi(id);
    return res.data;
  },
);

const kitchenSlice = createSlice({
  name: "kitchen",
  initialState: {
    loading: false,
    allKitchenStations: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllKitchenStations.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllKitchenStations.fulfilled, (state, action) => {
        state.loading = false;
        state.allKitchenStations = action.payload.data;
      })
      .addCase(fetchAllKitchenStations.rejected, (state, action) => {
        state.loading = false;
        toast.error(action.error.message);
      });
  },
});

// Export reducer
const { reducer } = kitchenSlice;
export default reducer;
