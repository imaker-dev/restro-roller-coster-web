// components/inventory/InventoryItemCardSkeleton.jsx
import React from "react";
import {
  ArrowUpRight,
  Package,
  SlidersHorizontal,
  Trash2,
  Edit3,
  Layers,
  Thermometer,
  Clock,
} from "lucide-react";
import Shimmer from "../../../layout/Shimmer";

export default function InventoryItemCardSkeleton() {
  return (
    <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden flex flex-col animate-pulse">
      <div className="px-5 py-4 flex-1">
        {/* Top row */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-start gap-3 min-w-0 flex-1">
            <div className="w-10 h-10 rounded-xl bg-slate-200 flex-shrink-0" />
            <div className="min-w-0 flex flex-col gap-1">
              <Shimmer width="120px" height="12px" rounded="md" />
              <div className="flex flex-wrap items-center gap-1.5 mt-0.5">
                <Shimmer width="60px" height="10px" rounded="full" />
                <Shimmer width="40px" height="10px" rounded="full" />
              </div>
            </div>
          </div>
          <Shimmer width="50px" height="18px" rounded="full" />
        </div>

        {/* Stock level + bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1.5">
            <Shimmer width="60px" height="10px" rounded="md" />
            <Shimmer width="80px" height="12px" rounded="md" />
          </div>
          <Shimmer width="100%" height="6px" rounded="full" />
          <div className="flex items-center justify-between mt-1">
            <Shimmer width="50px" height="10px" rounded="md" />
            <Shimmer width="40px" height="10px" rounded="md" />
          </div>
        </div>

        {/* Price tiles */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <Shimmer width="100%" height="40px" rounded="xl" />
          <Shimmer width="100%" height="40px" rounded="xl" />
        </div>

        {/* Attributes row */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mb-4">
          <Shimmer width="80px" height="14px" rounded="full" />
          <Shimmer width="100px" height="14px" rounded="full" />
          <Shimmer width="70px" height="14px" rounded="full" />
          <Shimmer width="140px" height="14px" rounded="md" />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-50">
          <Shimmer width="100px" height="10px" rounded="md" />
          <Shimmer width="40px" height="10px" rounded="md" />
        </div>
      </div>

      {/* Action footer */}
      <div className="grid grid-cols-5 divide-x divide-slate-100 border-t border-slate-100">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="flex flex-col items-center justify-center gap-1 py-3"
          >
            <Shimmer width="20px" height="20px" rounded="full" />
            <Shimmer width="30px" height="10px" rounded="full" />
          </div>
        ))}
      </div>
    </div>
  );
}