import React from "react";
import ModalBasic from "../../components/ModalBasic";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Loader2 } from "lucide-react";
import { InputField } from "../../components/fields/InputField";
import { CheckboxField } from "../../components/fields/CheckboxField";
import { SelectField } from "../../components/fields/SelectField";
import InfoCard from "../../components/InfoCard";

const validationSchema = Yup.object({
  name: Yup.string()
    .trim()
    .required("Group name is required")
    .min(2, "Too short")
    .max(50, "Too long"),

  description: Yup.string().trim().max(200, "Too long"),

  selectionType: Yup.string()
    .oneOf(["single", "multiple"])
    .required("Selection type required"),

  minSelection: Yup.number()
    .nullable()
    .transform((value, originalValue) => (originalValue === "" ? null : value))
    .when("selectionType", {
      is: "multiple",
      then: (schema) =>
        schema.required("Minimum required").min(0, "Cannot be negative"),
      otherwise: (schema) => schema.nullable(),
    }),

  maxSelection: Yup.number()
    .nullable()
    .transform((value, originalValue) => (originalValue === "" ? null : value))
    .when("selectionType", {
      is: "multiple",
      then: (schema) =>
        schema
          .required("Maximum required")
          .min(Yup.ref("minSelection"), "Max must be ≥ Min"),
      otherwise: (schema) => schema.nullable(),
    }),

  isRequired: Yup.boolean(),
});

const AddonGroupModal = ({
  isOpen,
  onClose,
  onSubmit,
  addonGroup,
  outletId,
  loading = false,
}) => {
  const isEditMode = !!addonGroup;

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      outletId: addonGroup?.outlet_id || outletId || "",
      name: addonGroup?.name || "",
      description: addonGroup?.description || "",
      selectionType: addonGroup?.selection_type || "single",
      minSelection: addonGroup?.min_selection,
      maxSelection: addonGroup?.max_selection,
      isRequired: addonGroup ? Boolean(addonGroup.is_required) : false,
    },
    validationSchema,

    onSubmit: async (values, { resetForm }) => {
      if (isEditMode) {
        await onSubmit({
          id: addonGroup.id,
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

  const handleSelectionTypeChange = (e) => {
    formik.handleChange(e);
  };

  return (
    <ModalBasic
      id="addon-group-modal"
      title={isEditMode ? "Update Addon Group" : "Add Addon Group"}
      isOpen={isOpen}
      onClose={onClose}
    >
      <form
        onSubmit={formik.handleSubmit}
        autoComplete="off"
        className="p-4 space-y-5"
      >
        {/* GROUP NAME */}
        <InputField
          label="Group Name"
          name="name"
          required
          placeholder="e.g. Drink Size, Pizza Toppings"
          value={formik.values.name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.name && formik.errors.name}
        />

        {/* DESCRIPTION */}
        <InputField
          label="Description"
          name="description"
          placeholder="Optional short note"
          value={formik.values.description}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.description && formik.errors.description}
        />

        {/* SELECTION TYPE */}
        <SelectField
          label="Selection Type"
          name="selectionType"
          options={[
            { value: "single", label: "Single – Only one option allowed" },
            { value: "multiple", label: "Multiple – More than one allowed" },
          ]}
          value={formik.values.selectionType}
          onChange={handleSelectionTypeChange}
        />

        {formik.values.selectionType === "multiple" && (
          <div className="grid grid-cols-2 gap-4">
            <InputField
              label="Minimum Selection"
              name="minSelection"
              type="number"
              placeholder="0"
              value={formik.values.minSelection}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.minSelection && formik.errors.minSelection}
            />

            <InputField
              label="Maximum Selection"
              name="maxSelection"
              type="number"
              placeholder="5"
              value={formik.values.maxSelection}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.maxSelection && formik.errors.maxSelection}
            />
          </div>
        )}

        {/* REQUIRED */}
        <div>
          <CheckboxField
            label="Selection Required"
            name="isRequired"
            checked={formik.values.isRequired}
            onChange={formik.handleChange}
          />
          <p className="text-xs text-slate-500 mt-1">
            Customer must select at least one option before adding to cart.
          </p>
        </div>

        <InfoCard
          size="sm"
          type="info"
          title="Addon Group Scope"
          description={
            isEditMode
              ? "Updating this addon group will modify its selection rules and availability within the selected outlet only."
              : "This addon group will be created for the selected outlet and can be assigned to products within that outlet."
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

export default AddonGroupModal;
