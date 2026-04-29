import React from "react";

function MetricPanel({
  icon: Icon,
  title,
  right,
  desc,
  count, // ✅ NEW
  children,
  noPad = false,
}) {
  return (
    <div
      className="bg-white rounded-2xl border border-slate-200 overflow-hidden"
      style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}
    >
      {/* ── Header ───────────────────────── */}
      <div className="flex items-center justify-between gap-4 px-5 py-3.5 border-b border-slate-100">
        <div className="flex items-center gap-3 min-w-0">
          {/* Icon */}
          {Icon && (
            <div className="w-8 h-8 rounded-xl bg-primary-500 flex items-center justify-center flex-shrink-0">
              <Icon size={14} className="text-white" strokeWidth={2} />
            </div>
          )}

          {/* Title + description */}
          <div className="min-w-0">
            <p className="text-sm font-extrabold text-slate-900 leading-none truncate">
              {title}
            </p>

            {desc && (
              <p className="text-xs text-slate-400 font-medium mt-0.5 truncate">
                {desc}
              </p>
            )}
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Count badge */}
          {count !== undefined && (
            <span className="text-[11px] font-bold text-slate-400 bg-slate-50 border border-slate-100 rounded-full px-3 py-1 tabular-nums">
              {count} {count === 1 ? "entry" : "entries"}
            </span>
          )}

          {right}
        </div>
      </div>

      {/* ── Body ───────────────────────── */}
      <div className={noPad ? "" : "px-5 py-3"}>{children}</div>
    </div>
  );
}

export default MetricPanel;