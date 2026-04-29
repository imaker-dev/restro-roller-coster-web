import React from "react";
import ModalBasic from "../../components/ModalBasic";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Loader2 } from "lucide-react";
import { InputField } from "../../components/fields/InputField";
import ToggleField from "../../components/fields/ToggleField";

const validationSchema = Yup.object({
  version: Yup.string().required("Version is required"),
  build: Yup.number().required("Build is required"),
  download_url: Yup.string().url("Invalid URL").nullable(),
  is_active: Yup.boolean(),
});

const VersionModal = ({
  isOpen,
  onClose,
  onSubmit,
  versionData,
  loading = false,
}) => {
  const isEditMode = !!versionData;

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      version: versionData?.version || "",
      build: versionData?.build || "",
      download_url: versionData?.download_url || "",
      is_active: versionData ? Boolean(versionData.is_active) : true,
    },
    validationSchema,
    onSubmit: async (values) => {
      await onSubmit({
        id: versionData.id,
        values,
      });
    },
  });

  return (
    <ModalBasic
      id="version-modal"
      title="Update Version"
      isOpen={isOpen}
      onClose={onClose}
    >
      <form
        onSubmit={formik.handleSubmit}
        className="p-4 space-y-4"
        autoComplete="off"
      >
        {/* Version */}
        <InputField
          label="Version"
          name="version"
          required
          value={formik.values.version}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.version && formik.errors.version}
        />

        {/* Build */}
        <InputField
          label="Build"
          name="build"
          type="number"
          required
          value={formik.values.build}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.build && formik.errors.build}
        />

        {/* Download URL */}
        <InputField
          label="Download URL"
          name="download_url"
          placeholder="https://..."
          value={formik.values.download_url}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={
            formik.touched.download_url && formik.errors.download_url
          }
        />

        {/* Active Toggle */}
        <ToggleField
          label="Active Version"
          description="Only active versions will be available for users."
          checked={formik.values.is_active}
          onChange={(val) =>
            formik.setFieldValue("is_active", val)
          }
          activeColorClass="bg-emerald-600"
          inactiveColorClass="bg-red-600"
        />

        {/* Buttons */}
        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="btn border border-slate-200 text-slate-600"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className="btn bg-primary-500 text-white flex items-center gap-2"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {loading ? "Updating..." : "Update"}
          </button>
        </div>
      </form>
    </ModalBasic>
  );
};

export default VersionModal;