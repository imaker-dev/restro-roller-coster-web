export const getFullFileUrl = (path) => {
  if (!path) return null;

  // Already full URL
  if (
    path.startsWith("http") ||
    path.startsWith("blob:") ||
    path.startsWith("data:")
  ) {
    return path;
  }

  const baseUrl = import.meta.env.VITE_API_URL.replace(/\/api.*$/, "");
  return `${baseUrl}/${path.replace(/^\//, "")}`;
};
