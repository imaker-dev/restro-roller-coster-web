import React from "react";
import ModalBasic from "../../components/ModalBasic";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Loader2 } from "lucide-react";
import { InputField } from "../../components/fields/InputField";
import InfoCard from "../../components/InfoCard";
import SubscriptionBadge from "../subscription/SubscriptionBadge";
import { SelectField } from "../../components/fields/SelectField";

const validationSchema = Yup.object({
  restaurant: Yup.string()
    .trim()
    .required("Restaurant name is required")
    .min(2, "Too short"),

  email: Yup.string().email("Invalid email").required("Email is required"),

  phone: Yup.string().required("Phone is required").min(8, "Too short"),

  plan: Yup.string().required("Plan is required"),

  password: Yup.string()
    .required("Password is required")
    .min(6, "Minimum 6 characters"),
});

const PLAN_OPTIONS = [
  { value: "free", label: "Free" },
  { value: "pro", label: "Pro" },
  { value: "offline_annual", label: "Offline Annual" },
];

const ActivateSubscriptionModal = ({
  isOpen,
  onClose,
  request,
  onConfirm,
  loading,
}) => {
  const formik = useFormik({
    enableReinitialize: true,
    validateOnMount: true,
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

        <SelectField
          label="Subscription Plan"
          name="plan"
          required
          value={formik.values.plan}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          options={PLAN_OPTIONS}
          error={formik.touched.plan && formik.errors.plan}
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
