"use client";

/**
 * StatCard — Premium Redesigned
 *
 * NEW PREMIUM VARIANT (v8-premium)
 * Modern glass-morphism, sophisticated shadows, perfect spacing
 *
 * Props:
 *   title      string
 *   value      string | number
 *   subtitle   string
 *   icon       Lucide component
 *   color      "blue"|"emerald"|"violet"|"amber"|"rose"|"cyan"|
 *              "orange"|"teal"|"indigo"|"slate"|"green"|"purple"|"yellow"|"pink"
 *   variant    "v1"–"v7" OR "premium"  → layout style
 *   mode       "light" | "solid"   → light white card OR full color card
 *   trend      { value, label, direction: "up"|"down"|"flat" }
 *   onClick    fn
 *
 * Usage:
 *   <StatCard variant="premium" mode="light" color="emerald" ... />
 *   <StatCard variant="premium" mode="solid" color="blue"    ... />
 */

import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { useCallback, useState } from "react";

// ─── Full Palette ──────────────────────────────────────────────────────────────
const P = {
  primary: {
    a: "#FB923C",
    b: "#F97316",
    bg: "#FFF7ED",
    border: "#FED7AA",
    muted: "#FFEDD5",
    text: "#9A3412",
  },
  slate: {
    a: "#64748b",
    b: "#475569",
    bg: "#f8fafc",
    border: "#cbd5e1",
    muted: "#e2e8f0",
    text: "#1e293b",
  },
  gray: {
    a: "#6b7280",
    b: "#4b5563",
    bg: "#f9fafb",
    border: "#d1d5db",
    muted: "#e5e7eb",
    text: "#1f2937",
  },
  zinc: {
    a: "#71717a",
    b: "#52525b",
    bg: "#fafafa",
    border: "#d4d4d8",
    muted: "#e4e4e7",
    text: "#27272a",
  },
  neutral: {
    a: "#737373",
    b: "#525252",
    bg: "#fafafa",
    border: "#d4d4d4",
    muted: "#e5e5e5",
    text: "#262626",
  },
  stone: {
    a: "#78716c",
    b: "#57534e",
    bg: "#fafaf9",
    border: "#d6d3d1",
    muted: "#e7e5e4",
    text: "#292524",
  },

  red: {
    a: "#ef4444",
    b: "#dc2626",
    bg: "#fef2f2",
    border: "#fecaca",
    muted: "#fee2e2",
    text: "#991b1b",
  },
  orange: {
    a: "#f97316",
    b: "#ea580c",
    bg: "#fff7ed",
    border: "#fed7aa",
    muted: "#ffedd5",
    text: "#9a3412",
  },
  amber: {
    a: "#f59e0b",
    b: "#d97706",
    bg: "#fffbeb",
    border: "#fde68a",
    muted: "#fef3c7",
    text: "#92400e",
  },
  yellow: {
    a: "#eab308",
    b: "#ca8a04",
    bg: "#fefce8",
    border: "#fef08a",
    muted: "#fef9c3",
    text: "#713f12",
  },
  lime: {
    a: "#84cc16",
    b: "#65a30d",
    bg: "#f7fee7",
    border: "#d9f99d",
    muted: "#ecfccb",
    text: "#365314",
  },
  green: {
    a: "#22c55e",
    b: "#16a34a",
    bg: "#f0fdf4",
    border: "#bbf7d0",
    muted: "#dcfce7",
    text: "#14532d",
  },
  emerald: {
    a: "#10b981",
    b: "#059669",
    bg: "#ecfdf5",
    border: "#a7f3d0",
    muted: "#d1fae5",
    text: "#065f46",
  },
  teal: {
    a: "#14b8a6",
    b: "#0d9488",
    bg: "#f0fdfa",
    border: "#99f6e4",
    muted: "#ccfbf1",
    text: "#134e4a",
  },
  cyan: {
    a: "#06b6d4",
    b: "#0891b2",
    bg: "#ecfeff",
    border: "#a5f3fc",
    muted: "#cffafe",
    text: "#155e75",
  },
  sky: {
    a: "#0ea5e9",
    b: "#0284c7",
    bg: "#f0f9ff",
    border: "#bae6fd",
    muted: "#e0f2fe",
    text: "#075985",
  },
  blue: {
    a: "#3b82f6",
    b: "#2563eb",
    bg: "#eff6ff",
    border: "#bfdbfe",
    muted: "#dbeafe",
    text: "#1e40af",
  },
  indigo: {
    a: "#6366f1",
    b: "#4f46e5",
    bg: "#eef2ff",
    border: "#c7d2fe",
    muted: "#e0e7ff",
    text: "#3730a3",
  },
  violet: {
    a: "#8b5cf6",
    b: "#7c3aed",
    bg: "#f5f3ff",
    border: "#ddd6fe",
    muted: "#ede9fe",
    text: "#5b21b6",
  },
  purple: {
    a: "#a855f7",
    b: "#9333ea",
    bg: "#faf5ff",
    border: "#e9d5ff",
    muted: "#f3e8ff",
    text: "#581c87",
  },
  fuchsia: {
    a: "#d946ef",
    b: "#c026d3",
    bg: "#fdf4ff",
    border: "#f5d0fe",
    muted: "#fae8ff",
    text: "#86198f",
  },
  pink: {
    a: "#ec4899",
    b: "#db2777",
    bg: "#fdf2f8",
    border: "#fbcfe8",
    muted: "#fce7f3",
    text: "#831843",
  },
  rose: {
    a: "#f43f5e",
    b: "#e11d48",
    bg: "#fff1f2",
    border: "#fecdd3",
    muted: "#ffe4e6",
    text: "#9f1239",
  },
};

