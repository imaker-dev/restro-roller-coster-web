import Shimmer from "../../../layout/Shimmer";

export function ProductionRecipeCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col">
      {/* Body */}
      <div className="p-4 flex flex-col flex-1 gap-3">
        
        {/* Row 1: icon + name */}
        <div className="flex items-center gap-2.5 min-w-0">
          <Shimmer width="36px" height="36px" rounded="lg" />
          <div className="min-w-0 flex-1">
            <Shimmer height="14px" width="70%" className="mb-1" />
            <Shimmer height="10px" width="50%" />
          </div>
        </div>

        {/* Row 2: output tile */}
        <div className="flex items-center gap-2.5 bg-slate-50 border border-slate-100 rounded-xl px-3 py-2.5">
          <Shimmer width="14px" height="14px" rounded="full" />
          <div className="flex-1">
            <Shimmer height="8px" width="40%" className="mb-1" />
            <Shimmer height="12px" width="80%" />
          </div>
        </div>

        {/* Row 3: stat chips */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-100">
            <Shimmer width="10px" height="10px" rounded="full" />
            <Shimmer width="40px" height="10px" />
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-100">
            <Shimmer width="10px" height="10px" rounded="full" />
            <Shimmer width="70px" height="10px" />
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-100">
            <Shimmer width="10px" height="10px" rounded="full" />
            <Shimmer width="50px" height="10px" />
          </div>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Row 4: buttons */}
        <div className="flex items-center gap-1.5 pt-1 border-t border-slate-100">
          <Shimmer width="60px" height="28px" rounded="lg" />
          <Shimmer width="60px" height="28px" rounded="lg" />
          <div className="ml-auto">
            <Shimmer width="80px" height="28px" rounded="lg" />
          </div>
        </div>
      </div>
    </div>
  );
}