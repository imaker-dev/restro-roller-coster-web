import React from "react";
import ModalBasic from "../../components/ModalBasic";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Building2, Calendar, Loader2 } from "lucide-react";
import { InputField } from "../../components/fields/InputField";
import InfoCard from "../../components/InfoCard";
import { TextareaField } from "../../components/fields/TextareaField";
import { formatDate } from "../../utils/dateFormatter";
import SubscriptionBadge from "./SubscriptionBadge";

const validationSchema = Yup.object({
  startDate: Yup.date()
    .required("Start date is required")
    .typeError("Invalid date"),
  endDate: Yup.date()
    .required("End date is required")
    .typeError("Invalid date")
    .min(Yup.ref("startDate"), "End date must be after start date"),
  notes: Yup.string()
    .trim()
    .required("Notes are required")
    .min(3, "Too short")
    .max(200, "Too long"),
});

const ActivateSubscriptionModal = ({
  isOpen,
  onClose,
  onSubmit,
  subscription,
  loading = false,
}) => {
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      startDate: new Date().toISOString().split("T")[0],
      endDate: "",
      notes: "Activated by master admin",
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
      id="activate-subscription-modal"
      title="Activate Subscription"
      isOpen={isOpen}
      onClose={onClose}
    >
      <form
        onSubmit={formik.handleSubmit}
        autoComplete="off"
        className="p-4 space-y-4"
      >
        {subscription && (
          <div className="rounded-xl border border-slate-200 bg-white p-3">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 min-w-0">
                <Building2 className="h-4 w-4 text-slate-400 shrink-0" />
                <h3 className="text-sm font-semibold text-slate-900 truncate">
                  {subscription.outlet_name || "Outlet"}
                </h3>
              </div>

              <SubscriptionBadge type="status" value={subscription.status} />
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2">
              <div className="rounded-md bg-slate-50 px-2.5 py-2">
                <div className="flex items-center gap-1 text-[11px] text-slate-500">
                  <Calendar className="h-3 w-3 text-emerald-500" />
                  <span className="uppercase tracking-wide">Start</span>
                </div>

                <p className="mt-1 text-sm font-medium text-slate-900">
                  {formatDate(subscription.subscription_start, "long") || "N/A"}
                </p>
              </div>

              <div className="rounded-md bg-slate-50 px-2.5 py-2">
                <div className="flex items-center gap-1 text-[11px] text-slate-500">
                  <Calendar className="h-3 w-3 text-rose-500" />
                  <span className="uppercase tracking-wide">End</span>
                </div>

                <p className="mt-1 text-sm font-medium text-slate-900">
                  {formatDate(subscription.subscription_end, "long") || "N/A"}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Start Date */}
        <InputField
          label="Start Date"
          name="startDate"
          type="date"
          required
          value={formik.values.startDate}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.startDate && formik.errors.startDate}
        />

        {/* End Date */}
        <InputField
          label="End Date"
          name="endDate"
          type="date"
          required
          value={formik.values.endDate}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.endDate && formik.errors.endDate}
        />

        {/* Notes */}
        <TextareaField
          label="Notes"
          name="notes"
          required
          placeholder="Enter activation notes"
          value={formik.values.notes}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.notes && formik.errors.notes}
          rows={2}
        />

        <InfoCard
          size="sm"
          type="warning"
          title="Important"
          description="This will activate the subscription and the outlet will have access based on the selected period."
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
            className="btn bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50 flex items-center gap-2"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {loading ? "Activating..." : "Activate Subscription"}
          </button>
        </div>
      </form>
    </ModalBasic>
  );
};

export default ActivateSubscriptionModal;
