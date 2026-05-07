import React, { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Loader2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import ModalBasic from "../../components/ModalBasic";
import { InputField } from "../../components/fields/InputField";
import ToggleField from "../../components/fields/ToggleField";
import { TextareaField } from "../../components/fields/TextareaField";
import { fetchAllTaxTypes } from "../../redux/slices/taxSlice";
import { SelectField } from "../../components/fields/SelectField";

const validationSchema = Yup.object({
  taxTypeId: Yup.number()
    .typeError("Tax type is required")
    .required("Tax type is required")
    .positive("Invalid tax type"),

  name: Yup.string()
    .trim()
    .required("Component name is required")
    .min(2, "Too short")
    .max(50, "Too long"),

  code: Yup.string()
    .trim()
    .required("Component code is required")
    .min(2, "Too short")
    .max(20, "Too long")
    .matches(
      /^[A-Z0-9._]+$/,
      "Only uppercase letters, numbers, dot and underscore",
    ),

  rate: Yup.number()
    .typeError("Rate must be a number")
    .required("Rate is required")
    .min(0, "Rate cannot be negative")
    .max(100, "Rate cannot exceed 100%"),

  description: Yup.string().trim().max(255, "Too long"),

  isActive: Yup.boolean(),
});

const AddTaxComponentModal = ({
  isOpen,
  onClose,
  onSubmit,
  loading = false,
  initialData = null,
}) => {
  const dispatch = useDispatch();
  const { allTaxTypes, isFetchingTaxTypes } = useSelector((state) => state.tax);
  const isEditMode = !!initialData;

  useEffect(() => {
    if (isOpen) {
      dispatch(fetchAllTaxTypes());
    }
  }, [isOpen, dispatch]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      taxTypeId: initialData?.tax_type_id || "",
      name: initialData?.name || "",
      code: initialData?.code || "",
      rate: initialData?.rate || "",
      description: initialData?.description || "",
      isActive: initialData ? Boolean(initialData.is_active) : true,
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      const payload = {
        taxTypeId: parseInt(values.taxTypeId),
        name: values.name,
        code: values.code,
        rate: parseFloat(values.rate),
        description: values.description || null,
        isActive: values.isActive,
      };

      await onSubmit({
        values: payload,
        resetForm,
        id: initialData?.id,
      });
    },
  });

  const taxTypeOptions = allTaxTypes
    ? allTaxTypes
        .filter((type) => type.is_active || type.id === initialData?.tax_type_id)
        .map((type) => ({
          label: `${type.name} (${type.code})`,
          value: type.id,
        }))
    : [];

  return (
    <ModalBasic
      id="add-tax-component-modal"
      title={isEditMode ? "Update Tax Component" : "Add Tax Component"}
      isOpen={isOpen}
      onClose={() => {
        onClose();
      }}
    >
      <form
        onSubmit={formik.handleSubmit}
        autoComplete="off"
        className="p-4 space-y-4"
      >
        <SelectField
          label="Tax Type"
          name="taxTypeId"
          required
          placeholder="Select tax type"
          value={formik.values.taxTypeId}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.taxTypeId && formik.errors.taxTypeId}
          options={taxTypeOptions}
          loading={isFetchingTaxTypes}
        />

        <div className="grid grid-cols-2 gap-4">
          <InputField
            label="Component Name"
            name="name"
            required
            placeholder="e.g. CGST 2.5%"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.name && formik.errors.name}
          />

          <InputField
            label="Component Code"
            name="code"
            required
            placeholder="e.g. CGST_2.5"
            value={formik.values.code}
            onChange={(e) => {
              const uppercased = e.target.value.toUpperCase();
              formik.setFieldValue("code", uppercased);
            }}
            onBlur={formik.handleBlur}
            error={formik.touched.code && formik.errors.code}
          />
        </div>

        <InputField
          label="Rate (%)"
          name="rate"
          type="number"
          required
          placeholder="e.g. 2.5"
          value={formik.values.rate}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.rate && formik.errors.rate}
          step="0.01"
        />

        <TextareaField
          label="Description"
          name="description"
          placeholder="Enter component description (optional)"
          value={formik.values.description}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.description && formik.errors.description}
          rows={3}
        />

        <ToggleField
          label="Active"
          description="Enable or disable this tax component"
          checked={formik.values.isActive}
          onChange={(value) => formik.setFieldValue("isActive", value)}
          activeColorClass="bg-emerald-600"
        />

        {/* Footer Buttons */}
        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={() => {
              onClose();
            }}
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
            {loading
              ? isEditMode
                ? "Updating..."
                : "Adding..."
              : isEditMode
                ? "Update Component"
                : "Add Component"}
          </button>
        </div>
      </form>
    </ModalBasic>
  );
};

export default AddTaxComponentModal;