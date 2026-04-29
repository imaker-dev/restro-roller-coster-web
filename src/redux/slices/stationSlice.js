import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import StationServices from "../services/StationServices";

export const fetchAllStations = createAsyncThunk("/fetch/stations", async (id) => {
  const res = await StationServices.getAllStationsApi(id);
  return res.data;
});

export const createStation = createAsyncThunk("/create/stations", async (values) => {
  const res = await StationServices.createStationApi(values);
  return res.data;
});

export const updateStation = createAsyncThunk("/update/stations", async ({id,values}) => {
  const res = await StationServices.updateStationApi(id,values);
  return res.data;
});
export const assignStationToUser = createAsyncThunk("/assign/station/user", async ({userId,values}) => {
  const res = await StationServices.assignStationToUserApi(userId,values);
  return res.data;
});
export const removeStationFromUser = createAsyncThunk("/remove/station/user", async ({userId,stationId}) => {
  const res = await StationServices.removeStationFromUserApi(userId,stationId);
  return res.data;
});

const stationSlice = createSlice({
  name: "station",
  initialState: {
    loading: false,
    allStations: null,
    isCreatingStation:false,
    isUpdatingStation:false,
    isAssigningStationToUser:false,
    isRemovingStationToUser:false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllStations.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllStations.fulfilled, (state, action) => {
        state.loading = false;
        state.allStations = action.payload.data;
      })
      .addCase(fetchAllStations.rejected, (state, action) => {
        state.loading = false;
        toast.error(action.error.message);
      })
      .addCase(createStation.pending, (state) => {
        state.isCreatingStation = true;
      })
      .addCase(createStation.fulfilled, (state, action) => {
        state.isCreatingStation = false;
        toast.success(action.payload.message)
      })
      .addCase(createStation.rejected, (state, action) => {
        state.isCreatingStation = false;
        toast.error(action.error.message);
      })
      .addCase(updateStation.pending, (state) => {
        state.isUpdatingStation = true;
      })
      .addCase(updateStation.fulfilled, (state, action) => {
        state.isUpdatingStation = false;
        toast.success(action.payload.message)
      })
      .addCase(updateStation.rejected, (state, action) => {
        state.isUpdatingStation = false;
        toast.error(action.error.message);
      })
      .addCase(assignStationToUser.pending, (state) => {
        state.isAssigningStationToUser = true;
      })
      .addCase(assignStationToUser.fulfilled, (state, action) => {
        state.isAssigningStationToUser = false;
        toast.success(action.payload.message)
      })
      .addCase(assignStationToUser.rejected, (state, action) => {
        state.isAssigningStationToUser = false;
        toast.error(action.error.message);
      })
      .addCase(removeStationFromUser.pending, (state) => {
        state.isRemovingStationToUser = true;
      })
      .addCase(removeStationFromUser.fulfilled, (state, action) => {
        state.isRemovingStationToUser = false;
        toast.success(action.payload.message)
      })
      .addCase(removeStationFromUser.rejected, (state, action) => {
        state.isRemovingStationToUser = false;
        toast.error(action.error.message);
      })
  },
});

// Export reducer
const { reducer } = stationSlice;
export default reducer;
