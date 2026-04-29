import React from "react";
import Shimmer from "../../layout/Shimmer";

export function RecipeCardSkeleton() {
  return (
    <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden flex flex-col animate-pulse">
      <div className="px-5 py-4 flex-1">
        {/* Top row */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-start gap-3 min-w-0 flex-1">
            <Shimmer width="40px" height="40px" rounded="lg" />
            <div className="flex-1 space-y-2">
              <Shimmer width="70%" height="12px" />
              <Shimmer width="50%" height="10px" />
            </div>
          </div>
          <Shimmer width="70px" height="22px" rounded="full" />
        </div>

        {/* Meta row */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 mb-4">
          <Shimmer width="60px" height="10px" />
          <Shimmer width="80px" height="10px" />
          <Shimmer width="50px" height="10px" />
          <Shimmer width="70px" height="10px" />
          <Shimmer width="90px" height="10px" />
        </div>

        {/* Cost tiles */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-slate-50 border border-slate-100 rounded-xl px-3 py-2.5 space-y-2"
            >
              <Shimmer width="60%" height="8px" />
              <Shimmer width="80%" height="14px" />
            </div>
          ))}
        </div>

        {/* Food cost bar */}
        <div className="mb-4 space-y-2">
          <div className="flex items-center justify-between">
            <Shimmer width="80px" height="10px" />
            <Shimmer width="70px" height="10px" />
          </div>
          <Shimmer width="100%" height="6px" rounded="full" />
        </div>

        {/* Footer meta */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-50">
          <div className="flex items-center gap-2">
            <Shimmer width="40px" height="16px" rounded="full" />
            <Shimmer width="90px" height="10px" />
          </div>
          <Shimmer width="70px" height="10px" />
        </div>
      </div>

      {/* Action footer */}
      <div className="flex border-t border-slate-100">
        <div className="flex-1 py-3 flex justify-center">
          <Shimmer width="90px" height="10px" />
        </div>
        <div className="px-5 py-3 flex justify-center">
          <Shimmer width="40px" height="10px" />
        </div>
      </div>
    </div>
  );
}