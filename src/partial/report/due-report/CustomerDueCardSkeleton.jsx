import Shimmer from "../../../layout/Shimmer";

function CustomerDueCardSkeleton() {
  return (
    <div>
      <div className="border border-slate-100 rounded-2xl overflow-hidden bg-white">
        {/* Header */}
        <div className="px-5 py-4">
          <div className="flex items-start justify-between gap-3">
            
            {/* Avatar + info */}
            <div className="flex items-center gap-3 min-w-0">
              <Shimmer width="40px" height="40px" rounded="lg" />

              <div className="space-y-2">
                <Shimmer width="120px" height="14px" />
                <Shimmer width="100px" height="10px" />
                <Shimmer width="140px" height="10px" />
              </div>
            </div>

            {/* Due badge + amount */}
            <div className="flex flex-col items-end gap-2">
              <Shimmer width="60px" height="18px" rounded="full" />
              <Shimmer width="70px" height="18px" />
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-3 mt-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-slate-50 border border-slate-100 rounded-xl px-3 py-2.5 space-y-2"
              >
                <div className="flex items-center gap-2">
                  <Shimmer width="10px" height="10px" rounded="full" />
                  <Shimmer width="60px" height="8px" />
                </div>
                <Shimmer width="40px" height="14px" />
              </div>
            ))}
          </div>

          {/* Progress bar */}
          <div className="mt-4 space-y-2">
            <div className="flex justify-between">
              <Shimmer width="110px" height="8px" />
              <Shimmer width="60px" height="8px" />
            </div>

            <Shimmer width="100%" height="6px" rounded="full" />
          </div>

          {/* Last due date */}
          <div className="flex items-center gap-2 mt-3">
            <Shimmer width="12px" height="12px" rounded="full" />
            <Shimmer width="160px" height="10px" />
          </div>
        </div>

        {/* Footer */}
        <div className="flex border-t border-slate-100">
          <div className="flex-1 flex justify-center py-2.5">
            <Shimmer width="90px" height="10px" />
          </div>

          <div className="w-px bg-slate-100" />

          <div className="flex-1 flex justify-center py-2.5">
            <Shimmer width="110px" height="10px" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default CustomerDueCardSkeleton;