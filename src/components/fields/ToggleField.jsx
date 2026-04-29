export default function ToggleField({
  label,
  description,
  checked = false,
  onChange,
  activeColorClass = "bg-primary-600",
  inactiveColorClass = "bg-gray-300",
  className = "",
  disabled = false,
}) {
  return (
    <div
      className={`flex items-center justify-between gap-4 p-4 rounded-xl 
      border border-gray-100 
      ${disabled ? "bg-gray-100 cursor-not-allowed opacity-60" : "bg-gray-50 hover:bg-gray-100 cursor-pointer"} 
      transition-colors ${className}`}
      onClick={() => {
        if (disabled) return;
        onChange?.(!checked);
      }}
    >
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-800">{label}</p>
        {description && (
          <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
            {description}
          </p>
        )}
      </div>

      <div
        className={`relative flex-shrink-0 w-11 h-6 rounded-full 
        transition-colors duration-200 
        ${checked ? activeColorClass : inactiveColorClass}`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm 
          transition-transform duration-200 ${
            checked ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </div>
    </div>
  );
}
