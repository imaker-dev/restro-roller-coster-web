import React, { useEffect, useMemo } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import PageHeader from "../../layout/PageHeader";
import AccordionSection from "../../components/AccordionSection";

import { InputField } from "../../components/fields/InputField";
import { SelectField } from "../../components/fields/SelectField";
import { User, Shield, User2, Mail, Loader2, RefreshCw } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllRoles } from "../../redux/slices/roleSlice";
import { fetchAllFloors } from "../../redux/slices/floorSlice";
import { MultiSelectDropdownField } from "../../components/fields/MultiSelectDropdownField";
import { handleResponse } from "../../utils/helpers";
import {
  createUser,
  fetchUserById,
  updateUser,
} from "../../redux/slices/userSlice";
import { useNavigate } from "react-router-dom";
import { useQueryParams } from "../../hooks/useQueryParams";
import InfoCard from "../../components/InfoCard";
import ToggleField from "../../components/fields/ToggleField";
import { ROLES } from "../../constants";
import LoadingOverlay from "../../components/LoadingOverlay";
import { ROUTE_PATHS } from "../../config/paths";

const AddUserPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userId } = useQueryParams();

  const { outletId } = useSelector((state) => state.auth);
  const { userDetails, isFetchingUserDetails, isCreatingUser, isupdatingUser } =
    useSelector((state) => state.user);
  const { allRoles } = useSelector((s) => s.role);
  const { roles } = allRoles || {};
  const { allFloors, loading: fetchingAllFloors } = useSelector((s) => s.floor);

  useEffect(() => {
    if (userId) {
      dispatch(fetchUserById(userId));
    }

    dispatch(fetchAllRoles());
    // dispatch(fetchAllPermissions());

    if (outletId) {
      dispatch(fetchAllFloors(outletId));
    }
  }, [dispatch, userId, outletId]);

  const initialValues = useMemo(() => {
    if (!userId || !userDetails) {
      return {
        name: "",
        email: "",
        phone: "",
        employeeCode: "",
        password: "",
        pin: "",
        isActive: true,
        outletId: outletId || "",
        roleId: "",
        floors: [],
      };
    }

    // EDIT MODE
    return {
      name: userDetails.name || "",
      email: userDetails.email || "",
      phone: userDetails.phone || "",
      employeeCode: userDetails.employeeCode || "",
      password: "",
      pin: "",
      isActive: userDetails.isActive ?? true,
      outletId: userDetails.roles?.[0]?.outletId || "",
      roleId: userDetails.roles?.[0]?.id || "",
      floors: userDetails.assignedFloors?.map((f) => String(f.floorId)) || [],
    };
  }, [userId, userDetails, outletId]);

  const validationSchema = useMemo(() => {
    return Yup.object({
      name: Yup.string().required("Name required"),
      email: Yup.string().email("Invalid email").required("Email required"),
      phone: Yup.string().test("len", "Phone must be 10 digits", (val) => {
        if (!val) return true;
        return val.length === 10;
      }),
      employeeCode: Yup.string().required("Employee code required"),
      outletId: Yup.string().required("Outlet required"),
      roleId: Yup.string().required("Role required"),

      password: userId
        ? Yup.string() // EDIT → optional
        : Yup.string()
            .min(6, "Minimum 6 characters")
            .matches(
              /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/,
              "Password must contain at least one uppercase, one lowercase, and one number",
            )
            .required("Password required"),

      pin: userId
        ? Yup.string() // EDIT → optional
        : Yup.string()
            .matches(/^\d{4}$/, "PIN must be 4 digits")
            .required("PIN required"),
    });
  }, [userId]);

  const handleSubmit = async (values) => {
    const payload = {
      name: values.name?.trim(),
      email: values.email?.trim(),
      employeeCode: values.employeeCode?.trim(),
      isActive: Boolean(values.isActive),

      ...(values.phone?.trim() && { phone: values.phone.trim() }),

      roles: [
        {
          roleId: Number(values.roleId),
          outletId: Number(values.outletId),
        },
      ],

      floors: (values.floors || []).map((floorId, index) => ({
        floorId: Number(floorId),
        outletId: Number(values.outletId),
        isPrimary: index === 0,
      })),
    };

    // only when creating
    if (!userId) {
      payload.password = values.password;
      payload.pin = values.pin;
    }
    if (userId) {
      if (values.password?.trim()) {
        payload.password = values.password;
      }

      if (values.pin?.trim()) {
        payload.pin = values.pin;
      }
    }

    const action = userId
      ? updateUser({ id: userId, values: payload })
      : createUser(payload);

    await handleResponse(dispatch(action), () => {
      navigate(ROUTE_PATHS.ALL_USERS);
    });
  };

  // Loading state
  if (isFetchingUserDetails && userId) {
    return <LoadingOverlay text="Loading user details..." />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={userId ? "Update Staff Member" : "Create Staff Member"}
        showBackButton
      />

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {(formik) => {
          const allowedFloorRoles = [
            ROLES.CAPTAIN,
            ROLES.CASHIER,
            ROLES.BARTENDER,
          ];

          const selectedRole = roles?.find(
            (r) => String(r.id) === String(formik?.values?.roleId),
          );

          const shouldShowFloors = allowedFloorRoles.includes(
            selectedRole?.name?.toLowerCase(),
          );

          useEffect(() => {
            if (!shouldShowFloors) {
              formik.setFieldValue("floors", []);
            }
          }, [shouldShowFloors]);

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
                  <InputField
                    label="Phone Number (Optional)"
                    name="phone"
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                    label={userId ? "Password (Optional)" : "Password"}
                    name="password"
                    type="password"
                    required
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.password && formik.errors.password}
                    autoComplete="new-password"
                    placeholder="Password@123"
                    helperText={
                      userId
                        ? "Leave blank to keep current password"
                        : "Must contain uppercase, lowercase and number"
                    }
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
                      // allow only digits & max 4
                      const val = e.target.value.replace(/\D/g, "").slice(0, 4);
                      formik.setFieldValue("pin", val);
                    }}
                    onBlur={formik.handleBlur}
                    error={formik.touched.pin && formik.errors.pin}
                    autoComplete="off"
                    helperText={
                      userId
                        ? "Leave blank to keep existing PIN"
                        : "Enter a 4 digit numeric PIN"
                    }
                  />
                </div>
              </AccordionSection>

              {/* ROLE + OUTLET + FLOORS */}
              <AccordionSection title="Access Control" icon={Shield}>
                <div className="grid grid-cols-1 gap-4 mb-6">
                  {/* ROLE  */}
                  <SelectField
                    label="Role"
                    name="roleId"
                    required
                    options={roles?.map((r) => ({
                      value: r.id,
                      label: r.name,
                    }))}
                    value={formik.values.roleId}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.roleId && formik.errors.roleId}
                  />

                  {/* FLOORS */}
                  {shouldShowFloors && (
                    <MultiSelectDropdownField
                      label="Floors"
                      name="floors"
                      options={allFloors?.map((f) => ({
                        id: f.id,
                        label: f.name,
                      }))}
                      value={formik.values.floors}
                      onChange={(val) => formik.setFieldValue("floors", val)}
                      onBlur={formik.handleBlur}
                      error={formik.touched.floors && formik.errors.floors}
                      disabled={!formik.values.outletId}
                      disabledText={
                        !formik.values.outletId
                          ? "Please select an outlet first"
                          : "Floors unavailable"
                      }
                      loading={fetchingAllFloors}
                    />
                  )}
                </div>
                {/* ACTIVE USER */}
                <ToggleField
                  label="Staff Account Active"
                  description="Inactive staff cannot log in or access the POS."
                  checked={formik.values.isActive}
                  onChange={(value) => formik.setFieldValue("isActive", value)}
                  activeColorClass="bg-emerald-500"
                  inactiveColorClass="bg-red-500"
                />
              </AccordionSection>

              <InfoCard
                type="info"
                title="Outlet-Specific Access"
                description={
                  userId
                    ? "Updating this staff member will modify their role and floor access within the selected outlet only. Changes will not affect other outlets."
                    : "This staff member will be assigned to the selected outlet. Their role and operational access will be restricted to that outlet only."
                }
              />

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isCreatingUser || isupdatingUser}
                  className="btn bg-primary-500 text-white flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isCreatingUser || isupdatingUser ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      {userId ? "Updating..." : "Creating..."}
                    </>
                  ) : userId ? (
                    "Update Staff"
                  ) : (
                    "Create Staff"
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

export default AddUserPage;
