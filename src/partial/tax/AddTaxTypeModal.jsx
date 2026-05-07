import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Loader2 } from "lucide-react";

import ModalBasic from "../../components/ModalBasic";
import { InputField } from "../../components/fields/InputField";
import { TextareaField } from "../../components/fields/TextareaField";
import ToggleField from "../../components/fields/ToggleField";

const validationSchema = Yup.object({
  name: Yup.string()
    .trim()
    .required("Tax name is required")
    .min(2, "Too short")
    .max(50, "Too long"),
  
  code: Yup.string()
    .trim()
    .required("Tax code is required")
    .min(2, "Too short")
    .max(10, "Too long")
    .matches(/^[A-Z0-9_]+$/, "Only uppercase letters, numbers and underscore"),
  
  description: Yup.string()
    .trim()
    .max(200, "Too long"),
  
  is_active: Yup.boolean(),
});

const AddTaxTypeModal = ({ isOpen, onClose, onSubmit, loading = false }) => {
  const formik = useFormik({
    initialValues: {
      name: "",
      code: "",
      description: "",
      is_active: true,
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      await onSubmit({
        values,
        resetForm,
      });
    },
  });

  return (
    <ModalBasic
      id="add-tax-type-modal"
      title="Add Tax Type"
      isOpen={isOpen}
      onClose={onClose}
    >
      <form onSubmit={formik.handleSubmit} autoComplete="off" className="p-4 space-y-4">
        <InputField
          label="Tax Name"
          name="name"
          required
          placeholder="e.g. Goods and Services Tax"
          value={formik.values.name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.name && formik.errors.name}
        />

        <InputField
          label="Tax Code"
          name="code"
          required
          placeholder="e.g. GST"
          value={formik.values.code}
          onChange={(e) => {
            const uppercased = e.target.value.toUpperCase();
            formik.setFieldValue("code", uppercased);
          }}
          onBlur={formik.handleBlur}
          error={formik.touched.code && formik.errors.code}
        />

        <TextareaField
          label="Description"
          name="description"
          placeholder="Enter tax description (optional)"
          value={formik.values.description}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.description && formik.errors.description}
          rows={3}
        />

        <ToggleField
          label="Active"
          description="Enable or disable this tax type"
          checked={formik.values.is_active}
          onChange={(value) => formik.setFieldValue("is_active", value)}
          activeColorClass="bg-emerald-600"
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
            disabled={loading || !formik.isValid || !formik.dirty}
            className="btn bg-primary-500 text-white hover:bg-primary-600 disabled:opacity-50 flex items-center gap-2"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {loading ? "Adding..." : "Add Tax Type"}
          </button>
        </div>
      </form>
    </ModalBasic>
  );
};

export default AddTaxTypeModal;