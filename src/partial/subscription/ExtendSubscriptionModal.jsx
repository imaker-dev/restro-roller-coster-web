import React from "react";
import ModalBasic from "../../components/ModalBasic";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Loader2, Calendar, Building2 } from "lucide-react";
import { InputField } from "../../components/fields/InputField";
import InfoCard from "../../components/InfoCard";
import { formatDate } from "../../utils/dateFormatter";
import SubscriptionBadge from "./SubscriptionBadge";

const validationSchema = Yup.object({
  days: Yup.number()
    .typeError("Must be a number")
    .required("Days is required")
    .positive("Must be positive")
    .integer("Must be a whole number")
    .max(365, "Cannot exceed 365 days"),
});

const ExtendSubscriptionModal = ({
  isOpen,
  onClose,
  onSubmit,
  subscription,
  loading = false,
}) => {
  const formik = useFormik({
    initialValues: {
      days: "",
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

  const calculateNewEndDate = (days) => {
    if (!days || days <= 0) return null;
    const currentEnd = subscription?.subscription_end
      ? new Date(subscription.subscription_end)
      : new Date();
    const newEnd = new Date(currentEnd.getTime() + days * 24 * 60 * 60 * 1000);
    return newEnd;
  };

  const newEndDate = calculateNewEndDate(formik.values.days);

  return (
    <ModalBasic
      id="extend-subscription-modal"
      title="Extend Subscription"
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

        {/* Days to Extend */}
        <InputField
          label="Days to Extend"
          name="days"
          type="number"
          required
          placeholder="Enter number of days"
          value={formik.values.days}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.days && formik.errors.days}
        />

        {/* Extension Preview */}
        {formik.values.days > 0 && newEndDate && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="h-4 w-4 text-emerald-600" />
              <span className="text-xs font-medium text-emerald-700 uppercase tracking-wide">
                Extension Preview
              </span>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Current End Date:</span>
                <span className="font-medium text-slate-900">
                  {formatDate(subscription?.subscription_end, "long") || "N/A"}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Extension:</span>
                <span className="font-medium text-emerald-600">
                  +{formik.values.days} days
                </span>
              </div>
              <div className="h-[1px] bg-emerald-200 my-2"></div>
              <div className="">
                <div className="flex justify-between text-sm">
                  <span className="font-semibold text-slate-900">
                    New End Date:
                  </span>
                  <span className="font-semibold text-emerald-700">
                    {formatDate(newEndDate.toISOString(), "long")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        <InfoCard
          size="sm"
          type="info"
          title="Note"
          description="Extending the subscription will add the specified days to the current end date. The outlet will continue to have access during the extended period."
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
            className="btn bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-2"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {loading ? "Extending..." : "Extend Subscription"}
          </button>
        </div>
      </form>
    </ModalBasic>
  );
};

export default ExtendSubscriptionModal;
