import React, { useEffect } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import PageHeader from "../../layout/PageHeader";
import AccordionSection from "../../components/AccordionSection";
import { InputField } from "../../components/fields/InputField";
import { SelectField } from "../../components/fields/SelectField";
import { TextareaField } from "../../components/fields/TextareaField";
import ToggleField from "../../components/fields/ToggleField";
import { Info, Loader2, Package } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useQueryParams } from "../../hooks/useQueryParams";
import { handleResponse } from "../../utils/helpers";

import {
  createInventoryItem,
  updateInventoryItem,
  fetchInventoryItemById,
  fetchAllInventoryCategories,
} from "../../redux/slices/inventorySlice";

import { fetchAllUnits } from "../../redux/slices/unitSlice";
import LoadingOverlay from "../../components/LoadingOverlay";
import { ROUTE_PATHS } from "../../config/paths";

const AddInventoryItemPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { itemId } = useQueryParams();

  const { outletId } = useSelector((state) => state.auth);

  const {
    inventoryItemDetails,
    isFetchingItemDetails,
    isCreatingItem,
    isUpdatingItem,
    allCategories,
  } = useSelector((state) => state.inventory);
  const { categories } = allCategories || {};
  const { allUnits } = useSelector((state) => state.unit);
  const { units } = allUnits || {};

  useEffect(() => {
    if (!outletId) return;
    dispatch(fetchAllInventoryCategories(outletId));
    dispatch(fetchAllUnits(outletId));
  }, [dispatch, outletId]);

  useEffect(() => {
    if (itemId) {
      dispatch(fetchInventoryItemById(itemId));
    }
  }, [itemId, dispatch]);

  const initialValues = {
    name: "",
    // sku: "",
    categoryId: "",
    baseUnitId: "",
    minimumStock: "",
    maximumStock: "",
    description: "",
    isPerishable: false,
    shelfLifeDays: "",
  };

  const getInitialValues = () => {
    if (!itemId || !inventoryItemDetails) return initialValues;

    return {
      name: inventoryItemDetails.name || "",
      // sku: inventoryItemDetails.sku || "",
      categoryId: inventoryItemDetails.categoryId || "",
      baseUnitId: inventoryItemDetails.unitId || "",
      minimumStock: inventoryItemDetails.minimumStock || "",
      maximumStock: inventoryItemDetails.maximumStock || "",
      description: inventoryItemDetails.description || "",
      isPerishable: Boolean(inventoryItemDetails.isPerishable),
      shelfLifeDays: inventoryItemDetails.shelfLifeDays || "",
    };
  };

  const validationSchema = Yup.object({
    name: Yup.string().required("Item name is required"),
    // sku: Yup.string().required("SKU is required"),
    categoryId: Yup.string().required("Category is required"),
    baseUnitId: Yup.string().required("Base unit is required"),

    minimumStock: Yup.number()
      .typeError("Must be number")
      .required("Minimum stock required"),

    maximumStock: Yup.number()
      .typeError("Must be number")
      .required("Maximum stock required")
      .min(Yup.ref("minimumStock"), "Must be greater than minimum stock"),

    shelfLifeDays: Yup.number().when("isPerishable", {
      is: true,
      then: (schema) =>
        schema.typeError("Must be number").required("Shelf life required"),
      otherwise: (schema) => schema.notRequired(),
    }),
  });

  const handleSubmit = async (values) => {
    const payload = {
      name: values.name.trim(),
      // sku: values.sku.trim(),
      categoryId: Number(values.categoryId),
      baseUnitId: Number(values.baseUnitId),
      minimumStock: Number(values.minimumStock),
      maximumStock: Number(values.maximumStock),
      description: values.description?.trim() || null,
      isPerishable: Boolean(values.isPerishable),
      shelfLifeDays: values.isPerishable ? Number(values.shelfLifeDays) : null,
    };

    const action = itemId
      ? updateInventoryItem({ id: itemId, values: payload })
      : createInventoryItem({ outletId, values: payload });

    await handleResponse(dispatch(action), () => {
      navigate(ROUTE_PATHS.ALL_INVENTORY_ITEMS);
    });
  };

  if (itemId && isFetchingItemDetails) return <LoadingOverlay text="" />;

  return (
    <div className="space-y-6">
      <PageHeader
        title={itemId ? "Edit Inventory Item" : "Create Inventory Item"}
        showBackButton
      />

      <Formik
        initialValues={getInitialValues()}
        validationSchema={validationSchema}
        enableReinitialize
        onSubmit={handleSubmit}
      >
        {(formik) => (
          <Form className="space-y-8">
            {/* ITEM INFORMATION */}
            <AccordionSection title="Item Information" icon={Info}>
              <div className="space-y-4">
                <InputField
                  label="Item Name"
                  name="name"
                  placeholder="Enter item name (e.g., Tomato)"
                  required
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.name && formik.errors.name}
                />

                {/* <InputField
                  label="SKU"
                  name="sku"
                  placeholder="Enter SKU (e.g., VEG-001)"
                  required
                  value={formik.values.sku}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.sku && formik.errors.sku}
                /> */}

                <div className="grid md:grid-cols-2 gap-6">
                  <SelectField
                    label="Category"
                    name="categoryId"
                    placeholder="Select category"
                    required
                    options={categories?.map((c) => ({
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

                  <SelectField
                    label="Base Unit"
                    name="baseUnitId"
                    placeholder="Select base unit (e.g., Kg, Gram, Piece)"
                    required
                    options={units?.map((u) => ({
                      value: u.id,
                      label: `${u.name} (${u.abbreviation})`,
                    }))}
                    value={formik.values.baseUnitId}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.baseUnitId && formik.errors.baseUnitId
                    }
                  />
                </div>

                <TextareaField
                  label="Description"
                  name="description"
                  placeholder="Enter item description (optional)"
                  rows={3}
                  value={formik.values.description}
                  onChange={formik.handleChange}
                />
              </div>
            </AccordionSection>

            {/* STOCK SETTINGS */}
            <AccordionSection title="Stock Settings" icon={Package}>
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-6">
                  <InputField
                    label="Minimum Stock"
                    name="minimumStock"
                    type="number"
                    placeholder="Enter minimum stock level (e.g., 5000)"
                    required
                    value={formik.values.minimumStock}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.minimumStock && formik.errors.minimumStock
                    }
                  />

                  <InputField
                    label="Maximum Stock"
                    name="maximumStock"
                    type="number"
                    placeholder="Enter maximum stock level (e.g., 100000)"
                    required
                    value={formik.values.maximumStock}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.maximumStock && formik.errors.maximumStock
                    }
                  />
                </div>

                <ToggleField
                  label="Perishable Item"
                  description="Enable this if the item expires after a certain number of days."
                  checked={formik.values.isPerishable}
                  onChange={(value) =>
                    formik.setFieldValue("isPerishable", value)
                  }
                  activeColorClass="bg-emerald-600"
                />

                {formik.values.isPerishable && (
                  <InputField
                    label="Shelf Life (Days)"
                    name="shelfLifeDays"
                    type="number"
                    placeholder="Enter shelf life in days (e.g., 7)"
                    required
                    value={formik.values.shelfLifeDays}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.shelfLifeDays &&
                      formik.errors.shelfLifeDays
                    }
                  />
                )}
              </div>
            </AccordionSection>

            {/* SUBMIT */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isCreatingItem || isUpdatingItem}
                className="btn bg-primary-500 hover:bg-primary-600 text-white flex items-center gap-2"
              >
                {(isCreatingItem || isUpdatingItem) && (
                  <Loader2 className="h-4 w-4 animate-spin" />
                )}

                {itemId
                  ? isUpdatingItem
                    ? "Updating..."
                    : "Update Item"
                  : isCreatingItem
                    ? "Creating..."
                    : "Create Item"}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default AddInventoryItemPage;
