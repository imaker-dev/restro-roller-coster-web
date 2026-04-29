// utils/cleanParams.js

export const cleanParams = (params = {}) => {
  const cleaned = {};

  Object.entries(params).forEach(([key, value]) => {
    // Skip undefined or null
    if (value === undefined || value === null) return;

    // Skip empty strings or only spaces
    if (typeof value === "string" && value.trim() === "") return;

    // Skip empty arrays
    if (Array.isArray(value) && value.length === 0) return;

    // Skip empty objects
    if (
      typeof value === "object" &&
      !Array.isArray(value) &&
      Object.keys(value).length === 0
    ) {
      return;
    }

    // ✅ Keep everything else (including 0, false)
    cleaned[key] = value;
  });

  return cleaned;
};