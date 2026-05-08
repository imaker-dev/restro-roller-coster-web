import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import PageHeader from "../../layout/PageHeader";
import AccordionSection from "../../components/AccordionSection";
import { InputField } from "../../components/fields/InputField";
import { SelectField } from "../../components/fields/SelectField";
import { TextareaField } from "../../components/fields/TextareaField";
import {
  Building2,
  Phone,
  Landmark,
  Loader2,
  Plus,
  Mail,
  MapPin,
  FileText,
  UserPlus,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
// import { createRegistrationRequest } from "../../redux/slices/registrationSlice";
import { useNavigate } from "react-router-dom";
import { SUBSCRIPTION_PLANS } from "../../constants";
import { handleResponse } from "../../utils/helpers";
import { ROUTE_PATHS } from "../../config/paths";
import InfoCard from "../../components/InfoCard";
import { createRegistrationRequest } from "../../redux/slices/registrationSlice";

const validationSchema = Yup.object({
  restaurant_name: Yup.string()
    .trim()
    .required("Restaurant name is required")
    .min(2, "Too short")
    .max(100, "Too long"),

  contact_person: Yup.string()
    .trim()
    .required("Contact person is required")
    .min(2, "Too short")
    .max(100, "Too long"),

  email: Yup.string()
    .trim()
    .required("Email is required")
    .email("Invalid email address"),

  phone: Yup.string()
    .trim()
    .required("Phone number is required")
    .matches(/^[0-9]{10}$/, "Phone number must be 10 digits"),

  city: Yup.string().trim().required("City is required").max(100, "Too long"),

  state: Yup.string().trim().required("State is required").max(100, "Too long"),

  plan_interest: Yup.string()
    .oneOf(Object.values(SUBSCRIPTION_PLANS), "Invalid plan")
    .required("Plan is required"),

  message: Yup.string().trim().max(500, "Too long"),

  gst_number: Yup.string()
    .trim()
    .matches(
      /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
      "Invalid GST number",
    )
    .nullable(),

  fssai_number: Yup.string()
    .trim()
    .matches(/^[0-9]{14}$/, "Invalid FSSAI number")
    .nullable(),

  pan_number: Yup.string()
    .trim()
    .matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Invalid PAN number")
    .nullable(),
});

const AddRegistrationRequestPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isCreatingRegistrationRequest } = useSelector(
    (state) => state.registration,
  );

  const initialValues = {
    restaurant_name: "",
    contact_person: "",
    email: "",
    phone: "",
    city: "",
    state: "",
    plan_interest: SUBSCRIPTION_PLANS.FREE,
    message: "",
    gst_number: "",
    fssai_number: "",
    pan_number: "",
  };

  const planOptions = [
    { label: "Free", value: SUBSCRIPTION_PLANS.FREE },
    { label: "Pro", value: SUBSCRIPTION_PLANS.PRO },
    { label: "Offline Annual", value: SUBSCRIPTION_PLANS.OFFLINE_ANNUAL },
  ];

  const handleSubmit = async (values, { resetForm }) => {
    await handleResponse(
      dispatch(createRegistrationRequest({ values })),
      () => {
        resetForm();
        navigate(ROUTE_PATHS.REGISTRATION_REQUESTS);
      },
    );
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Add Registration Request" showBackButton />

      {/* Info Banner */}
      <InfoCard
        type="info"
        title="Manual Registration Request"
        description="You are creating a registration request on behalf of a restaurant owner. This will allow you to manually register outlets that have shown interest offline or through other channels."
      />
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {(formik) => (
          <Form className="space-y-8" autoComplete="off">
            {/* RESTAURANT INFO */}
            <AccordionSection title="Restaurant Information" icon={Building2}>
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <InputField
                  label="Restaurant Name"
                  name="restaurant_name"
                  required
                  placeholder="e.g. The Urban Tandoor"
                  value={formik.values.restaurant_name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.restaurant_name &&
                    formik.errors.restaurant_name
                  }
                />

                <InputField
                  label="Contact Person"
                  name="contact_person"
                  required
                  placeholder="e.g. John Doe"
                  value={formik.values.contact_person}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.contact_person &&
                    formik.errors.contact_person
                  }
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <InputField
                  label="Email Address"
                  name="email"
                  type="email"
                  required
                  placeholder="e.g. contact@urbantandoor.com"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.email && formik.errors.email}
                />

                <InputField
                  label="Phone Number"
                  name="phone"
                  type="tel"
                  required
                  placeholder="10-digit phone number"
                  value={formik.values.phone}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.phone && formik.errors.phone}
                  maxLength={10}
                />
              </div>
            </AccordionSection>

            {/* LOCATION */}
            <AccordionSection title="Location Details" icon={MapPin}>
              <div className="grid md:grid-cols-2 gap-6">
                <InputField
                  label="City"
                  name="city"
                  required
                  placeholder="e.g. Mumbai"
                  value={formik.values.city}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.city && formik.errors.city}
                />

                <InputField
                  label="State"
                  name="state"
                  required
                  placeholder="e.g. Maharashtra"
                  value={formik.values.state}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.state && formik.errors.state}
                />
              </div>
            </AccordionSection>

            {/* SUBSCRIPTION PLAN */}
            <AccordionSection title="Subscription Plan" icon={FileText}>
              <div className="mb-6">
                <SelectField
                  label="Plan Interest"
                  name="plan_interest"
                  required
                  options={planOptions}
                  value={formik.values.plan_interest}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.plan_interest && formik.errors.plan_interest
                  }
                />
              </div>

              <div className="grid md:grid-cols-1 gap-6">
                <TextareaField
                  label="Message / Requirements"
                  name="message"
                  placeholder="Enter any additional requirements or message (optional)"
                  value={formik.values.message}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.message && formik.errors.message}
                  rows={4}
                />
              </div>
            </AccordionSection>

            {/* COMPLIANCE & LEGAL */}
            <AccordionSection
              title="Compliance & Legal Details"
              icon={Landmark}
            >
              <div className="grid md:grid-cols-3 gap-6">
                <InputField
                  label="GST Number"
                  name="gst_number"
                  placeholder="e.g. 22AAAAA0000A1Z5"
                  value={formik.values.gst_number}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.gst_number && formik.errors.gst_number}
                />

                <InputField
                  label="FSSAI Number"
                  name="fssai_number"
                  placeholder="14 digit FSSAI number"
                  value={formik.values.fssai_number}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.fssai_number && formik.errors.fssai_number
                  }
                  maxLength={14}
                />

                <InputField
                  label="PAN Number"
                  name="pan_number"
                  placeholder="e.g. ABCDE1234F"
                  value={formik.values.pan_number}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.pan_number && formik.errors.pan_number}
                  maxLength={10}
                />
              </div>
            </AccordionSection>

            {/* SUBMIT */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isCreatingRegistrationRequest}
                className="btn bg-primary-500 hover:bg-primary-600 text-white px-8 py-2 flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
              >
                {isCreatingRegistrationRequest ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Plus className="w-4 h-4" />
                )}

                {isCreatingRegistrationRequest
                  ? "Creating Request..."
                  : "Create Request"}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default AddRegistrationRequestPage;
