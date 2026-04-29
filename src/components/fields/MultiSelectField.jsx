import { useState } from "react";
import { X } from "lucide-react";
import { FieldWrapper } from "./FieldWrapper";

export function MultiSelectField({
  label,
  name,  
  required,
  error,
  helperText,
  selectedValues = [],
  onChange,
  onBlur,
  disabled = false,
  placeholder = "Add value",
}) {
  const [input, setInput] = useState("");

  const add = (e) => {
    if (disabled) return;

    if ((e.key === "Enter" || e.key === ",") && input.trim()) {
      e.preventDefault();
      const val = input.trim();
      if (!selectedValues.includes(val)) {
        onChange([...selectedValues, val]);
      }
      setInput("");
    }
  };

  const remove = (v) => {
    if (disabled) return;
    onChange(selectedValues.filter((x) => x !== v));
  };

  return (
    <FieldWrapper
      label={label}
      required={required}
      error={error}
      helperText={helperText}
      disabled={disabled}
    >
      <div className={`form-input p-2 flex flex-wrap gap-2 ${disabled ? "bg-slate-100" : ""}`}>
        {selectedValues.map((v) => (
          <span key={v} className="bg-gray-200 px-2 py-1 text-xs rounded flex gap-1">
            {v}
            {!disabled && (
              <button type="button" onClick={() => remove(v)}>
                <X size={12} />
              </button>
            )}
          </span>
        ))}

        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={add}
          onBlur={() => onBlur && onBlur(name)}
          disabled={disabled}
          className="flex-1 outline-none text-sm bg-transparent"
          placeholder={placeholder}
        />
      </div>
    </FieldWrapper>
  );
}
