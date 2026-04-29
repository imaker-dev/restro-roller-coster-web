import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import RecipeServices from "../services/RecipeServices";

// Fetch all recipes
export const fetchAllRecipes = createAsyncThunk(
  "/fetch/recipes",
  async ({outletId,page,limit,search}) => {
    const res = await RecipeServices.getAllRecipesApi(outletId,page,limit,search);
    return res.data;
  },
);

// Fetch recipe by ID
export const fetchRecipeById = createAsyncThunk("/fetch/recipe", async (id) => {
  const res = await RecipeServices.getRecipeByIdApi(id);
  return res.data;
});

// Create recipe
export const createRecipe = createAsyncThunk(
  "/create/recipe",
  async ({ outletId, values }) => {
    const res = await RecipeServices.createRecipeApi(outletId, values);
    return res.data;
  },
);

// Update recipe
export const updateRecipe = createAsyncThunk(
  "/update/recipe",
  async ({ id, values }) => {
    const res = await RecipeServices.updateRecipeApi(id, values);
    return res.data;
  },
);

// ── Pre-production recipe thunks ──

// Fetch all production recipes
export const fetchAllProductionRecipes = createAsyncThunk(
  "/fetch/production-recipes",
  async ({outletId}) => {
    const res = await RecipeServices.getAllProductionRecipesApi(outletId);
    return res.data;
  },
);

// Fetch production recipe by ID
export const fetchProductionRecipeById = createAsyncThunk(
  "/fetch/production-recipe",
  async (id) => {
    const res = await RecipeServices.getProductionRecipeByIdApi(id);
    return res.data;
  },
);

// Create production recipe
export const createProductionRecipe = createAsyncThunk(
  "/create/production-recipe",
  async ({ outletId, values }) => {
    const res = await RecipeServices.createProductionRecipeApi(
      outletId,
      values,
    );
    return res.data;
  },
);

// Update production recipe
export const updateProductionRecipe = createAsyncThunk(
  "/update/production-recipe",
  async ({ id, values }) => {
    const res = await RecipeServices.updateProductionRecipeApi(id, values);
    return res.data;
  },
);

// produce production recipe
export const produceProductionRecipe = createAsyncThunk(
  "/produce/production-recipe",
  async ({ outletId, values }) => {
    const res = await RecipeServices.produceProductionRecipeApi(outletId, values);
    return res.data;
  },
);

const recipeSlice = createSlice({
  name: "recipe",
  initialState: {
    isFetchingRecipes: false,
    isFetchingRecipeDetails: false,
    isCreatingRecipe: false,
    isUpdatingRecipe: false,

    allRecipes: null,
    recipeDetails: null,

    isFetchingProductionRecipes: false,
    isFetchingProductionRecipeDetails: false,
    isCreatingProductionRecipe: false,
    isUpdatingProductionRecipe: false,

    allProductionRecipes: [],
    productionRecipeDetails: null,

    isProducingRecipe:false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder

      // Fetch all recipes
      .addCase(fetchAllRecipes.pending, (state) => {
        state.isFetchingRecipes = true;
      })
      .addCase(fetchAllRecipes.fulfilled, (state, action) => {
        state.isFetchingRecipes = false;
        state.allRecipes = action.payload;
      })
      .addCase(fetchAllRecipes.rejected, (state, action) => {
        state.isFetchingRecipes = false;
        toast.error(action.error.message);
      })

      // Fetch recipe by ID
      .addCase(fetchRecipeById.pending, (state) => {
        state.isFetchingRecipeDetails = true;
      })
      .addCase(fetchRecipeById.fulfilled, (state, action) => {
        state.isFetchingRecipeDetails = false;
        state.recipeDetails = action.payload.data;
      })
      .addCase(fetchRecipeById.rejected, (state, action) => {
        state.isFetchingRecipeDetails = false;
        toast.error(action.error.message);
      })

      // Create recipe
      .addCase(createRecipe.pending, (state) => {
        state.isCreatingRecipe = true;
      })
      .addCase(createRecipe.fulfilled, (state, action) => {
        state.isCreatingRecipe = false;
        toast.success(action.payload.message);
      })
      .addCase(createRecipe.rejected, (state, action) => {
        state.isCreatingRecipe = false;
        toast.error(action.error.message);
      })

      // Update recipe
      .addCase(updateRecipe.pending, (state) => {
        state.isUpdatingRecipe = true;
      })
      .addCase(updateRecipe.fulfilled, (state, action) => {
        state.isUpdatingRecipe = false;
        toast.success(action.payload.message);
      })
      .addCase(updateRecipe.rejected, (state, action) => {
        state.isUpdatingRecipe = false;
        toast.error(action.error.message);
      })

      // Fetch all production recipes
      .addCase(fetchAllProductionRecipes.pending, (state) => {
        state.isFetchingProductionRecipes = true;
      })
      .addCase(fetchAllProductionRecipes.fulfilled, (state, action) => {
        state.isFetchingProductionRecipes = false;
        state.allProductionRecipes = action.payload.data;
      })
      .addCase(fetchAllProductionRecipes.rejected, (state, action) => {
        state.isFetchingProductionRecipes = false;
        toast.error(action.error.message);
      })

      // Fetch production recipe by ID
      .addCase(fetchProductionRecipeById.pending, (state) => {
        state.isFetchingProductionRecipeDetails = true;
      })
      .addCase(fetchProductionRecipeById.fulfilled, (state, action) => {
        state.isFetchingProductionRecipeDetails = false;
        state.productionRecipeDetails = action.payload.data || action.payload;
      })
      .addCase(fetchProductionRecipeById.rejected, (state, action) => {
        state.isFetchingProductionRecipeDetails = false;
        toast.error(action.error.message);
      })

      // Create production recipe
      .addCase(createProductionRecipe.pending, (state) => {
        state.isCreatingProductionRecipe = true;
      })
      .addCase(createProductionRecipe.fulfilled, (state, action) => {
        state.isCreatingProductionRecipe = false;
        toast.success(action.payload.message);
      })
      .addCase(createProductionRecipe.rejected, (state, action) => {
        state.isCreatingProductionRecipe = false;
        toast.error(action.error.message);
      })

      // Update production recipe
      .addCase(updateProductionRecipe.pending, (state) => {
        state.isUpdatingProductionRecipe = true;
      })
      .addCase(updateProductionRecipe.fulfilled, (state, action) => {
        state.isUpdatingProductionRecipe = false;
        toast.success(action.payload.message);
      })
      .addCase(updateProductionRecipe.rejected, (state, action) => {
        state.isUpdatingProductionRecipe = false;
        toast.error(action.error.message);
      })

      // produce production recipe
      .addCase(produceProductionRecipe.pending, (state) => {
        state.isProducingRecipe = true;
      })
      .addCase(produceProductionRecipe.fulfilled, (state, action) => {
        state.isProducingRecipe = false;
        toast.success(action.payload.message);
      })
      .addCase(produceProductionRecipe.rejected, (state, action) => {
        state.isProducingRecipe = false;
        toast.error(action.error.message);
      })
  },
});

export default recipeSlice.reducer;
