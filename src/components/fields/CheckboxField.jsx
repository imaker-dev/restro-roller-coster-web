import { FieldWrapper } from "./FieldWrapper";

export function CheckboxField({
  label,
  name,
  checked,
  onChange,
  disabled = false,
}) {
  return (
    <label className="flex items-center gap-2 text-sm cursor-pointer">
      <input
        type="checkbox"
        name={name}
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className="form-checkbox"
      />
      {label}
    </label>
  );
}

export function RadioField({
  label,
  name,
  checked,
  onChange,
  disabled = false,
}) {
  return (
    <label className="flex items-center gap-2 text-sm cursor-pointer">
      <input
        type="radio"
        name={name}
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className="form-radio"
      />
      {label}
    </label>
  );
}



export function RadioGroupField({
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
}) {
  const inputId = id || name;

  return (
    <FieldWrapper
      label={label}
      id={inputId}
      required={required}
      error={error}
      helperText={helperText}
      disabled={disabled}
    >
      <div className="flex gap-6">
        {options.map((opt) => (
          <label
            key={opt.value}
            className={`flex items-center gap-2 cursor-pointer ${
              disabled ? "cursor-not-allowed" : ""
            }`}
          >
            <input
              id={`${name}-${opt.value}`}
              type="radio"
              name={name}
              value={opt.value}
              checked={String(value) === String(opt.value)}
              onChange={() => onChange(opt.value)} 
              onBlur={onBlur}
              disabled={disabled}
              className="form-radio"
            />
            <span className="text-sm text-gray-700">{opt.label}</span>
          </label>
        ))}
      </div>
    </FieldWrapper>
  );
}
