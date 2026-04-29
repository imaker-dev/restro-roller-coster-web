import React from "react";
import ModalBasic from "../../components/ModalBasic";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Loader2 } from "lucide-react";
import { InputField } from "../../components/fields/InputField";
import { CheckboxField } from "../../components/fields/CheckboxField";

const validationSchema = Yup.object({
  name: Yup.string()
    .trim()
    .required("Floor name is required")
    .min(2, "Too short")
    .max(50, "Too long"),

  code: Yup.string()
    .trim()
    .required("Floor code is required")
    .max(10, "Max 10 characters"),

  floorNumber: Yup.number()
    .typeError("Floor number must be a number")
    .required("Floor number is required")
    .min(0, "Invalid number")
    .max(100, "Too large"),

  displayOrder: Yup.number()
    .typeError("Display order must be a number")
    .required("Display order is required")
    .min(0, "Invalid order")
    .max(1000, "Too large"),

  description: Yup.string()
    .trim()
    .required("Description is required")
    .min(3, "Too short")
    .max(200, "Too long"),

  isActive: Yup.boolean(),
});

const FloorModal = ({
  isOpen,
  onClose,
  onSubmit,
  floor,
  outletId,
  loading = false,
}) => {
  const isEditMode = !!floor;

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      outletId: floor?.outlet_id || outletId || "",
      name: floor?.name || "",
      code: floor?.code || "",
      floorNumber: floor?.floor_number ?? "",
      displayOrder: floor?.display_order ?? "", // NEW
      description: floor?.description || "",
      isActive: floor ? Boolean(floor.is_active) : true,
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      const payload = {
        ...values,
        floorNumber: Number(values.floorNumber),
        displayOrder: Number(values.displayOrder),
      };

      if (isEditMode) {
        await onSubmit({
          id: floor.id,
          values: payload,
          resetForm,
        });
      } else {
        await onSubmit({
          values: payload,
          resetForm,
        });
      }
    },
  });

  return (
    <ModalBasic
      id="floor-modal"
      title={isEditMode ? "Update Floor" : "Add Floor"}
      isOpen={isOpen}
      onClose={onClose}
    >
      <form
        onSubmit={formik.handleSubmit}
        autoComplete="off"
        className="p-4 space-y-4"
      >
        {/* Floor Name */}
        <InputField
          label="Floor Name"
          name="name"
          required
          placeholder="e.g. Ground Floor"
          value={formik.values.name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.name && formik.errors.name}
        />

        {/* Floor Code */}
        <InputField
          label="Floor Code"
          name="code"
          required
          placeholder="e.g. GF, F1"
          value={formik.values.code}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.code && formik.errors.code}
        />

        {/* Floor Number */}
        <InputField
          label="Floor Number"
          name="floorNumber"
          type="number"
          required
          placeholder="1, 2, 3"
          value={formik.values.floorNumber}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.floorNumber && formik.errors.floorNumber}
        />

        {/* Display Order */}
        <InputField
          label="Display Order"
          name="displayOrder"
          type="number"
          required
          placeholder="1, 2, 3"
          tooltip="This sets the order in which the floor appears in the list. It does not change the actual floor number."
          value={formik.values.displayOrder}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.displayOrder && formik.errors.displayOrder}
          helperText="Lower numbers appear first."
        />

        {/* Description */}
        <InputField
          label="Description"
          name="description"
          required
          placeholder="Enter floor description"
          value={formik.values.description}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.description && formik.errors.description}
        />

        {/* Active Checkbox */}
        <CheckboxField
          label="Enable Floor"
          name="isActive"
          checked={formik.values.isActive}
          onChange={formik.handleChange}
        />

        {/* Footer Buttons */}
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

export default FloorModal;
