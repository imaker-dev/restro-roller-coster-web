import { useLocation } from "react-router-dom";

export function useQueryParams() {
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);

  return Object.fromEntries(queryParams.entries());
}
