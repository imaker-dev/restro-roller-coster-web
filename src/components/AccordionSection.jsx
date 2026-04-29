import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

const AccordionSection = ({
  title,
  icon: Icon, // icon passed as component
  index,
  children,
  defaultOpen = true,
  className = "",
}) => {
  const [open, setOpen] = useState(defaultOpen);
  const contentRef = useRef(null);
  const [height, setHeight] = useState("0px");

  // Smooth + safe height animation
  useEffect(() => {
    if (!contentRef.current) return;

    setHeight(open ? `${contentRef.current.scrollHeight}px` : "0px");
  }, [open, children]);

  const toggle = () => setOpen((prev) => !prev);

  return (
    <div
      className={`bg-white rounded-lg border border-gray-200 overflow-hidden ${className}`}
    >
      {/* HEADER */}
      <div
        role="button"
        tabIndex={0}
        aria-expanded={open}
        onClick={toggle}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") toggle();
        }}
        className="flex items-center justify-between px-6 py-4 cursor-pointer border-b border-slate-300 hover:bg-gray-50 transition-colors duration-200 select-none"
      >
        <div className="flex items-center gap-2 font-medium text-gray-700">
          {/* 👇 Index badge */}
          {typeof index === "number" && (
            <div className="w-7 h-7 flex items-center justify-center rounded-md bg-primary-100 text-primary-700 text-xs font-semibold">
              {index + 1}
            </div>
          )}
          {Icon && <Icon className="w-5 h-5 text-orange-500" />}
          <span>{title}</span>
        </div>

        {/* Chevron */}
        <div className="border-2 border-gray-500 w-6 h-6 flex items-center justify-center rounded-full bg-gray-100">
          <ChevronDown
            strokeWidth={3}
            className={`w-4 h-4 text-gray-500 transition-transform duration-300 ${
              open ? "rotate-180" : ""
            }`}
          />
        </div>
      </div>

      {/* BODY (animated) */}
      <div
        className={`
          overflow-hidden transition-all duration-300 ease-in-out
          ${open ? "max-h-[2000px]" : "max-h-0"}
        `}
      >
        <div ref={contentRef} className="p-6 bg-white">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AccordionSection;
