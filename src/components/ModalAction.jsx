import React, { useRef, useEffect } from "react";
import Transition from "../utils/Transition";
import { AlertTriangle, CheckCircle, Info, Loader2, X } from "lucide-react";

// ─── Theme config ─────────────────────────────────────────────────────────────
const THEMES = {
  danger: {
    Icon: AlertTriangle,
    bar: "bg-red-600",
    iconBg: "bg-red-50",
    iconColor: "text-red-600",
    eyebrow: "Destructive Action",
    eyebrowColor: "text-red-800",
    btn: "bg-red-600 hover:bg-red-700 active:bg-red-800",
  },
  success: {
    Icon: CheckCircle,
    bar: "bg-emerald-600",
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-600",
    eyebrow: "Confirm Action",
    eyebrowColor: "text-emerald-800",
    btn: "bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800",
  },
  warning: {
    Icon: AlertTriangle,
    bar: "bg-amber-500",
    iconBg: "bg-amber-50",
    iconColor: "text-amber-600",
    eyebrow: "Attention Required",
    eyebrowColor: "text-amber-800",
    btn: "bg-amber-500 hover:bg-amber-600 active:bg-amber-700",
  },
  info: {
    Icon: Info,
    bar: "bg-blue-600",
    iconBg: "bg-blue-50",
    iconColor: "text-blue-600",
    eyebrow: "Information",
    eyebrowColor: "text-blue-800",
    btn: "bg-blue-600 hover:bg-blue-700 active:bg-blue-800",
  },
};

// ─── Size config ──────────────────────────────────────────────────────────────
const SIZES = {
  sm: {
    // centered
    maxW: "max-w-[360px]",
    pad: "px-7 pt-7 pb-5",
    ruleMx: "mx-7",
    footPad: "px-7 pb-7 pt-4",
    iconWrap: "w-[60px] h-[60px] rounded-2xl mb-[18px]",
    iconSize: "w-[26px] h-[26px]",
    eyebrow: "text-[9.5px] mb-[10px]",
    title: "text-[17px] mb-3",
    desc: "text-[13.5px]",
    cancelBtn: "py-[11px] text-[13px] rounded-[10px]",
    okBtn: "py-[11px] text-[13px] rounded-[10px]",
    gap: "gap-[10px]",
    // minimal
    mnMaxW: "max-w-[340px]",
    mnPad: "p-[18px]",
    mnFootPad: "px-[16px] pb-[16px] pt-[12px]",
    mnIconWrap: "w-[38px] h-[38px] rounded-[10px] mt-0.5",
    mnIconSize: "w-[17px] h-[17px]",
    mnTitle: "text-[14px] mb-[5px]",
    mnDesc: "text-[12.5px]",
    mnBtn: "py-[8.5px] text-[12.5px] rounded-[9px]",
  },
  md: {
    // centered
    maxW: "max-w-[420px]",
    pad: "px-9 pt-9 pb-6",
    ruleMx: "mx-9",
    footPad: "px-9 pb-9 pt-5",
    iconWrap: "w-[72px] h-[72px] rounded-[20px] mb-[20px]",
    iconSize: "w-[30px] h-[30px]",
    eyebrow: "text-[10.5px] mb-[11px]",
    title: "text-[19px] mb-3",
    desc: "text-[14px]",
    cancelBtn: "py-[13px] text-[14px] rounded-[10px]",
    okBtn: "py-[13px] text-[14px] rounded-[10px]",
    gap: "gap-3",
    // minimal
    mnMaxW: "max-w-[400px]",
    mnPad: "p-[22px]",
    mnFootPad: "px-[20px] pb-[20px] pt-[13px]",
    mnIconWrap: "w-[44px] h-[44px] rounded-[12px] mt-0.5",
    mnIconSize: "w-[20px] h-[20px]",
    mnTitle: "text-[15px] mb-[5px]",
    mnDesc: "text-[13px]",
    mnBtn: "py-[10px] text-[13px] rounded-[9px]",
  },
};

