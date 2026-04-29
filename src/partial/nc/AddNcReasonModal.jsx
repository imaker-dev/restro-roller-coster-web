import React from "react";
import ModalBasic from "../../components/ModalBasic";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Loader2 } from "lucide-react";
import { InputField } from "../../components/fields/InputField";
import InfoCard from "../../components/InfoCard";
import ToggleField from "../../components/fields/ToggleField";

const validationSchema = Yup.object({
  name: Yup.string()
    .trim()
    .required("Reason name is required")
    .min(2, "Too short")
    .max(50, "Too long"),

  description: Yup.string()
    .trim()
    .required("Description is required")
    .min(5, "Too short")
    .max(200, "Description too long"),

  isActive: Yup.boolean(),
});

const AddNcReasonModal = ({
  isOpen,
  onClose,
  onSubmit,
  reason,
  loading = false,
}) => {
  const isEditMode = !!reason;

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: reason?.name || "",
      description: reason?.description || "",
      isActive: reason ? Boolean(reason.isActive) : true,
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      if (isEditMode) {
        await onSubmit({
          id: reason.id,
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
      id="nc-reason-modal"
      title={isEditMode ? "Update NC Reason" : "Add NC Reason"}
      isOpen={isOpen}
      onClose={onClose}
    >
      <form
        onSubmit={formik.handleSubmit}
        autoComplete="off"
        className="p-4 space-y-4"
      >
        {/* Reason Name */}
        <InputField
          label="Reason Name"
          name="name"
          required
          placeholder="Example: VIP Guest"
          value={formik.values.name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.name && formik.errors.name}
          autoComplete="off"
        />

        {/* Description */}
        <InputField
          label="Description"
          name="description"
          required
          placeholder="Example: Complimentary for VIP guests"
          value={formik.values.description}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.description && formik.errors.description}
          autoComplete="off"
        />

        {/* Active Toggle */}
        <ToggleField
          label="Enable Reason"
          description="Disable to hide this reason from POS when applying No Charge."
          checked={formik.values.isActive}
          onChange={(value) => formik.setFieldValue("isActive", value)}
        />

        <InfoCard
          size="sm"
          type="info"
          title="No Charge Reason"
          description={
            isEditMode
              ? "Updating this reason will change how it appears when applying No Charge to an order."
              : "This reason will appear when staff applies a No Charge to an order."
          }
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

export default AddNcReasonModal;