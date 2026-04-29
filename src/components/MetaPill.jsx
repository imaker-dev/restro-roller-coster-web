  export default function MetaPill({ icon: Icon, label, value, highlight, amber, small }) {
    const bg = highlight ? (amber ? "#fffbeb" : "#fef2f2") : "#f8fafc";
    const border = highlight ? (amber ? "#fcd34d" : "#fecaca") : "#e5e7eb";
    const color = highlight ? (amber ? "#92400e" : "#9f1239") : "#475569";
    return (
      <div
        className="rounded-xl px-2.5 py-2"
        style={{ background: bg, border: `1px solid ${border}` }}
      >
        <div className="flex items-center gap-1 mb-0.5">
          <Icon
            size={8}
            style={{
              color: highlight ? (amber ? "#f59e0b" : "#f43f5e") : "#94a3b8",
            }}
            strokeWidth={2.5}
          />
          <span
            className="text-[8px] font-black uppercase tracking-wider"
            style={{ color: highlight ? color : "#94a3b8" }}
          >
            {label}
          </span>
        </div>
        <p
          className={`font-black leading-snug truncate ${small ? "text-[9px]" : "text-[10px]"}`}
          style={{ color }}
        >
          {value}
        </p>
      </div>
    );
  }