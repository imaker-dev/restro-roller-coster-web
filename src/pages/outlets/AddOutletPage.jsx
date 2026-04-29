import React, { useEffect, useMemo } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import PageHeader from "../../layout/PageHeader";
import AccordionSection from "../../components/AccordionSection";
import { InputField } from "../../components/fields/InputField";
import { SelectField } from "../../components/fields/SelectField";
import {
  Building2,
  MapPin,
  Phone,
  Clock,
  Landmark,
  Loader2,
  Save,
  Plus,
} from "lucide-react";
import { handleResponse } from "../../utils/helpers";
import { useDispatch, useSelector } from "react-redux";
import {
  createOutlet,
  fetchOutletById,
  updateOutlet,
} from "../../redux/slices/outletSlice";
import { useNavigate } from "react-router-dom";
import { useQueryParams } from "../../hooks/useQueryParams";
import LoadingOverlay from "../../components/LoadingOverlay";
import { fetchMeData } from "../../redux/slices/authSlice";
import ToggleField from "../../components/fields/ToggleField";
import { ROUTE_PATHS } from "../../config/paths";

const AddOutletPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { outletId } = useQueryParams();

  useEffect(() => {
    if (outletId) {
      dispatch(fetchOutletById(outletId));
    }
  }, [outletId]);

  const {
    isCreatingOutlet,
    isUpdatingOutlet,
    isFetchingOutletDetails,
    outletDetails,
  } = useSelector((state) => state.outlet);

  const initialValues = useMemo(() => {
    if (outletId && outletDetails) {
      return {
        name: outletDetails.name || "",
        code: outletDetails.code || "",
        legalName: outletDetails.legal_name || "",
        outletType: outletDetails.outlet_type || "restaurant",

        addressLine1: outletDetails.address_line1 || "",
        addressLine2: outletDetails.address_line2 || "",
        city: outletDetails.city || "",
        state: outletDetails.state || "",
        country: outletDetails.country || "India",
        postalCode: outletDetails.postal_code || "",

        phone: outletDetails.phone || "",
        email: outletDetails.email || "",

        gstin: outletDetails.gstin || "",
        fssaiNumber: outletDetails.fssai_number || "",
        panNumber: outletDetails.pan_number || "",

        currencyCode: outletDetails.currency_code || "INR",
        timezone: outletDetails.timezone || "Asia/Kolkata",

        openingTime: outletDetails.opening_time
          ? outletDetails.opening_time.slice(0, 5)
          : "10:00",

        closingTime: outletDetails.closing_time
          ? outletDetails.closing_time.slice(0, 5)
          : "23:00",

        is24Hours: Boolean(outletDetails.is_24_hours),
      };
    }

    // CREATE MODE
    return {
      name: "",
      code: "",
      legalName: "",
      outletType: "restaurant",

      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      country: "India",
      postalCode: "",

      phone: "",
      email: "",

      gstin: "",
      fssaiNumber: "",
      panNumber: "",

      currencyCode: "INR",
      timezone: "Asia/Kolkata",

      openingTime: "10:00",
      closingTime: "23:00",
      is24Hours: false,
    };
  }, [outletId, outletDetails]);

  const validationSchema = Yup.object({
    name: Yup.string().required("Outlet name is required"),
    code: Yup.string().required("Outlet code is required"),
    legalName: Yup.string().required("Legal name is required"),
    outletType: Yup.string().required("Outlet type is required"),

    addressLine1: Yup.string().required("Address Line 1 is required"),
    city: Yup.string().required("City is required"),
    state: Yup.string().required("State is required"),
    country: Yup.string().required("Country is required"),
    postalCode: Yup.string().required("Postal code is required"),

    phone: Yup.string().required("Phone number is required"),
    gstin: Yup.string().nullable(),

    fssaiNumber: Yup.string().nullable(),

    panNumber: Yup.string().nullable(),

    email: Yup.string().email("Invalid email format").nullable(),

    currencyCode: Yup.string().required("Currency is required"),
    timezone: Yup.string().required("Timezone is required"),
  });

  const handleSubmit = async (values, { resetForm }) => {
    const payload = {
      ...values,
      is24Hours: Boolean(values.is24Hours),
    };

    const action = outletId
      ? updateOutlet({ id: outletId, values: payload })
      : createOutlet(payload);

    await handleResponse(dispatch(action), () => {
      dispatch(fetchMeData());
      resetForm();
      navigate(ROUTE_PATHS.ALL_OUTLETS);
    });

    // console.log("Outlet Payload:", payload);
  };

  if (isFetchingOutletDetails && outletId) {
    return <LoadingOverlay />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={outletId ? "Update Outlet" : "Create Outlet"}
        showBackButton
      />

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {(formik) => (
          <Form className="space-y-8" autoComplete="off">
            {/* BASIC INFO */}
            <AccordionSection title="Basic Information" icon={Building2}>
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <InputField
                  label="Outlet Name"
                  name="name"
                  required
                  placeholder="e.g. The Urban Tandoor"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.name && formik.errors.name}
                />

                <InputField
                  label="Outlet Code"
                  name="code"
                  required
                  placeholder="e.g. URBTND001"
                  value={formik.values.code}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.code && formik.errors.code}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <InputField
                  label="Legal Business Name"
                  name="legalName"
                  required
                  placeholder="e.g. Urban Tandoor Hospitality Pvt Ltd"
                  value={formik.values.legalName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.legalName && formik.errors.legalName}
                />

                <SelectField
                  label="Outlet Type"
                  name="outletType"
                  required
                  options={[
                    { value: "restaurant", label: "Restaurant" },
                    { value: "cafe", label: "Cafe" },
                    { value: "bar", label: "Bar" },
                    { value: "cloud_kitchen", label: "Cloud Kitchen" },
                  ]}
                  value={formik.values.outletType}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.outletType && formik.errors.outletType}
                />
              </div>
            </AccordionSection>

            {/* ADDRESS */}
            <AccordionSection title="Address Details" icon={MapPin}>
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <InputField
                  label="Address Line 1"
                  name="addressLine1"
                  required
                  placeholder="Street name, building number"
                  value={formik.values.addressLine1}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.addressLine1 && formik.errors.addressLine1
                  }
                />

                <InputField
                  label="Address Line 2"
                  name="addressLine2"
                  placeholder="Area, landmark (optional)"
                  value={formik.values.addressLine2}
                  onChange={formik.handleChange}
                />
              </div>

              <div className="grid md:grid-cols-4 gap-6">
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

                <InputField
                  label="Country"
                  name="country"
                  required
                  placeholder="e.g. India"
                  value={formik.values.country}
                  onChange={formik.handleChange}
                />

                <InputField
                  label="Postal Code"
                  name="postalCode"
                  required
                  placeholder="e.g. 400001"
                  value={formik.values.postalCode}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.postalCode && formik.errors.postalCode}
                />
              </div>
            </AccordionSection>

            {/* CONTACT */}
            <AccordionSection title="Contact Information" icon={Phone}>
              <div className="grid md:grid-cols-2 gap-6">
                <InputField
                  label="Phone Number"
                  name="phone"
                  required
                  placeholder="e.g. +91 22 1234 5678"
                  value={formik.values.phone}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.phone && formik.errors.phone}
                />

                <InputField
                  label="Official Email"
                  name="email"
                  type="email"
                  placeholder="e.g. contact@urbantandoor.com"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.email && formik.errors.email}
                />
              </div>
            </AccordionSection>

            {/* COMPLIANCE */}
            <AccordionSection
              title="Compliance & Legal Details"
              icon={Landmark}
            >
              <div className="grid md:grid-cols-3 gap-6">
                <InputField
                  label="GSTIN"
                  name="gstin"
                  placeholder="e.g. 27ABCDE1234F1Z5"
                  value={formik.values.gstin}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.gstin && formik.errors.gstin}
                />

                <InputField
                  label="FSSAI License Number"
                  name="fssaiNumber"
                  placeholder="14 digit FSSAI license number"
                  value={formik.values.fssaiNumber}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.fssaiNumber && formik.errors.fssaiNumber
                  }
                />

                <InputField
                  label="PAN Number"
                  name="panNumber"
                  placeholder="e.g. ABCDE1234F"
                  value={formik.values.panNumber}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.panNumber && formik.errors.panNumber}
                />
              </div>
            </AccordionSection>

            {/* OPERATING HOURS */}
            <AccordionSection title="Operating Hours" icon={Clock}>
              <div className="space-y-4">
                <ToggleField
                  label="Open 24 Hours"
                  description="Enable this if the outlet operates round-the-clock without fixed opening or closing hours."
                  checked={formik.values.is24Hours}
                  onChange={(value) => {
                    formik.setFieldValue("is24Hours", value);

                    if (value) {
                      formik.setFieldValue("openingTime", "00:00");
                      formik.setFieldValue("closingTime", "23:59");
                    }
                  }}
                  activeColorClass="bg-indigo-600"
                />

                <div className="grid md:grid-cols-3 gap-6 items-end">
                  <InputField
                    label="Opening Time"
                    name="openingTime"
                    type="time"
                    placeholder="Select opening time"
                    value={formik.values.openingTime}
                    onChange={formik.handleChange}
                    disabled={formik.values.is24Hours}
                  />

                  <InputField
                    label="Closing Time"
                    name="closingTime"
                    type="time"
                    placeholder="Select closing time"
                    value={formik.values.closingTime}
                    onChange={formik.handleChange}
                    disabled={formik.values.is24Hours}
                  />
                </div>
              </div>
            </AccordionSection>

            {/* SUBMIT */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isCreatingOutlet || isUpdatingOutlet}
                className="btn bg-primary-500 hover:bg-primary-600 text-white px-8 py-2 flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
              >
                {/* Loading */}
                {(isCreatingOutlet || isUpdatingOutlet) && (
                  <Loader2 className="w-4 h-4 animate-spin" />
                )}

                {/* Not Loading → Show Action Icon */}
                {!isCreatingOutlet &&
                  !isUpdatingOutlet &&
                  (outletId ? (
                    <Save className="w-4 h-4" />
                  ) : (
                    <Plus className="w-4 h-4" />
                  ))}

                {/* Text */}
                {outletId
                  ? isUpdatingOutlet
                    ? "Updating Outlet..."
                    : "Update Outlet"
                  : isCreatingOutlet
                    ? "Creating Outlet..."
                    : "Create Outlet"}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default AddOutletPage;
