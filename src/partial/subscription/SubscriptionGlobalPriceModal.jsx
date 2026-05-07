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
});

const SubscriptionGlobalPriceModal = ({
  isOpen,
  onClose,
  pricing,
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
      basePrice: pricing?.basePrice || "",
      gstPercentage: pricing?.gstPercentage || "",
    },

    validationSchema,

    onSubmit: async (values, { resetForm }) => {
      try {
        await onSubmit({
          values: {
            basePrice: parseFloat(values.basePrice),
            gstPercentage: parseFloat(values.gstPercentage),
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
      id="subscription-global-price-modal"
      title="Update Subscription Pricing"
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

        {/* ---------------- LIVE PREVIEW ---------------- */}

        {(formik.values.basePrice || formik.values.gstPercentage) && (
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Live Pricing Preview
              </h4>

              <span className="text-[10px] font-medium text-slate-400">
                Auto Calculated
              </span>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Base Amount</span>

                <span className="text-sm font-semibold text-slate-900">
                  {formatNumber(formik.values.basePrice || 0, true)}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">GST Amount</span>

                <span className="text-sm font-semibold text-slate-900">
                  {formatNumber(
                    calculateGSTAmount(
                      formik.values.basePrice,
                      formik.values.gstPercentage,
                    ),
                    true,
                  )}
                </span>
              </div>

              <div className="border-t border-slate-200 pt-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-900">
                    Total Subscription Price
                  </span>

                  <span className="text-lg font-bold text-slate-900">
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

        {/* ---------------- INFO ---------------- */}

        <InfoCard
          size="sm"
          type="info"
          title="Pricing Update"
          description="Updating the global subscription pricing will affect future subscriptions and renewals."
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

            {loading ? "Updating Pricing..." : "Update Pricing"}
          </button>
        </div>
      </form>
    </ModalBasic>
  );
};

export default SubscriptionGlobalPriceModal;