// ─── Centered variant ─────────────────────────────────────────────────────────
function CenteredModal({
  id,
  cfg,
  sz,
  title,
  description,
  confirmText,
  cancelText,
  loading,
  onClose,
  onConfirm,
}) {
  const { Icon } = cfg;
  return (
    <div
      className={`relative w-full ${sz.maxW} overflow-hidden rounded-[20px] bg-white shadow-2xl shadow-slate-900/20 ring-1 ring-black/[0.06]`}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        disabled={loading}
        aria-label="Close"
        className="absolute right-[14px] top-[14px] flex h-[30px] w-[30px] items-center justify-center rounded-full border-[1.5px] border-slate-200 bg-slate-50 text-slate-400 transition-all hover:bg-slate-100 hover:text-slate-600 disabled:pointer-events-none disabled:opacity-40"
      >
        <X className="h-[13px] w-[13px]" strokeWidth={2.5} />
      </button>

      {/* Hero */}
      <div className={`flex flex-col items-center text-center ${sz.pad}`}>
        {/* Icon */}
        <div
          className={`flex items-center justify-center ${sz.iconWrap} ${cfg.iconBg}`}
        >
          <Icon
            className={`${sz.iconSize} ${cfg.iconColor}`}
            strokeWidth={1.65}
          />
        </div>

        {/* Eyebrow */}
        {/* <p
          className={`font-extrabold uppercase tracking-[.12em] ${sz.eyebrow} ${cfg.eyebrowColor}`}
        >
          {cfg.eyebrow}
        </p> */}

        {/* Title */}
        <h2
          id={`${id}-title`}
          className={`font-extrabold leading-[1.25] tracking-tight text-slate-900 ${sz.title}`}
        >
          {title}
        </h2>

        {/* Description */}
        <p
          id={`${id}-description`}
          className={`font-normal leading-[1.7] text-slate-500 ${sz.desc}`}
        >
          {description}
        </p>
      </div>

      {/* Rule */}
      <div className={`h-px bg-slate-100 ${sz.ruleMx}`} />

      {/* Footer */}
      <div className={`flex ${sz.gap} ${sz.footPad}`}>
        <button
          onClick={onClose}
          disabled={loading}
          className={`flex-1 border-[1.5px] border-slate-200 bg-white font-semibold text-slate-500 transition-all hover:border-slate-300 hover:bg-slate-50 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50 ${sz.cancelBtn}`}
        >
          {cancelText}
        </button>
        <button
          onClick={() => !loading && onConfirm()}
          disabled={loading}
          className={`flex flex-[1.2] items-center justify-center gap-2 font-bold tracking-[-0.01em] text-white transition-all hover:-translate-y-px active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60 disabled:translate-y-0 ${sz.okBtn} ${cfg.btn}`}
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Processing…
            </>
          ) : (
            confirmText
          )}
        </button>
      </div>
    </div>
  );
}

// ─── Minimal variant ──────────────────────────────────────────────────────────
function MinimalModal({
  id,
  cfg,
  sz,
  title,
  description,
  confirmText,
  cancelText,
  loading,
  onClose,
  onConfirm,
}) {
  const { Icon } = cfg;
  return (
    <div
      className={`relative w-full ${sz.mnMaxW} overflow-hidden rounded-2xl border-[1.5px] border-slate-200 bg-white shadow-xl shadow-slate-900/12 ring-1 ring-black/[0.04]`}
    >
      {/* Body */}
      <div className={`flex gap-[14px] ${sz.mnPad}`}>
        {/* Icon */}
        <div
          className={`flex flex-shrink-0 items-center justify-center ${sz.mnIconWrap} ${cfg.iconBg}`}
        >
          <Icon
            className={`${sz.mnIconSize} ${cfg.iconColor}`}
            strokeWidth={1.75}
          />
        </div>

        {/* Text */}
        <div className="min-w-0 flex-1 pr-6">
          <p
            id={`${id}-title`}
            className={`font-extrabold leading-snug tracking-tight text-slate-900 ${sz.mnTitle}`}
          >
            {title}
          </p>
          <p
            id={`${id}-description`}
            className={`font-normal leading-[1.65] text-slate-500 ${sz.mnDesc}`}
          >
            {description}
          </p>
        </div>

        {/* Close */}
        <button
          onClick={onClose}
          disabled={loading}
          aria-label="Close"
          className="absolute right-3 top-[18px] flex h-6 w-6 items-center justify-center rounded-full border-[1.5px] border-slate-200 bg-slate-50 text-slate-400 transition hover:bg-slate-100 hover:text-slate-500 disabled:pointer-events-none disabled:opacity-40"
        >
          <X className="h-[11px] w-[11px]" strokeWidth={2.5} />
        </button>
      </div>

      {/* Rule */}
      <div className="h-px bg-slate-100" />

      {/* Footer */}
      <div className={`flex gap-2 ${sz.mnFootPad}`}>
        <button
          onClick={onClose}
          disabled={loading}
          className={`flex-1 border-[1.5px] border-slate-200 bg-white font-semibold text-slate-500 transition-all hover:bg-slate-50 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50 ${sz.mnBtn}`}
        >
          {cancelText}
        </button>
        <button
          onClick={() => !loading && onConfirm()}
          disabled={loading}
          className={`flex flex-1 items-center justify-center gap-1.5 font-bold text-white transition-all hover:-translate-y-px active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60 disabled:translate-y-0 ${sz.mnBtn} ${cfg.btn}`}
        >
          {loading ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              Processing…
            </>
          ) : (
            confirmText
          )}
        </button>
      </div>
    </div>
  );
}

