import React from "react";
import ModalBasic from "../../components/ModalBasic";
import { useFormik } from "formik";
import * as Yup from "yup";
import { IndianRupee, Loader2 } from "lucide-react";
import { InputField } from "../../components/fields/InputField";
import { SelectField } from "../../components/fields/SelectField";
import { FOOD_TYPES } from "../../constants";
import InfoCard from "../../components/InfoCard";

const validationSchema = Yup.object({
  name: Yup.string()
    .trim()
    .required("Item name is required")
    .min(2, "Too short")
    .max(50, "Too long"),

  price: Yup.number()
    .typeError("Price must be a number")
    .min(0, "Cannot be negative")
    .required("Price required"),

  itemType: Yup.string()
    .oneOf([FOOD_TYPES.VEG, FOOD_TYPES.NON_VEG, FOOD_TYPES.EGG])
    .required("Item type required"),
});

const AddonItemModal = ({
  isOpen,
  onClose,
  onSubmit,
  addonItem,
  addonGroupId,
  loading = false,
}) => {
  const isEditMode = !!addonItem;

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      addonGroupId: addonItem?.addon_group_id || addonGroupId,
      name: addonItem?.name || "",
      price: addonItem?.price ?? "",
      itemType: addonItem?.item_type || "veg",
    },
    validationSchema,

    onSubmit: async (values, { resetForm }) => {
      if (isEditMode) {
        await onSubmit({
          id: addonItem.id,
          values,
          resetForm,
        });
      } else {
        await onSubmit({
          values,
          resetForm,
        });
      }
    },
  });

  return (
    <ModalBasic
      id="addon-item-modal"
      title={isEditMode ? "Update Addon Item" : "Add Addon Item"}
      isOpen={isOpen}
      onClose={onClose}
    >
      <form
        onSubmit={formik.handleSubmit}
        autoComplete="off"
        className="p-4 space-y-5"
      >
        {/* ITEM NAME */}
        <InputField
          label="Item Name"
          name="name"
          required
          placeholder="e.g. Extra Cheese"
          value={formik.values.name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.name && formik.errors.name}
        />

        {/* PRICE */}
        <InputField
          label="Price"
          name="price"
          type="number"
          required
          placeholder="e.g. 50"
          value={formik.values.price}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.price && formik.errors.price}
          icon={IndianRupee}
        />

        {/* ITEM TYPE */}
        <SelectField
          label="Item Type"
          name="itemType"
          options={[
            { value: FOOD_TYPES.VEG, label: "Veg 🟢" },
            { value: FOOD_TYPES.NON_VEG, label: "Non-Veg 🔴" },
            { value: FOOD_TYPES.EGG, label: "Egg 🟡" },
          ]}
          value={formik.values.itemType}
          onChange={formik.handleChange}
        />

        <InfoCard
          size="sm"
          type="info"
          title="Addon Item Scope"
          description={
            isEditMode
              ? "Updating this addon item will modify its price, type, or availability within the selected addon group."
              : "This addon item will be added to the selected addon group and will be available only for products linked to that group."
          }
        />

        {/* FOOTER */}
        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="btn border border-slate-200 text-slate-600 hover:bg-slate-50"
            disabled={loading}
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading || !formik.isValid}
            className="btn bg-primary-500 text-white hover:bg-primary-600 disabled:opacity-50 flex items-center gap-2"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {loading
              ? isEditMode
                ? "Updating..."
                : "Saving..."
              : isEditMode
                ? "Update"
                : "Save"}
          </button>
        </div>
      </form>
    </ModalBasic>
  );
};

export default AddonItemModal;
