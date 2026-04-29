import React, { useEffect, useState } from "react";
import PageHeader from "../../layout/PageHeader";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllProductionRecipes,
  produceProductionRecipe,
} from "../../redux/slices/recipeSlice";
import { useNavigate } from "react-router-dom";
import { Plus, ChefHat, Search } from "lucide-react";
import { handleResponse } from "../../utils/helpers";
import { ProductionRecipeCard } from "../../partial/recipe/production-receipe/ProductionRecipeCard";
import { ProductionOverlay } from "../../partial/recipe/production-receipe/ProductionOverlay";
import SearchBar from "../../components/SearchBar";
import { ProductionRecipeCardSkeleton } from "../../partial/recipe/production-receipe/ProductionRecipeCardSkeleton";
import NoDataFound from "../../layout/NoDataFound";
import { ROUTE_PATHS } from "../../config/paths";

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
const AllProductionRecipePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { outletId } = useSelector((s) => s.auth);
  const {
    isFetchingProductionRecipes,
    allProductionRecipes,
    isProducingRecipe,
  } = useSelector((s) => s.recipe);

  const [showProductionOverlay, setShowProductionOverlay] = useState(false);
  const [productionTarget, setProductionTarget] = useState(null);
  const { recipes } = allProductionRecipes || {};
  const [search, setSearch] = useState("");

  const clearStates = () => {
    setShowProductionOverlay(false);
    setProductionTarget(null);
  };

  useEffect(() => {
    if (!outletId) return;
    dispatch(fetchAllProductionRecipes({ outletId }));
  }, [outletId]);

  const handleSubmitProduction = async (payload) => {
    await handleResponse(
      dispatch(produceProductionRecipe({ outletId, values: payload })),
      () => {
        clearStates();
      },
    );
  };

  const actions = [
    {
      label: "Add Recipe",
      type: "primary",
      icon: Plus,
      onClick: () => navigate(ROUTE_PATHS.PREP_RECIPES_ADD),
    },
  ];

  return (
    <>
      <div className="space-y-6">
        <PageHeader title="Pre-Prepared Recipes" actions={actions} />

        <SearchBar
          placeholder="Search recipes…"
          onSearch={(value) => setSearch(value)}
        />

        {/* Grid */}

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {isFetchingProductionRecipes ? (
            Array.from({ length: 6 }).map((_, i) => (
              <ProductionRecipeCardSkeleton key={i} />
            ))
          ) : recipes?.length > 0 ? (
            recipes.map((recipe) => (
              <ProductionRecipeCard
                key={recipe.id}
                recipe={recipe}
                onProduce={(recipe) => {
                  setShowProductionOverlay(true);
                  setProductionTarget(recipe);
                }}
                navigate={navigate}
              />
            ))
          ) : (
            <NoDataFound
              title="No recipes found"
              description="Try creating a new recipe or adjusting your search"
              className="col-span-full bg-white"
            />
          )}
        </div>
      </div>

      <ProductionOverlay
        isOpen={showProductionOverlay}
        recipe={productionTarget}
        onClose={clearStates}
        onSubmit={handleSubmitProduction}
        loading={isProducingRecipe}
      />
    </>
  );
};

export default AllProductionRecipePage;
