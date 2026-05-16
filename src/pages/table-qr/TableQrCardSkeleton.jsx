// components/skeletons/TableQrCardSkeleton.jsx
import React from "react";
import Shimmer from "../../layout/Shimmer";

export default function TableQrCardSkeleton() {
  return (
    <div className="group bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col">
      {/* ── QR Image Area ── */}
      <div
        className="relative flex items-center justify-center border-b border-slate-100 bg-white"
        style={{ height: 156 }}
      >
        {/* QR Image */}
        <div className="p-4">
          <Shimmer
            width="112px"
            height="112px"
            rounded="lg"
          />
        </div>

        {/* Top action button */}
        <div className="absolute top-3 right-3">
          <Shimmer width="28px" height="28px" rounded="lg" />
        </div>
      </div>

      {/* ── Info + Actions ── */}
      <div className="px-4 py-4 flex flex-col gap-3 flex-1">
        {/* Table name + status */}
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <Shimmer width="70%" height="14px" rounded="md" />
            <Shimmer
              width="40%"
              height="10px"
              rounded="md"
              className="mt-2"
            />
          </div>

          {/* Status badge */}
          <Shimmer width="74px" height="22px" rounded="full" />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1.5">
          {/* Download button */}
          <Shimmer
            width="100%"
            height="32px"
            rounded="lg"
            className="flex-1"
          />

          {/* Copy button */}
          <Shimmer width="32px" height="32px" rounded="lg" />

          {/* Refresh button */}
          <Shimmer width="32px" height="32px" rounded="lg" />
        </div>
      </div>
    </div>
  );
}