export const ACTION_COLORS = {
  slate: {
    icon: "text-slate-600 hover:bg-slate-100 hover:ring-slate-200",
    menu: "text-slate-700 hover:bg-slate-100",
  },

  gray: {
    icon: "text-gray-600 hover:bg-gray-100 hover:ring-gray-200",
    menu: "text-gray-700 hover:bg-gray-100",
  },

  zinc: {
    icon: "text-zinc-600 hover:bg-zinc-100 hover:ring-zinc-200",
    menu: "text-zinc-700 hover:bg-zinc-100",
  },

  neutral: {
    icon: "text-neutral-600 hover:bg-neutral-100 hover:ring-neutral-200",
    menu: "text-neutral-700 hover:bg-neutral-100",
  },

  stone: {
    icon: "text-stone-600 hover:bg-stone-100 hover:ring-stone-200",
    menu: "text-stone-700 hover:bg-stone-100",
  },

  red: {
    icon: "text-red-600 hover:bg-red-50 hover:ring-red-200",
    menu: "text-red-600 hover:bg-red-100",
  },

  orange: {
    icon: "text-orange-600 hover:bg-orange-50 hover:ring-orange-200",
    menu: "text-orange-600 hover:bg-orange-100",
  },

  amber: {
    icon: "text-amber-600 hover:bg-amber-50 hover:ring-amber-200",
    menu: "text-amber-600 hover:bg-amber-100",
  },

  yellow: {
    icon: "text-yellow-600 hover:bg-yellow-50 hover:ring-yellow-200",
    menu: "text-yellow-600 hover:bg-yellow-100",
  },

  lime: {
    icon: "text-lime-600 hover:bg-lime-50 hover:ring-lime-200",
    menu: "text-lime-600 hover:bg-lime-100",
  },

  green: {
    icon: "text-green-600 hover:bg-green-50 hover:ring-green-200",
    menu: "text-green-600 hover:bg-green-100",
  },

  emerald: {
    icon: "text-emerald-600 hover:bg-emerald-50 hover:ring-emerald-200",
    menu: "text-emerald-600 hover:bg-emerald-100",
  },

  teal: {
    icon: "text-teal-600 hover:bg-teal-50 hover:ring-teal-200",
    menu: "text-teal-600 hover:bg-teal-100",
  },

  cyan: {
    icon: "text-cyan-600 hover:bg-cyan-50 hover:ring-cyan-200",
    menu: "text-cyan-600 hover:bg-cyan-100",
  },

  sky: {
    icon: "text-sky-600 hover:bg-sky-50 hover:ring-sky-200",
    menu: "text-sky-600 hover:bg-sky-100",
  },

  blue: {
    icon: "text-blue-600 hover:bg-blue-50 hover:ring-blue-200",
    menu: "text-blue-600 hover:bg-blue-100",
  },

  indigo: {
    icon: "text-indigo-600 hover:bg-indigo-50 hover:ring-indigo-200",
    menu: "text-indigo-600 hover:bg-indigo-100",
  },

  violet: {
    icon: "text-violet-600 hover:bg-violet-50 hover:ring-violet-200",
    menu: "text-violet-600 hover:bg-violet-100",
  },

  purple: {
    icon: "text-purple-600 hover:bg-purple-50 hover:ring-purple-200",
    menu: "text-purple-600 hover:bg-purple-100",
  },

  fuchsia: {
    icon: "text-fuchsia-600 hover:bg-fuchsia-50 hover:ring-fuchsia-200",
    menu: "text-fuchsia-600 hover:bg-fuchsia-100",
  },

  pink: {
    icon: "text-pink-600 hover:bg-pink-50 hover:ring-pink-200",
    menu: "text-pink-600 hover:bg-pink-100",
  },

  rose: {
    icon: "text-rose-600 hover:bg-rose-50 hover:ring-rose-200",
    menu: "text-rose-600 hover:bg-rose-100",
  },
};

export const DEFAULT_COLOR = "slate";

export const getActionColor = (color) =>
  ACTION_COLORS[color] || ACTION_COLORS[DEFAULT_COLOR];
