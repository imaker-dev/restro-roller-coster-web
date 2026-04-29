// ─── Drawer.jsx (Reusable Global Drawer) ─────────────────────────────────────
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

/**
 * Reusable slide-in Drawer
 *
 * Props:
 *   isOpen      — boolean
 *   onClose     — () => void
 *   title       — string | ReactNode
 *   subtitle    — string | ReactNode  (optional)
 *   children    — ReactNode
 *   side        — "right" | "left"    (default "right")
 *   width       — tailwind width class (default "max-w-md")
 *   footer      — ReactNode           (optional sticky footer)
 *   closeOnBackdrop — boolean         (default true)
 */
export default function Drawer({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  side = "right",
  width = "max-w-md",
  footer,
  closeOnBackdrop = true,
}) {
  const drawerRef = useRef(null);

  // Lock body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) return;

    // Always push a new entry when opening
    window.history.pushState(null, "");

    const handlePopState = () => {
      // Close drawer instead of navigating
      onClose();
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [isOpen, onClose]);

  const slideFrom =
    side === "right"
      ? { enter: "translate-x-full", base: "right-0" }
      : { enter: "-translate-x-full", base: "left-0" };

  return createPortal(
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 ${
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={closeOnBackdrop ? onClose : undefined}
        aria-hidden="true"
      />

      {/* Drawer panel */}
      <div
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        className={`
          fixed top-0 bottom-0 ${slideFrom.base} z-50
          w-full ${width}
          bg-white shadow-2xl
          flex flex-col
          transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]
          ${isOpen ? "translate-x-0" : slideFrom.enter}
        `}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3 px-5 py-4 border-b border-gray-100 shrink-0">
          <div className="min-w-0 flex-1">
            {typeof title === "string" ? (
              <h2 className="text-base font-black text-gray-900 leading-snug truncate">
                {title}
              </h2>
            ) : (
              title
            )}
            {subtitle &&
              (typeof subtitle === "string" ? (
                <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>
              ) : (
                subtitle
              ))}
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors shrink-0 mt-0.5"
          >
            <X size={15} className="text-gray-600" />
          </button>
        </div>

        {/* Body — scrollable */}
        <div className="flex-1 overflow-y-auto overscroll-contain">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="shrink-0 border-t border-gray-100 bg-white px-5 py-4">
            {footer}
          </div>
        )}
      </div>
    </>,
    document.body,
  );
}
