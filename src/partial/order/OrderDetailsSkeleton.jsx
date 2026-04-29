import React from "react";
import Shimmer from "../../layout/Shimmer";

/* ── reusable skeleton pieces ── */

const InfoRowSkeleton = () => (
  <div className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
    <Shimmer width="30%" height="10px" />
    <Shimmer width="20%" height="10px" />
  </div>
);

const SectionSkeleton = ({ titleWidth = "120px", rows = 4 }) => (
  <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
    {/* header */}
    <div className="flex items-center gap-2.5 px-4 py-3.5 border-b border-gray-50">
      <Shimmer width="28px" height="28px" rounded="lg" />
      <Shimmer width={titleWidth} height="12px" />
    </div>

    {/* content */}
    <div className="px-4 py-3">
      {[...Array(rows)].map((_, i) => (
        <InfoRowSkeleton key={i} />
      ))}
    </div>
  </div>
);

/* ── main skeleton ── */

export default function OrderDetailsSkeleton() {
  return (
    <div className="space-y-3">
      
      {/* ── Hero Section ── */}
      <div className="border-b px-4 md:px-6 py-5 rounded-lg bg-white border-gray-100">
        
        {/* top row */}
        <div className="flex items-center gap-3 mb-4">
          <Shimmer width="32px" height="32px" rounded="lg" />

          <div className="flex-1 space-y-2">
            <Shimmer width="140px" height="14px" />
            <Shimmer width="180px" height="10px" />
          </div>

          <div className="text-right space-y-2">
            <Shimmer width="90px" height="18px" />
            <Shimmer width="70px" height="10px" />
          </div>
        </div>

        {/* badges */}
        <div className="flex gap-2 flex-wrap mb-4">
          {[...Array(5)].map((_, i) => (
            <Shimmer key={i} width="70px" height="22px" rounded="full" />
          ))}
        </div>

        {/* stats */}
        <div className="grid grid-cols-4 gap-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white border border-gray-100 rounded-xl px-3 py-2.5 text-center space-y-2">
              <Shimmer width="50%" height="10px" />
              <Shimmer width="70%" height="12px" />
            </div>
          ))}
        </div>
      </div>

      {/* ── Items Section ── */}
      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
        <div className="flex items-center gap-2.5 px-4 py-3.5 border-b border-gray-50">
          <Shimmer width="28px" height="28px" rounded="lg" />
          <Shimmer width="160px" height="12px" />
        </div>

        <div className="divide-y divide-gray-50">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="px-4 py-3 flex gap-2.5">
              <Shimmer width="20px" height="20px" rounded="full" />

              <div className="flex-1 space-y-2">
                <Shimmer width="60%" height="12px" />
                <Shimmer width="40%" height="10px" />
                <div className="flex gap-2">
                  <Shimmer width="50px" height="10px" rounded="full" />
                  <Shimmer width="40px" height="10px" rounded="full" />
                </div>
              </div>

              <div className="text-right space-y-2">
                <Shimmer width="60px" height="12px" />
                <Shimmer width="50px" height="10px" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Bill Breakdown ── */}
      <SectionSkeleton titleWidth="140px" rows={6} />

      {/* ── Tax Breakup ── */}
      <SectionSkeleton titleWidth="120px" rows={4} />

      {/* ── Discounts ── */}
      <SectionSkeleton titleWidth="160px" rows={3} />

      {/* ── Payments ── */}
      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
        <div className="flex items-center gap-2.5 px-4 py-3.5 border-b border-gray-50">
          <Shimmer width="28px" height="28px" rounded="lg" />
          <Shimmer width="100px" height="12px" />
        </div>

        <div className="px-4 py-3 space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex justify-between items-center">
              <div className="flex gap-2 items-center">
                <Shimmer width="32px" height="32px" rounded="lg" />
                <div className="space-y-2">
                  <Shimmer width="100px" height="10px" />
                  <Shimmer width="140px" height="10px" />
                </div>
              </div>
              <Shimmer width="60px" height="12px" />
            </div>
          ))}
        </div>
      </div>

      {/* ── Customer & Outlet ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <SectionSkeleton titleWidth="100px" rows={3} />
        <SectionSkeleton titleWidth="100px" rows={3} />
      </div>

      {/* ── Order Info ── */}
      <SectionSkeleton titleWidth="100px" rows={5} />

      {/* footer */}
      <div className="flex justify-center pb-4">
        <Shimmer width="160px" height="10px" />
      </div>
    </div>
  );
}