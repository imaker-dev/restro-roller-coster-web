import React, { useEffect, useState } from "react";
import { Formik, Form, FieldArray } from "formik";
import * as Yup from "yup";
import PageHeader from "../../layout/PageHeader";
import { InputField } from "../../components/fields/InputField";
import { SelectField } from "../../components/fields/SelectField";
import {
  CheckCircle2,
  Image,
  IndianRupee,
  Info,
  Loader2,
  Plus,
  RefreshCw,
  Text,
  Trash2,
} from "lucide-react";
import { RadioField } from "../../components/fields/CheckboxField";
import { TextareaField } from "../../components/fields/TextareaField";
import { MultiSelectDropdownField } from "../../components/fields/MultiSelectDropdownField";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllCategories } from "../../redux/slices/categorySlice";
import { fetchAllTaxGroups } from "../../redux/slices/taxSlice";
import { fetchAllFloors } from "../../redux/slices/floorSlice";
import { fetchAllKitchenStations } from "../../redux/slices/kitchenSlice";
import { fetchAllAddonGroups } from "../../redux/slices/addonSlice";
import AccordionSection from "../../components/AccordionSection";
import DragDropUploader from "../../components/DragDropUploader";
import { handleResponse } from "../../utils/helpers";
import {
  createItem,
  fetchItemsById,
  updateItem,
} from "../../redux/slices/itemSlice";
import { useNavigate } from "react-router-dom";
import { useQueryParams } from "../../hooks/useQueryParams";
import { FOOD_TYPES } from "../../constants";
import InfoCard from "../../components/InfoCard";
import ToggleField from "../../components/fields/ToggleField";
import LoadingOverlay from "../../components/LoadingOverlay";
import { FOOD_TYPE_OPTIONS } from "../../constants/selectOptions";

const AddItemPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { itemId } = useQueryParams();

  const { outletId } = useSelector((state) => state.auth);
  const { isFetchingItemDetails, itemDetails, isCreatingItem, isUpdatingItem } =
    useSelector((state) => state.item);

  const { allCategories, loading: isFetchingCategory } = useSelector(
    (state) => state.category,
  );
  const { data } = allCategories || {};

  const { allTaxGroup, loading: isFetchingTaxGroup } = useSelector(
    (state) => state.tax,
  );
  const { allFloors, loading: isFetchingFloor } = useSelector(
    (state) => state.floor,
  );
  const { allKitchenStations, isFetchingKitchens } = useSelector(
    (state) => state.kitchen,
  );
  const { allAddonGroups } = useSelector((state) => state.addon);

  useEffect(() => {
    if (itemId) {
      dispatch(fetchItemsById(itemId));
    }
  }, [itemId, dispatch]);

  useEffect(() => {
    if (!outletId) return;

    dispatch(fetchAllCategories({ outletId }));
    // dispatch(fetchAllFloors(outletId));
    dispatch(fetchAllKitchenStations(outletId));
    dispatch(fetchAllAddonGroups(outletId));
    dispatch(fetchAllTaxGroups(outletId));
  }, [outletId, dispatch]);

  // Loading state
  if (isFetchingItemDetails && itemId) {
    return <LoadingOverlay text="Loading items details..." />;
  }

  const initialValues = {
    outletId: outletId || "",
    categoryId: "",
    name: "",
    shortName: "",
    description: "",
    itemType: "veg",
    basePrice: "",
    taxGroupId: "",
    taxEnabled: false,
    hasVariants: false,
    hasAddons: false,
    allowSpecialNotes: true,
    isActive: true,
    isOpenItem: false,
    minQuantity: 1,
    maxQuantity: 10,
    kitchenStationId: "",
    // floorIds: [],
    sectionIds: [],
    addonGroupIds: [],
    variants: [{ name: "", price: "", isDefault: true }],
    image: [],
  };

  const getInitialValues = () => {
    if (!itemId || !itemDetails) return initialValues;

    return {
      outletId: itemDetails.outlet_id || outletId,
      categoryId: itemDetails.category_id || "",
      name: itemDetails.name || "",
      shortName: itemDetails.short_name || "",
      description: itemDetails.description || "",
      itemType: itemDetails.item_type || "veg",

      basePrice: itemDetails.base_price || "",

      taxEnabled: Boolean(itemDetails.tax_enabled),
      taxGroupId: itemDetails.tax_enabled ? itemDetails.tax_group_id || "" : "",

      hasVariants: Boolean(itemDetails.has_variants),
      hasAddons: Boolean(itemDetails.has_addons),
      allowSpecialNotes: Boolean(itemDetails.allow_special_notes),

      isActive: itemDetails?.is_active ?? true, // ✅ ADD
      isOpenItem: Boolean(itemDetails.is_open_item),

      minQuantity: itemDetails.min_quantity || 1,
      maxQuantity: itemDetails.max_quantity || 10,
      kitchenStationId: itemDetails.kitchen_station_id || "",

      // floorIds:
      //   itemDetails.visibility?.floors
      //     ?.filter((f) => f.is_available)
      //     ?.map((f) => f.id) || [],

      sectionIds: [],

      addonGroupIds: itemDetails.addonGroups?.map((a) => a.id) || [],

      variants:
        itemDetails.variants?.length > 0
          ? itemDetails.variants.map((v) => ({
              name: v.name,
              price: v.price,
              isDefault: Boolean(v.is_default),
            }))
          : [{ name: "", price: "", isDefault: true }],

      image: itemDetails.image_url ? [itemDetails.image_url] : [],
    };
  };

  const validationSchema = Yup.object({
    outletId: Yup.string().required("Outlet is required"),
    categoryId: Yup.string().required("Category is required"),
    name: Yup.string().required("Product name is required"),
    shortName: Yup.string().max(50, "Short name too long"),
    itemType: Yup.string().required("Item type is required"),
    basePrice: Yup.number().when(["hasVariants", "isOpenItem"], {
      is: (hasVariants, isOpenItem) => !hasVariants && !isOpenItem,
      then: (schema) =>
        schema
          .typeError("Price must be a number")
          .required("Price is required")
          .min(0, "Price must be >= 0"),
      otherwise: (schema) => schema.notRequired(),
    }),

    taxGroupId: Yup.number().when("taxEnabled", {
      is: true,
      then: (schema) =>
        schema
          .typeError("Tax group is required")
          .required("Tax group is required"),
      otherwise: (schema) => schema.notRequired(),
    }),
    kitchenStationId: Yup.string().required("Kitchen station is required"),
    // floorIds: Yup.array().min(1, "Select at least one floor"),
    // sectionIds: Yup.array().min(1, "Select at least one section"),
    addonGroupIds: Yup.array(),
    variants: Yup.array().when("hasVariants", {
      is: true,
      then: (schema) =>
        schema
          .of(
            Yup.object({
              name: Yup.string().required("Variant name required"),
              price: Yup.number()
                .typeError("Price must be a number")
                .required("Price required")
                .min(0, "Price must be >= 0"),
              isDefault: Yup.boolean(),
            }),
          )
          .min(1, "Add at least one variant"),
      otherwise: (schema) => schema.notRequired(),
    }),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    const payload = {
      outletId: Number(values.outletId),
      categoryId: Number(values.categoryId),

      name: values.name.trim(),
      shortName: values.shortName?.trim() || null,
      description: values.description?.trim() || null,
      itemType: values.itemType,

      basePrice: values.hasVariants
        ? Number(values.variants?.[0]?.price) || 0
        : Number(values.basePrice),
      taxEnabled: Boolean(values.taxEnabled),
      taxGroupId: values.taxEnabled ? Number(values.taxGroupId) : null,

      hasVariants: Boolean(values.hasVariants),
      hasAddons: Boolean(values.hasAddons),
      allowSpecialNotes: Boolean(values.allowSpecialNotes),
      isActive: Boolean(values.isActive),
      isOpenItem: Boolean(values.isOpenItem),

      minQuantity: Number(values.minQuantity),
      maxQuantity: Number(values.maxQuantity),

      kitchenStationId: Number(values.kitchenStationId),

      // floorIds: (values.floorIds || []).map(Number),
      sectionIds: (values.sectionIds || []).map(Number),
      addonGroupIds: (values.addonGroupIds || []).map(Number),
    };

    // FILTER EMPTY VARIANTS
    const validVariants = (values.variants || []).filter(
      (v) => v.name?.trim() && Number(v.price) > 0,
    );

    if (validVariants.length > 0 && values.hasVariants) {
      payload.variants = validVariants.map((v, i) => ({
        name: v.name.trim(),
        price: Number(v.price),
        isDefault: i === 0 || Boolean(v.isDefault),
      }));
    }

    // SINGLE IMAGE
    if (values.image?.length) {
      payload.imageUrl = values.image[0];
    }

    const action = itemId
      ? updateItem({ id: itemId, values: payload })
      : createItem(payload);
    await handleResponse(dispatch(action), () => {
      navigate(-1);
    });

    // console.log("Final Payload:", payload);
  };

  return (
    <div className="space-y-6">
      <PageHeader title={itemId ? "Edit Item" : "Create Item"} showBackButton />

      <Formik
        initialValues={getInitialValues()}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {(formik) => (
          <Form className="space-y-8" autoComplete="off">
            {/* PRODUCT INFO */}
            <AccordionSection title="Product Info" icon={Info}>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-6">
                  {/* PRODUCT NAME */}
                  <InputField
                    label="Product Name"
                    name="name"
                    placeholder="Product Name"
                    required
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.name && formik.errors.name}
                  />

                  <InputField
                    label="Short Name"
                    name="shortName"
                    placeholder="Short name (e.g. Paneer Tikka)"
                    value={formik.values.shortName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.shortName && formik.errors.shortName}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* FLOORS */}
                  {/* <MultiSelectDropdownField
                    label="Floors"
                    name="floorIds"
                    required
                    disabled={!formik.values.outletId}
                    disabledText="Select outlet first"
                    loading={isFetchingFloor}
                    options={allFloors?.map((f) => ({
                      id: f.id,
                      label: f.name,
                    }))}
                    value={formik.values.floorIds}
                    onChange={(v) => {
                      formik.setFieldValue("floorIds", v);
                      formik.setFieldValue("sectionIds", []);
                      // dispatch(fetchSections(v))
                    }}
                    onBlur={formik.handleBlur}
                    error={formik.touched.floorIds && formik.errors.floorIds}
                  /> */}

                  {/* KITCHEN STATIONS  */}
                  <SelectField
                    label="Kitchen Station"
                    name="kitchenStationId"
                    required
                    disabled={!formik.values.outletId}
                    disabledText="Select outlet first"
                    loading={isFetchingKitchens}
                    options={allKitchenStations?.map((k) => ({
                      value: k.id,
                      label: k.name,
                    }))}
                    value={formik.values.kitchenStationId}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.kitchenStationId &&
                      formik.errors.kitchenStationId
                    }
                  />

                  {/* CATEGORY */}
                  <SelectField
                    label="Category"
                    name="categoryId"
                    required
                    disabled={!formik.values.outletId}
                    disabledText="Select outlet first"
                    loading={isFetchingCategory}
                    options={data?.map((c) => ({
                      value: c.id,
                      label: c.name,
                    }))}
                    value={formik.values.categoryId}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.categoryId && formik.errors.categoryId
                    }
                  />

                  {/* ITEM TYPE */}
                  <SelectField
                    label="Item Type"
                    name="itemType"
                    required
                    options={FOOD_TYPE_OPTIONS}
                    value={formik.values.itemType}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.itemType && formik.errors.itemType}
                  />
                  {/* SECTIONS */}
                  {/* <MultiSelectDropdownField
                  label="Sections"
                  name="sectionIds"
                  required
                  disabled={!formik.values.floorIds.length}
                  disabledText="Select floor first"
                  options={[]}
                  value={formik.values.sectionIds}
                  onChange={(v) => formik.setFieldValue("sectionIds", v)}
                  onBlur={formik.handleBlur}
                  error={formik.touched.sectionIds && formik.errors.sectionIds}
                /> */}
                </div>

                <TextareaField
                  label="Product Description"
                  name="description"
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  rows={3}
                />

                <ToggleField
                  label="Open Item"
                  description="Enable this to allow cashier to enter custom price/name while ordering."
                  checked={formik.values.isOpenItem}
                  onChange={(value) =>
                    formik.setFieldValue("isOpenItem", value)
                  }
                  activeColorClass="bg-indigo-600"
                />

                <ToggleField
                  label="Enable Item"
                  description="Disable this to hide the item from POS ordering without deleting it."
                  checked={formik.values.isActive}
                  onChange={(value) => formik.setFieldValue("isActive", value)}
                  activeColorClass="bg-emerald-600"
                  inactiveColorClass="bg-red-600"
                />
              </div>
            </AccordionSection>

            {/* PRICING & OPTIONS */}
            <AccordionSection title="Pricing & Options" icon={IndianRupee}>
              <div className="space-y-6">
                <ToggleField
                  label="Enable Tax"
                  description="Turn this on to apply tax to this item."
                  checked={formik.values.taxEnabled}
                  onChange={(value) => {
                    formik.setFieldValue("taxEnabled", value);

                    if (!value) {
                      formik.setFieldValue("taxGroupId", "");
                    } else if (
                      !formik.values.taxGroupId &&
                      allTaxGroup?.length
                    ) {
                      formik.setFieldValue("taxGroupId", allTaxGroup[0].id);
                    }
                  }}
                  activeColorClass="bg-indigo-600"
                />

                {/* TAX */}
                {formik.values.taxEnabled && (
                  <SelectField
                    label="Tax Group"
                    name="taxGroupId"
                    required
                    loading={isFetchingTaxGroup}
                    options={allTaxGroup?.map((t) => ({
                      value: t.id,
                      label: t.name,
                    }))}
                    value={formik.values.taxGroupId}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.taxGroupId && formik.errors.taxGroupId
                    }
                  />
                )}

                <ToggleField
                  label="Enable Size / Portion Variations"
                  description={
                    formik.values.isOpenItem
                      ? "Disabled because this is an open item"
                      : "Turn this on if the dish is available in multiple sizes"
                  }
                  checked={formik.values.hasVariants}
                  onChange={(value) =>
                    formik.setFieldValue("hasVariants", value)
                  }
                  activeColorClass="bg-indigo-600"
                  disabled={formik.values.isOpenItem}
                />

                {/* BASE PRICE – SHOW ONLY WHEN NO VARIANTS */}
                {!formik.values.hasVariants && (
                  <InputField
                    label="Base Price"
                    name="basePrice"
                    type="number"
                    placeholder="Price"
                    icon={IndianRupee}
                    required
                    value={formik.values.basePrice}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.basePrice && formik.errors.basePrice}
                    helperText={
                      formik.values.isOpenItem
                        ? "Price will be entered by cashier during billing (Open Item)"
                        : "Enter the standard product price"
                    }
                    disabled={formik.values.isOpenItem}
                  />
                )}

                {/* VARIANTS */}
                {formik.values.hasVariants && (
                  <FieldArray name="variants">
                    {({ push, remove }) => (
                      <>
                        <div className="space-y-4">
                          {formik.values.variants.map((variant, index) => (
                            <div
                              key={index}
                              className="border border-gray-200 rounded-lg p-5 bg-white shadow-xs hover:shadow transition-shadow duration-200"
                            >
                              <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-2">
                                  <div className="w-6 h-6 rounded-md bg-primary-200 flex items-center justify-center">
                                    <span className="text-xs font-semibold text-primary-700">
                                      {index + 1}
                                    </span>
                                  </div>
                                  <h4 className="font-medium text-gray-700">
                                    Variant {index + 1}
                                  </h4>
                                </div>
                                {formik.values.variants.length > 1 && (
                                  <button
                                    type="button"
                                    onClick={() => remove(index)}
                                    className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-1.5 rounded-md transition-colors"
                                    title="Remove variant"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                )}
                              </div>

                              <div className="grid grid-cols-1 lg:grid-cols-3 items-end gap-4">
                                {/* Variant Name */}
                                <InputField
                                  label="Variant Name"
                                  placeholder="e.g., Small, Medium, Large"
                                  required
                                  name={`variants.${index}.name`}
                                  value={variant.name}
                                  onChange={formik.handleChange}
                                  onBlur={formik.handleBlur}
                                  error={
                                    formik.touched.variants?.[index]?.name &&
                                    formik.errors.variants?.[index]?.name
                                  }
                                />

                                {/* Price */}
                                <InputField
                                  label="Price"
                                  placeholder="0.00"
                                  required
                                  type="number"
                                  min="0"
                                  step="0.01"
                                  name={`variants.${index}.price`}
                                  value={variant.price}
                                  onChange={formik.handleChange}
                                  onBlur={formik.handleBlur}
                                  error={
                                    formik.touched.variants?.[index]?.price &&
                                    formik.errors.variants?.[index]?.price
                                  }
                                  icon={IndianRupee}
                                />

                                {/* Default Selection */}
                                <div className="w-full flex items-center space-x-3 bg-gray-50 p-2 rounded-lg border border-gray-200">
                                  <RadioField
                                    label={
                                      variant.isDefault
                                        ? "Default"
                                        : "Make Default"
                                    }
                                    id={`default-${index}`}
                                    checked={variant.isDefault}
                                    onChange={() => {
                                      formik.values.variants.forEach((_, i) =>
                                        formik.setFieldValue(
                                          `variants.${i}.isDefault`,
                                          i === index,
                                        ),
                                      );
                                    }}
                                  />
                                </div>
                              </div>

                              {/* Status Indicator */}
                              {variant.isDefault && (
                                <div className="mt-4 flex items-center space-x-2 text-green-600 bg-green-50 px-3 py-2 rounded-md border border-green-100">
                                  <CheckCircle2 className="w-4 h-4" />
                                  <span className="text-xs font-medium">
                                    This variant will be selected by default
                                  </span>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>

                        {/* Add Variant Button */}
                        <button
                          type="button"
                          onClick={() =>
                            push({ name: "", price: "", isDefault: false })
                          }
                          className="w-full border-2 border-dashed border-gray-300 hover:border-primary-400 rounded-lg p-2 flex flex-col items-center justify-center space-y-2 hover:bg-primary-100 transition-all duration-200 group"
                        >
                          <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center group-hover:bg-primary-200 transition-colors">
                            <Plus className="w-5 h-5 text-primary-600" />
                          </div>
                          <span className="text-sm font-medium text-gray-700 group-hover:text-primary-600">
                            Add New Variant
                          </span>
                        </button>
                      </>
                    )}
                  </FieldArray>
                )}

                <ToggleField
                  label="Enable Add-Ons & Extras"
                  description={
                    formik.values.isOpenItem
                      ? "Disabled because this is an open item (cashier will customize directly)"
                      : "Turn this on to allow guests to select additional items such as toppings, sides, beverages, or special upgrades."
                  }
                  checked={formik.values.hasAddons}
                  onChange={(value) => formik.setFieldValue("hasAddons", value)}
                  activeColorClass="bg-emerald-600"
                  disabled={formik.values.isOpenItem}
                />

                {/* ADDON GROUPS */}
                {formik.values.hasAddons && (
                  <MultiSelectDropdownField
                    label="Addon Groups"
                    name="addonGroupIds"
                    options={allAddonGroups?.map((a) => ({
                      id: a.id,
                      label: a.name,
                    }))}
                    value={formik.values.addonGroupIds}
                    onChange={(v) => formik.setFieldValue("addonGroupIds", v)}
                    disabled={!formik.values.outletId}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.addonGroupIds &&
                      formik.errors.addonGroupIds
                    }
                    placeholder="Select addon groups"
                  />
                )}
              </div>
            </AccordionSection>

            {/* PRODUCT IMAGES */}
            <AccordionSection title="Product Image" icon={Image}>
              <div className="space-y-2">
                <DragDropUploader
                  value={formik.values.image}
                  onChange={(files) => formik.setFieldValue("image", files)}
                  multiple={false}
                  accept="image/*"
                  maxFiles={1}
                  enableCrop={true}
                  aspectRatio={1}
                  uploadToServer={true}
                />

                <p className="text-xs text-gray-500">
                  Upload a clear product image. Supported formats: JPG, PNG,
                  WEBP. Max size 5MB. You can crop before saving.
                </p>

                {/* Validation Error */}
                {formik.touched.image && formik.errors.image && (
                  <p className="text-xs text-red-500 mt-1">
                    {formik.errors.image}
                  </p>
                )}
              </div>
            </AccordionSection>

            <InfoCard
              type="info"
              title="Item Visibility"
              description="This item appears only in the selected category of the chosen outlet."
            />

            {/* SUBMIT */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={
                  isCreatingItem || isUpdatingItem || formik.isSubmitting
                }
                className="btn bg-primary-500 hover:bg-primary-600 text-white flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {(isCreatingItem || isUpdatingItem) && (
                  <Loader2 className="w-4 h-4 animate-spin" />
                )}

                {isCreatingItem || isUpdatingItem
                  ? itemId
                    ? "Updating..."
                    : "Creating..."
                  : itemId
                    ? "Update Product"
                    : "Create Product"}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default AddItemPage;
