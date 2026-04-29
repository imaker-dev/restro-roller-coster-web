import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import IngredientServices from "../services/IngredientServices";

// Fetch all ingredients
export const fetchAllIngredients = createAsyncThunk(
  "/fetch/ingredients",
  async ({outletId,page,limit,search}) => {
    const res = await IngredientServices.getAllIngredientsApi(outletId,page,limit,search);
    return res.data;
  },
);

// Fetch ingredient by ID
export const fetchIngredientById = createAsyncThunk(
  "/fetch/ingredient",
  async (id) => {
    const res = await IngredientServices.getIngredientByIdApi(id);
    return res.data;
  },
);

// Create ingredient
export const createIngredient = createAsyncThunk(
  "/create/ingredient",
  async ({ outletId, values }) => {
    const res = await IngredientServices.createIngredientApi(outletId, values);
    return res.data;
  },
);

// Update ingredient
export const updateIngredient = createAsyncThunk(
  "/update/ingredient",
  async ({ id, values }) => {
    const res = await IngredientServices.updateIngredientApi(id, values);
    return res.data;
  },
);

const ingredientSlice = createSlice({
  name: "ingredient",
  initialState: {
    isFetchingIngredients: false,
    isFetchingIngredientDetails: false,
    isCreatingIngredient: false,
    isUpdatingIngredient: false,

    allIngredients: null,
    ingredientDetails: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder

      // Fetch all ingredients
      .addCase(fetchAllIngredients.pending, (state) => {
        state.isFetchingIngredients = true;
      })
      .addCase(fetchAllIngredients.fulfilled, (state, action) => {
        state.isFetchingIngredients = false;
        state.allIngredients = action.payload;
      })
      .addCase(fetchAllIngredients.rejected, (state, action) => {
        state.isFetchingIngredients = false;
        toast.error(action.error.message);
      })

      // Fetch ingredient by ID
      .addCase(fetchIngredientById.pending, (state) => {
        state.isFetchingIngredientDetails = true;
      })
      .addCase(fetchIngredientById.fulfilled, (state, action) => {
        state.isFetchingIngredientDetails = false;
        state.ingredientDetails = action.payload.data;
      })
      .addCase(fetchIngredientById.rejected, (state, action) => {
        state.isFetchingIngredientDetails = false;
        toast.error(action.error.message);
      })

      // Create ingredient
      .addCase(createIngredient.pending, (state) => {
        state.isCreatingIngredient = true;
      })
      .addCase(createIngredient.fulfilled, (state, action) => {
        state.isCreatingIngredient = false;
        toast.success(action.payload.message);
      })
      .addCase(createIngredient.rejected, (state, action) => {
        state.isCreatingIngredient = false;
        toast.error(action.error.message);
      })

      // Update ingredient
      .addCase(updateIngredient.pending, (state) => {
        state.isUpdatingIngredient = true;
      })
      .addCase(updateIngredient.fulfilled, (state, action) => {
        state.isUpdatingIngredient = false;
        toast.success(action.payload.message);
      })
      .addCase(updateIngredient.rejected, (state, action) => {
        state.isUpdatingIngredient = false;
        toast.error(action.error.message);
      });
  },
});

export default ingredientSlice.reducer;
