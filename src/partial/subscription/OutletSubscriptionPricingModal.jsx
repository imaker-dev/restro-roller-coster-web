// components/modals/OutletPricingModal.jsx
import React from "react";
import ModalBasic from "../../components/ModalBasic";
import { InputField } from "../../components/fields/InputField";
import InfoCard from "../../components/InfoCard";
import { Loader2 } from "lucide-react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { formatNumber } from "../../utils/numberFormatter";
import { CURRENCY } from "../../constants";

const validationSchema = Yup.object({
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

  notes: Yup.string().max(500, "Notes cannot exceed 500 characters").nullable(),
});

const OutletPricingModal = ({
  isOpen,
  onClose,
  outlet,
  onSubmit,
  loading = false,
}) => {
  /* ---------------- CALCULATIONS ---------------- */

  const calculateGSTAmount = (basePrice, gstPercentage) => {
    const base = parseFloat(basePrice) || 0;
    const gst = parseFloat(gstPercentage) || 0;
    return (base * gst) / 100;
  };

  const calculateTotalPrice = (basePrice, gstPercentage) => {
    const base = parseFloat(basePrice) || 0;
    const gst = parseFloat(gstPercentage) || 0;
    return base + (base * gst) / 100;
  };

  /* ---------------- FORMIK ---------------- */

  const formik = useFormik({
    enableReinitialize: true,

    initialValues: {
      basePrice: outlet?.pricing?.basePrice || "",
      gstPercentage: outlet?.pricing?.gstPercentage || "",
      notes: "",
    },

    validationSchema,

    onSubmit: async (values, { resetForm }) => {
      try {
        await onSubmit({
          outletId: outlet.id,
          values: {
            basePrice: parseFloat(values.basePrice),
            gstPercentage: parseFloat(values.gstPercentage),
            notes: values.notes || null,
          },
          resetForm,
        });
      } catch (error) {
        console.error(error);
      }
    },
  });

  /* ---------------- RENDER ---------------- */

  return (
    <ModalBasic
      id="outlet-pricing-modal"
      title="Update Outlet Pricing"
      isOpen={isOpen}
      onClose={() => {
        formik.resetForm();
        onClose();
      }}
    >
      <form
        onSubmit={formik.handleSubmit}
        autoComplete="off"
        className="p-5 space-y-5"
      >
        {/* ---------------- OUTLET INFO ---------------- */}

        {outlet && (
          <div className="flex items-center justify-between rounded-md bg-slate-50 border border-slate-200 px-4 py-3">
            <div>
              <p className="text-sm font-bold text-slate-800">{outlet.name}</p>

              <p className="text-[11px] text-slate-500 mt-0.5">
                {outlet.address?.city}, {outlet.address?.state}
              </p>
            </div>

            <div className="text-right">
              <p className="text-[10px] text-slate-400 uppercase tracking-wide">
                Pricing
              </p>

              <p className="text-base font-black text-slate-900 tabular-nums">
                {outlet.pricing?.totalPrice
                  ? formatNumber(outlet.pricing.totalPrice, true)
                  : "--"}
              </p>
            </div>
          </div>
        )}

        {/* ---------------- INPUTS ---------------- */}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            label={`Base Price ${CURRENCY.SYMBOL}`}
            name="basePrice"
            type="number"
            required
            placeholder="Enter base price"
            value={formik.values.basePrice}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.basePrice && formik.errors.basePrice}
            autoComplete="off"
          />

          <InputField
            label="GST Percentage (%)"
            name="gstPercentage"
            type="number"
            required
            placeholder="Enter GST percentage"
            value={formik.values.gstPercentage}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.gstPercentage && formik.errors.gstPercentage}
            autoComplete="off"
            step="0.01"
          />
        </div>

        {/* ---------------- NOTES ---------------- */}

        <InputField
          label="Notes"
          name="notes"
          type="text"
          placeholder="e.g., Promotional rate for first year"
          value={formik.values.notes}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.notes && formik.errors.notes}
          autoComplete="off"
        />

        {/* ---------------- LIVE PREVIEW ---------------- */}

        {(formik.values.basePrice || formik.values.gstPercentage) && (
          <div className="rounded-xl border border-slate-200 bg-white px-4 py-4 sm:px-5">
            <div className="flex items-end justify-between gap-4 sm:gap-6">
              {/* Left Section */}
              <div className="min-w-0">
                <p className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                  Subscription Pricing
                </p>

                <div className="flex items-center gap-2 mt-2">
                  <span className="text-base sm:text-lg font-bold text-slate-900 tabular-nums truncate">
                    {formatNumber(formik.values.basePrice || 0, true)}
                  </span>

                  <span className="text-[11px] sm:text-sm text-slate-400 whitespace-nowrap">
                    + {formik.values.gstPercentage || 0}% GST
                  </span>
                </div>
              </div>

              {/* Right Section */}
              <div className="text-right shrink-0">
                <p className="text-[9px] sm:text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">
                  Total Amount
                </p>

                <p className="mt-1 text-xl sm:text-2xl font-black tracking-tight text-slate-900 tabular-nums leading-none">
                  {formatNumber(
                    calculateTotalPrice(
                      formik.values.basePrice,
                      formik.values.gstPercentage,
                    ),
                    true,
                  )}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ---------------- INFO ---------------- */}

        <InfoCard
          size="sm"
          type="warning"
          title="Outlet-Specific Pricing"
          description="This will override the global subscription pricing for this outlet. The changes will apply from the next billing cycle."
        />

        {/* ---------------- ACTIONS ---------------- */}

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => {
              formik.resetForm();
              onClose();
            }}
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
            {loading ? "Updating Pricing..." : "Update Outlet Pricing"}
          </button>
        </div>
      </form>
    </ModalBasic>
  );
};

export default OutletPricingModal;