// ─── Root export ──────────────────────────────────────────────────────────────
/**
 * ModalAction — premium confirmation overlay
 *
 * @prop variant      "centered" | "minimal"                    default: "centered"
 * @prop theme        "danger" | "success" | "warning" | "info" default: "danger"
 * @prop size         "sm" | "md"                               default: "sm"
 * @prop isOpen       boolean
 * @prop onClose      () => void
 * @prop onConfirm    () => void
 * @prop title        string
 * @prop description  string
 * @prop confirmText  string   default: "Confirm"
 * @prop cancelText   string   default: "Cancel"
 * @prop loading      boolean
 */
export default function ModalAction({
  id,
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  theme = "danger",
  variant = "centered",
  size = "sm",
  confirmText = "Confirm",
  cancelText = "Cancel",
  loading = false,
}) {
  const modalRef = useRef(null);
  const cfg = THEMES[theme] ?? THEMES.danger;
  const sz = SIZES[size] ?? SIZES.sm;

  // outside click dismiss
  useEffect(() => {
    const fn = ({ target }) => {
      if (!isOpen || modalRef.current?.contains(target)) return;
      onClose();
    };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, [isOpen, onClose]);

  // ESC dismiss
  useEffect(() => {
    const fn = ({ key }) => {
      if (isOpen && key === "Escape") onClose();
    };
    document.addEventListener("keydown", fn);
    return () => document.removeEventListener("keydown", fn);
  }, [isOpen, onClose]);

  const shared = {
    id,
    cfg,
    sz,
    title,
    description,
    confirmText,
    cancelText,
    loading,
    onClose,
    onConfirm,
  };

  const enterFrom =
    variant === "minimal"
      ? "opacity-0 translate-y-3 scale-[0.98]"
      : "opacity-0 scale-95 translate-y-2";

  return (
    <>
      {/* Backdrop */}
      <Transition
        className="fixed inset-0 bg-slate-900/30 z-50 transition-opacity"
        show={isOpen}
        enter="transition ease-out duration-200"
        enterStart="opacity-0"
        enterEnd="opacity-100"
        leave="transition ease-out duration-100"
        leaveStart="opacity-100"
        leaveEnd="opacity-0"
      />

      {/* Positioner */}
      <Transition
        id={id}
        className={`fixed inset-0 z-50 flex px-4 ${
          variant === "minimal"
            ? "items-end justify-center pb-8 sm:items-center sm:pb-0"
            : "items-center justify-center"
        }`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${id}-title`}
        aria-describedby={`${id}-description`}
        show={isOpen}
        enter="transition ease-out duration-[180ms]"
        enterStart={enterFrom}
        enterEnd="opacity-100 scale-100 translate-y-0"
        leave="transition ease-in duration-[140ms]"
        leaveStart="opacity-100 scale-100 translate-y-0"
        leaveEnd={enterFrom}
      >
        <div ref={modalRef} className="flex w-full justify-center">
          {variant === "minimal" ? (
            <MinimalModal {...shared} />
          ) : (
            <CenteredModal {...shared} />
          )}
        </div>
      </Transition>
    </>
  );
}
