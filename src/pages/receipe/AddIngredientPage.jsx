import React, { useEffect, useCallback } from "react";
import { Formik, Form, FieldArray } from "formik";
import * as Yup from "yup";
import PageHeader from "../../layout/PageHeader";
import AccordionSection from "../../components/AccordionSection";
import { InputField } from "../../components/fields/InputField";
import { TextareaField } from "../../components/fields/TextareaField";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllInventoryItems } from "../../redux/slices/inventorySlice";
import {
  createIngredient,
  fetchIngredientById,
  updateIngredient,
} from "../../redux/slices/ingredientSlice";
import { handleResponse } from "../../utils/helpers";
import { useNavigate } from "react-router-dom";
import InfoCard from "../../components/InfoCard";
import { useQueryParams } from "../../hooks/useQueryParams";
import LoadingOverlay from "../../components/LoadingOverlay";
import { SearchSelectField } from "../../components/fields/SearchSelectField";
import { ROUTE_PATHS } from "../../config/paths";

const AddIngredientPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { ingredientId } = useQueryParams();
  const isEditMode = Boolean(ingredientId);

  const { outletId } = useSelector((s) => s.auth);
  const { allItemsData, isFetchingItems } = useSelector((s) => s.inventory);
  const { items } = allItemsData || {};

  const {
    isFetchingIngredientDetails,
    ingredientDetails,
    isCreatingIngredient,
    isUpdatingIngredient,
  } = useSelector((s) => s.ingredient);

  // ── Initial fetch (no search query — load defaults) ──────────────────────
  useEffect(() => {
    if (outletId) {
      dispatch(fetchAllInventoryItems({ outletId, search: "" }));
    }
  }, [outletId, dispatch]);

  useEffect(() => {
    if (ingredientId) dispatch(fetchIngredientById(ingredientId));
  }, [ingredientId, dispatch]);

  const handleItemSearch = useCallback(
    (query) => {
      console.log(query);
      if (outletId) {
        dispatch(fetchAllInventoryItems({ outletId, search: query }));
      }
    },
    [outletId, dispatch],
  );

  // ── Field error helper ────────────────────────────────────────────────────
  const getFieldError = (formik, name) => {
    const error = name.split(".").reduce((acc, p) => acc?.[p], formik.errors);
    const touched = name
      .split(".")
      .reduce((acc, p) => acc?.[p], formik.touched);
    return touched && error ? error : null;
  };

  // ── Initial values ────────────────────────────────────────────────────────
  const getInitialValues = () => {
    if (!isEditMode || !ingredientDetails) {
      return {
        items: [
          {
            inventoryItemId: "",
            name: "",
            description: "",
            yieldPercentage: "",
            wastagePercentage: "",
            preparationNotes: "",
          },
        ],
      };
    }
    return {
      items: [
        {
          inventoryItemId: ingredientDetails.inventoryItemId || "",
          name: ingredientDetails.name || "",
          description: ingredientDetails.description || "",
          yieldPercentage: ingredientDetails.yieldPercentage || "",
          wastagePercentage: ingredientDetails.wastagePercentage || "",
          preparationNotes: ingredientDetails.preparationNotes || "",
        },
      ],
    };
  };

  // ── Validation ────────────────────────────────────────────────────────────
  const validationSchema = Yup.object({
    items: Yup.array().of(
      Yup.object({
        inventoryItemId: Yup.string().required("Inventory item is required"),
        name: Yup.string().required("Ingredient name is required"),
        yieldPercentage: Yup.number()
          .typeError("Enter valid number")
          .min(0)
          .max(100)
          .required("Yield is required"),
        wastagePercentage: Yup.number().min(0).max(100).notRequired(),
      }),
    ),
  });

  // ── Submit ────────────────────────────────────────────────────────────────
  const handleSubmit = async (values) => {
    const item = values.items[0];
    const payload = {
      inventoryItemId: Number(item.inventoryItemId),
      name: item.name?.trim() || null,
      description: item.description?.trim() || null,
      yieldPercentage: Number(item.yieldPercentage),
      wastagePercentage: Number(item.wastagePercentage || 0),
      preparationNotes: item.preparationNotes?.trim() || null,
    };

    const action = isEditMode
      ? updateIngredient({ id: ingredientId, values: payload })
      : createIngredient({ outletId, values: { items: values.items } });

    await handleResponse(dispatch(action), () =>
      navigate(ROUTE_PATHS.ALL_INVENTORY_INGREDIENTS),
    );
  };

  if (isEditMode && isFetchingIngredientDetails) return <LoadingOverlay />;

  return (
    <div className="space-y-6">
      <PageHeader
        title={isEditMode ? "Edit Ingredient" : "Add Ingredients"}
        showBackButton
      />

      <Formik
        initialValues={getInitialValues()}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {(formik) => (
          <Form className="space-y-6" autoComplete="off">
            <FieldArray name="items">
              {({ push, remove }) => (
                <div className="space-y-6">
                  {formik.values.items.map((item, index) => (
                    <AccordionSection
                      key={index}
                      title={`Ingredient ${formik.values.items.length > 1 ? index + 1 : "Details"}`}
                      index={index}
                    >
                      <div className="space-y-5">
                        {/* Inventory item picker */}
                        <SearchSelectField
                          label="Inventory Item"
                          name={`items.${index}.inventoryItemId`}
                          required
                          loading={isFetchingItems}
                          options={(items || []).map((i) => ({
                            value: i.id,
                            label: i.name,
                          }))}
                          value={item.inventoryItemId}
                          onChange={(value) => {
                            formik.setFieldValue(
                              `items.${index}.inventoryItemId`,
                              value,
                            );
                            // Auto-fill name from selected item
                            const selected = items?.find(
                              (i) => i.id === Number(value),
                            );
                            if (selected) {
                              formik.setFieldValue(
                                `items.${index}.name`,
                                selected.name,
                              );
                            }
                          }}
                          onBlur={formik.handleBlur}
                          error={getFieldError(
                            formik,
                            `items.${index}.inventoryItemId`,
                          )}
                          placeholder="Search inventory item…"
                          disabled={isEditMode}
                          onSearch={handleItemSearch}
                        />

                        {/* Name + Yield + Wastage */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <InputField
                            label="Ingredient Name"
                            name={`items.${index}.name`}
                            required
                            placeholder="Auto-filled or custom name"
                            value={item.name}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={getFieldError(formik, `items.${index}.name`)}
                            helperText="Created from inventory item"
                          />
                          <InputField
                            label="Yield (%)"
                            name={`items.${index}.yieldPercentage`}
                            type="number"
                            required
                            placeholder="e.g. 80"
                            helperText="After prep usable quantity"
                            value={item.yieldPercentage}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={getFieldError(
                              formik,
                              `items.${index}.yieldPercentage`,
                            )}
                          />
                          <InputField
                            label="Wastage (%)"
                            name={`items.${index}.wastagePercentage`}
                            type="number"
                            placeholder="Optional"
                            helperText="Loss during cooking"
                            value={item.wastagePercentage}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                          />
                        </div>

                        {/* Preparation Notes */}
                        <TextareaField
                          label="Preparation Notes"
                          name={`items.${index}.preparationNotes`}
                          placeholder="Wash, peel, chop..."
                          rows={2}
                          value={item.preparationNotes}
                          onChange={formik.handleChange}
                        />

                        {/* Description */}
                        <TextareaField
                          label="Description"
                          name={`items.${index}.description`}
                          placeholder="Optional description..."
                          rows={2}
                          value={item.description}
                          onChange={formik.handleChange}
                        />

                        {/* Remove row button — only in add mode with multiple items */}
                        {!isEditMode && formik.values.items.length > 1 && (
                          <div className="flex justify-end">
                            <button
                              type="button"
                              onClick={() => remove(index)}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold text-rose-600 border border-rose-200 bg-rose-50 hover:bg-rose-100 transition-colors"
                            >
                              <Trash2 size={13} strokeWidth={2} />
                              Remove
                            </button>
                          </div>
                        )}
                      </div>
                    </AccordionSection>
                  ))}

                  {/* Add another ingredient — only in add mode */}
                  {!isEditMode && (
                    <button
                      type="button"
                      onClick={() =>
                        push({
                          inventoryItemId: "",
                          name: "",
                          description: "",
                          yieldPercentage: "",
                          wastagePercentage: "",
                          preparationNotes: "",
                        })
                      }
                      className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed border-slate-200 hover:border-primary-400 hover:bg-primary-50 text-slate-500 hover:text-primary-600 text-[13px] font-semibold transition-all duration-150"
                    >
                      <Plus size={15} strokeWidth={2.5} />
                      Add Another Ingredient
                    </button>
                  )}
                </div>
              )}
            </FieldArray>

            {/* Info card */}
            <InfoCard
              type="info"
              title="Understanding Yield & Wastage"
              description={`Yield = usable portion after preparation.\nExample: 1kg → 800g usable → Yield = 80%.\nRaw Needed = Recipe Qty ÷ (Yield / 100)\nWastage = additional cooking loss.\nEffective Qty = Recipe Qty × (1 + wastage%) × (100 / yield)`}
            />

            {/* Submit */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isCreatingIngredient || isUpdatingIngredient}
                className="btn bg-primary-500 hover:bg-primary-600 text-white font-medium flex items-center gap-2 disabled:opacity-70"
              >
                {(isCreatingIngredient || isUpdatingIngredient) && (
                  <Loader2 size={15} className="animate-spin" />
                )}
                {isEditMode
                  ? isUpdatingIngredient
                    ? "Updating…"
                    : "Update Ingredient"
                  : isCreatingIngredient
                    ? "Creating…"
                    : "Create Ingredients"}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default AddIngredientPage;
