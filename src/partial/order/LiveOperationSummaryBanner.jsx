function LiveOperationSummaryBanner({ items }) {
  return (
    <div
      className={`bg-blue-50/70 border border-blue-100 rounded-xl px-3.5 py-3 sm:px-5 sm:py-4 overflow-x-auto`}
    >
      <div className="flex items-center gap-0 min-w-min">
        {items.map((item, i) => (
          <div key={item.label} className="flex items-center flex-shrink-0">
            <div className="flex flex-col items-center text-center px-2 sm:px-3">
              <p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-0.5 whitespace-nowrap">
                {item.label}
              </p>
              <p
                className={`font-black font-mono leading-none whitespace-nowrap ${item.danger ? "text-rose-600" : "text-slate-900"} text-xl sm:text-2xl`}
              >
                {item.value}
              </p>
            </div>
            {i < items.length - 1 && (
              <div className="w-px self-stretch bg-slate-300 mx-3 sm:mx-5 flex-shrink-0" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
export default LiveOperationSummaryBanner;
