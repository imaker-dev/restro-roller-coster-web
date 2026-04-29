import { Info } from "lucide-react";
import Tooltip from "../Tooltip";

export function FieldWrapper({
  label,
  id,
  required,
  error,
  helperText,
  disabled,
  children,
  tooltip,
}) {
  return (
    <div className={`space-y-1 w-full ${disabled ? "opacity-70" : ""}`}>
      {label && (
        <label
          htmlFor={id}
          className="flex items-center gap-1 text-sm font-medium text-gray-900"
        >
          {label} {required && <span className="text-red-500">*</span>}
          {tooltip && (
            <Tooltip content={tooltip}>
              <Info size={14} className="text-gray-400 cursor-pointer" />
            </Tooltip>
          )}
        </label>
      )}

      {children}

      {error && <p className="text-xs text-red-500">{error}</p>}
      {helperText && <p className="text-xs text-gray-500">{helperText}</p>}
    </div>
  );
}
