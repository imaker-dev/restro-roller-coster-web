import React from "react";
import ModalBasic from "../../components/ModalBasic";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Loader2 } from "lucide-react";
import { InputField } from "../../components/fields/InputField";
import InfoCard from "../../components/InfoCard";
import SubscriptionBadge from "../subscription/SubscriptionBadge";

const validationSchema = Yup.object({
  restaurant: Yup.string()
    .trim()
    .required("Restaurant name is required")
    .min(2, "Too short"),

  email: Yup.string().email("Invalid email").required("Email is required"),

  phone: Yup.string().required("Phone is required").min(8, "Too short"),

  password: Yup.string()
    .required("Password is required")
    .min(6, "Minimum 6 characters"),
});

const ActivateSubscriptionModal = ({
  isOpen,
  onClose,
  request,
  onConfirm,
  loading,
}) => {
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      outletId: request?.outlet_id || "",
      restaurant: request?.restaurant_name || "",
      email: request?.email || "",
      phone: request?.phone || "",
      plan: request?.plan_interest || "",
      password: "",
      notify_whatsapp: true,
      notify_email: true,
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      await onConfirm({ values, resetForm });
    },
  });

  return (
    <ModalBasic title="Activate Subscription" isOpen={isOpen} onClose={onClose}>
      <form
        onSubmit={formik.handleSubmit}
        autoComplete="off"
        className="p-4 space-y-4"
      >
        <InfoCard
          size="sm"
          type="info"
          title="Subscription Activation"
          description="Create login credentials for this restaurant and activate its subscription access."
        />

        <div className="relative overflow-hidden rounded-lg border border-primary-200 bg-white px-4 py-3 shadow-sm">
          <div className="absolute inset-y-0 left-0 w-1 bg-primary-500" />

          <div className="flex items-center justify-between pl-2">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-primary-600">
                Selected Plan
              </p>
              <p className="text-xs text-slate-500">
                Subscription activation plan
              </p>
            </div>

            <SubscriptionBadge
              type="plan"
              value={formik.values.plan}
              size="sm"
            />
          </div>
        </div>

        {/* Restaurant */}
        <InputField
          label="Restaurant Name"
          name="restaurant"
          required
          placeholder="Enter restaurant name"
          value={formik.values.restaurant}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.restaurant && formik.errors.restaurant}
        />

        {/* Email */}
        <InputField
          label="Email Address"
          name="email"
          required
          placeholder="Enter email"
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.email && formik.errors.email}
        />

        {/* Phone */}
        <InputField
          label="Phone Number"
          name="phone"
          required
          placeholder="Enter phone number"
          value={formik.values.phone}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.phone && formik.errors.phone}
        />

        {/* Password */}
        <InputField
          label="Password"
          name="password"
          type="password"
          required
          placeholder="Create password"
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.password && formik.errors.password}
        />

        {/* Footer */}
        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={() => onClose()}
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
            {loading ? "Activating..." : "Activate Subscription"}
          </button>
        </div>
      </form>
    </ModalBasic>
  );
};

export default ActivateSubscriptionModal;
