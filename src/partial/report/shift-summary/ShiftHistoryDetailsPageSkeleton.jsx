import React from "react";
import Shimmer from "../../../layout/Shimmer";

export default function ShiftHistoryDetailsSkeleton() {
  return (
    <div className="space-y-5">
      {/* ── HERO HEADER ── */}
      <div className="bg-white border-b border-gray-100 px-4 md:px-6 py-5 space-y-4">
        {/* top row */}
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <Shimmer width="80px" height="16px" rounded="full" />
            <Shimmer width="200px" height="18px" />
            <Shimmer width="140px" height="12px" />
          </div>
          <div className="text-right space-y-2">
            <Shimmer width="100px" height="22px" />
            <Shimmer width="80px" height="12px" />
          </div>
        </div>

        {/* cashier row */}
        <div className="flex items-center gap-3">
          <Shimmer width="140px" height="32px" rounded="full" />
          <Shimmer width="120px" height="12px" />
        </div>

        {/* stat chips */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {[...Array(6)].map((_, i) => (
            <Shimmer key={i} height="44px" rounded="lg" />
          ))}
        </div>
      </div>

      {/* ── TABS ── */}
      <div className="bg-white border-b border-gray-100 px-4 md:px-6">
        <div className="flex gap-2 py-2.5">
          {[...Array(5)].map((_, i) => (
            <Shimmer key={i} width="80px" height="28px" rounded="full" />
          ))}
        </div>
      </div>

      {/* ── CONTENT ── */}
      <div className="space-y-3">
        {/* Accordion blocks */}
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="bg-white border border-gray-100 rounded-2xl p-4 space-y-4"
          >
            {/* header */}
            <div className="flex justify-between items-center">
              <Shimmer width="160px" height="14px" />
              <Shimmer width="20px" height="20px" rounded="full" />
            </div>

            {/* rows */}
            <div className="space-y-2">
              {[...Array(4)].map((_, j) => (
                <div key={j} className="flex justify-between">
                  <Shimmer width="120px" height="10px" />
                  <Shimmer width="80px" height="10px" />
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* list cards (orders / staff / etc.) */}
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="bg-white border border-gray-100 rounded-2xl px-4 py-3 space-y-3"
          >
            <div className="flex justify-between items-center">
              <div className="space-y-1">
                <Shimmer width="140px" height="12px" />
                <Shimmer width="100px" height="10px" />
              </div>
              <Shimmer width="80px" height="14px" />
            </div>

            <div className="grid grid-cols-2 gap-2">
              {[...Array(4)].map((_, j) => (
                <Shimmer key={j} height="32px" rounded="lg" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}