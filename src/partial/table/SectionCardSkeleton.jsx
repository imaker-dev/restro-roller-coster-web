const SectionCardSkeleton = () => {
  return (
    <div className="rounded-3xl p-6 bg-gradient-to-br from-white to-slate-50 border border-slate-200 animate-pulse space-y-5">
      
      {/* ===== SECTION HEADER ===== */}
      <div className="flex justify-between items-start">
        <div className="space-y-3 w-1/2">
          <div className="h-6 bg-slate-200 rounded w-1/3" />
          <div className="h-4 bg-slate-200 rounded w-2/3" />
        </div>

        <div className="flex gap-3">
          <div className="h-9 w-32 bg-slate-200 rounded-xl" />
          <div className="h-9 w-24 bg-slate-200 rounded-xl" />
        </div>
      </div>

      {/* ===== TABLE GRID ===== */}
      <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="relative rounded-2xl bg-white border border-slate-200 overflow-hidden"
          >
            <div className="p-6 space-y-4">
              <div className="h-24 bg-slate-200 rounded-xl" />

              <div className="space-y-2">
                <div className="h-4 bg-slate-200 rounded w-1/3" />
                <div className="h-3 bg-slate-200 rounded w-1/2" />
              </div>

              <div className="h-3 bg-slate-200 rounded w-2/3" />

              <div className="flex gap-2 mt-2">
                <div className="h-5 w-16 bg-slate-200 rounded" />
                <div className="h-5 w-20 bg-slate-200 rounded" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SectionCardSkeleton;