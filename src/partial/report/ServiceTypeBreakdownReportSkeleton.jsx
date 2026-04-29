import React from "react";
import Shimmer from "../../layout/Shimmer";

/* ---------------- Summary Card Skeleton ---------------- */
const SummaryCardSkeleton = () => {
  return (
    <div className="relative overflow-hidden rounded-2xl p-6 bg-gray-100 shadow-sm">
      <div className="flex items-start justify-between">
        <div className="space-y-3 w-3/4">
          <Shimmer height="12px" width="40%" />
          <Shimmer height="28px" width="70%" rounded="lg" />
        </div>

        <Shimmer height="40px" width="40px" rounded="lg" />
      </div>
    </div>
  );
};

/* ---------------- Breakdown Card Skeleton ---------------- */
const BreakdownCardSkeleton = () => {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">

      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-3 w-2/3">
          <Shimmer height="12px" width="40%" />
          <Shimmer height="30px" width="60%" rounded="lg" />
        </div>

        <Shimmer height="48px" width="48px" rounded="lg" />
      </div>

      {/* Contribution Label */}
      <div className="space-y-3">
        <div className="flex justify-between">
          <Shimmer height="10px" width="30%" />
          <Shimmer height="10px" width="15%" />
        </div>
        <Shimmer height="8px" width="100%" rounded="full" />
      </div>

      {/* Stats Rows */}
      <div className="pt-6 border-t border-gray-100 space-y-4">
        {[1, 2, 3, 4].map((row) => (
          <div key={row} className="flex justify-between">
            <Shimmer height="12px" width="40%" />
            <Shimmer height="12px" width="20%" />
          </div>
        ))}
      </div>
    </div>
  );
};

/* ---------------- Main Page Skeleton ---------------- */
const ServiceTypeBreakdownReportSkeleton = () => {
  return (
    <div className="space-y-8 animate-fadeIn">

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <Shimmer height="32px" width="280px" rounded="lg" />
        <Shimmer height="40px" width="220px" rounded="lg" />
      </div>

      {/* Summary Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        {[1, 2, 3, 4, 5].map((card) => (
          <SummaryCardSkeleton key={card} />
        ))}
      </div>

      {/* Breakdown Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {[1, 2, 3].map((card) => (
          <BreakdownCardSkeleton key={card} />
        ))}
      </div>

    </div>
  );
};

export default ServiceTypeBreakdownReportSkeleton;