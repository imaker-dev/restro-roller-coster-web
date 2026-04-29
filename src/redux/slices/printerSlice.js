import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import PrinterServices from "../services/PrinterServices";

export const fetchAllPrinters = createAsyncThunk("/fetch/printers", async (id) => {
  const res = await PrinterServices.getAllPrintersApi(id);
  return res.data;
});

export const createPrinter = createAsyncThunk("/create/printer", async (values) => {
  const res = await PrinterServices.createPrinterApi(values);
  return res.data;
});

export const updatePrinter = createAsyncThunk("/update/printer", async ({id,values}) => {
  const res = await PrinterServices.updatePrinterApi(id,values);
  return res.data;
});
export const testPrinter = createAsyncThunk("/test/printer", async ({outletId,station,printerId}) => {
  const res = await PrinterServices.testPrinterApi(outletId,station,printerId);
  return res.data;
});

const printerSlice = createSlice({
  name: "printer",
  initialState: {
    loading: false,
    allPrinters: null,
    isCreatingPrinter:false,
    isUpdatingPrinter:false,
    printerTestingId:null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllPrinters.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllPrinters.fulfilled, (state, action) => {
        state.loading = false;
        state.allPrinters = action.payload.data;
      })
      .addCase(fetchAllPrinters.rejected, (state, action) => {
        state.loading = false;
        toast.error(action.error.message);
      })
      .addCase(createPrinter.pending, (state) => {
        state.isCreatingPrinter = true;
      })
      .addCase(createPrinter.fulfilled, (state, action) => {
        state.isCreatingPrinter = false;
        toast.success(action.payload.message)
      })
      .addCase(createPrinter.rejected, (state, action) => {
        state.isCreatingPrinter = false;
        toast.error(action.error.message);
      })
      .addCase(updatePrinter.pending, (state) => {
        state.isUpdatingPrinter = true;
      })
      .addCase(updatePrinter.fulfilled, (state, action) => {
        state.isUpdatingPrinter = false;
        toast.success(action.payload.message)
      })
      .addCase(updatePrinter.rejected, (state, action) => {
        state.isUpdatingPrinter = false;
        toast.error(action.error.message);
      })
      .addCase(testPrinter.pending, (state,action) => {
        state.printerTestingId = action.meta.arg.station;
      })
      .addCase(testPrinter.fulfilled, (state, action) => {
        state.printerTestingId = null;
        toast.success(action.payload.message)
      })
      .addCase(testPrinter.rejected, (state, action) => {
        state.printerTestingId = null;
        toast.error(action.error.message);
      })
  },
});

// Export reducer
const { reducer } = printerSlice;
export default reducer;
