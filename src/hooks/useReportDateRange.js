import { useState } from "react";
import { useQueryParams } from "./useQueryParams";

export function useReportDateRange() {
  const { date, start, end } = useQueryParams();

  const getQueryDateRange = () => {
    if (date) {
      return {
        startDate: date,
        endDate: date,
      };
    }

    if (start && end) {
      return {
        startDate: start,
        endDate: end,
      };
    }

    return null;
  };

  const [dateRange, setDateRange] = useState(getQueryDateRange());

  return { dateRange, setDateRange };
}