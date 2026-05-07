import React from "react";
import ModalBasic from "../../components/ModalBasic";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Loader2 } from "lucide-react";
import { InputField } from "../../components/fields/InputField";
import InfoCard from "../../components/InfoCard";
import { TextareaField } from "../../components/fields/TextareaField";

const validationSchema = Yup.object({
  notes: Yup.string()
    .trim()
    .required("Reason is required")
    .min(3, "Too short")
    .max(200, "Too long"),
});

const DeactivateSubscriptionModal = ({
  isOpen,
  onClose,
  onSubmit,
  subscription,
  loading = false,
}) => {
  const formik = useFormik({
    initialValues: {
      notes: "",
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      await onSubmit({
        id: subscription?.outlet_id,
        data: values,
        resetForm,
      });
    },
  });

  return (
    <ModalBasic
      id="deactivate-subscription-modal"
      title="Deactivate Subscription"
      isOpen={isOpen}
      onClose={onClose}
    >
      <form
        onSubmit={formik.handleSubmit}
        autoComplete="off"
        className="p-4 space-y-4"
      >
        {/* Subscription Info */}
        {subscription && (
          <InfoCard
            size="sm"
            type="warning"
            title="Subscription Details"
            description={`Deactivating subscription for ${subscription.outlet_name || "N/A"}. This action will revoke access.`}
          />
        )}

        {/* Reason */}
        <TextareaField
          label="Reason for Deactivation"
          name="notes"
          required
          placeholder="e.g., Non-payment, Violation, Requested by outlet"
          value={formik.values.notes}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.notes && formik.errors.notes}
          rows={3}
        />

        <InfoCard
          size="sm"
          type="error"
          title="Warning"
          description="This will immediately deactivate the subscription. The outlet will lose access to all subscription features."
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
            className="btn bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 flex items-center gap-2"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {loading ? "Deactivating..." : "Deactivate Subscription"}
          </button>
        </div>
      </form>
    </ModalBasic>
  );
};

export default DeactivateSubscriptionModal;
