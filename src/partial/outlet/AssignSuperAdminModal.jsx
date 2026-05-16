import React, { useEffect, useState } from "react";
import ModalBasic from "../../components/ModalBasic";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Loader2,
  Building2,
  MapPin,
  Phone,
  User,
  Shield,
  ArrowRight,
  Check,
  Info,
  Mail,
} from "lucide-react";
import { SelectField } from "../../components/fields/SelectField";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllSuperAdmins } from "../../redux/slices/adminSlice";
import StatusBadge from "../../layout/StatusBadge";
import UserAvatar from "../../components/UserAvatar";
import InfoCard from "../../components/InfoCard";

const validationSchema = Yup.object({
  superAdminId: Yup.string().required("Please select a franchise"),
});

const AssignSuperAdminModal = ({
  isOpen,
  onClose,
  onSubmit,
  outlet,
  loading = false,
}) => {
  const dispatch = useDispatch();

  const { isFetchingSuperAdmin, allSuperAdmins } = useSelector(
    (state) => state.admin,
  );

  const { data } = allSuperAdmins || {};

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      outletId: outlet?.id || "",
      superAdminId: outlet?.assignedSuperAdminId || "",
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      await onSubmit({
        outletId: values.outletId,
        superAdminId: values.superAdminId,
        resetForm,
      });
    },
  });

  const superAdminOptions = data?.map((admin) => ({
    label: admin.name,
    value: admin.id.toString(),
    subtitle: admin.email,
    meta: admin.employeeCode ? `#${admin.employeeCode}` : null,
    status: admin.isActive,
  }));

  const currentlyAssigned = data?.find(
    (admin) => admin.id.toString() === formik.values.superAdminId,
  );

  const isReassignment =
    outlet?.assignedSuperAdminId &&
    outlet.assignedSuperAdminId !== formik.values.superAdminId;

  useEffect(() => {
    if (isOpen) {
      dispatch(fetchAllSuperAdmins());
    }
  }, [isOpen, dispatch]);

  return (
    <ModalBasic
      id="assign-super-admin-modal"
      isOpen={isOpen}
      onClose={onClose}
      modalSize="lg"
      title={"Assign this outlet to a franchise owner"}
    >
      <form
        onSubmit={formik.handleSubmit}
        autoComplete="off"
        className="p-4 space-y-4"
      >
        {/* Outlet Summary */}
        {outlet && (
          <div className="group relative overflow-hidden rounded-lg border border-slate-200 bg-white px-4 py-3 transition-all duration-200 hover:border-slate-300 hover:shadow-md">
            {/* Content */}
            <div className="min-w-0 flex-1">
              {/* Header */}
              <h3 className="truncate text-sm font-semibold tracking-tight text-slate-900">
                {outlet.name}
              </h3>

              {/* Legal Name */}
              {outlet.legal_name && (
                <p className="mt-0.5 truncate text-xs text-slate-500">
                  {outlet.legal_name}
                </p>
              )}

              {/* Meta */}
              <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-500">
                {(outlet.city || outlet.state) && (
                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-slate-400" />
                    <span className="truncate">
                      {[outlet.city, outlet.state].filter(Boolean).join(", ")}
                    </span>
                  </span>
                )}

                {outlet.phone && (
                  <span className="flex items-center gap-1.5">
                    <Phone className="h-3.5 w-3.5 text-slate-400" />
                    {outlet.phone}
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Current Assignment Info */}
        {outlet?.assignedSuperAdminId && !isReassignment && (
          <InfoCard
            title={"Currently Assigned"}
            description={
              "This outlet is already assigned to a franchise owner. Select a different franchise owner below to reassign."
            }
            size="sm"
          />
        )}

        {/* Admin Selection */}

        <SelectField
          name="superAdminId"
          label={"Select Franchise Owner"}
          required={true}
          value={formik.values.superAdminId}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.superAdminId && formik.errors.superAdminId}
          options={superAdminOptions || []}
          placeholder="Search and select a super admin..."
          loading={isFetchingSuperAdmin}
        />

        {/* Selected Admin Preview */}
        {currentlyAssigned && (
          <div className="group relative overflow-hidden rounded-lg border border-slate-200/80 bg-white px-4 py-3 transition-all duration-200 hover:border-slate-300 hover:shadow-md">
            <div className="flex items-start gap-3">
              {/* Avatar */}
              <UserAvatar name={currentlyAssigned.name} />

              {/* Content */}
              <div className="min-w-0 flex-1">
                {/* Name */}
                <div className="flex items-center gap-2">
                  <p className="truncate text-sm font-semibold tracking-tight text-slate-900">
                    {currentlyAssigned.name}
                  </p>

   
                </div>

                {/* Contact Info */}
                <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                  {currentlyAssigned.email && (
                    <span className="flex min-w-0 items-center gap-1.5 truncate">
                      <Mail className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                      <span className="truncate">
                        {currentlyAssigned.email}
                      </span>
                    </span>
                  )}

                  {currentlyAssigned.phone && (
                    <span className="flex items-center gap-1.5">
                      <Phone className="h-3.5 w-3.5 text-slate-400" />
                      <span>{currentlyAssigned.phone}</span>
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Assignment Flow */}
        {formik.values.superAdminId && (
          <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg">
            <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
              <Building2 className="w-4 h-4 text-primary-500" />
              {outlet?.name}
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400" />
            <div className="flex items-center gap-2 text-sm font-medium text-slate-900">
              <User className="w-4 h-4 text-primary-500" />
              {currentlyAssigned?.name || "Selected Admin"}
            </div>
            {isReassignment && (
              <span className="ml-auto text-xs font-medium text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                Reassignment
              </span>
            )}
          </div>
        )}

        {/* Info Footer */}
        <InfoCard
          title="Franchise Owner Access"
          description={`The assigned franchise owner will have full access to manage this outlet's operations, staff, pricing, and reporting.`}
          size="sm"
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
            className="btn bg-primary-500 text-white hover:bg-primary-600 disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Assigning...
              </>
            ) : (
              <>
                <Shield className="w-4 h-4" />
                Assign Franchise Owner
              </>
            )}
          </button>
        </div>
      </form>
    </ModalBasic>
  );
};

export default AssignSuperAdminModal;
