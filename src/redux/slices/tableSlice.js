import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import TableServices from "../services/TableServices";

export const fetchAllTables = createAsyncThunk(
  "/fetch/floor/tables",
  async (id) => {
    const res = await TableServices.getAllTableApi(id);
    return res.data;
  },
);
export const createTable = createAsyncThunk("/create/table", async (values) => {
  const res = await TableServices.createTableApi(values);
  return res.data;
});
export const updateTable = createAsyncThunk(
  "/update/table",
  async ({ id, values }) => {
    const res = await TableServices.updatedTableApi(id, values);
    return res.data;
  },
);
export const mergeTable = createAsyncThunk(
  "/merge/table",
  async ({ id, values }) => {
    const res = await TableServices.mergeTableApi(id, values);
    return res.data;
  },
);
export const splitTable = createAsyncThunk("/split/table", async (id) => {
  const res = await TableServices.splitTableApi(id);
  return res.data;
});
export const fetchTableHistory = createAsyncThunk(
  "/fetch/table/history",
  async (id) => {
    const res = await TableServices.getTableHistoryApi(id);
    return res.data;
  },
);
export const fetchTableReport = createAsyncThunk(
  "/fetch/table/report",
  async (id) => {
    const res = await TableServices.getTableReportApi(id);
    return res.data;
  },
);
export const fetchTableKot = createAsyncThunk(
  "/fetch/table/kot",
  async (id) => {
    const res = await TableServices.getTableKotApi(id);
    return res.data;
  },
);

const tableSlice = createSlice({
  name: "table",
  initialState: {
    loading: false,
    allTables: null,
    isCreatingTable: false,
    isUpdatingTable: false,
    isMergingTable: false,
    tableToSplitId: null,

    isFetchingTableHistory: false,
    isFetchingTableReport: false,
    isFetchingTableKot: false,
    tableHistory: null,
    tableReport: null,
    tableKot: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllTables.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllTables.fulfilled, (state, action) => {
        state.loading = false;
        state.allTables = action.payload.data;
      })
      .addCase(fetchAllTables.rejected, (state, action) => {
        state.loading = false;
        toast.error(action.error.message);
      })
      .addCase(createTable.pending, (state) => {
        state.isCreatingTable = true;
      })
      .addCase(createTable.fulfilled, (state, action) => {
        state.isCreatingTable = false;
        toast.success(action.payload.message);
      })
      .addCase(createTable.rejected, (state, action) => {
        state.isCreatingTable = false;
        toast.error(action.error.message);
      })
      .addCase(updateTable.pending, (state) => {
        state.isUpdatingTable = true;
      })
      .addCase(updateTable.fulfilled, (state, action) => {
        state.isUpdatingTable = false;
        toast.success(action.payload.message);
      })
      .addCase(updateTable.rejected, (state, action) => {
        state.isUpdatingTable = false;
        toast.error(action.error.message);
      })
      .addCase(mergeTable.pending, (state) => {
        state.isMergingTable = true;
      })
      .addCase(mergeTable.fulfilled, (state, action) => {
        state.isMergingTable = false;
        toast.success(action.payload.message);
      })
      .addCase(mergeTable.rejected, (state, action) => {
        state.isMergingTable = false;
        toast.error(action.error.message);
      })
      .addCase(splitTable.pending, (state, action) => {
        state.tableToSplitId = action.meta.arg;
      })
      .addCase(splitTable.fulfilled, (state, action) => {
        state.tableToSplitId = null;
        toast.success(action.payload.message);
      })
      .addCase(splitTable.rejected, (state, action) => {
        state.tableToSplitId = null;
        toast.error(action.error.message);
      })
      .addCase(fetchTableHistory.pending, (state, action) => {
        state.isFetchingTableHistory = true;
      })
      .addCase(fetchTableHistory.fulfilled, (state, action) => {
        state.isFetchingTableHistory = false;
        state.tableHistory = action.payload;
      })
      .addCase(fetchTableHistory.rejected, (state, action) => {
        state.isFetchingTableHistory = false;
        toast.error(action.error.message);
      })
      .addCase(fetchTableReport.pending, (state, action) => {
        state.isFetchingTableReport = true;
      })
      .addCase(fetchTableReport.fulfilled, (state, action) => {
        state.isFetchingTableReport = false;
        state.tableReport = action.payload;
      })
      .addCase(fetchTableReport.rejected, (state, action) => {
        state.isFetchingTableReport = false;
        toast.error(action.error.message);
      })
      .addCase(fetchTableKot.pending, (state, action) => {
        state.isFetchingTableKot = true;
      })
      .addCase(fetchTableKot.fulfilled, (state, action) => {
        state.isFetchingTableKot = false;
        state.tableKot = action.payload;
      })
      .addCase(fetchTableKot.rejected, (state, action) => {
        state.isFetchingTableKot = false;
        toast.error(action.error.message);
      });
  },
});

// Export reducer
const { reducer } = tableSlice;
export default reducer;
