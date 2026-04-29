import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import UnitServices from "../services/UnitServices";

// Fetch all units
export const fetchAllUnits = createAsyncThunk(
  "/fetch/units",
  async (outletId) => {
    const res = await UnitServices.getAllUnitsApi(outletId);
    return res.data;
  },
);

// Create unit
export const createUnit = createAsyncThunk(
  "/create/unit",
  async ({ outletId, values }) => {
    const res = await UnitServices.createUnitApi(outletId, values);
    return res.data;
  },
);

// Update unit
export const updateUnit = createAsyncThunk(
  "/update/unit",
  async ({ id, values }) => {
    const res = await UnitServices.updateUnitApi(id, values);
    return res.data;
  },
);

const unitSlice = createSlice({
  name: "unit",
  initialState: {
    isFetchingUnits: false,
    isCreatingUnit: false,
    isUpdatingUnit: false,
    allUnits: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetch all units
      .addCase(fetchAllUnits.pending, (state) => {
        state.isFetchingUnits = true;
      })
      .addCase(fetchAllUnits.fulfilled, (state, action) => {
        state.isFetchingUnits = false;
        state.allUnits = action.payload;
      })
      .addCase(fetchAllUnits.rejected, (state, action) => {
        state.isFetchingUnits = false;
        toast.error(action.error.message);
      })

      // create unit
      .addCase(createUnit.pending, (state) => {
        state.isCreatingUnit = true;
      })
      .addCase(createUnit.fulfilled, (state, action) => {
        state.isCreatingUnit = false;
        toast.success(action.payload.message);
      })
      .addCase(createUnit.rejected, (state, action) => {
        state.isCreatingUnit = false;
        toast.error(action.error.message);
      })

      // update unit
      .addCase(updateUnit.pending, (state) => {
        state.isUpdatingUnit = true;
      })
      .addCase(updateUnit.fulfilled, (state, action) => {
        state.isUpdatingUnit = false;
        toast.success(action.payload.message);
      })
      .addCase(updateUnit.rejected, (state, action) => {
        state.isUpdatingUnit = false;
        toast.error(action.error.message);
      });
  },
});

// Export reducer
const { reducer } = unitSlice;
export default reducer;
