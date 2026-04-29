export const formatFileSize = (value, unit = "B", decimals = 2) => {
  // Validate input
  if (value === 0) return "0 B";
  if (typeof value !== "number" || isNaN(value)) return "Invalid size";

  // Convert everything to bytes first
  const unitMap = {
    B: 1,
    KB: 1024,
    MB: 1024 ** 2,
    GB: 1024 ** 3,
    TB: 1024 ** 4,
  };

  const bytes = value * (unitMap[unit] || 1);

  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];

  const i = Math.min(
    sizes.length - 1,
    Math.floor(Math.log(bytes) / Math.log(k))
  );

  const size = bytes / Math.pow(k, i);

  return `${size.toFixed(decimals)} ${sizes[i]}`;
};