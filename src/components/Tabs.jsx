/**
 * Tabs — 4 premium variants
 *
 * Props:
 *   tabs     Array<{ id, label, icon?, count? }>
 *   active   string  (active tab id)
 *   onChange fn(id)
 *   variant  "v1" | "v2" | "v3" | "v4"
 *   color    "blue" | "emerald" | "violet" | "amber" | "rose" | "cyan" | "slate"
 */

// ─── V1 · PILL STRIP ──────────────────────────────────────────────────────────
// Floating pill on a tinted track · icon + label + count badge
// Feels like: Vercel, Linear, Raycast
export function TabsV1({ tabs, active, onChange, color = "blue" }) {
  const P = PALETTE[color] || PALETTE.blue;
  return (
    <div
      className="inline-flex gap-1 p-1.5 rounded-2xl"
      style={{ background: "#f1f3f6", border: "1px solid #e2e5ea" }}
    >
      {tabs.map((tab) => {
        const on = active === tab.id;
        const Icon = tab.icon;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className="relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-[12px] font-black transition-all duration-200 whitespace-nowrap outline-none"
            style={
              on
                ? {
                    background: "#fff",
                    color: P.text,
                    boxShadow:
                      "0 1px 8px rgba(0,0,0,0.10), 0 0 0 1px rgba(0,0,0,0.04)",
                  }
                : { color: "#94a3b8" }
            }
          >
            {Icon && (
              <Icon
                size={14}
                strokeWidth={on ? 2.2 : 1.8}
                style={{ color: on ? P.a : undefined }}
              />
            )}
            {tab.label}
            {tab.count !== undefined && (
              <span
                className="text-[9px] font-black px-1.5 py-0.5 rounded-full min-w-[18px] text-center"
                style={
                  on
                    ? {
                        background: P.muted,
                        color: P.text,
                        border: `1px solid ${P.border}`,
                      }
                    : { background: "#e2e5ea", color: "#94a3b8" }
                }
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

// ─── V2 · UNDERLINE SLIDE ─────────────────────────────────────────────────────
// Clean underline · sliding indicator · minimal
// Feels like: GitHub, Notion, Stripe dashboard
export function TabsV2({ tabs, active, onChange, color = "blue" }) {
  const P = PALETTE[color] || PALETTE.blue;
  const activeIdx = tabs.findIndex((t) => t.id === active);
  return (
    <div
      className="relative flex"
      style={{ borderBottom: "2px solid #e8eaed" }}
    >
      {tabs.map((tab, i) => {
        const on = active === tab.id;
        const Icon = tab.icon;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className="relative flex items-center gap-2 px-5 py-3.5 text-[12px] font-black transition-all duration-200 whitespace-nowrap outline-none group"
            style={{
              color: on ? P.a : "#94a3b8",
              borderBottom: on ? `2px solid ${P.a}` : "2px solid transparent",
              marginBottom: "-2px",
            }}
          >
            {Icon && <Icon size={14} strokeWidth={on ? 2.2 : 1.8} />}
            {tab.label}
            {tab.count !== undefined && (
              <span
                className="text-[9px] font-black px-1.5 py-0.5 rounded-full"
                style={
                  on
                    ? { background: P.muted, color: P.text }
                    : { background: "#f1f3f6", color: "#94a3b8" }
                }
              >
                {tab.count}
              </span>
            )}
            {/* hover underline preview */}
            {!on && (
              <span
                className="absolute bottom-[-2px] left-0 right-0 h-[2px] rounded-full opacity-0 group-hover:opacity-30 transition-opacity duration-200"
                style={{ background: P.a }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}

// ─── V3 · SOLID BUTTON ROW ────────────────────────────────────────────────────
// Gradient active · icon chip · count bubble · hover lift
// Feels like: Shopify, Retool, SaaS dashboards
export function TabsV3({ tabs, active, onChange, color = "blue" }) {
  const P = PALETTE[color] || PALETTE.blue;
  return (
    <div className="flex flex-wrap gap-2">
      {tabs.map((tab) => {
        const on = active === tab.id;
        const Icon = tab.icon;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className="relative flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-[12px] font-black transition-all duration-200 whitespace-nowrap outline-none hover:-translate-y-0.5"
            style={
              on
                ? {
                    background: `linear-gradient(135deg,${P.a},${P.b})`,
                    color: "#fff",
                    boxShadow: `0 4px 14px ${P.a}45`,
                    border: "1px solid transparent",
                  }
                : {
                    background: "#fff",
                    color: "#64748b",
                    border: "1px solid #e2e5ea",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                  }
            }
          >
            {Icon && (
              <span
                className="flex items-center justify-center w-6 h-6 rounded-lg flex-shrink-0"
                style={
                  on
                    ? {
                        background: "rgba(255,255,255,0.22)",
                        border: "1px solid rgba(255,255,255,0.3)",
                      }
                    : { background: P.muted, border: `1px solid ${P.border}` }
                }
              >
                <Icon
                  size={12}
                  strokeWidth={2.2}
                  style={{ color: on ? "#fff" : P.a }}
                />
              </span>
            )}
            {tab.label}
            {tab.count !== undefined && (
              <span
                className="text-[9px] font-black px-1.5 py-0.5 rounded-full"
                style={
                  on
                    ? {
                        background: "rgba(255,255,255,0.25)",
                        color: "#fff",
                        border: "1px solid rgba(255,255,255,0.3)",
                      }
                    : { background: P.muted, color: P.text }
                }
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

// ─── V4 · CARD TABS ───────────────────────────────────────────────────────────
// Tall card style · icon prominently on top · label + count below
// Feels like: Analytics dashboards, Mixpanel, Amplitude
export function TabsV4({ tabs, active, onChange, color = "blue" }) {
  const P = PALETTE[color] || PALETTE.blue;
  return (
    <div className="flex flex-wrap gap-2.5">
      {tabs.map((tab) => {
        const on = active === tab.id;
        const Icon = tab.icon;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className="relative flex flex-col items-center gap-2 px-5 py-4 rounded-2xl text-center transition-all duration-200 whitespace-nowrap outline-none group hover:-translate-y-0.5 min-w-[90px]"
            style={
              on
                ? {
                    background: `linear-gradient(145deg,${P.bg},#ffffff)`,
                    border: `2px solid ${P.border}`,
                    boxShadow: `0 4px 16px ${P.a}18`,
                  }
                : {
                    background: "#fff",
                    border: "2px solid #e8eaed",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                  }
            }
          >
            {/* icon bubble */}
            {Icon && (
              <span
                className="flex items-center justify-center w-9 h-9 rounded-xl transition-all duration-200"
                style={
                  on
                    ? {
                        background: `linear-gradient(135deg,${P.a},${P.b})`,
                        boxShadow: `0 4px 12px ${P.a}45`,
                      }
                    : { background: "#f1f5f9", border: "1px solid #e2e5ea" }
                }
              >
                <Icon
                  size={16}
                  strokeWidth={2}
                  style={{ color: on ? "#fff" : "#64748b" }}
                />
              </span>
            )}
            {/* label */}
            <span
              className="text-[11px] font-black leading-tight"
              style={{ color: on ? P.text : "#64748b" }}
            >
              {tab.label}
            </span>
            {/* count */}
            {tab.count !== undefined && (
              <span
                className="text-[9px] font-black px-2 py-0.5 rounded-full"
                style={
                  on
                    ? {
                        background: P.muted,
                        color: P.text,
                        border: `1px solid ${P.border}`,
                      }
                    : { background: "#f1f5f9", color: "#94a3b8" }
                }
              >
                {tab.count}
              </span>
            )}
            {/* active dot */}
            {on && (
              <span
                className="absolute bottom-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full"
                style={{ background: P.a }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}

// ─── Palette ──────────────────────────────────────────────────────────────────
const PALETTE = {
  primary: {
  a: "#F97316",
  b: "#EA580C",
  bg: "#FFF7ED",
  border: "#FDBA74",
  muted: "#FFEDD5",
  text: "#9A3412",
},
  blue: {
    a: "#3b82f6",
    b: "#6366f1",
    bg: "#eff6ff",
    border: "#bfdbfe",
    muted: "#dbeafe",
    text: "#1e40af",
  },
  emerald: {
    a: "#10b981",
    b: "#059669",
    bg: "#ecfdf5",
    border: "#6ee7b7",
    muted: "#d1fae5",
    text: "#065f46",
  },
  violet: {
    a: "#8b5cf6",
    b: "#7c3aed",
    bg: "#f5f3ff",
    border: "#c4b5fd",
    muted: "#ede9fe",
    text: "#5b21b6",
  },
  amber: {
    a: "#f59e0b",
    b: "#d97706",
    bg: "#fffbeb",
    border: "#fcd34d",
    muted: "#fde68a",
    text: "#92400e",
  },
  rose: {
    a: "#f43f5e",
    b: "#e11d48",
    bg: "#fff1f2",
    border: "#fda4af",
    muted: "#ffe4e6",
    text: "#9f1239",
  },
  cyan: {
    a: "#06b6d4",
    b: "#0891b2",
    bg: "#ecfeff",
    border: "#67e8f9",
    muted: "#cffafe",
    text: "#0e7490",
  },
  slate: {
    a: "#64748b",
    b: "#475569",
    bg: "#f8fafc",
    border: "#cbd5e1",
    muted: "#e2e8f0",
    text: "#1e293b",
  },
};

// ─── Unified export ───────────────────────────────────────────────────────────
const VARIANTS = { v1: TabsV1, v2: TabsV2, v3: TabsV3, v4: TabsV4 };

export default function Tabs({
  tabs,
  active,
  onChange,
  variant = "v1",
  color = "primary",
}) {
  const Comp = VARIANTS[variant] || TabsV1;
  return <Comp tabs={tabs} active={active} onChange={onChange} color={color} />;
}
