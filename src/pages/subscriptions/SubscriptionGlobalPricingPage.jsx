import React, { useEffect, useState } from "react";
import PageHeader from "../../layout/PageHeader";

import { useDispatch, useSelector } from "react-redux";

import {
  fetchSubscriptionGlobalPricing,
  updateSubscriptionGlobalPricing,
} from "../../redux/slices/subscriptionSlice";

import {
  Loader2,
  Pencil,
  Percent,
  Calendar,
  Circle,
} from "lucide-react";

import { formatNumber } from "../../utils/numberFormatter";
import { formatDate } from "../../utils/dateFormatter";

import SubscriptionGlobalPriceModal from "../../partial/subscription/SubscriptionGlobalPriceModal";
import { handleResponse } from "../../utils/helpers";
import LoadingOverlay from "../../components/LoadingOverlay";

const SubscriptionGlobalPricingPage = () => {
  const dispatch = useDispatch();

  const {
    isFetchingSubscriptionGlobalPricing,
    subscriptionGlobalPricing,
    isUpdatingSubscriptionGlobalPricing,
  } = useSelector((state) => state.subscription);

  const [isModalOpen, setIsModalOpen] = useState(false);

  /* ---------------- FETCH ---------------- */

  const fetchSubscriptions = () => {
    dispatch(fetchSubscriptionGlobalPricing());
  };

  useEffect(() => {
    fetchSubscriptions();
  }, [dispatch]);

  /* ---------------- UPDATE ---------------- */

  const handleUpdatePricing = async ({ values, resetForm }) => {
    await handleResponse(
      dispatch(updateSubscriptionGlobalPricing({ values })),
      () => {
        resetForm();
        setIsModalOpen(false);
        fetchSubscriptions();
      },
    );
  };

  /* ---------------- HELPERS ---------------- */

  const calculateGSTAmount = (basePrice, gstPercentage) => {
    const base = parseFloat(basePrice) || 0;
    const gst = parseFloat(gstPercentage) || 0;

    return (base * gst) / 100;
  };

  /* ---------------- LOADING ---------------- */

  if (isFetchingSubscriptionGlobalPricing) {
    return <LoadingOverlay />;
  }

  /* ---------------- RENDER ---------------- */

  return (
    <>
      <div className="space-y-6">
        <PageHeader title="Subscription Global Pricing" />

        {/* ---------------- TOTAL ---------------- */}

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-8 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500 uppercase tracking-wide mb-2">
                Total Price (incl. GST)
              </p>

              <p className="text-5xl font-semibold text-slate-900 tracking-tight">
                {formatNumber(subscriptionGlobalPricing?.totalPrice, true)}
              </p>
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="btn text-white bg-primary-500 hover:bg-primary-600"
            >
              <Pencil className="h-4 w-4 mr-2" />
              Edit Pricing
            </button>
          </div>
        </div>

        {/* ---------------- BREAKDOWN ---------------- */}

        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
            <h3 className="text-sm font-medium text-slate-600 uppercase tracking-wide">
              Price Breakdown
            </h3>
          </div>

          <div className="divide-y divide-slate-100">
            <div className="flex items-center justify-between px-6 py-4">
              <span className="text-sm text-slate-600">Base Amount</span>

              <span className="text-sm font-medium text-slate-900">
                {formatNumber(subscriptionGlobalPricing?.basePrice, true)}
              </span>
            </div>

            <div className="flex items-center justify-between px-6 py-4">
              <span className="text-sm text-slate-600">
                GST ({subscriptionGlobalPricing?.gstPercentage}
                %)
              </span>

              <span className="text-sm font-medium text-slate-900">
                {formatNumber(
                  calculateGSTAmount(
                    subscriptionGlobalPricing?.basePrice,
                    subscriptionGlobalPricing?.gstPercentage,
                  ),
                  true,
                )}
              </span>
            </div>

            <div className="flex items-center justify-between px-6 py-4 bg-slate-50">
              <span className="text-sm font-semibold text-slate-900">
                Total Amount
              </span>

              <span className="text-lg font-semibold text-slate-900">
                {formatNumber(subscriptionGlobalPricing?.totalPrice, true)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ---------------- MODAL ---------------- */}

      <SubscriptionGlobalPriceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        pricing={subscriptionGlobalPricing}
        onSubmit={handleUpdatePricing}
        loading={isUpdatingSubscriptionGlobalPricing}
      />
    </>
  );
};

export default SubscriptionGlobalPricingPage;
