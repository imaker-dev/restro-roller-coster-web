import React from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import {
  Mail,
  Phone,
  MapPin,
  MessageSquare,
  Loader2,
  Building2,
} from "lucide-react";

import ModalBasic from "../../components/ModalBasic";
import { SelectField } from "../../components/fields/SelectField";
import { TextareaField } from "../../components/fields/TextareaField";

const STATUS_OPTIONS = [
  { value: "contacted", label: "Contacted" },
  { value: "converted", label: "Converted" },
  { value: "ignored", label: "Ignored" },
];

const STATUS_STYLES = {
  contacted: "bg-amber-50 text-amber-700 border-amber-200",
  converted: "bg-emerald-50 text-emerald-700 border-emerald-200",
  ignored: "bg-slate-50 text-slate-700 border-slate-200",
};

const UpdateFranchiseModal = ({
  isOpen,
  onClose,
  inquiry,
  onSubmit,
  loading = false,
}) => {
  const initialValues = {
    status: inquiry?.status || "contacted",
    admin_notes: inquiry?.admin_notes || "",
  };

  const validationSchema = Yup.object({
    status: Yup.string()
      .required("Status is required")
      .oneOf(
        STATUS_OPTIONS.map((opt) => opt.value),
        "Invalid status",
      ),
    admin_notes: Yup.string().max(500, "Notes cannot exceed 500 characters"),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      await onSubmit({
        status: values.status,
        admin_notes: values.admin_notes?.trim(),
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ModalBasic
      id="update-franchise-inquiry"
      title="Update Inquiry"
      isOpen={isOpen}
      onClose={onClose}
      hideFooter
      size="lg"
    >
      <Formik
        enableReinitialize
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({
          isSubmitting,
          dirty,
          errors,
          touched,
          values,
          handleChange,
          handleBlur,
          setFieldValue,
        }) => (
          <Form className="flex flex-col">
            {/* Body */}
            <div className="space-y-3 p-5">
              {/* Compact Lead Info */}
              <div className="rounded-xl border border-slate-200 bg-gradient-to-r from-primary-50 to-primary-50/30 p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-slate-900 text-[14px]">
                    {inquiry?.full_name}
                  </h4>
                  <span
                    className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold capitalize ${
                      STATUS_STYLES[inquiry?.status] || STATUS_STYLES.contacted
                    }`}
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-current" />
                    {inquiry?.status || "contacted"}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-[12px] text-slate-500 mb-3">
                  <Building2 size={13} />
                  <span>{inquiry?.franchise_name || "Franchise Inquiry"}</span>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {/* <CompactInfo label="Email" value={inquiry?.email} /> */}
                  <CompactInfo label="Phone" value={inquiry?.phone} />
                  <CompactInfo
                    label="Location"
                    value={`${inquiry?.city || ""}${inquiry?.city && inquiry?.state ? ", " : ""}${inquiry?.state || ""}`}
                  />
                </div>

                {inquiry?.investment_budget && (
                  <span className="mt-2 inline-block rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-medium text-emerald-700">
                    Budget: {inquiry.investment_budget}
                  </span>
                )}
              </div>

              {/* Customer Message */}
              {inquiry?.message && (
                <details className="rounded-xl border border-slate-200 bg-slate-50/80 p-3 group">
                  <summary className="flex items-center gap-2 cursor-pointer list-none">
                    <MessageSquare size={14} className="text-slate-500" />
                    <span className="text-[12px] font-medium text-slate-700">
                      Customer Message
                    </span>
                    <span className="text-[11px] text-slate-400 ml-auto group-open:hidden">
                      Click to expand
                    </span>
                  </summary>
                  <p className="mt-2 text-[12px] leading-relaxed text-slate-600 whitespace-pre-wrap line-clamp-3 group-open:line-clamp-none">
                    {inquiry.message}
                  </p>
                </details>
              )}

              {/* Form Fields */}
              <div className="space-y-4">
                <SelectField
                  label="Inquiry Status"
                  name="status"
                  required
                  options={STATUS_OPTIONS}
                  value={values.status}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.status && errors.status}
                />

                <TextareaField
                  label="Internal Notes"
                  name="admin_notes"
                  rows={2}
                  maxLength={500}
                  showCharCount
                  placeholder="Called customer, discussed requirements, scheduled follow-up..."
                  helperText="Visible only to administrators"
                  value={values.admin_notes}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.admin_notes && errors.admin_notes}
                />
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50/80 px-5 py-3">
              <p className="text-[11px] text-slate-500">
                {dirty ? "Unsaved changes" : "No changes"}
              </p>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="btn h-9 border border-slate-300 bg-white px-4 text-[12px] font-medium text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={loading || isSubmitting || !dirty}
                  className="btn h-9 bg-primary-500 px-4 text-[12px] font-semibold text-white hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-1.5"
                >
                  {loading || isSubmitting ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </ModalBasic>
  );
};

function CompactInfo({ label, value }) {
  return (
    <div>
      <p className="text-[10px] font-medium uppercase text-slate-400">
        {label}
      </p>
      <p className="text-[12px] font-medium text-slate-700 truncate">
        {value || "-"}
      </p>
    </div>
  );
}

export default UpdateFranchiseModal;
