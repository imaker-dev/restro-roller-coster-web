import { useState } from "react";
import { X } from "lucide-react";
import { FieldWrapper } from "./FieldWrapper";

export function MultiSelectDropdownField({
  label,
  name,
  id,
  required,
  error,
  helperText,
  options = [],
  value = [],
  onChange,
  onBlur,
  disabled = false,
  loading = false,
  placeholder = "Select option",
  emptyText = "No options available",
  disabledText = "Disabled",
}) {
  const inputId = id || name;
  const [selectedId, setSelectedId] = useState("");

  const isDisabled = disabled || loading;

  const normalizedValue = value.map(String);

  const triggerBlur = () => {
    onBlur?.({
      target: { name },
    });
  };

  const handleAdd = (e) => {
    const val = e.target.value;
    setSelectedId(val);

    if (!val || isDisabled) return;

    const normalized = String(val);

    if (!normalizedValue.includes(normalized)) {
      onChange([...normalizedValue, normalized]);
    }

    triggerBlur();
    setSelectedId("");
  };

  const remove = (removeId) => {
    if (isDisabled) return;

    onChange(
      normalizedValue.filter((v) => String(v) !== String(removeId))
    );

    triggerBlur();
  };

  const selectedOptions = options.filter((o) =>
    normalizedValue.includes(String(o.id))
  );

  return (
    <FieldWrapper
      label={label}
      id={inputId}
      required={required}
      error={error}
      helperText={helperText}
      disabled={isDisabled}
    >
      <div className="flex flex-col gap-2">
        {/* Dropdown */}
        <select
          id={inputId}
          name={name}
          value={selectedId}
          onChange={handleAdd}
          onBlur={triggerBlur}
          disabled={isDisabled}
          className={`
            form-select w-full
            ${isDisabled ? "bg-slate-100 text-slate-500 cursor-not-allowed" : ""}
            ${error ? "border-red-500" : ""}
          `}
        >
          {/* Disabled Text */}
          {disabled && !loading && (
            <option value="">{disabledText}</option>
          )}

          {/* Loading */}
          {loading && <option value="">Loading...</option>}

          {/* Normal Placeholder */}
          {!loading && !disabled && (
            <option value="">{placeholder}</option>
          )}

          {/* Empty */}
          {!loading && !disabled && options.length === 0 && (
            <option value="" disabled>
              {emptyText}
            </option>
          )}

          {/* Options */}
          {!loading &&
            !disabled &&
            options.length > 0 &&
            options.map((o) => {
              const isSelected = normalizedValue.includes(String(o.id));

              return (
                <option key={o.id} value={o.id} disabled={isSelected}>
                  {o.label} {isSelected ? "✓" : ""}
                </option>
              );
            })}
        </select>

        {/* Selected Tags */}
        <div className="flex flex-wrap gap-2">
          {selectedOptions.map((o) => (
            <span
              key={o.id}
              className="bg-gray-200 px-2 py-1 text-xs rounded flex gap-1 items-center"
            >
              {o.label}
              {!isDisabled && (
                <button
                  type="button"
                  onClick={() => remove(o.id)}
                  className="text-red-500 hover:text-red-600"
                >
                  <X size={12} />
                </button>
              )}
            </span>
          ))}
        </div>
      </div>
    </FieldWrapper>
  );
}
