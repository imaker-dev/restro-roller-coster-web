import React from "react";
import ModalBasic from "../../components/ModalBasic";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Loader2 } from "lucide-react";
import { InputField } from "../../components/fields/InputField";
import { CheckboxField } from "../../components/fields/CheckboxField";
import DragDropUploader from "../../components/DragDropUploader";
import { SelectField } from "../../components/fields/SelectField";
import { SERVICE_TYPES } from "../../constants";
import InfoCard from "../../components/InfoCard";
import ToggleField from "../../components/fields/ToggleField";

const validationSchema = Yup.object({
  name: Yup.string()
    .trim()
    .required("Category name is required")
    .min(2, "Too short")
    .max(50, "Too long"),

  description: Yup.string().trim().max(200, "Too long"),

  serviceType: Yup.string()
    .oneOf(Object.values(SERVICE_TYPES))
    .required("Service type is required"),
  imageUrl: Yup.mixed().nullable(),
  isActive: Yup.boolean(),
});

const CategoryModal = ({
  isOpen,
  onClose,
  onSubmit,
  category,
  outletId,
  loading = false,
}) => {
  const isEditMode = !!category;

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      outletId: category?.outlet_id || outletId || "",
      name: category?.name || "",
      description: category?.description || "",
      serviceType: category?.service_type || SERVICE_TYPES.BOTH,
      imageUrl: category?.image_url || "",
      isActive: category ? Boolean(category.is_active) : true,
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      const payload = {
        ...values,
        imageUrl: Array.isArray(values.imageUrl)
          ? values.imageUrl[0]
          : values.imageUrl,
      };

      if (isEditMode) {
        await onSubmit({
          id: category.id,
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
      id="category-modal"
      title={isEditMode ? "Update Category" : "Add Category"}
      isOpen={isOpen}
      onClose={onClose}
    >
      <form
        onSubmit={formik.handleSubmit}
        autoComplete="off"
        className="p-4 space-y-4"
      >
        {/* Category Name */}
        <InputField
          label="Category Name"
          name="name"
          required
          placeholder="Enter category name"
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
          placeholder="Enter description"
          value={formik.values.description}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.description && formik.errors.description}
          autoComplete="off"
        />

        <SelectField
          label="Service Type"
          name="serviceType"
          required
          value={formik.values.serviceType}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.serviceType && formik.errors.serviceType}
          options={[
            { label: "Restaurant", value: SERVICE_TYPES.RESTAURANT },
            { label: "Bar", value: SERVICE_TYPES.BAR },
            { label: "Both", value: SERVICE_TYPES.BOTH },
          ]}
        />

        {/* Image Upload */}
        {/* <DragDropUploader
          value={formik.values.imageUrl}
          onChange={(files) => formik.setFieldValue("imageUrl", files)}
          multiple={false}
          accept="image/*"
          maxFiles={1}
          enableCrop={true}
          aspectRatio={1}
          uploadToServer={true}
          size="sm"
        /> */}

        {/* Category Status */}
        <ToggleField
          label="Enable Category"
          description="Disabled categories will not appear in the menu for ordering."
          checked={formik.values.isActive}
          onChange={(value) => formik.setFieldValue("isActive", value)}
          activeColorClass="bg-emerald-600"
          inactiveColorClass="bg-red-600"
        />

        <InfoCard
          size="sm"
          type="info"
          title="Category Scope"
          description={
            isEditMode
              ? "Updating this category will modify its name, service type, or visibility within the selected outlet only."
              : "This category will be created under the selected outlet and will organize menu items within that outlet."
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

export default CategoryModal;
