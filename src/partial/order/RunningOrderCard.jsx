import { formatNumber } from "../../utils/numberFormatter";

function RunningOrderCard({
  title,
  count,
  countLabel,
  amount,
  icon: Icon,
  iconBg,
  iconColor,
  accentBar,
}) {
  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow flex flex-col overflow-hidden">
      <div className={`h-1 w-full ${accentBar}`} />
      <div className="p-3 sm:p-4 flex-1 flex flex-col gap-2.5">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-xs sm:text-sm font-bold text-slate-800 leading-tight">
              {title}
            </p>
          </div>
          <div
            className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${iconBg}`}
          >
            <Icon size={14} strokeWidth={2} className={iconColor} />
          </div>
        </div>

        {/* Count */}
        <div>
          <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-0.5">
            {countLabel}
          </p>
          <p className="text-2xl sm:text-3xl font-black text-slate-900 leading-none font-mono">
            {count}
          </p>
        </div>

        {/* Amount */}
        <div className="mt-auto pt-1 border-t border-slate-50">
          <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-0.5">
            Est. Total Amount
          </p>
          <p className="text-sm sm:text-base font-bold text-slate-800 font-mono">
            {formatNumber(amount,true)}
          </p>
        </div>
      </div>
    </div>
  );
}

export default RunningOrderCard;
