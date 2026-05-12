import React, { useMemo } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import PageHeader from "../../layout/PageHeader";
import AccordionSection from "../../components/AccordionSection";
import { InputField } from "../../components/fields/InputField";
import {
  User,
  User2,
  Mail,
  Loader2,
  Shield,
  Crown,
  Home,
  Settings,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { handleResponse } from "../../utils/helpers";
import { useNavigate } from "react-router-dom";
import InfoCard from "../../components/InfoCard";
import { ROUTE_PATHS } from "../../config/paths";
import { createSuperAdmin } from "../../redux/slices/adminSlice";
import ToggleField from "../../components/fields/ToggleField";

const AddSuperAdminPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isCreatingSuperAdmin } = useSelector((state) => state.admin);

  const initialValues = useMemo(() => {
    return {
      name: "",
      email: "",
      phone: "",
      employeeCode: "",
      password: "",
      pin: "",
      isActive: true,
    };
  }, []);

  const validationSchema = useMemo(() => {
    return Yup.object({
      name: Yup.string().required("Name required"),
      email: Yup.string().email("Invalid email").required("Email required"),
      phone: Yup.string()
        .matches(/^\d{10}$/, "Phone must be 10 digits")
        .required("Phone number required"),
      employeeCode: Yup.string().required("Employee code required"),
      password: Yup.string()
        .min(6, "Minimum 6 characters")
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/,
          "Password must contain at least one uppercase, one lowercase, and one number",
        )
        .required("Password required"),
      pin: Yup.string()
        .matches(/^\d{4}$/, "PIN must be 4 digits")
        .required("PIN required"),
    });
  }, []);

  const handleSubmit = async (values) => {
    const payload = {
      name: values.name?.trim(),
      email: values.email?.trim(),
      phone: values.phone?.trim(),
      employeeCode: values.employeeCode?.trim(),
      password: values.password,
      pin: values.pin,
      //   role: "super_admin",
      isActive: Boolean(values.isActive),
    };

    await handleResponse(
      dispatch(createSuperAdmin({ values: payload })),
      () => {
        navigate(ROUTE_PATHS.ALL_SUPER_ADMINS);
      },
    );
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Add Franchise Partner" showBackButton />

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {(formik) => {
          return (
            <Form className="space-y-8" autoComplete="off">
              {/* BASIC INFO */}
              <AccordionSection title="Basic Info" icon={User}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  {/* NAME */}
                  <InputField
                    label="Full Name"
                    name="name"
                    required
                    placeholder="Enter Full Name"
                    icon={User2}
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.name && formik.errors.name}
                  />

                  {/* EMAIL */}
                  <InputField
                    label="Email"
                    name="email"
                    required
                    placeholder="Enter Email Address"
                    type="email"
                    icon={Mail}
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.email && formik.errors.email}
                  />

                  {/* PHONE */}
                  <InputField
                    label="Phone Number"
                    name="phone"
                    required
                    placeholder="Enter Phone Number"
                    value={formik.values.phone}
                    onChange={(e) => {
                      const val = e.target.value
                        .replace(/\D/g, "")
                        .slice(0, 10);
                      formik.setFieldValue("phone", val);
                    }}
                    onBlur={formik.handleBlur}
                    error={formik.touched.phone && formik.errors.phone}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  {/* EMPLOYEE CODE */}
                  <InputField
                    label="Employee Code"
                    name="employeeCode"
                    required
                    placeholder="EMP001"
                    value={formik.values.employeeCode}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.employeeCode && formik.errors.employeeCode
                    }
                  />

                  {/* PASSWORD */}
                  <InputField
                    label="Password"
                    name="password"
                    type="password"
                    required
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.password && formik.errors.password}
                    autoComplete="new-password"
                    placeholder="Password@123"
                    helperText="Must contain uppercase, lowercase and number"
                  />

                  {/* PIN */}
                  <InputField
                    label="PIN"
                    name="pin"
                    required
                    type="password"
                    placeholder="4 digit pin"
                    value={formik.values.pin}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, "").slice(0, 4);
                      formik.setFieldValue("pin", val);
                    }}
                    onBlur={formik.handleBlur}
                    error={formik.touched.pin && formik.errors.pin}
                    autoComplete="off"
                    helperText="Enter a 4 digit numeric PIN"
                  />
                </div>

                {/* ACTIVE USER */}
                <ToggleField
                  label="Franchise Partner Account Active"
                  description="Inactive franchise partner cannot log in or access the system."
                  checked={formik.values.isActive}
                  onChange={(value) => formik.setFieldValue("isActive", value)}
                  activeColorClass="bg-emerald-500"
                  inactiveColorClass="bg-red-500"
                />
              </AccordionSection>

              {/* ACCESS PRIVILEGES */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white border border-slate-200 rounded-2xl p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-primary-500 flex items-center justify-center">
                      <Crown size={18} className="text-white" />
                    </div>
                    <h4 className="text-sm font-bold text-slate-900">
                      Full Access
                    </h4>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Complete system access across all modules and features
                  </p>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-primary-500 flex items-center justify-center">
                      <Shield size={18} className="text-white" />
                    </div>
                    <h4 className="text-sm font-bold text-slate-900">
                      User Management
                    </h4>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Create and manage all user accounts across outlets
                  </p>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-primary-500 flex items-center justify-center">
                      <Home size={18} className="text-white" />
                    </div>
                    <h4 className="text-sm font-bold text-slate-900">
                      Outlet Control
                    </h4>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Create and configure multiple outlets seamlessly
                  </p>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-primary-500 flex items-center justify-center">
                      <Settings size={18} className="text-white" />
                    </div>
                    <h4 className="text-sm font-bold text-slate-900">
                      System Config
                    </h4>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Configure platform-wide settings and integrations
                  </p>
                </div>
              </div>

              <InfoCard
                type="info"
                title="Franchise Partner Access"
                description="Franchise partners can manage their assigned outlets, users, subscriptions, and operational settings. This account should only be assigned to authorized business partners."
              />

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isCreatingSuperAdmin}
                  className="btn bg-primary-500 text-white flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isCreatingSuperAdmin ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Create Franchise Partner"
                  )}
                </button>
              </div>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

export default AddSuperAdminPage;