// ─── Premium Palette  ──────────────────────────────────────────────────────
const premiumP = (color) => {
  return P[color] || P.slate;
};

const safe = (v) =>
  v === null || v === undefined || v === "" ? "0" : String(v);

// ─── Premium Icon Bubble ───────────────────────────────────────────────────
function PremiumBubble({ Icon, p, solid, size = "lg", isHovered }) {
  if (!Icon) return null;
  const sizes = {
    sm: { w: 40, ic: 16 },
    md: { w: 56, ic: 22 },
    lg: { w: 64, ic: 28 },
  };
  const { w, ic } = sizes[size] || sizes.lg;

  return (
    <div
      className="flex items-center justify-center transition-all duration-500 flex-shrink-0 rounded-2xl backdrop-blur-xl"
      style={
        solid
          ? {
              width: w,
              height: w,
              background: `linear-gradient(135deg, ${p.a}20, ${p.b}10)`,
              border: `1.5px solid ${p.a}40`,
              boxShadow: `0 8px 32px ${p.a}15, inset 0 1px 1px rgba(255,255,255,0.6)`,
              transform: isHovered
                ? "scale(1.08) translateY(-2px)"
                : "scale(1)",
            }
          : {
              width: w,
              height: w,
              background: `linear-gradient(135deg, ${p.a}, ${p.b})`,
              boxShadow: `0 12px 40px ${p.a}35, inset 0 1px 2px rgba(255,255,255,0.4)`,
              transform: isHovered
                ? "scale(1.08) translateY(-4px)"
                : "scale(1)",
            }
      }
    >
      <Icon
        size={ic}
        className={solid ? "text-white/80" : "text-white"}
        strokeWidth={1.8}
      />
    </div>
  );
}

