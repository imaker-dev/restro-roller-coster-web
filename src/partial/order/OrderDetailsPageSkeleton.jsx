import Shimmer from "../../layout/Shimmer";

export default function OrderDetailsPageSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* ===== HEADER ===== */}
      <div className="space-y-2">
        <Shimmer width="200px" height="22px" />
        <Shimmer width="140px" height="14px" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ===== LEFT COLUMN ===== */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Info Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Status Banner */}
            <div className="p-6 border-b border-gray-200 space-y-3">
              <div className="flex justify-between items-center">
                <div className="space-y-2">
                  <Shimmer width="120px" height="18px" />
                  <Shimmer width="160px" height="14px" />
                </div>
                <div className="space-y-2 text-right">
                  <Shimmer width="90px" height="22px" />
                  <Shimmer width="100px" height="12px" />
                </div>
              </div>
            </div>

            {/* Metadata Grid */}
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="flex gap-3 items-start">
                  <Shimmer width="32px" height="32px" rounded="lg" />
                  <div className="space-y-2 flex-1">
                    <Shimmer width="80px" height="12px" />
                    <Shimmer width="140px" height="14px" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Items Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <Shimmer width="160px" height="18px" />
            </div>

            <div className="divide-y divide-gray-100">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="p-6 flex gap-4">
                  <Shimmer width="40px" height="40px" rounded="lg" />
                  <div className="flex-1 space-y-3">
                    <div className="flex justify-between">
                      <Shimmer width="200px" height="16px" />
                      <Shimmer width="80px" height="18px" />
                    </div>
                    <Shimmer width="120px" height="12px" />
                    <div className="flex gap-2">
                      <Shimmer width="60px" height="20px" rounded="full" />
                      <Shimmer width="80px" height="20px" rounded="full" />
                    </div>
                    <Shimmer width="220px" height="12px" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ===== RIGHT COLUMN ===== */}
        <div className="space-y-6">
          {/* Payment Summary */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <Shimmer width="150px" height="18px" />
            </div>

            <div className="p-6 space-y-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="flex justify-between">
                  <Shimmer width="120px" height="14px" />
                  <Shimmer width="70px" height="14px" />
                </div>
              ))}

              <div className="pt-4 border-t border-gray-200 space-y-2">
                <div className="flex justify-between">
                  <Shimmer width="120px" height="18px" />
                  <Shimmer width="90px" height="18px" />
                </div>
                <div className="flex justify-between">
                  <Shimmer width="100px" height="14px" />
                  <Shimmer width="70px" height="14px" />
                </div>
              </div>
            </div>
          </div>

          {/* Notes Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <Shimmer width="100px" height="18px" />
            </div>

            <div className="p-6 space-y-4">
              <Shimmer width="80%" height="14px" />
              <Shimmer width="60%" height="14px" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
