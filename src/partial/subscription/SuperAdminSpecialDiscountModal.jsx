import React, { useEffect } from "react";
import ModalBasic from "../../components/ModalBasic";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Loader2 } from "lucide-react";
import { InputField } from "../../components/fields/InputField";
import { SelectField } from "../../components/fields/SelectField";
import { TextareaField } from "../../components/fields/TextareaField";
import InfoCard from "../../components/InfoCard";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllSuperAdmins } from "../../redux/slices/adminSlice";
import { formatNumber } from "../../utils/numberFormatter";
import { CURRENCY } from "../../constants";

const validationSchema = Yup.object({
  adminId: Yup.number()
    .typeError("Admin is required")
    .required("Admin is required")
    .positive("Invalid admin"),

  basePrice: Yup.number()
    .typeError("Base price must be a number")
    .required("Base price is required")
    .positive("Base price must be greater than 0")
    .max(999999, "Base price is too high"),

  gstPercentage: Yup.number()
    .typeError("GST must be a number")
    .required("GST percentage is required")
    .min(0, "GST cannot be negative")
    .max(100, "GST cannot exceed 100%"),

  notes: Yup.string()
    .trim()
    .required("Notes are required")
    .min(3, "Too short")
    .max(200, "Too long"),
});

const SuperAdminSpecialDiscountModal = ({
  isOpen,
  onClose,
  onSubmit,
  loading = false,
}) => {
  const dispatch = useDispatch();
  const { allSuperAdmins, isFetchingSuperAdmin } = useSelector(
    (state) => state.admin,
  );
  const { data } = allSuperAdmins || {};

  useEffect(() => {
    if (isOpen) {
      dispatch(fetchAllSuperAdmins());
    }
  }, [isOpen, dispatch]);

  const formik = useFormik({
    initialValues: {
      adminId: "",
      basePrice: "",
      gstPercentage: "",
      notes: "",
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      const payload = {
        basePrice: parseFloat(values.basePrice),
        gstPercentage: parseFloat(values.gstPercentage),
        notes: values.notes,
      };

      await onSubmit({
        adminId: parseInt(values.adminId),
        values: payload,
        resetForm,
      });
    },
  });

  const calculateTotalPrice = (basePrice, gstPercentage) => {
    const base = parseFloat(basePrice) || 0;
    const gst = parseFloat(gstPercentage) || 0;
    return base + (base * gst) / 100;
  };

  const adminOptions = data
    ? data.map((admin) => ({
        label: `${admin.name} (${admin.email})`,
        value: admin.id,
      }))
    : [];

  return (
    <ModalBasic
      id="special-discount-modal"
      title="Set Franchise Pricing"
      isOpen={isOpen}
      onClose={onClose}
    >
      <form
        onSubmit={formik.handleSubmit}
        autoComplete="off"
        className="p-4 space-y-4"
      >
        <SelectField
          label="Franchise Owner"
          name="adminId"
          required
          placeholder="Select franchise owner"
          value={formik.values.adminId}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.adminId && formik.errors.adminId}
          options={adminOptions}
          loading={isFetchingSuperAdmin}
        />

        <div className="grid grid-cols-2 gap-4">
          <InputField
            label={`Base Price (${CURRENCY.SYMBOL})`}
            name="basePrice"
            type="number"
            required
            placeholder="e.g. 10000"
            value={formik.values.basePrice}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.basePrice && formik.errors.basePrice}
          />

          <InputField
            label="GST Percentage (%)"
            name="gstPercentage"
            type="number"
            required
            placeholder="e.g. 18"
            value={formik.values.gstPercentage}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.gstPercentage && formik.errors.gstPercentage}
            step="0.01"
          />
        </div>

        <TextareaField
          label="Notes"
          name="notes"
          required
          placeholder="e.g. Custom pricing for premium franchise partner"
          value={formik.values.notes}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.notes && formik.errors.notes}
          rows={2}
        />

        {/* Live Preview */}
        {(formik.values.basePrice || formik.values.gstPercentage) && (
          <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
            <h4 className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-3">
              Price Preview
            </h4>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Base Amount</span>
                <span className="font-medium text-slate-900">
                  {formatNumber(formik.values.basePrice || 0, true)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">
                  GST ({formik.values.gstPercentage || 0}%)
                </span>
                <span className="font-medium text-slate-900">
                  {formatNumber(
                    ((parseFloat(formik.values.basePrice) || 0) *
                      (parseFloat(formik.values.gstPercentage) || 0)) /
                      100,
                    true,
                  )}
                </span>
              </div>
              <div className="pt-2 border-t border-slate-200">
                <div className="flex justify-between">
                  <span className="text-sm font-semibold text-slate-900">
                    Total
                  </span>
                  <span className="text-sm font-semibold text-emerald-600">
                    {formatNumber(
                      calculateTotalPrice(
                        formik.values.basePrice,
                        formik.values.gstPercentage,
                      ),
                      true,
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        <InfoCard
          size="sm"
          type="warning"
          title="Important"
          description="This pricing overrides the default subscription pricing for the selected franchise owner."
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
            disabled={loading || !formik.isValid || !formik.dirty}
            className="btn bg-primary-500 text-white hover:bg-primary-600 disabled:opacity-50 flex items-center gap-2"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {loading ? "Applying..." : "Apply Pricing"}
          </button>
        </div>
      </form>
    </ModalBasic>
  );
};

export default SuperAdminSpecialDiscountModal;
