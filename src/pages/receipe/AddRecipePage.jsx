import React, { useEffect, useState, useRef, useCallback } from "react";
import { Formik, Form, FieldArray } from "formik";
import * as Yup from "yup";
import PageHeader from "../../layout/PageHeader";
import { InputField } from "../../components/fields/InputField";
import { SelectField } from "../../components/fields/SelectField";
import { TextareaField } from "../../components/fields/TextareaField";
import AccordionSection from "../../components/AccordionSection";
import LoadingOverlay from "../../components/LoadingOverlay";
import {
  BookOpen,
  ChefHat,
  Clock,
  FlaskConical,
  Layers,
  Plus,
  Trash2,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { handleResponse } from "../../utils/helpers";
import { fetchAllItems } from "../../redux/slices/itemSlice";
import { SearchSelectField } from "../../components/fields/SearchSelectField";
import { fetchAllIngredients } from "../../redux/slices/ingredientSlice";
import { fetchAllUnits } from "../../redux/slices/unitSlice";
import {
  createRecipe,
  fetchRecipeById,
  updateRecipe,
} from "../../redux/slices/recipeSlice";
import { useQueryParams } from "../../hooks/useQueryParams";
import { ROUTE_PATHS } from "../../config/paths";

/* ─── Ingredient row ──────────────────────────────────────────────────────── */
function IngredientRow({
  index,
  values,
  ingredients,
  units,
  formik,
  remove,
  canRemove,
  onSearch,
}) {
  return (
    <div className="bg-white border border-slate-100 rounded-2xl  hover:border-slate-200 transition-colors duration-150">
      {/* Row header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-50 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-slate-200 flex items-center justify-center">
            <span className="text-[10px] font-extrabold text-slate-600">
              {index + 1}
            </span>
          </div>
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">
            Ingredient {index + 1}
          </span>
        </div>
        {canRemove && (
          <button
            type="button"
            onClick={() => remove(index)}
            className="w-7 h-7 rounded-lg hover:bg-red-50 hover:text-red-500 text-slate-400 flex items-center justify-center transition-colors duration-150"
          >
            <Trash2 size={13} strokeWidth={2} />
          </button>
        )}
      </div>

      <div className="p-4 space-y-5">
        <SearchSelectField
          label="Ingredient"
          value={values.ingredientId}
          onChange={(v) =>
            formik.setFieldValue(`ingredients.${index}.ingredientId`, v)
          }
          onBlur={() =>
            formik.setFieldTouched(`ingredients.${index}.ingredientId`, true)
          }
          options={(ingredients || []).map((i) => ({
            value: i.id,
            label: i.name,
          }))}
          error={
            formik.touched.ingredients?.[index]?.ingredientId &&
            formik.errors.ingredients?.[index]?.ingredientId
          }
          onSearch={onSearch}
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-start">
          {/* Quantity */}
          <div className="">
            <InputField
              label="Quantity"
              name={`ingredients.${index}.quantity`}
              type="number"
              min="0"
              step="0.01"
              placeholder="0.00"
              required
              value={values.quantity}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.ingredients?.[index]?.quantity &&
                formik.errors.ingredients?.[index]?.quantity
              }
            />
          </div>

          {/* Unit */}
          <div className="">
            <SelectField
              label="Unit"
              name={`ingredients.${index}.unitId`}
              required
              options={units?.map((u) => ({
                value: u.id,
                label: u.abbreviation ?? u.name,
              }))}
              value={values.unitId}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.ingredients?.[index]?.unitId &&
                formik.errors.ingredients?.[index]?.unitId
              }
            />
          </div>

          {/* Wastage */}
          <div className="">
            <InputField
              label="Wastage %"
              name={`ingredients.${index}.wastagePercentage`}
              type="number"
              min="0"
              max="100"
              step="0.1"
              placeholder="0"
              value={values.wastagePercentage}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
          </div>
        </div>
        {/* Notes */}
        <div className="">
          <InputField
            label="Notes"
            name={`ingredients.${index}.notes`}
            placeholder="e.g. diced"
            value={values.notes ?? ""}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════════════════════════════════ */
const AddRecipePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { recipeId } = useQueryParams();

  const [selectedMenuItem, setSelectedMenuItem] = useState(null);

  const { outletId } = useSelector((state) => state.auth);

  // ─── TODO: wire up your real selectors ──────────────────────────────────
  const { allItems, loading } = useSelector((s) => s.item);
  const { data: allMenuItems } = allItems || {};
  const { isFetchingIngredients, allIngredients } = useSelector(
    (s) => s.ingredient,
  );
  const { ingredients } = allIngredients || {};
  const { allUnits, isFetchingUnits } = useSelector((s) => s.unit);
  const { units } = allUnits || {};

  const {
    isCreatingRecipe,
    isFetchingRecipeDetails,
    recipeDetails,
    isUpdatingRecipe,
  } = useSelector((s) => s.recipe);

  useEffect(() => {
    if (recipeId) {
      dispatch(fetchRecipeById(recipeId));
    }
  }, [recipeId]);

  // ✅ Initial loads — runs once on mount, no search query deps
  useEffect(() => {
    if (!outletId) return;
    dispatch(fetchAllItems({ outletId, search: "" }));
    dispatch(fetchAllIngredients({ outletId }));
    dispatch(fetchAllUnits(outletId));
  }, [outletId]);

  // ✅ Stable menu item search handler
  const handleMenuItemSearch = useCallback(
    (query) => {
      if (outletId) dispatch(fetchAllItems({ outletId, search: query }));
    },
    [outletId, dispatch],
  );

  const handleIngredientSearch = useCallback(
    (query) => {
      if (outletId) dispatch(fetchAllIngredients({ outletId, search: query }));
    },
    [outletId, dispatch],
  );

  const getInitialValues = () => {
    if (!recipeId || !recipeDetails) {
      return {
        menuItemId: "",
        variantId: "",
        name: "",
        description: "",
        portionSize: "",
        preparationTimeMins: "",
        instructions: "",
        ingredients: [
          {
            ingredientId: "",
            quantity: "",
            unitId: "",
            wastagePercentage: 0,
            notes: "",
          },
        ],
      };
    }

    return {
      menuItemId: recipeDetails.menuItemId || "",
      variantId: recipeDetails.variantId || "",
      name: recipeDetails.name || "",
      description: recipeDetails.description || "",
      portionSize: recipeDetails.portionSize || "",
      preparationTimeMins: recipeDetails.preparationTimeMins || "",
      instructions: recipeDetails.instructions || "",
      ingredients:
        recipeDetails.ingredients?.map((ing) => ({
          ingredientId: ing.ingredientId || "",
          quantity: ing.quantity || "",
          unitId: ing.unitId || "",
          wastagePercentage: ing.wastagePercentage || 0,
          notes: ing.notes || "",
        })) || [],
    };
  };

  /* ── validation ── */
  const validationSchema = Yup.object({
    menuItemId: Yup.number().required("Menu item is required"),
    variantId: Yup.number().when("menuItemId", {
      is: () => selectedMenuItem?.has_variants === 1, // reads closure, not allMenuItems
      then: (schema) => schema.required("Variant is required"),
      otherwise: (schema) => schema.nullable(),
    }),

    name: Yup.string().required("Recipe name is required"),
    preparationTimeMins: Yup.number()
      .typeError("Must be a number")
      .required("Prep time is required")
      .min(1, "Must be at least 1 min"),
    ingredients: Yup.array()
      .of(
        Yup.object({
          ingredientId: Yup.number().required("Ingredient is required"),
          quantity: Yup.number()
            .typeError("Must be a number")
            .required("Quantity is required")
            .min(0.01, "Must be > 0"),
          unitId: Yup.number().required("Unit is required"),
          wastagePercentage: Yup.number().min(0).max(100),
        }),
      )
      .min(1, "Add at least one ingredient"),
  });

  /* ── submit ── */
  const handleSubmit = async (values) => {
    const payload = {
      menuItemId: Number(values.menuItemId),
      variantId: values.variantId ? Number(values.variantId) : null,
      name: values.name.trim(),
      description: values.description?.trim() || null,
      portionSize: values.portionSize?.trim() || null,
      preparationTimeMins: Number(values.preparationTimeMins),
      instructions: values.instructions?.trim() || null,
      ingredients: values.ingredients.map((ing) => ({
        ingredientId: Number(ing.ingredientId),
        quantity: Number(ing.quantity),
        unitId: Number(ing.unitId),
        wastagePercentage: Number(ing.wastagePercentage) || 0,
        notes: ing.notes?.trim() || undefined,
      })),
    };

    const action = recipeId
      ? updateRecipe({ id: recipeId, outletId, values: payload })
      : createRecipe({ outletId, values: payload });

    await handleResponse(dispatch(action), () =>
      navigate(ROUTE_PATHS.ALL_RECIPES),
    );
  };

  if (recipeId && isFetchingRecipeDetails) {
    return <LoadingOverlay />;
  }

  const menuOptions = [
    ...(recipeDetails?.menuItemId && recipeDetails?.menuItemName
      ? [
          {
            value: recipeDetails.menuItemId,
            label: recipeDetails.menuItemName,
          },
        ]
      : []),

    ...(allMenuItems?.map((m) => ({
      value: m.id,
      label: m.name,
    })) || []),
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title={recipeId ? "Edit Recipe" : "Add Recipe"}
        showBackButton
      />

      <Formik
        initialValues={getInitialValues()}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {(formik) => (
          <Form className="space-y-5" autoComplete="off">
            {/* ══ RECIPE INFO ══ */}
            <AccordionSection title="Recipe Info" icon={BookOpen}>
              <div className="space-y-5">
                <InputField
                  label="Recipe Name"
                  name="name"
                  placeholder="e.g. Margherita Pizza Recipe"
                  required
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.name && formik.errors.name}
                />

                {/* Menu item picker — full width */}
                <SearchSelectField
                  label="Menu Item"
                  name="menuItemId"
                  value={formik.values.menuItemId}
                  onChange={(v) => {
                    formik.setFieldValue("menuItemId", v);
                    formik.setFieldValue("variantId", "");
                    const item =
                      allMenuItems?.find((m) => m.id === Number(v)) || null;
                    setSelectedMenuItem(item);
                  }}
                  onBlur={() => formik.setFieldTouched("menuItemId", true)}
                  options={menuOptions}
                  error={formik.touched.menuItemId && formik.errors.menuItemId}
                  onSearch={handleMenuItemSearch}
                  loading={loading}
                />

                {(() => {
                  const hasVariants = selectedMenuItem?.has_variants === 1;
                  const variantOptions =
                    selectedMenuItem?.variants
                      ?.filter((v) => v.is_active)
                      ?.map((v) => ({ value: v.id, label: v.name })) ?? [];

                  return (
                    <div
                      className={`grid grid-cols-1 gap-4 ${hasVariants ? "md:grid-cols-3" : "md:grid-cols-2"}`}
                    >
                      {hasVariants && (
                        <SelectField
                          label="Variant"
                          name="variantId"
                          required
                          options={variantOptions}
                          value={formik.values.variantId}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          error={
                            formik.touched.variantId && formik.errors.variantId
                          }
                        />
                      )}
                      <InputField
                        label="Portion Size"
                        name="portionSize"
                        placeholder="e.g. 1 pizza"
                        icon={Layers}
                        value={formik.values.portionSize}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                      <InputField
                        label="Prep Time (mins)"
                        name="preparationTimeMins"
                        type="number"
                        min="1"
                        placeholder="e.g. 20"
                        icon={Clock}
                        required
                        value={formik.values.preparationTimeMins}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={
                          formik.touched.preparationTimeMins &&
                          formik.errors.preparationTimeMins
                        }
                      />
                    </div>
                  );
                })()}

                {/* Description */}
                <TextareaField
                  label="Description"
                  name="description"
                  placeholder="Brief description of this recipe…"
                  rows={2}
                  value={formik.values.description}
                  onChange={formik.handleChange}
                />
              </div>
            </AccordionSection>

            {/* ══ INGREDIENTS ══ */}
            <AccordionSection title="Ingredients" icon={FlaskConical}>
              <FieldArray name="ingredients">
                {({ push, remove }) => (
                  <div className="space-y-3">
                    {/* Error if empty */}
                    {typeof formik.errors.ingredients === "string" && (
                      <div className="flex items-center gap-2 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                        <AlertCircle
                          size={14}
                          className="text-red-500 flex-shrink-0"
                          strokeWidth={2}
                        />
                        <p className="text-xs font-semibold text-red-600">
                          {formik.errors.ingredients}
                        </p>
                      </div>
                    )}

                    {formik.values.ingredients.map((ing, i) => (
                      <IngredientRow
                        key={i}
                        index={i}
                        values={ing}
                        ingredients={ingredients}
                        units={units}
                        formik={formik}
                        remove={remove}
                        canRemove={formik.values.ingredients.length > 1}
                        onSearch={handleIngredientSearch}
                      />
                    ))}

                    {/* Add ingredient button */}
                    <button
                      type="button"
                      onClick={() =>
                        push({
                          ingredientId: "",
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

                    {/* Summary strip */}
                    {formik.values.ingredients.length > 0 && (
                      <div className="flex items-center gap-2 pt-1">
                        <div className="h-px flex-1 bg-slate-100" />
                        <span className="text-[11px] font-semibold text-slate-400">
                          {formik.values.ingredients.length} ingredient
                          {formik.values.ingredients.length !== 1
                            ? "s"
                            : ""}{" "}
                          added
                        </span>
                        <div className="h-px flex-1 bg-slate-100" />
                      </div>
                    )}
                  </div>
                )}
              </FieldArray>
            </AccordionSection>

            {/* ══ INSTRUCTIONS ══ */}
            <AccordionSection title="Preparation Instructions" icon={ChefHat}>
              <TextareaField
                label="Step-by-step Instructions"
                name="instructions"
                placeholder={`1. Roll dough\n2. Spread sauce\n3. Add cheese\n4. Bake at 250°C for 12 mins`}
                rows={20}
                value={formik.values.instructions}
                onChange={formik.handleChange}
                helperText="Write each step on a new line for clarity."
              />
            </AccordionSection>

            {/* Submit */}
            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="btn btn-outline text-slate-600 border-slate-200 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isCreatingRecipe || isUpdatingRecipe}
                className="btn bg-primary-500 hover:bg-primary-600 text-white flex items-center justify-center gap-2"
              >
                {(isCreatingRecipe || isUpdatingRecipe) && (
                  <Loader2 className="animate-spin" size={16} />
                )}

                {isCreatingRecipe || isUpdatingRecipe
                  ? "Saving Recipe…"
                  : recipeId
                    ? "Update Recipe"
                    : "Save Recipe"}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default AddRecipePage;
