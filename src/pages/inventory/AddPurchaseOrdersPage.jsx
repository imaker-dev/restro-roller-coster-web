import React, { useCallback, useEffect, useState } from "react";
import { Formik, Form, FieldArray } from "formik";
import * as Yup from "yup";
import PageHeader from "../../layout/PageHeader";
import AccordionSection from "../../components/AccordionSection";
import { InputField } from "../../components/fields/InputField";
import { SelectField } from "../../components/fields/SelectField";
import { TextareaField } from "../../components/fields/TextareaField";
import { Plus, Trash2, Package, Loader2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllUnits } from "../../redux/slices/unitSlice";
import {
  createPurchase,
  fetchAllInventoryItems,
} from "../../redux/slices/inventorySlice";
import { fetchVendors } from "../../redux/slices/vendorSlice";
import { handleResponse } from "../../utils/helpers";
import { useNavigate } from "react-router-dom";
import { SearchSelectField } from "../../components/fields/SearchSelectField";

const AddPurchaseOrderPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [searchItemQuery, setSearchItemQuery] = useState("");
  const { outletId } = useSelector((state) => state.auth);
  const { allVendorsData } = useSelector((state) => state.vendor);
  const { vendors } = allVendorsData || {};

  const { allItemsData, isCreatingPurchase, isFetchingItems } = useSelector(
    (state) => state.inventory,
  );
  const { items } = allItemsData || {};

  // ✅ Initial load
  useEffect(() => {
    if (!outletId) return;
    dispatch(fetchAllInventoryItems({ outletId, search: "" }));
  }, [outletId]);

  // ✅ Stable per-field search handler
  const handleItemSearch = useCallback(
    (query) => {
      if (outletId)
        dispatch(fetchAllInventoryItems({ outletId, search: query }));
    },
    [outletId, dispatch],
  );

  useEffect(() => {
    if (!outletId) return;
    dispatch(fetchVendors(outletId));
    dispatch(fetchAllUnits(outletId));
  }, [outletId]);

  /* ---------------- HELPERS ---------------- */

  const getError = (formik, name) => {
    const error = name
      .split(".")
      .reduce((acc, key) => acc?.[key], formik.errors);
    const touched = name
      .split(".")
      .reduce((acc, key) => acc?.[key], formik.touched);
    return touched && error ? error : null;
  };

  /* ---------------- INITIAL VALUES ---------------- */

  const initialValues = {
    vendorId: "",
    invoiceNumber: "",
    purchaseDate: "",
    taxAmount: "",
    discountAmount: "",
    paidAmount: "",
    notes: "",
    items: [
      {
        inventoryItemId: "",
        quantity: "",
        unitId: "",
        pricePerUnit: "",
        expiryDate: "",
        notes: "",
      },
    ],
  };

  /* ---------------- VALIDATION ---------------- */

  const validationSchema = Yup.object({
    vendorId: Yup.string().required("Vendor required"),
    purchaseDate: Yup.string().required("Purchase date required"),

    items: Yup.array()
      .of(
        Yup.object({
          inventoryItemId: Yup.string().required("Item required"),
          quantity: Yup.number()
            .typeError("Enter valid quantity")
            .min(0.001, "Must be greater than 0")
            .required("Qty required"),
          pricePerUnit: Yup.number()
            .typeError("Enter valid price")
            .min(0, "Must be >= 0")
            .required("Price required"),
        }),
      )
      .min(1, "Add at least one item"),
  });

  /* ---------------- SUBMIT ---------------- */

  const handleSubmit = async (values) => {
    await handleResponse(dispatch(createPurchase({ outletId, values })), () => {
      navigate(-1);
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Create Purchase Order" showBackButton />

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {(formik) => (
          <Form className="space-y-8">
            {/* PURCHASE INFO */}
            <AccordionSection title="Purchase Information" icon={Package}>
              <div className="grid md:grid-cols-3 gap-6 mb-6">
                <SelectField
                  label="Vendor"
                  name="vendorId"
                  required
                  placeholder="Select a vendor"
                  options={vendors?.map((v) => ({
                    value: v.id,
                    label: v.name,
                  }))}
                  value={formik.values.vendorId}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={getError(formik, "vendorId")}
                />

                <InputField
                  label="Invoice Number"
                  name="invoiceNumber"
                  placeholder="e.g. INV-2026-001"
                  value={formik.values.invoiceNumber}
                  onChange={formik.handleChange}
                />

                <InputField
                  label="Purchase Date"
                  type="date"
                  required
                  name="purchaseDate"
                  placeholder="Select purchase date"
                  value={formik.values.purchaseDate}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={getError(formik, "purchaseDate")}
                />
              </div>

              <TextareaField
                label="Notes"
                name="notes"
                placeholder="Add any notes about this purchase (optional)"
                value={formik.values.notes}
                onChange={formik.handleChange}
                rows={2}
              />
            </AccordionSection>

            {/* ITEMS */}
            <AccordionSection title="Purchase Items">
              <FieldArray name="items">
                {({ push, remove }) => (
                  <div className="space-y-4">
                    {formik.values.items.map((item, index) => {
                      const selectedItem = items?.find(
                        (i) => i.id === Number(item.inventoryItemId),
                      );

                      return (
                        <div
                          key={index}
                          className="border border-slate-200 rounded-lg p-5 bg-white space-y-4"
                        >
                          <SearchSelectField
                            label="Inventory Item"
                            name={`items.${index}.inventoryItemId`}
                            placeholder="Search item..."
                            required
                            value={item.inventoryItemId}
                            options={items?.map((i) => ({
                              value: i.id,
                              label: i.name,
                            }))}
                            onChange={(value) => {
                              formik.setFieldValue(
                                `items.${index}.inventoryItemId`,
                                value,
                              );

                              const selected = items.find(
                                (i) => i.id === Number(value),
                              );

                              if (selected) {
                                formik.setFieldValue(
                                  `items.${index}.unitId`,
                                  selected.unitId,
                                );

                                formik.setFieldValue(
                                  `items.${index}.pricePerUnit`,
                                  selected.latestPrice || "",
                                );
                              }
                            }}
                            onBlur={() =>
                              formik.setFieldTouched(
                                `items.${index}.inventoryItemId`,
                                true,
                              )
                            }
                            error={getError(
                              formik,
                              `items.${index}.inventoryItemId`,
                            )}
                            onSearch={handleItemSearch}
                            loading={isFetchingItems}
                          />
                          <div className="grid md:grid-cols-4 gap-4">
                            {/* UNIT (LOCKED) */}
                            <InputField
                              label="Unit"
                              placeholder="Auto-selected"
                              value={selectedItem?.unitAbbreviation || ""}
                              disabled
                            />

                            {/* QUANTITY */}
                            <InputField
                              label="Quantity"
                              type="number"
                              required
                              name={`items.${index}.quantity`}
                              placeholder={`e.g. 5 ${
                                selectedItem?.unitAbbreviation || ""
                              }`}
                              value={item.quantity}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              error={getError(
                                formik,
                                `items.${index}.quantity`,
                              )}
                            />

                            {/* PRICE */}
                            <InputField
                              label="Price / Unit"
                              type="number"
                              required
                              name={`items.${index}.pricePerUnit`}
                              placeholder="e.g. 50.00"
                              value={item.pricePerUnit}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              error={getError(
                                formik,
                                `items.${index}.pricePerUnit`,
                              )}
                            />

                            {/* EXPIRY */}
                            <InputField
                              label="Expiry Date"
                              type="date"
                              name={`items.${index}.expiryDate`}
                              placeholder="Select expiry date"
                              value={item.expiryDate}
                              onChange={formik.handleChange}
                            />
                          </div>

                          {/* STOCK INFO */}
                          {selectedItem && (
                            <p className="text-xs text-slate-400">
                              Stock: {selectedItem.currentStock}{" "}
                              {selectedItem.unitAbbreviation}
                            </p>
                          )}

                          <TextareaField
                            label="Item Notes"
                            name={`items.${index}.notes`}
                            placeholder="e.g. Fresh stock, urgent use"
                            value={item.notes}
                            onChange={formik.handleChange}
                            rows={2}
                          />

                          {formik.values.items.length > 1 && (
                            <button
                              type="button"
                              onClick={() => remove(index)}
                              className="text-red-500 flex items-center gap-2 text-sm"
                            >
                              <Trash2 size={16} />
                              Remove Item
                            </button>
                          )}
                        </div>
                      );
                    })}

                    {/* ADD ITEM */}
                    <button
                      type="button"
                      onClick={() =>
                        push({
                          inventoryItemId: "",
                          quantity: "",
                          unitId: "",
                          pricePerUnit: "",
                          expiryDate: "",
                          notes: "",
                        })
                      }
                      className="flex items-center gap-2 text-primary-600"
                    >
                      <Plus size={18} />
                      Add Item
                    </button>
                  </div>
                )}
              </FieldArray>
            </AccordionSection>

            {/* SUMMARY */}
            <AccordionSection title="Payment & Summary">
              <div className="grid md:grid-cols-3 gap-6">
                <InputField
                  label="Tax Amount"
                  type="number"
                  name="taxAmount"
                  placeholder="e.g. 100"
                  value={formik.values.taxAmount}
                  onChange={formik.handleChange}
                />

                <InputField
                  label="Discount Amount"
                  type="number"
                  name="discountAmount"
                  placeholder="e.g. 50"
                  value={formik.values.discountAmount}
                  onChange={formik.handleChange}
                />

                <InputField
                  label="Paid Amount"
                  type="number"
                  name="paidAmount"
                  placeholder="e.g. 1500"
                  value={formik.values.paidAmount}
                  onChange={formik.handleChange}
                />
              </div>
            </AccordionSection>

            {/* SUBMIT */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isCreatingPurchase}
                className="btn bg-primary-500 hover:bg-primary-600 text-white flex items-center gap-2"
              >
                {isCreatingPurchase && (
                  <Loader2 className="w-4 h-4 animate-spin" />
                )}
                {isCreatingPurchase ? "Creating..." : "Create Purchase Order"}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default AddPurchaseOrderPage;
