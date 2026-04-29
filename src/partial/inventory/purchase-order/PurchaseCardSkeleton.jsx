import Shimmer from "../../../layout/Shimmer";

export default function PurchaseCardSkeleton() {
  return (
    <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden flex flex-col">
      <div className="px-5 py-4 flex-1">
        {/* ── Top row ── */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-start gap-3 min-w-0 flex-1">
            {/* Avatar */}
            <Shimmer width="40px" height="40px" rounded="lg" />

            <div className="flex flex-col gap-1.5 flex-1">
              <Shimmer width="140px" height="14px" />
              <div className="flex gap-1.5">
                <Shimmer width="60px" height="18px" rounded="full" />
                <Shimmer width="70px" height="18px" rounded="full" />
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end gap-1">
            <Shimmer width="80px" height="16px" />
            <Shimmer width="50px" height="12px" />
          </div>
        </div>

        {/* ── Meta row ── */}
        <div className="flex flex-wrap gap-x-4 gap-y-2 mb-4">
          <Shimmer width="80px" height="12px" />
          <Shimmer width="100px" height="12px" />
          <Shimmer width="90px" height="12px" />
          <Shimmer width="110px" height="12px" />
        </div>

        {/* ── Amount breakdown ── */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 flex flex-col gap-1"
            >
              <Shimmer width="50%" height="10px" />
              <Shimmer width="70%" height="14px" />
            </div>
          ))}
        </div>

        {/* ── Payment progress ── */}
        <div className="mb-4">
          <div className="flex justify-between mb-1.5">
            <Shimmer width="100px" height="10px" />
            <Shimmer width="40px" height="10px" />
          </div>
          <Shimmer width="100%" height="6px" rounded="full" />
        </div>

        {/* ── Footer row ── */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-50">
          <div className="flex items-center gap-3">
            <Shimmer width="80px" height="12px" />
            <Shimmer width="60px" height="12px" />
          </div>
          <Shimmer width="90px" height="12px" />
        </div>
      </div>

      {/* ── Action footer ── */}
      <div className="flex border-t border-slate-100">
        <Shimmer width="100%" height="44px" />
      </div>
    </div>
  );
}