// ─── Trend badge ──────────────────────────────────────────────────────────────
function TrendBadge({ trend, solid }) {
  if (!trend) return null;
  const n = parseFloat(trend.value ?? 0);
  const up = trend.direction === "up" || (!trend.direction && n > 0);
  const dn = trend.direction === "down" || (!trend.direction && n < 0);
  const Ic = up ? TrendingUp : dn ? TrendingDown : Minus;
  const cls = solid
    ? up
      ? "bg-white/25 text-white border-white/30"
      : dn
        ? "bg-black/20 text-white/90 border-white/20"
        : "bg-white/15 text-white/65 border-white/15"
    : up
      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
      : dn
        ? "bg-red-50 text-red-600 border-red-200"
        : "bg-slate-100 text-slate-500 border-slate-200";
  return (
    <span
      className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border whitespace-nowrap ${cls}`}
    >
      <Ic size={9} strokeWidth={2.5} />
      {trend.label ?? `${Math.abs(n)}%`}
    </span>
  );
}

// ─── Icon bubble ──────────────────────────────────────────────────────────────
function Bubble({ Icon, p, solid, size = "md" }) {
  if (!Icon) return null;
  const { w, ic } = {
    sm: { w: 30, ic: 13 },
    md: { w: 38, ic: 17 },
    lg: { w: 52, ic: 24 },
  }[size] || { w: 38, ic: 17 };
  return (
    <div
      className="flex items-center justify-center transition-transform duration-200 group-hover:scale-105 flex-shrink-0 rounded-xl"
      style={
        solid
          ? {
              width: w,
              height: w,
              background: "rgba(255,255,255,0.22)",
              border: "1px solid rgba(255,255,255,0.32)",
            }
          : {
              width: w,
              height: w,
              background: `linear-gradient(145deg,${p.a},${p.b})`,
              boxShadow: `0 4px 12px ${p.a}45`,
            }
      }
    >
      <Icon size={ic} className="text-white" strokeWidth={2} />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// V1 · AURORA  — top stripe · icon chip · big value · trend footer
// ═══════════════════════════════════════════════════════════════════════════════
function V1L({ title, value, subtitle, icon: Icon, p, trend, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`group relative bg-white rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_-8px_rgba(0,0,0,0.13)] ${onClick ? "cursor-pointer" : ""}`}
      style={{
        border: `1px solid ${p.border}`,
        boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
      }}
    >
      <div
        className="h-[3px]"
        style={{ background: `linear-gradient(90deg,${p.a},${p.b})` }}
      />
      <div
        className="absolute -top-10 -right-10 w-36 h-36 rounded-full pointer-events-none opacity-50 group-hover:opacity-80 transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle,${p.a}22,transparent 70%)`,
        }}
      />
      <div className="relative z-10 p-5">
        <div className="flex items-start justify-between gap-3 mb-4">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.14em] leading-none">
            {title}
          </p>
          <Bubble Icon={Icon} p={p} solid={false} size="sm" />
        </div>
        <p className="text-[32px] font-black text-slate-900 leading-none tracking-tight tabular-nums">
          {value}
        </p>
        {subtitle && (
          <p className="text-[11px] text-slate-500 font-medium mt-1.5">
            {subtitle}
          </p>
        )}
        {trend && (
          <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-100">
            <TrendBadge trend={trend} solid={false} />
            <span className="text-[10px] text-slate-400">vs last period</span>
          </div>
        )}
      </div>
    </div>
  );
}
function V1S({ title, value, subtitle, icon: Icon, p, trend, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`group relative rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_50px_-8px_rgba(0,0,0,0.28)] ${onClick ? "cursor-pointer" : ""}`}
      style={{
        background: `linear-gradient(145deg,${p.a},${p.b})`,
        boxShadow: `0 4px 20px ${p.a}55`,
      }}
    >
      <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/10 pointer-events-none group-hover:scale-110 transition-transform duration-500" />
      <div className="absolute -bottom-12 -left-8 w-32 h-32 rounded-full bg-black/10 pointer-events-none" />
      {Icon && (
        <div className="absolute bottom-0 right-2 opacity-[0.08] pointer-events-none">
          <Icon size={100} className="text-white" strokeWidth={0.6} />
        </div>
      )}
      <div className="relative z-10 p-5">
        <div className="flex items-start justify-between gap-3 mb-4">
          <p className="text-[10px] font-black text-white/55 uppercase tracking-[0.14em] leading-none">
            {title}
          </p>
          <Bubble Icon={Icon} p={p} solid={true} size="sm" />
        </div>
        <p className="text-[34px] font-black text-white leading-none tracking-tight tabular-nums">
          {value}
        </p>
        {subtitle && (
          <p className="text-[12px] text-white/60 font-medium mt-1.5">
            {subtitle}
          </p>
        )}
        {trend && (
          <div className="flex items-center gap-2 pt-3 mt-3 border-t border-white/15">
            <TrendBadge trend={trend} solid={true} />
            <span className="text-[10px] text-white/40">vs last period</span>
          </div>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// V2 · METRIC SPLIT  — horizontal · colored icon column · value right
// ═══════════════════════════════════════════════════════════════════════════════
function V2L({ title, value, subtitle, icon: Icon, p, trend, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`group relative bg-white rounded-2xl overflow-hidden flex items-stretch transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_32px_-4px_rgba(0,0,0,0.12)] ${onClick ? "cursor-pointer" : ""}`}
      style={{
        border: `1px solid ${p.border}`,
        boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
      }}
    >
      <div
        className="flex flex-col items-center justify-center w-[62px] flex-shrink-0"
        style={{
          background: `linear-gradient(180deg,${p.a}14,${p.b}08)`,
          borderRight: `1px solid ${p.border}`,
        }}
      >
        <Bubble Icon={Icon} p={p} solid={false} size="md" />
      </div>
      <div className="flex-1 px-4 py-4 min-w-0">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.13em] leading-none mb-2">
          {title}
        </p>
        <p className="text-[26px] font-black text-slate-900 leading-none tracking-tight tabular-nums mb-1.5">
          {value}
        </p>
        <div className="flex items-center gap-2 flex-wrap">
          {subtitle && (
            <p className="text-[11px] text-slate-500 font-medium">{subtitle}</p>
          )}
          {trend && <TrendBadge trend={trend} solid={false} />}
        </div>
      </div>
    </div>
  );
}
function V2S({ title, value, subtitle, icon: Icon, p, trend, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`group relative rounded-2xl overflow-hidden flex items-stretch transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_36px_-4px_rgba(0,0,0,0.25)] ${onClick ? "cursor-pointer" : ""}`}
      style={{
        background: `linear-gradient(135deg,${p.a},${p.b})`,
        boxShadow: `0 4px 16px ${p.a}50`,
      }}
    >
      <div
        className="flex flex-col items-center justify-center w-[62px] flex-shrink-0"
        style={{
          background: "rgba(0,0,0,0.15)",
          borderRight: "1px solid rgba(255,255,255,0.15)",
        }}
      >
        <Bubble Icon={Icon} p={p} solid={true} size="md" />
      </div>
      <div className="flex-1 px-4 py-4 min-w-0">
        <p className="text-[10px] font-black text-white/55 uppercase tracking-[0.13em] leading-none mb-2">
          {title}
        </p>
        <p className="text-[26px] font-black text-white leading-none tracking-tight tabular-nums mb-1.5">
          {value}
        </p>
        <div className="flex items-center gap-2 flex-wrap">
          {subtitle && (
            <p className="text-[11px] text-white/60 font-medium">{subtitle}</p>
          )}
          {trend && <TrendBadge trend={trend} solid={true} />}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// V3 · TINTED GLASS  — soft tinted bg · big icon ring · colored value
// ═══════════════════════════════════════════════════════════════════════════════
function V3L({ title, value, subtitle, icon: Icon, p, trend, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`group relative rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_-6px_rgba(0,0,0,0.12)] ${onClick ? "cursor-pointer" : ""}`}
      style={{
        background: `linear-gradient(145deg,${p.bg},#ffffff)`,
        border: `1px solid ${p.border}`,
        boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
      }}
    >
      <div
        className="absolute -top-12 -right-12 w-44 h-44 rounded-full pointer-events-none opacity-50"
        style={{
          background: `radial-gradient(circle,${p.a}22,transparent 65%)`,
        }}
      />
      <div className="relative z-10 p-5">
        <div className="flex items-center justify-between gap-2 mb-4">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.13em] leading-none">
            {title}
          </p>
          {trend && <TrendBadge trend={trend} solid={false} />}
        </div>
        <div className="flex items-center gap-3.5">
          {Icon && (
            <div
              className="rounded-2xl bg-white flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform duration-200"
              style={{
                width: 52,
                height: 52,
                border: `2px solid ${p.border}`,
                boxShadow: `0 4px 14px ${p.a}22`,
              }}
            >
              <Icon size={24} strokeWidth={1.7} style={{ color: p.a }} />
            </div>
          )}
          <div>
            <p
              className="text-[30px] font-black leading-none tracking-tight tabular-nums"
              style={{ color: p.text }}
            >
              {value}
            </p>
            {subtitle && (
              <p className="text-[11px] text-slate-500 font-medium mt-1">
                {subtitle}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
function V3S({ title, value, subtitle, icon: Icon, p, trend, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`group relative rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_44px_-8px_rgba(0,0,0,0.24)] ${onClick ? "cursor-pointer" : ""}`}
      style={{
        background: `linear-gradient(145deg,${p.a},${p.b})`,
        boxShadow: `0 4px 18px ${p.a}50`,
      }}
    >
      <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/10 pointer-events-none group-hover:scale-110 transition-transform duration-500" />
      <div className="relative z-10 p-5">
        <div className="flex items-center justify-between gap-2 mb-4">
          <p className="text-[10px] font-black text-white/55 uppercase tracking-[0.13em] leading-none">
            {title}
          </p>
          {trend && <TrendBadge trend={trend} solid={true} />}
        </div>
        <div className="flex items-center gap-3.5">
          {Icon && (
            <div
              className="rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform duration-200"
              style={{ width: 52, height: 52 }}
            >
              <Icon size={24} className="text-white" strokeWidth={1.7} />
            </div>
          )}
          <div>
            <p className="text-[30px] font-black text-white leading-none tracking-tight tabular-nums">
              {value}
            </p>
            {subtitle && (
              <p className="text-[11px] text-white/60 font-medium mt-1">
                {subtitle}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// V4 · FOCUS OUTLINE  — 2px border · top stripe · chip+label · watermark
// ═══════════════════════════════════════════════════════════════════════════════
function V4L({ title, value, subtitle, icon: Icon, p, trend, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`group relative bg-white rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_32px_-4px_rgba(0,0,0,0.12)] ${onClick ? "cursor-pointer" : ""}`}
      style={{
        border: `2px solid ${p.border}`,
        boxShadow: `0 1px 4px ${p.a}12`,
      }}
    >
      <div
        className="h-[3px]"
        style={{ background: `linear-gradient(90deg,${p.a},${p.b})` }}
      />
      {Icon && (
        <div className="absolute -right-3 -bottom-3 opacity-[0.04] pointer-events-none">
          <Icon size={110} strokeWidth={0.7} className="text-slate-900" />
        </div>
      )}
      <div className="relative z-10 p-5">
        <div className="flex items-center gap-2.5 mb-3">
          <div
            className="w-[30px] h-[30px] rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-200"
            style={{
              background: `linear-gradient(135deg,${p.a},${p.b})`,
              boxShadow: `0 3px 10px ${p.a}50`,
            }}
          >
            {Icon && (
              <Icon size={14} className="text-white" strokeWidth={2.2} />
            )}
          </div>
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.13em]">
            {title}
          </p>
        </div>
        <p className="text-[32px] font-black text-slate-900 leading-none tracking-tight tabular-nums mb-2">
          {value}
        </p>
        <div className="flex items-center justify-between gap-2">
          {subtitle && (
            <p className="text-[11px] text-slate-500 font-medium truncate">
              {subtitle}
            </p>
          )}
          {trend && <TrendBadge trend={trend} solid={false} />}
        </div>
      </div>
    </div>
  );
}
function V4S({ title, value, subtitle, icon: Icon, p, trend, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`group relative rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_40px_-6px_rgba(0,0,0,0.26)] ${onClick ? "cursor-pointer" : ""}`}
      style={{
        background: `linear-gradient(145deg,${p.a},${p.b})`,
        border: `2px solid rgba(255,255,255,0.22)`,
        boxShadow: `0 4px 20px ${p.a}55`,
      }}
    >
      {Icon && (
        <div className="absolute -right-3 -bottom-3 opacity-[0.07] pointer-events-none">
          <Icon size={110} className="text-white" strokeWidth={0.6} />
        </div>
      )}
      <div className="relative z-10 p-5">
        <div className="flex items-center gap-2.5 mb-3">
          <div className="w-[30px] h-[30px] rounded-xl bg-white/20 border border-white/30 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-200">
            {Icon && (
              <Icon size={14} className="text-white" strokeWidth={2.2} />
            )}
          </div>
          <p className="text-[10px] font-black text-white/55 uppercase tracking-[0.13em]">
            {title}
          </p>
        </div>
        <p className="text-[32px] font-black text-white leading-none tracking-tight tabular-nums mb-2">
          {value}
        </p>
        <div className="flex items-center justify-between gap-2">
          {subtitle && (
            <p className="text-[11px] text-white/60 font-medium truncate">
              {subtitle}
            </p>
          )}
          {trend && <TrendBadge trend={trend} solid={true} />}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// V5 · COMPACT ROW  — dense horizontal · gradient icon · trend right
// ═══════════════════════════════════════════════════════════════════════════════
function V5L({ title, value, subtitle, icon: Icon, p, trend, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`group relative bg-white rounded-xl overflow-hidden transition-all duration-200 hover:-translate-y-px hover:shadow-[0_8px_24px_-4px_rgba(0,0,0,0.10)] ${onClick ? "cursor-pointer" : ""}`}
      style={{
        border: "1px solid #e5e7eb",
        boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
      }}
    >
      <div
        className="absolute bottom-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{ background: `linear-gradient(90deg,${p.a},${p.b})` }}
      />
      <div className="flex items-center gap-3.5 px-4 py-3.5">
        <Bubble Icon={Icon} p={p} solid={false} size="md" />
        <div className="flex-1 min-w-0">
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.13em] leading-none mb-0.5">
            {title}
          </p>
          <p className="text-[20px] font-black text-slate-900 leading-none tracking-tight tabular-nums">
            {value}
          </p>
          {subtitle && (
            <p className="text-[9px] text-slate-400 font-medium mt-0.5 truncate">
              {subtitle}
            </p>
          )}
        </div>
        {trend && <TrendBadge trend={trend} solid={false} />}
      </div>
    </div>
  );
}
function V5S({ title, value, subtitle, icon: Icon, p, trend, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`group relative rounded-xl overflow-hidden transition-all duration-200 hover:-translate-y-px hover:shadow-[0_12px_28px_-4px_rgba(0,0,0,0.24)] ${onClick ? "cursor-pointer" : ""}`}
      style={{
        background: `linear-gradient(135deg,${p.a},${p.b})`,
        boxShadow: `0 3px 14px ${p.a}50`,
      }}
    >
      <div className="flex items-center gap-3.5 px-4 py-3.5">
        <Bubble Icon={Icon} p={p} solid={true} size="md" />
        <div className="flex-1 min-w-0">
          <p className="text-[9px] font-black text-white/55 uppercase tracking-[0.13em] leading-none mb-0.5">
            {title}
          </p>
          <p className="text-[20px] font-black text-white leading-none tracking-tight tabular-nums">
            {value}
          </p>
          {subtitle && (
            <p className="text-[9px] text-white/55 font-medium mt-0.5 truncate">
              {subtitle}
            </p>
          )}
        </div>
        {trend && <TrendBadge trend={trend} solid={true} />}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// V6 · LEFT BAR  — thick left border · watermark · icon badge bottom-right
// ═══════════════════════════════════════════════════════════════════════════════
function V6L({ title, value, subtitle, icon: Icon, p, trend, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`group relative bg-white rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_32px_-4px_rgba(0,0,0,0.10)] ${onClick ? "cursor-pointer" : ""}`}
      style={{
        border: `1px solid ${p.border}`,
        borderLeft: `4px solid ${p.a}`,
        boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
      }}
    >
      {Icon && (
        <div className="absolute right-0 top-1/2 -translate-y-1/2 opacity-[0.04] pointer-events-none">
          <Icon size={110} strokeWidth={0.7} className="text-slate-900" />
        </div>
      )}
      <div className="relative z-10 pl-4 pr-5 py-5">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.13em] mb-2.5 leading-none">
          {title}
        </p>
        <p className="text-[32px] font-black text-slate-900 leading-none tracking-tight tabular-nums mb-2">
          {value}
        </p>
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0">
            {subtitle && (
              <p className="text-[11px] text-slate-500 font-medium truncate">
                {subtitle}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {trend && <TrendBadge trend={trend} solid={false} />}
            {Icon && (
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center"
                style={{ background: p.muted }}
              >
                <Icon size={13} strokeWidth={2} style={{ color: p.a }} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
function V6S({ title, value, subtitle, icon: Icon, p, trend, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`group relative rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_40px_-6px_rgba(0,0,0,0.25)] ${onClick ? "cursor-pointer" : ""}`}
      style={{
        background: `linear-gradient(145deg,${p.a},${p.b})`,
        borderLeft: "4px solid rgba(255,255,255,0.40)",
        boxShadow: `0 4px 18px ${p.a}55`,
      }}
    >
      {Icon && (
        <div className="absolute right-0 top-1/2 -translate-y-1/2 opacity-[0.07] pointer-events-none">
          <Icon size={110} className="text-white" strokeWidth={0.6} />
        </div>
      )}
      <div className="relative z-10 pl-4 pr-5 py-5">
        <p className="text-[10px] font-black text-white/55 uppercase tracking-[0.13em] mb-2.5 leading-none">
          {title}
        </p>
        <p className="text-[32px] font-black text-white leading-none tracking-tight tabular-nums mb-2">
          {value}
        </p>
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0">
            {subtitle && (
              <p className="text-[11px] text-white/60 font-medium truncate">
                {subtitle}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {trend && <TrendBadge trend={trend} solid={true} />}
            {Icon && (
              <div className="w-7 h-7 rounded-lg bg-white/20 border border-white/30 flex items-center justify-center">
                <Icon size={13} className="text-white" strokeWidth={2} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// V7 · PROGRESS TARGET  — icon chip · value · adaptive progress bar
// ═══════════════════════════════════════════════════════════════════════════════
function V7L({
  title,
  value,
  subtitle,
  icon: Icon,
  p,
  trend,
  onClick,
  progress,
}) {
  const pct = Math.min(100, Math.max(0, parseFloat(progress ?? 0)));
  const bc = pct >= 80 ? "#10b981" : pct >= 40 ? p.a : "#f43f5e";
  return (
    <div
      onClick={onClick}
      className={`group relative bg-white rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_36px_-6px_rgba(0,0,0,0.12)] ${onClick ? "cursor-pointer" : ""}`}
      style={{
        border: `1px solid ${p.border}`,
        boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
      }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at top right,${p.a}10,transparent 55%)`,
        }}
      />
      <div className="relative z-10 p-5">
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            {Icon && (
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: p.muted, border: `1px solid ${p.border}` }}
              >
                <Icon size={14} strokeWidth={2} style={{ color: p.a }} />
              </div>
            )}
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.13em] leading-none">
              {title}
            </p>
          </div>
          {trend && <TrendBadge trend={trend} solid={false} />}
        </div>
        <p className="text-[30px] font-black text-slate-900 leading-none tracking-tight tabular-nums mb-1">
          {value}
        </p>
        {subtitle && (
          <p className="text-[11px] text-slate-500 font-medium mb-3">
            {subtitle}
          </p>
        )}
        {progress !== undefined && (
          <div className="mt-3 space-y-1.5">
            <div className="flex justify-between">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider">
                Progress
              </span>
              <span
                className="text-[10px] font-black tabular-nums"
                style={{ color: bc }}
              >
                {pct}%
              </span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${pct}%`,
                  background: `linear-gradient(90deg,${bc},${bc}bb)`,
                  boxShadow: `0 0 6px ${bc}55`,
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
function V7S({
  title,
  value,
  subtitle,
  icon: Icon,
  p,
  trend,
  onClick,
  progress,
}) {
  const pct = Math.min(100, Math.max(0, parseFloat(progress ?? 0)));
  return (
    <div
      onClick={onClick}
      className={`group relative rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_20px_44px_-8px_rgba(0,0,0,0.25)] ${onClick ? "cursor-pointer" : ""}`}
      style={{
        background: `linear-gradient(145deg,${p.a},${p.b})`,
        boxShadow: `0 4px 18px ${p.a}50`,
      }}
    >
      <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/10 pointer-events-none group-hover:scale-110 transition-transform duration-500" />
      <div className="relative z-10 p-5">
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            {Icon && (
              <div className="w-8 h-8 rounded-xl bg-white/20 border border-white/30 flex items-center justify-center flex-shrink-0">
                <Icon size={14} className="text-white" strokeWidth={2} />
              </div>
            )}
            <p className="text-[10px] font-black text-white/55 uppercase tracking-[0.13em] leading-none">
              {title}
            </p>
          </div>
          {trend && <TrendBadge trend={trend} solid={true} />}
        </div>
        <p className="text-[30px] font-black text-white leading-none tracking-tight tabular-nums mb-1">
          {value}
        </p>
        {subtitle && (
          <p className="text-[11px] text-white/60 font-medium mb-3">
            {subtitle}
          </p>
        )}
        {progress !== undefined && (
          <div className="mt-3 space-y-1.5">
            <div className="flex justify-between">
              <span className="text-[9px] font-black text-white/50 uppercase tracking-wider">
                Progress
              </span>
              <span className="text-[10px] font-black text-white tabular-nums">
                {pct}%
              </span>
            </div>
            <div className="h-2 bg-black/25 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-white/80 transition-all duration-700"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// V8 · PREMIUM  — glass-morphism · premium shadows · perfect spacing
// ═══════════════════════════════════════════════════════════════════════════════
function PremiumL({ title, value, subtitle, icon: Icon, p, trend, onClick }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`group relative rounded-3xl overflow-hidden transition-all duration-500 ${onClick ? "cursor-pointer" : ""}`}
      style={{
        background: `linear-gradient(135deg, ${p.a}10, ${p.b}05)`,
        border: `1.5px solid ${p.a}30`,
        boxShadow: `0 24px 56px rgba(0,0,0,0.08), 0 0 1px 1px rgba(255,255,255,0.5) inset, 0 12px 32px ${p.a}12`,
        backdropFilter: "blur(20px)",
        transform: isHovered ? "translateY(-8px)" : "translateY(0)",
      }}
    >
      {/* Top gradient highlight */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background: `linear-gradient(90deg, transparent, ${p.a}60, transparent)`,
        }}
      />

      {/* Dynamic gradient orb - top right */}
      <div
        className="absolute -top-32 -right-32 w-80 h-80 rounded-full pointer-events-none group-hover:scale-125 transition-transform duration-700"
        style={{
          background: `radial-gradient(circle, ${p.a}20, transparent 70%)`,
        }}
      />

      {/* Secondary accent orb - bottom left */}
      <div
        className="absolute -bottom-24 -left-24 w-56 h-56 rounded-full pointer-events-none opacity-30"
        style={{
          background: `radial-gradient(circle, ${p.b}15, transparent 70%)`,
        }}
      />

      {/* Glow accent line on hover */}
      <div
        className="absolute bottom-0 left-0 right-0 h-1 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `linear-gradient(90deg, transparent, ${p.a}40, transparent)`,
        }}
      />

      <div className="relative z-10 p-7 md:p-8">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-6">
          <div className="flex-1">
            <p
              className="text-xs md:text-sm font-bold uppercase tracking-widest leading-none mb-1 transition-colors duration-300"
              style={{ color: p.text }}
            >
              {title}
            </p>
            {subtitle && (
              <p
                className="text-xs font-medium transition-colors duration-300"
                style={{ color: `${p.text}95` }}
              >
                {subtitle}
              </p>
            )}
          </div>
          <PremiumBubble
            Icon={Icon}
            p={p}
            solid={false}
            size="lg"
            isHovered={isHovered}
          />
        </div>

        {/* Value */}
        <p
          className="text-5xl md:text-6xl font-black leading-none tracking-tight tabular-nums mb-6 transition-colors duration-300"
          style={{ color: p.text }}
        >
          {value}
        </p>

        {/* Trend footer */}
        {trend && (
          <div
            className="flex items-center justify-between pt-5 transition-all duration-300"
            style={{ borderTop: `1px solid ${p.a}25` }}
          >
            <span
              className="text-xs font-medium transition-colors duration-300"
              style={{ color: `${p.text}80` }}
            >
              vs last period
            </span>
            <TrendBadge trend={trend} solid={false} />
          </div>
        )}
      </div>
    </div>
  );
}

function PremiumS({ title, value, subtitle, icon: Icon, p, trend, onClick }) {
  const [isHovered, setIsHovered] = useState(false, []);

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`group relative rounded-3xl overflow-hidden transition-all duration-500 ${onClick ? "cursor-pointer" : ""}`}
      style={{
        background: `linear-gradient(135deg, ${p.a}, ${p.b})`,
        boxShadow: `0 24px 56px ${p.a}35, 0 0 1px 1px rgba(255,255,255,0.3) inset`,
        transform: isHovered ? "translateY(-8px)" : "translateY(0)",
      }}
    >
      {/* Top gradient accent */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background: `linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)`,
        }}
      />

      {/* Animated gradient orb */}
      <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-white/10 pointer-events-none group-hover:scale-125 transition-transform duration-700" />
      <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-black/10 pointer-events-none" />

      <div className="relative z-10 p-7 md:p-8">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-6">
          <div className="flex-1">
            <p className="text-xs md:text-sm font-bold text-white/70 uppercase tracking-widest leading-none mb-1">
              {title}
            </p>
            {subtitle && (
              <p className="text-xs text-white/60 font-medium">{subtitle}</p>
            )}
          </div>
          <PremiumBubble
            Icon={Icon}
            p={p}
            solid={true}
            size="lg"
            isHovered={isHovered}
          />
        </div>

        {/* Value */}
        <p className="text-5xl md:text-6xl font-black text-white leading-none tracking-tight tabular-nums mb-6">
          {value}
        </p>

        {/* Trend footer */}
        {trend && (
          <div className="flex items-center justify-between pt-5 border-t border-white/20">
            <span className="text-xs text-white/50">vs last period</span>
            <TrendBadge trend={trend} solid={true} />
          </div>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// V9 · TILE — compact metric tile (your StatTile layout)
// ═══════════════════════════════════════════════════════════════════════════════
function V9L({ title, value, subtitle, icon: Icon, p, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`relative rounded-2xl p-4 overflow-hidden transition-all duration-200 ${
        onClick ? "cursor-pointer hover:-translate-y-0.5" : ""
      }`}
      style={{
        background: "#ffffff",
        border: `1px solid ${p.border}`,
        boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
      }}
    >
      {/* Decorative orb */}
      <div
        className="absolute -top-4 -right-4 w-16 h-16 rounded-full pointer-events-none"
        style={{ background: p.bg }}
      />

      <div className="relative z-10">
        <div className="flex items-start justify-between gap-1 mb-3">
          <p
            className="text-[9px] font-black uppercase tracking-[0.13em] leading-snug"
            style={{ color: p.text }}
          >
            {title}
          </p>

          {Icon && (
            <div
              className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: p.muted }}
            >
              <Icon size={12} strokeWidth={2} style={{ color: p.a }} />
            </div>
          )}
        </div>

        <p
          className="text-[21px] font-black tabular-nums leading-none"
          style={{ color: p.text }}
        >
          {value}
        </p>

        {subtitle && (
          <p
            className="text-[9.5px] font-medium mt-1.5"
            style={{ color: `${p.text}99` }}
          >
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}

function V9S({ title, value, subtitle, icon: Icon, p, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`relative rounded-2xl p-4 overflow-hidden transition-all duration-200 ${
        onClick ? "cursor-pointer hover:-translate-y-0.5" : ""
      }`}
      style={{
        background: `linear-gradient(135deg, ${p.a}, ${p.b})`,
        boxShadow: `0 4px 16px ${p.a}40`,
      }}
    >
      <div className="absolute -top-4 -right-4 w-16 h-16 rounded-full bg-white/10 pointer-events-none" />

      <div className="relative z-10">
        <div className="flex items-start justify-between gap-1 mb-3">
          <p className="text-[9px] font-black uppercase tracking-[0.13em] leading-snug text-white/60">
            {title}
          </p>

          {Icon && (
            <div className="w-6 h-6 rounded-lg flex items-center justify-center bg-white/20">
              <Icon size={12} className="text-white" strokeWidth={2} />
            </div>
          )}
        </div>

        <p className="text-[21px] font-black tabular-nums leading-none text-white">
          {value}
        </p>

        {subtitle && (
          <p className="text-[9.5px] font-medium mt-1.5 text-white/60">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}

// ─── Registry ─────────────────────────────────────────────────────────────────
const REGISTRY = {
  v1: { light: V1L, solid: V1S },
  v2: { light: V2L, solid: V2S },
  v3: { light: V3L, solid: V3S },
  v4: { light: V4L, solid: V4S },
  v5: { light: V5L, solid: V5S },
  v6: { light: V6L, solid: V6S },
  v7: { light: V7L, solid: V7S },
  premium: { light: PremiumL, solid: PremiumS },

  v9: { light: V9L, solid: V9S },
};

// ─── Main export ──────────────────────────────────────────────────────────────
export default function StatCard({
  title = "",
  value,
  subtitle,
  icon,
  color = "blue",
  variant = "v1",
  mode = "light",
  onClick,
  trend,
  progress,
  loading = false,
}) {
  const layout = REGISTRY[variant] || REGISTRY.v1;
  const Comp = layout[mode] || layout.light;
  const p = P[color] || P.blue;

  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-4 animate-pulse">
        <div className="h-3 w-24 bg-slate-200 rounded mb-3"></div>
        <div className="h-6 w-32 bg-slate-300 rounded mb-2"></div>
        <div className="h-3 w-20 bg-slate-200 rounded"></div>
      </div>
    );
  }

  return (
    <Comp
      title={title}
      value={safe(value)}
      subtitle={subtitle}
      icon={icon}
      p={p}
      trend={trend}
      progress={progress}
      onClick={onClick}
    />
  );
}
