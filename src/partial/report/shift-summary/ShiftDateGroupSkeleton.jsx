import Shimmer from "../../../layout/Shimmer";

export default function ShiftDateGroupSkeleton({ count = 3 }) {
  return (
    <div className="space-y-3">
      {/* ─── Date header row ─── */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-slate-900">
          <Shimmer width="13px" height="13px" rounded="full" />
          <Shimmer width="130px" height="10px" />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Shimmer width="75px" height="20px" rounded="lg" />
          <Shimmer width="65px" height="20px" rounded="lg" />
          <Shimmer width="120px" height="20px" rounded="lg" />
        </div>

        <div className="flex-1 h-px bg-slate-200 hidden sm:block" />
      </div>

      {/* ─── Shift cards grid ─── */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl overflow-hidden"
            style={{
              border: "1px solid #e2e8f0",
              boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
            }}
          >
            {/* top bar */}
            <div className="h-1 bg-slate-200" />

            <div className="p-5">
              {/* Header */}
              <div className="flex items-start justify-between gap-3 mb-5">
                <div className="flex items-center gap-3">
                  <Shimmer width="40px" height="40px" rounded="lg" />
                  <div className="space-y-2">
                    <Shimmer width="120px" height="12px" />
                    <Shimmer width="80px" height="8px" />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Shimmer width="50px" height="20px" rounded="lg" />
                  <Shimmer width="24px" height="24px" rounded="lg" />
                </div>
              </div>

              {/* Time block */}
              <div className="grid grid-cols-2 gap-2 mb-4">
                {[1, 2].map((_, j) => (
                  <div
                    key={j}
                    className="rounded-xl border px-3 py-3 bg-slate-50 border-slate-200"
                  >
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <Shimmer width="10px" height="10px" rounded="full" />
                      <Shimmer width="45px" height="8px" />
                    </div>
                    <Shimmer width="65px" height="16px" className="mb-1" />
                    <Shimmer width="85px" height="8px" />
                  </div>
                ))}
              </div>

              {/* Chips */}
              <div className="flex flex-wrap gap-2 mb-4">
                <Shimmer width="75px" height="22px" rounded="lg" />
                <Shimmer width="95px" height="22px" rounded="lg" />
                <Shimmer width="85px" height="22px" rounded="lg" />
              </div>

              {/* Cash summary */}
              <div className="rounded-xl border border-slate-200 overflow-hidden mb-4">
                <div className="flex items-center gap-2 px-3.5 py-2 bg-slate-50 border-b border-slate-200">
                  <Shimmer width="12px" height="12px" rounded="full" />
                  <Shimmer width="100px" height="8px" />
                </div>

                <div className="px-3.5 py-2 space-y-3">
                  {[1, 2, 3].map((_, k) => (
                    <div
                      key={k}
                      className="flex items-center justify-between"
                    >
                      <Shimmer width="95px" height="10px" />
                      <Shimmer width="75px" height="12px" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Total + variance */}
              <div className="flex items-center justify-between gap-3 pt-1">
                <div className="space-y-2">
                  <Shimmer width="85px" height="8px" />
                  <Shimmer width="110px" height="22px" />
                </div>

                <Shimmer width="85px" height="26px" rounded="lg" />
              </div>

              {/* Closed by */}
              <div className="mt-3 pt-3 border-t border-slate-100">
                <Shimmer width="150px" height="10px" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}