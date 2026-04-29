const FoodTypeIcon = ({ type = "", size = "sm" }) => {
  const sizeClasses = {
    xs: "w-3 h-3",
    sm: "w-3.5 h-3.5",
    md: "w-4 h-4",
    lg: "w-5 h-5", // NEW SIZE
  };

  const dotSizeClasses = {
    xs: "w-1 h-1",
    sm: "w-1.5 h-1.5",
    md: "w-2 h-2",
    lg: "w-2.5 h-2.5", // NEW SIZE
  };

  const normalizedSize = sizeClasses[size] ? size : "sm";

  let borderColor = "border-gray-400";
  let dotColor = "bg-gray-400";
  let label = "Unknown";

  const value = String(type).toLowerCase().trim();

  if (value === "veg") {
    borderColor = "border-green-600";
    dotColor = "bg-green-600";
    label = "Veg";
  } else if (value === "non-veg" || value === "non_veg" || value === "nonveg") {
    borderColor = "border-red-600";
    dotColor = "bg-red-600";
    label = "Non-Veg";
  } else if (value === "egg") {
    borderColor = "border-yellow-500";
    dotColor = "bg-yellow-500";
    label = "Egg";
  }

  return (
    <div
      title={label}
      aria-label={label}
      className={`
        ${sizeClasses[normalizedSize]}
        border-2
        ${borderColor}
        rounded
        flex items-center justify-center
        flex-shrink-0
        bg-white
      `}
    >
      <div
        className={`
          ${dotSizeClasses[normalizedSize]}
          rounded-full
          ${dotColor}
        `}
      />
    </div>
  );
};

export default FoodTypeIcon;
