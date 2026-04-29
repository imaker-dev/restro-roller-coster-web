import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import FloorServices from "../services/FloorServices";

export const fetchAllFloors = createAsyncThunk("/fetch/outlets/floors", async (id) => {
  const res = await FloorServices.getAllFloorsApi(id);
  return res.data;
});

export const createFloor = createAsyncThunk("/create/floors", async (values) => {
  const res = await FloorServices.createFloorApi(values);
  return res.data;
});

export const updateFloor = createAsyncThunk("/update/floors", async ({id,values}) => {
  const res = await FloorServices.updateFloorApi(id,values);
  return res.data;
});

const floorSlice = createSlice({
  name: "floor",
  initialState: {
    loading: false,
    allFloors: null,
    isCreatingFloor:false,
    isUpdatingFloor:false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllFloors.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllFloors.fulfilled, (state, action) => {
        state.loading = false;
        state.allFloors = action.payload.data;
      })
      .addCase(fetchAllFloors.rejected, (state, action) => {
        state.loading = false;
        toast.error(action.error.message);
      })
      .addCase(createFloor.pending, (state) => {
        state.isCreatingFloor = true;
      })
      .addCase(createFloor.fulfilled, (state, action) => {
        state.isCreatingFloor = false;
        toast.success(action.payload.message)
      })
      .addCase(createFloor.rejected, (state, action) => {
        state.isCreatingFloor = false;
        toast.error(action.error.message);
      })
      .addCase(updateFloor.pending, (state) => {
        state.isUpdatingFloor = true;
      })
      .addCase(updateFloor.fulfilled, (state, action) => {
        state.isUpdatingFloor = false;
        toast.success(action.payload.message)
      })
      .addCase(updateFloor.rejected, (state, action) => {
        state.isUpdatingFloor = false;
        toast.error(action.error.message);
      })
  },
});

// Export reducer
const { reducer } = floorSlice;
export default reducer;
