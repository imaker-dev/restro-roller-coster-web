import { useSearchParams } from "react-router-dom";

export const useDataTable = (defaults = {}) => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Convert URL params into object
  const query = {};

  searchParams.forEach((value, key) => {
    query[key] = value;
  });

  // Merge defaults
  const finalQuery = {
    ...defaults,
    ...query,
  };

  const updateQuery = (updates = {}) => {
    const params = new URLSearchParams(searchParams);

    Object.entries(updates).forEach(([key, value]) => {
      if (
        value === undefined ||
        value === null ||
        value === ""
      ) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });

    setSearchParams(params);
  };

  const resetQuery = (keys = []) => {
    const params = new URLSearchParams(searchParams);

    if (keys.length) {
      keys.forEach((key) => {
        params.delete(key);
      });
    } else {
      params.forEach((_, key) => {
        params.delete(key);
      });
    }

    setSearchParams(params);
  };

  return {
    query: finalQuery,
    updateQuery,
    resetQuery,
  };
};