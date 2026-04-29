import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Loader2 } from "lucide-react";
import ModalBasic from "../../../components/ModalBasic";
import { InputField } from "../../../components/fields/InputField";

const validationSchema = Yup.object({
  name: Yup.string()
    .trim()
    .required("Category name is required")
    .min(2, "Too short")
    .max(50, "Too long"),

  description: Yup.string()
    .trim()
    .required("Description is required")
    .min(2, "Too short")
    .max(200, "Too long"),
});

const InventoryCategoryModal = ({
  isOpen,
  onClose,
  category,
  onConfirm,
  loading = false,
}) => {
  const isEditMode = !!category;

  const formik = useFormik({
    enableReinitialize: true,

    initialValues: {
      name: category?.name || "",
      description: category?.description || "",
    },

    validationSchema,

    onSubmit: async (values, { resetForm }) => {
      const payload = {
        name: values.name?.trim(),
        description: values.description?.trim(),
      };

      if (isEditMode) {
        await onConfirm({
          id: category.id,
          values: payload,
          resetForm,
        });
      } else {
        await onConfirm({
          values: payload,
          resetForm,
        });
      }
    },
  });

  return (
    <ModalBasic
      id="inventory-category-modal"
      title={isEditMode ? "Update Category" : "Add Category"}
      isOpen={isOpen}
      onClose={onClose}
    >
      {" "}
      <form
        onSubmit={formik.handleSubmit}
        autoComplete="off"
        className="p-4 space-y-4"
      >
        <InputField
          label="Category Name"
          name="name"
          required
          placeholder="Vegetables"
          value={formik.values.name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.name && formik.errors.name}
        />

        <InputField
          label="Description"
          name="description"
          required
          placeholder="Fresh vegetables"
          value={formik.values.description}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.description && formik.errors.description}
        />

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

export default InventoryCategoryModal;
