import React from "react";
import Shimmer from "../../../layout/Shimmer";

export default function DayEndSummarySkeleton() {
  return (
    <div className="space-y-6">

      {/* ── Collection Summary Card ── */}
      <div className="bg-white border border-gray-100 rounded-2xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <Shimmer width="140px" height="14px" />
          <Shimmer width="80px" height="14px" />
        </div>

        <div className="grid grid-cols-3 gap-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="space-y-2">
              <Shimmer width="60%" height="10px" />
              <Shimmer width="80%" height="14px" />
            </div>
          ))}
        </div>
      </div>

      {/* ── Day-wise cards ── */}
      <div className="space-y-2">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="bg-white border border-gray-100 rounded-2xl px-4 py-4 flex items-center justify-between"
          >
            <div className="space-y-2 w-1/3">
              <Shimmer width="70%" height="12px" />
              <Shimmer width="50%" height="10px" />
            </div>
            <Shimmer width="80px" height="14px" />
          </div>
        ))}
      </div>
    </div>
  );
}