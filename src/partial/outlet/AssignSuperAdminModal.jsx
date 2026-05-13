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
      title={
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            Assign Franchise Owner
          </h2>
          <p className="text-sm text-slate-500">
            Assign this outlet to a franchise owner
          </p>
        </div>
      }
    >
      <form
        onSubmit={formik.handleSubmit}
        autoComplete="off"
        className="p-4 space-y-5"
      >
        {/* Outlet Summary */}
        {outlet && (
          <div className="relative overflow-hidden rounded-md border border-slate-200 bg-white p-4 shadow-sm">
            {/* Left */}
            <div className="flex items-start gap-3 min-w-0">
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-sm font-bold text-slate-900 truncate">
                    {outlet.name}
                  </h3>

                  <StatusBadge value={outlet.is_active} size="sm" />
                </div>

                {outlet.legal_name && (
                  <p className="text-xs text-slate-500 truncate mt-0.5">
                    {outlet.legal_name}
                  </p>
                )}

                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 text-[11px] text-slate-500">
                  {(outlet.city || outlet.state) && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {[outlet.city, outlet.state].filter(Boolean).join(", ")}
                    </span>
                  )}

                  {outlet.phone && (
                    <span className="flex items-center gap-1">
                      <Phone className="w-3 h-3" />
                      {outlet.phone}
                    </span>
                  )}
                </div>
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
          <div className="bg-white border border-slate-200 rounded-md p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <UserAvatar name={currentlyAssigned.name} size="md" />
                <div>
                  <p className="text-sm font-semibold text-slate-800">
                    {currentlyAssigned.name}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {currentlyAssigned.email}
                  </p>
                </div>
              </div>
              <StatusBadge value={currentlyAssigned.isActive} size="sm" />
            </div>

            {(currentlyAssigned.phone || currentlyAssigned.employeeCode) && (
              <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-4 text-xs text-slate-500">
                {currentlyAssigned.phone && (
                  <span className="flex items-center gap-1.5">
                    <Phone className="w-3 h-3" />
                    {currentlyAssigned.phone}
                  </span>
                )}
                {currentlyAssigned.employeeCode && (
                  <span className="font-mono text-slate-400">
                    #{currentlyAssigned.employeeCode}
                  </span>
                )}
              </div>
            )}
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
