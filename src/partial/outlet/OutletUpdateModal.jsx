import React, { useEffect } from "react";
import ModalBasic from "../../components/ModalBasic";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Loader2 } from "lucide-react";
import { InputField } from "../../components/fields/InputField"; // your field

const validationSchema = Yup.object({
  name: Yup.string()
    .trim()
    .required("Outlet name is required")
    .min(2, "Too short")
    .max(50, "Too long"),
});

const OutletUpdateModal = ({
  isOpen,
  onClose,
  onSubmit,
  outlet,
  loading = false,
}) => {
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: outlet?.name || "",
    },
    validationSchema,
    onSubmit: (values) => {
      onSubmit({
        id: outlet.id,
        values
      });
    },
  });

  useEffect(() => {
    if (!isOpen) formik.resetForm();
  }, [isOpen]);

  return (
    <ModalBasic
      id="update-outlet"
      title="Update Outlet"
      isOpen={isOpen}
      onClose={onClose}
    >
      <form onSubmit={formik.handleSubmit} autoComplete="off" className="px-6 py-5 space-y-4">

        {/* Outlet Code (Read Only) */}
        <InputField
          label="Outlet Code"
          value={outlet?.code || ""}
          disabled
        />

        {/* Outlet Name */}
        <InputField
          label="Outlet Name"
          name="name"
          required
          placeholder="Enter outlet name"
          value={formik.values.name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.name && formik.errors.name}
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
            {loading ? "Updating..." : "Update"}
          </button>
        </div>

      </form>
    </ModalBasic>
  );
};

export default OutletUpdateModal;
