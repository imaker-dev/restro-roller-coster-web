import React, { useState } from "react";
import { Calendar, Clock, Eye, EyeOff } from "lucide-react";
import { FieldWrapper } from "./FieldWrapper";

export function InputField({
  label,
  name,
  id,
  required,
  error,
  helperText,
  type = "text",
  placeholder = "Placeholder",
  value,
  onChange,
  onBlur,
  disabled = false,
  icon: Icon,
  iconPosition = "left",
  autoComplete = "off",
  tooltip,
}) {
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === "password";

  // const rightDefaultIcon =
  //   type === "date" ? Calendar : type === "time" ? Clock : null;

  const rightDefaultIcon = null;

  const FinalRightIcon = iconPosition === "right" ? Icon : null;
  const FinalLeftIcon = iconPosition === "left" ? Icon : null;

  const inputId = id || name;

  const actualType = isPassword ? (showPassword ? "text" : "password") : type;

  return (
    <FieldWrapper
      label={label}
      tooltip={tooltip}
      id={inputId}
      required={required}
      error={error}
      helperText={helperText}
      disabled={disabled}
    >
      <div className="relative">
        {/* LEFT ICON */}
        {FinalLeftIcon && (
          <FinalLeftIcon
            className="absolute left-3 top-2.5 text-gray-400"
            size={18}
          />
        )}

        <input
          id={inputId}
          name={name}
          type={actualType}
          placeholder={placeholder}
          value={value ?? ""}
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled}
          className={`
            form-input w-full
            ${FinalLeftIcon ? "pl-9" : ""}
            ${FinalRightIcon || rightDefaultIcon || isPassword ? "pr-10" : ""}
            ${error ? "border-red-500" : ""}
            ${disabled ? "bg-slate-100 text-slate-500 cursor-not-allowed" : ""}
          `}
          autoComplete={autoComplete}
        />

        {/* RIGHT ICON AREA */}
        <div className="absolute right-3 top-2.5 text-gray-400 flex items-center">
          {/* PASSWORD TOGGLE */}
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword((p) => !p)}
              className="hover:text-gray-600"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          )}

          {/* CUSTOM RIGHT ICON */}
          {!isPassword && FinalRightIcon && <FinalRightIcon size={18} />}

          {/* DEFAULT DATE/TIME ICON */}
          {!isPassword &&
            !FinalRightIcon &&
            rightDefaultIcon &&
            React.createElement(rightDefaultIcon, { size: 18 })}
        </div>
      </div>
    </FieldWrapper>
  );
}
