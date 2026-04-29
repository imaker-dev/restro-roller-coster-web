import React, { useMemo, useEffect } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";

import PageHeader from "../../layout/PageHeader";
import AccordionSection from "../../components/AccordionSection";
import InfoCard from "../../components/InfoCard";

import { InputField } from "../../components/fields/InputField";

import { User, Phone, Mail, MapPin, Loader2, RefreshCw } from "lucide-react";

import { useDispatch, useSelector } from "react-redux";
import {
  createVendor,
  fetchVendorById,
  updateVendor,
} from "../../redux/slices/vendorSlice";

import { useNavigate } from "react-router-dom";
import { useQueryParams } from "../../hooks/useQueryParams";
import { handleResponse } from "../../utils/helpers";
import LoadingOverlay from "../../components/LoadingOverlay";
import { ROUTE_PATHS } from "../../config/paths";

const AddVendorPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { vendorId } = useQueryParams();
  const { outletId } = useSelector((state) => state.auth);

  const {
    vendorDetails,
    isFetchingVendorDetails,
    isCreatingVendor,
    isUpdatingVendor,
  } = useSelector((state) => state.vendor);

  const { vendor } = vendorDetails || {};

  useEffect(() => {
    if (vendorId) {
      dispatch(fetchVendorById(vendorId));
    }
  }, [dispatch, vendorId]);

  const initialValues = useMemo(() => {
    if (!vendorId || !vendor) {
      return {
        name: "",
        contactPerson: "",
        phone: "",
        email: "",
        address: "",
        city: "",
        state: "",
        pincode: "",
        gstNumber: "",
        panNumber: "",
        paymentTerms: "",
        creditDays: "",
        notes: "",
      };
    }

    return {
      name: vendor.name || "",
      contactPerson: vendor.contactPerson || "",
      phone: vendor.phone || "",
      email: vendor.email || "",
      address: vendor.address || "",
      city: vendor.city || "",
      state: vendor.state || "",
      pincode: vendor.pincode || "",
      gstNumber: vendor.gstNumber || "",
      panNumber: vendor.panNumber || "",
      paymentTerms: vendor.paymentTerms || "",
      creditDays: vendor.creditDays || "",
      notes: vendor.notes || "",
    };
  }, [vendorId, vendor]);
  const validationSchema = Yup.object({
    name: Yup.string().required("Vendor name is required"),
  });

  const handleSubmit = async (values) => {
    const payload = {
      ...values,
      name: values.name?.trim(),
    };

    const action = vendorId
      ? updateVendor({ id: vendorId, values: payload })
      : createVendor({ outletId, values: payload });

    await handleResponse(dispatch(action), () => {
      navigate(ROUTE_PATHS.ALL_VENDORS);
    });
  };

  if (isFetchingVendorDetails && vendorId) {
    return <LoadingOverlay text="Loading vendor details..." />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={vendorId ? "Update Vendor" : "Create Vendor"}
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
            <AccordionSection title="Vendor Information" icon={User}>
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <InputField
                  label="Vendor Name"
                  name="name"
                  placeholder="Fresh Vegetables Co."
                  required={true}
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.name && formik.errors.name}
                />

                <InputField
                  label="Contact Person"
                  name="contactPerson"
                  placeholder="Rajesh"
                  value={formik.values.contactPerson}
                  onChange={formik.handleChange}
                />

                <InputField
                  label="Phone"
                  name="phone"
                  placeholder="9876543210"
                  icon={Phone}
                  value={formik.values.phone}
                  onChange={formik.handleChange}
                />

                <InputField
                  label="Email"
                  name="email"
                  type="email"
                  placeholder="vendor@email.com"
                  icon={Mail}
                  value={formik.values.email}
                  onChange={formik.handleChange}
                />
              </div>
            </AccordionSection>

            {/* ADDRESS */}
            <AccordionSection title="Address Details" icon={MapPin}>
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <InputField
                  label="Address"
                  name="address"
                  placeholder="Street / Market area"
                  value={formik.values.address}
                  onChange={formik.handleChange}
                />

                <InputField
                  label="City"
                  name="city"
                  placeholder="Mumbai"
                  value={formik.values.city}
                  onChange={formik.handleChange}
                />

                <InputField
                  label="State"
                  name="state"
                  placeholder="Maharashtra"
                  value={formik.values.state}
                  onChange={formik.handleChange}
                />

                <InputField
                  label="Pincode"
                  name="pincode"
                  placeholder="400703"
                  value={formik.values.pincode}
                  onChange={formik.handleChange}
                />
              </div>
            </AccordionSection>

            {/* TAX & PAYMENT */}
            <AccordionSection title="Tax & Payment Info">
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <InputField
                  label="GST Number"
                  name="gstNumber"
                  placeholder="27AABCU9603R1ZM"
                  value={formik.values.gstNumber}
                  onChange={formik.handleChange}
                />

                <InputField
                  label="PAN Number"
                  name="panNumber"
                  placeholder="AABCU9603R"
                  value={formik.values.panNumber}
                  onChange={formik.handleChange}
                />

                {/* <InputField
                  label="Payment Terms"
                  name="paymentTerms"
                  placeholder="Net 15"
                  value={formik.values.paymentTerms}
                  onChange={formik.handleChange}
                />

                <InputField
                  label="Credit Days"
                  name="creditDays"
                  type="number"
                  placeholder="15"
                  value={formik.values.creditDays}
                  onChange={formik.handleChange}
                /> */}
              </div>

              <InputField
                label="Notes"
                name="notes"
                placeholder="Any special instructions"
                value={formik.values.notes}
                onChange={formik.handleChange}
              />
            </AccordionSection>

            <InfoCard
              type="info"
              title="Vendor Management"
              description={
                vendorId
                  ? "Updating this vendor will modify supplier details used for purchase orders and stock procurement."
                  : "Vendors represent suppliers from whom you purchase inventory items."
              }
            />

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isCreatingVendor || isUpdatingVendor}
                className="btn bg-primary-500 text-white flex items-center gap-2"
              >
                {isCreatingVendor || isUpdatingVendor ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {vendorId ? "Updating..." : "Creating..."}
                  </>
                ) : vendorId ? (
                  "Update Vendor"
                ) : (
                  "Create Vendor"
                )}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default AddVendorPage;
