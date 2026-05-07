import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import TaxServices from "../services/TaxServices";

export const fetchAllTaxGroups = createAsyncThunk(
  "/fetch/tax/groups",
  async (outletId) => {
    const res = await TaxServices.getAllTaxGroupsApi(outletId);
    return res.data;
  },
);
export const fetchTaxGroupById = createAsyncThunk(
  "/fetch/tax/group/:id",
  async (id) => {
    const res = await TaxServices.getTaxGroupByIdApi(id);
    return res.data;
  },
);
export const createTaxGroup = createAsyncThunk(
  "/create/tax/group",
  async (values) => {
    const res = await TaxServices.createTaxGroupApi(values);
    return res.data;
  },
);
export const updateTaxGroup = createAsyncThunk(
  "/update/tax/group",
  async ({ id, values }) => {
    const res = await TaxServices.updateTaxGroupApi(id, values);
    return res.data;
  },
);
export const fetchAllTaxTypes = createAsyncThunk(
  "/fetch/tax/types",
  async () => {
    const res = await TaxServices.getAllTaxTypesApi();
    return res.data;
  },
);
export const createTaxType = createAsyncThunk(
  "/create/tax/type",
  async ({ values }) => {
    const res = await TaxServices.createTaxTypesApi({ values });
    return res.data;
  },
);
export const fetchAllTaxComponents = createAsyncThunk(
  "/fetch/tax/components",
  async () => {
    const res = await TaxServices.getAllTaxComponentsApi();
    return res.data;
  },
);
export const createTaxComponent = createAsyncThunk(
  "/create/tax/component",
  async ({ values }) => {
    const res = await TaxServices.createTaxComponentApi({ values });
    return res.data;
  },
);
export const updateTaxComponent = createAsyncThunk(
  "/update/tax/component",
  async ({ id, values }) => {
    const res = await TaxServices.updateTaxComponentApi({ id, values });
    return res.data;
  },
);

const taxSlice = createSlice({
  name: "tax",
  initialState: {
    loading: false,
    allTaxGroup: null,
    isFetchingTaxGroupDetails: false,
    taxGroupDetails: null,
    isCreatingTaxGroup: false,
    isUpdatingTaxGroup: false,
    isFetchingTaxTypes: false,
    allTaxTypes: null,
    isCreatingTaxType: false,
    isFetchingTaxComponents: false,
    taxComponents: null,
    isCreatingTaxComponent: false,
    isUpdatingTaxComponent: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllTaxGroups.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllTaxGroups.fulfilled, (state, action) => {
        state.loading = false;
        state.allTaxGroup = action.payload.data;
      })
      .addCase(fetchAllTaxGroups.rejected, (state, action) => {
        state.loading = false;
        toast.error(action.error.message);
      })
      .addCase(fetchTaxGroupById.pending, (state) => {
        state.isFetchingTaxGroupDetails = true;
      })
      .addCase(fetchTaxGroupById.fulfilled, (state, action) => {
        state.isFetchingTaxGroupDetails = false;
        state.taxGroupDetails = action.payload.data;
      })
      .addCase(fetchTaxGroupById.rejected, (state, action) => {
        state.isFetchingTaxGroupDetails = false;
        toast.error(action.error.message);
      })

      .addCase(createTaxGroup.pending, (state) => {
        state.isCreatingTaxGroup = true;
      })
      .addCase(createTaxGroup.fulfilled, (state, action) => {
        state.isCreatingTaxGroup = false;
        toast.success(action.payload.message);
      })
      .addCase(createTaxGroup.rejected, (state, action) => {
        state.isCreatingTaxGroup = false;
        toast.error(action.error.message);
      })
      .addCase(updateTaxGroup.pending, (state) => {
        state.isUpdatingTaxGroup = true;
      })
      .addCase(updateTaxGroup.fulfilled, (state, action) => {
        state.isUpdatingTaxGroup = false;
        toast.success(action.payload.message);
      })
      .addCase(updateTaxGroup.rejected, (state, action) => {
        state.isUpdatingTaxGroup = false;
        toast.error(action.error.message);
      })
      .addCase(fetchAllTaxTypes.pending, (state) => {
        state.isFetchingTaxTypes = true;
      })
      .addCase(fetchAllTaxTypes.fulfilled, (state, action) => {
        state.isFetchingTaxTypes = false;
        state.allTaxTypes = action.payload.data;
      })
      .addCase(fetchAllTaxTypes.rejected, (state, action) => {
        state.isFetchingTaxTypes = false;
        toast.error(action.error.message);
      })
      .addCase(createTaxType.pending, (state) => {
        state.isCreatingTaxType = true;
      })
      .addCase(createTaxType.fulfilled, (state, action) => {
        state.isCreatingTaxType = false;
        toast.success(action.payload.message);
      })
      .addCase(createTaxType.rejected, (state, action) => {
        state.isCreatingTaxType = false;
        toast.error(action.error.message);
      })

      .addCase(fetchAllTaxComponents.pending, (state) => {
        state.isFetchingTaxComponents = true;
      })
      .addCase(fetchAllTaxComponents.fulfilled, (state, action) => {
        state.isFetchingTaxComponents = false;
        state.taxComponents = action.payload.data;
      })
      .addCase(fetchAllTaxComponents.rejected, (state, action) => {
        state.isFetchingTaxComponents = false;
        toast.error(action.error.message);
      })
      .addCase(createTaxComponent.pending, (state) => {
        state.isCreatingTaxComponent = true;
      })
      .addCase(createTaxComponent.fulfilled, (state, action) => {
        state.isCreatingTaxComponent = false;
        toast.success(action.payload.message);
      })
      .addCase(createTaxComponent.rejected, (state, action) => {
        state.isCreatingTaxComponent = false;
        toast.error(action.error.message);
      })
      .addCase(updateTaxComponent.pending, (state) => {
        state.isUpdatingTaxComponent = true;
      })
      .addCase(updateTaxComponent.fulfilled, (state, action) => {
        state.isUpdatingTaxComponent = false;
        toast.success(action.payload.message);
      })
      .addCase(updateTaxComponent.rejected, (state, action) => {
        state.isUpdatingTaxComponent = false;
        toast.error(action.error.message);
      })
  },
});

// Export reducer
const { reducer } = taxSlice;
export default reducer;
