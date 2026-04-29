import React, { useRef, useEffect } from "react";
import Transition from "../utils/Transition";

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

function ModalBlank({ children, id, isOpen, onClose, size = "lg" }) {
  const modalContent = useRef(null);

  useEffect(() => {
    if (!onClose) return;

    const clickHandler = ({ target }) => {
      if (!isOpen || modalContent.current.contains(target)) return;
      onClose();
    };

    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!onClose) return;

    const keyHandler = ({ keyCode }) => {
      if (!isOpen || keyCode !== 27) return; 
      onClose();
    };

    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  }, [isOpen, onClose]);

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
          {children}
        </div>
      </Transition>
    </>
  );
}

export default ModalBlank;
