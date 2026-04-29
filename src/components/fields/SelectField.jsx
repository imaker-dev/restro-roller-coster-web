import { FieldWrapper } from "./FieldWrapper";

export function SelectField({
  label,
  name,
  id,
  required,
  error,
  helperText,
  options = [],
  value,
  onChange,
  onBlur,
  disabled = false,
  loading = false,
  emptyText = "No options available",
  disabledText = "Disabled",
}) {
  const inputId = id || name;
  const isDisabled = disabled || loading;

  return (
    <FieldWrapper
      label={label}
      id={inputId}
      required={required}
      error={error}
      helperText={helperText}
      disabled={isDisabled}
    >
      <select
        id={inputId}
        name={name}
        value={value ?? ""}
        onChange={onChange}
        onBlur={onBlur}
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
        {!loading && !disabled && <option value="">Select</option>}

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
          options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
      </select>
    </FieldWrapper>
  );
}
