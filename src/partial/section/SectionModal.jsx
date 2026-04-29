import React from "react";
import ModalBasic from "../../components/ModalBasic";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Loader2 } from "lucide-react";
import { InputField } from "../../components/fields/InputField";
import { CheckboxField } from "../../components/fields/CheckboxField";
import { SECTION_TYPE_OPTIONS } from "../../constants/selectOptions";
import { SelectField } from "../../components/fields/SelectField";
import InfoCard from "../../components/InfoCard";

const validationSchema = Yup.object({
  name: Yup.string().trim().required("Section name is required").max(50),

  code: Yup.string().required("Code is required").max(20),

  sectionType: Yup.string().required("Section type is required"),

  description: Yup.string().required("Description is required").max(255),

  colorCode: Yup.string().required("Color code is required"),

  displayOrder: Yup.number()
    .typeError("Display order must be a number")
    .integer("Display order must be an integer")
    .required("Display order is required"),

  isActive: Yup.boolean().required("Status is required"),
});

const SectionModal = ({
  isOpen,
  onClose,
  onSubmit,
  section,
  outletId,
  floorId,
  loading = false,
}) => {
  const isEditMode = !!section;

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      outletId: section?.outlet_id || outletId,
      floorId: section?.floor_id || floorId,
      name: section?.name || "",
      code: section?.code || "",
      sectionType: section?.section_type || "",
      description: section?.description || "",
      colorCode: section?.color_code || "#3B82F6",
      displayOrder: section?.display_order ?? "",
      isActive: section ? Boolean(section.is_active) : true,
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      const payload = {
        ...values,
        displayOrder:
          values.displayOrder === "" ? null : Number(values.displayOrder),
      };

      if (isEditMode) {
        await onSubmit({ id: section.id, values: payload, resetForm });
      } else {
        await onSubmit({ values: payload, resetForm });
      }
    },
  });

  return (
    <ModalBasic
      id="section-modal"
      title={isEditMode ? "Update Section" : "Add Section"}
      isOpen={isOpen}
      onClose={onClose}
    >
      <form
        onSubmit={formik.handleSubmit}
        autoComplete="off"
        className="p-4 space-y-4"
      >
        {/* Name */}
        <InputField
          label="Section Name"
          name="name"
          required
          placeholder="e.g. VIP Section"
          value={formik.values.name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.name && formik.errors.name}
        />


        {/* Code */}
        <InputField
          label="Code"
          name="code"
          required
          placeholder="Enter section code"
          value={formik.values.code}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.code && formik.errors.code}
        />

        
<InfoCard
  type="warning"
  size="sm"
  title="Unique Section Name & Code"
  description="Both section name and code must be unique across all floors within this outlet. Duplicate values are not allowed."
/>

        {/* Section Type */}
        <SelectField
          label="Section Type"
          name="sectionType"
          required
          value={formik.values.sectionType}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.sectionType && formik.errors.sectionType}
          options={[
            { label: "Select Type", value: "" },
            ...SECTION_TYPE_OPTIONS.map((opt) => ({
              label: opt.label,
              value: opt.value,
            })),
          ]}
        />

        {/* Description */}
        <InputField
          label="Description"
          name="description"
          required
          placeholder="Description"
          value={formik.values.description}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.description && formik.errors.description}
        />

        {/* Floor Section Display Order */}
        <InputField
          label="Display Order"
          name="displayOrder"
          required
          placeholder="1, 2, 3"
          type="number"
          tooltip="Controls the order of sections on this floor."
          helperText="Lower numbers appear first within this floor."
          value={formik.values.displayOrder}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.displayOrder && formik.errors.displayOrder}
        />

        {/* Active */}
        <CheckboxField
          label="Enable Section"
          name="isActive"
          checked={formik.values.isActive}
          onChange={formik.handleChange}
        />

        {/* Footer */}
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
            disabled={loading}
            className="btn bg-primary-500 text-white hover:bg-primary-600 disabled:opacity-50 flex items-center gap-2"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {isEditMode ? "Update" : "Save"}
          </button>
        </div>
      </form>
      
    </ModalBasic>
  );
};

export default SectionModal;
