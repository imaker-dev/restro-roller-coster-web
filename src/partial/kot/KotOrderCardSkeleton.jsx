import React from "react";
import Shimmer from "../../layout/Shimmer";

const KotOrderCardSkeleton = () => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="space-y-2">
          <Shimmer width="110px" height="16px" />
          <Shimmer width="160px" height="12px" />
        </div>
      </div>

      {/* Items */}
      <div className="p-4 space-y-3 min-h-[150px]">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center w-full">
            {/* Left */}
            <div className="flex items-center gap-2 flex-1">
              <Shimmer width="8px" height="8px" rounded="full" />
              <Shimmer width="14px" height="14px" rounded="sm" />
              <Shimmer width="120px" height="12px" />
            </div>

            {/* Dashed line fake */}
            <div className="flex-1 mx-2">
              <Shimmer width="100%" height="1px" />
            </div>

            {/* Qty */}
            <Shimmer width="24px" height="12px" />
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
        <Shimmer width="150px" height="12px" />
        <Shimmer width="90px" height="30px" rounded="md" />
      </div>
    </div>
  );
};

export default KotOrderCardSkeleton;
