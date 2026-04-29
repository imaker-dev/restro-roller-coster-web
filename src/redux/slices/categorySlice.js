import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import CategoryServices from "../services/CategoryServices";

export const fetchAllCategories = createAsyncThunk(
  "/fetch/outlets/categories",
  async ({
    outletId = null,
    page = 1,
    limit = 100,
    serviceType,
    search,
  } = {}) => {
    const res = await CategoryServices.getAllCategoriesApi({
      outletId,
      page,
      limit,
      serviceType,
      search,
    });

    return res.data;
  },
);

export const createCategory = createAsyncThunk(
  "/create/outlets/category",
  async (values) => {
    const res = await CategoryServices.createCategoryApi(values);
    return res.data;
  },
);

export const updateCategory = createAsyncThunk(
  "/update/outlets/category",
  async ({ id, values }) => {
    const res = await CategoryServices.updateCategoryApi({id, values});
    return res.data;
  },
);

const categorySlice = createSlice({
  name: "category",
  initialState: {
    loading: false,
    isCreatingCategory: false,
    isUpdatingCategory: false,
    allCategories: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllCategories.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.allCategories = action.payload;
      })
      .addCase(fetchAllCategories.rejected, (state, action) => {
        state.loading = false;
        toast.error(action.error.message);
      })
      .addCase(createCategory.pending, (state) => {
        state.isCreatingCategory = true;
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.isCreatingCategory = false;
        toast.success(action.payload.message);
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.isCreatingCategory = false;
        toast.error(action.error.message);
      })
      .addCase(updateCategory.pending, (state) => {
        state.isUpdatingCategory = true;
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.isUpdatingCategory = false;
        toast.success(action.payload.message);
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.isUpdatingCategory = false;
        toast.error(action.error.message);
      });
  },
});

// Export reducer
const { reducer } = categorySlice;
export default reducer;
