import React, { useRef, useEffect } from "react";
import Transition from "../utils/Transition";

// Define size classes
const maxWidthClasses = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  "2xl": "max-w-2xl",
  "3xl": "max-w-3xl",
  "4xl": "max-w-4xl",
  "5xl": "max-w-5xl",
  full: "max-w-full",
};

function ModalBasic({ children, id, title, isOpen, onClose, size = "lg" }) {
  const modalContent = useRef(null);

  // Close on ESC key
  useEffect(() => {
    const keyHandler = ({ keyCode }) => {
      if (!isOpen || keyCode !== 27) return;
      onClose();
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  }, [isOpen, onClose]);

  // Determine modal max width class
  const maxWidthClass = maxWidthClasses[size] || maxWidthClasses.lg;

  return (
    <>
      {/* Modal backdrop */}
      <Transition
        className="fixed inset-0 bg-slate-900/30 z-50 transition-opacity"
        show={isOpen}
        enter="transition ease-out duration-200"
        enterStart="opacity-0"
        enterEnd="opacity-100"
        leave="transition ease-out duration-100"
        leaveStart="opacity-100"
        leaveEnd="opacity-0"
        aria-hidden="true"
      />

      {/* Modal dialog */}
      <Transition
        id={id}
        className="fixed inset-0 z-50 overflow-hidden flex items-center my-4 justify-center px-4 sm:px-6"
        role="dialog"
        aria-modal="true"
        show={isOpen}
        enter="transition ease-in-out duration-200"
        enterStart="opacity-0 translate-y-4"
        enterEnd="opacity-100 translate-y-0"
        leave="transition ease-in-out duration-200"
        leaveStart="opacity-100 translate-y-0"
        leaveEnd="opacity-0 translate-y-4"
      >
        <div
          ref={modalContent}
          className={`bg-white rounded shadow-lg overflow-auto w-full max-h-full ${maxWidthClass}`}
        >
          {/* Modal header (only if title exists) */}
          {title && (
            <div className="px-5 py-3 border-b border-slate-200">
              <div className="flex justify-between items-center">
                <div className="font-semibold text-slate-800">{title}</div>
                <button
                  className="text-slate-400 hover:text-slate-500"
                  onClick={(e) => {
                    e.stopPropagation();
                    onClose();
                  }}
                >
                  <div className="sr-only">Close</div>
                  <svg className="w-4 h-4 fill-current">
                    <path d="M7.95 6.536l4.242-4.243a1 1 0 111.415 1.414L9.364 7.95l4.243 4.242a1 1 0 11-1.415 1.415L7.95 9.364l-4.243 4.243a1 1 0 01-1.414-1.415L6.536 7.95 2.293 3.707a1 1 0 011.414-1.414L7.95 6.536z" />
                  </svg>
                </button>
              </div>
            </div>
          )}

          {/* Modal content */}
          {children}
        </div>
      </Transition>
    </>
  );
}

export default ModalBasic;
