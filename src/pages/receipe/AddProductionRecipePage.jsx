import React, { useCallback, useEffect, useState } from "react";
import { Formik, Form, FieldArray } from "formik";
import * as Yup from "yup";
import PageHeader from "../../layout/PageHeader";
import { InputField } from "../../components/fields/InputField";
import { SelectField } from "../../components/fields/SelectField";
import { TextareaField } from "../../components/fields/TextareaField";
import AccordionSection from "../../components/AccordionSection";
import {
  BookOpen,
  ChefHat,
  Clock,
  FlaskConical,
  Plus,
  Loader2,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { handleResponse } from "../../utils/helpers";
import { SearchSelectField } from "../../components/fields/SearchSelectField";
import { fetchAllInventoryItems } from "../../redux/slices/inventorySlice";
import { fetchAllUnits } from "../../redux/slices/unitSlice";
import {
  createProductionRecipe,
  fetchProductionRecipeById,
  updateProductionRecipe,
} from "../../redux/slices/recipeSlice";
import { IngredientRow } from "../../partial/recipe/production-receipe/IngredientRow";
import { fetchAllIngredients } from "../../redux/slices/ingredientSlice";
import { useQueryParams } from "../../hooks/useQueryParams";
import LoadingOverlay from "../../components/LoadingOverlay";

const AddProductionRecipePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { recipeId } = useQueryParams();

  useEffect(() => {
    if (recipeId) {
      dispatch(fetchProductionRecipeById(recipeId));
    }
  }, [recipeId]);

  const [searchItemQuery, setSearchItemQuery] = useState("");
  const [searchIngredientQuery, setSearchIngredientQuery] = useState("");

  const { outletId } = useSelector((s) => s.auth);
  const { allItemsData } = useSelector((s) => s.inventory);
  const { items } = allItemsData || {};
  const { allIngredients } = useSelector((state) => state.ingredient);
  const { ingredients } = allIngredients || {};
  const { allUnits } = useSelector((s) => s.unit);
  const { units } = allUnits || {};

  const {
    isCreatingProductionRecipe,
    isFetchingProductionRecipeDetails,
    productionRecipeDetails,
    isUpdatingProductionRecipe,
  } = useSelector((s) => s.recipe);

// ✅ Initial loads
useEffect(() => {
  if (!outletId) return;
  dispatch(fetchAllInventoryItems({ outletId, search: "" }));
  dispatch(fetchAllIngredients({ outletId, search: "" }));
  dispatch(fetchAllUnits(outletId));
}, [outletId]);

// ✅ Stable search handlers
const handleItemSearch = useCallback((query) => {
  if (outletId) dispatch(fetchAllInventoryItems({ outletId, search: query }));
}, [outletId, dispatch]);

const handleIngredientSearch = useCallback((query) => {
  if (outletId) dispatch(fetchAllIngredients({ outletId, search: query }));
}, [outletId, dispatch]);


  /* Initial Values */
  const getInitialValues = () => {
    if (recipeId && productionRecipeDetails) {
      return {
        outputInventoryItemId:
          productionRecipeDetails.outputInventoryItemId || "",
        name: productionRecipeDetails.name || "",
        description: productionRecipeDetails.description || "",
        preparationTimeMins: productionRecipeDetails.preparationTimeMins || "",
        instructions: productionRecipeDetails.instructions || "",
        outputQuantity: productionRecipeDetails.outputQuantity || "",
        outputUnitId: productionRecipeDetails.outputUnitId || "",

        ingredients:
          productionRecipeDetails.ingredients?.length > 0
            ? productionRecipeDetails.ingredients.map((i) => ({
                inventoryItemId: i.inventoryItemId || "",
                quantity: i.quantity || "",
                unitId: i.unitId || "",
                wastagePercentage: i.wastagePercentage || 0,
                notes: i.notes || "",
              }))
            : [
                {
                  inventoryItemId: "",
                  quantity: "",
                  unitId: "",
                  wastagePercentage: 0,
                  notes: "",
                },
              ],
      };
    }

    // CREATE MODE
    return {
      outputInventoryItemId: "",
      name: "",
      description: "",
      preparationTimeMins: "",
      instructions: "",
      outputQuantity: "",
      outputUnitId: "",
      ingredients: [
        {
          inventoryItemId: "",
          quantity: "",
          unitId: "",
          wastagePercentage: 0,
          notes: "",
        },
      ],
    };
  };

  /* Validation */
  const validationSchema = Yup.object({
    outputInventoryItemId: Yup.number().required("Output item is required"),
    name: Yup.string().required("Recipe name is required"),
    preparationTimeMins: Yup.number()
      .typeError("Enter valid number")
      .required("Prep time required"),
    outputQuantity: Yup.number()
      .typeError("Enter valid number")
      .required("Output quantity required")
      .min(0.01),
    outputUnitId: Yup.number().required("Output unit required"),

    ingredients: Yup.array()
      .of(
        Yup.object({
          inventoryItemId: Yup.number().required("Ingredient required"),
          quantity: Yup.number()
            .typeError("Enter valid number")
            .required("Quantity required")
            .min(0.01),
          unitId: Yup.number().required("Unit required"),
        }),
      )
      .min(1, "Add at least one ingredient"),
  });

  /* Submit */
  const handleSubmit = async (values) => {
    const payload = {
      name: values.name,
      description: values.description,
      outputInventoryItemId: Number(values.outputInventoryItemId),
      outputQuantity: Number(values.outputQuantity),
      outputUnitId: Number(values.outputUnitId),
      preparationTimeMins: Number(values.preparationTimeMins),
      instructions: values.instructions,
      ingredients: values.ingredients.map((i) => ({
        inventoryItemId: Number(i.inventoryItemId),
        quantity: Number(i.quantity),
        unitId: Number(i.unitId),
        wastagePercentage: Number(i.wastagePercentage) || 0,
        notes: i.notes,
      })),
    };

    const action = recipeId
      ? updateProductionRecipe({ id: recipeId, values: payload })
      : createProductionRecipe({ outletId, values: payload });
    await handleResponse(dispatch(action), () => {
      navigate(-1);
    });
  };

  if (recipeId && isFetchingProductionRecipeDetails)
    return <LoadingOverlay text="loading recipe details..." />;

  return (
    <div className="space-y-6">
      <PageHeader
        title={
          recipeId ? "Update Pre Prepared Recipe" : "Create Pre Prepared Recipe"
        }
        showBackButton
      />
      <Formik
        initialValues={getInitialValues()}
        enableReinitialize
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {(formik) => (
          <Form className="space-y-5">
            {/* Recipe Info */}
            <AccordionSection title="Recipe Info" icon={BookOpen}>
              <div className="space-y-5">
                <InputField
                  label="Recipe Name"
                  name="name"
                  placeholder="e.g. Tomato Base Gravy"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  error={formik.touched.name && formik.errors.name}
                />

                <SearchSelectField
                  label="Output Item"
                  placeholder="Select output (e.g. Tomato Gravy)"
                  value={formik.values.outputInventoryItemId}
                  onChange={(v) =>
                    formik.setFieldValue("outputInventoryItemId", v)
                  }
                  options={(items || []).map((i) => ({
                    value: i.id,
                    label: i.name,
                  }))}
                  error={
                    formik.touched.outputInventoryItemId &&
                    formik.errors.outputInventoryItemId
                  }
                  onSearch={handleItemSearch}

                />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <InputField
                    label="Output Quantity"
                    name="outputQuantity"
                    type="number"
                    placeholder="e.g. 5"
                    value={formik.values.outputQuantity}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.outputQuantity &&
                      formik.errors.outputQuantity
                    }
                  />

                  <SelectField
                    label="Output Unit"
                    name="outputUnitId"
                    options={units?.map((u) => ({
                      value: u.id,
                      label: u.abbreviation,
                    }))}
                    value={formik.values.outputUnitId}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.outputUnitId && formik.errors.outputUnitId
                    }
                  />

                  <InputField
                    label="Preparation Time (mins)"
                    name="preparationTimeMins"
                    type="number"
                    placeholder="e.g. 45"
                    value={formik.values.preparationTimeMins}
                    onChange={formik.handleChange}
                    icon={Clock}
                    error={
                      formik.touched.preparationTimeMins &&
                      formik.errors.preparationTimeMins
                    }
                  />
                </div>

                <TextareaField
                  label="Description"
                  name="description"
                  placeholder="Short description"
                  value={formik.values.description}
                  onChange={formik.handleChange}
                />
              </div>
            </AccordionSection>

            {/* Ingredients */}
            <AccordionSection title="Ingredients" icon={FlaskConical}>
              <FieldArray name="ingredients">
                {({ push, remove }) => (
                  <div className="space-y-3">
                    {formik.values.ingredients.map((ing, i) => (
                      <IngredientRow
                        key={i}
                        index={i}
                        values={ing}
                        ingredients={ingredients}
                        units={units}
                        formik={formik}
                        remove={remove}
                        onIngredientSearch={handleIngredientSearch}
                        canRemove={formik.values.ingredients.length > 1}
                      />
                    ))}

                    {/* Add ingredient button */}
                    <button
                      type="button"
                      onClick={() =>
                        push({
                          inventoryItemId: "",
                          quantity: "",
                          unitId: "",
                          wastagePercentage: 0,
                          notes: "",
                        })
                      }
                      className="w-full border-2 border-dashed border-slate-200 hover:border-primary-400 rounded-2xl py-3.5 flex items-center justify-center gap-2.5 hover:bg-primary-50/30 transition-all duration-200 group"
                    >
                      <div className="w-7 h-7 rounded-full bg-slate-100 group-hover:bg-primary-100 flex items-center justify-center transition-colors">
                        <Plus
                          size={14}
                          className="text-slate-500 group-hover:text-primary-600"
                          strokeWidth={2.5}
                        />
                      </div>
                      <span className="text-sm font-semibold text-slate-500 group-hover:text-primary-600 transition-colors">
                        Add Ingredient
                      </span>
                    </button>
                  </div>
                )}
              </FieldArray>
            </AccordionSection>

            {/* Instructions */}
            <AccordionSection title="Preparation Instructions" icon={ChefHat}>
              <TextareaField
                name="instructions"
                placeholder="Step-by-step instructions..."
                value={formik.values.instructions}
                onChange={formik.handleChange}
                rows={10}
              />
            </AccordionSection>

            {/* Submit */}
            <div className="flex justify-between">
              <button type="button" onClick={() => navigate(-1)}>
                Cancel
              </button>

              <button
                type="submit"
                disabled={
                  isCreatingProductionRecipe || isUpdatingProductionRecipe
                }
                className="btn bg-primary-500 text-white flex items-center gap-2"
              >
                {isCreatingProductionRecipe || isUpdatingProductionRecipe ? (
                  <>
                    <Loader2 className="animate-spin" size={16} />
                    {recipeId ? "Updating..." : "Saving..."}
                  </>
                ) : recipeId ? (
                  "Update Recipe"
                ) : (
                  "Save Recipe"
                )}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default AddProductionRecipePage;
