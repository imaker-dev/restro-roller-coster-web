import { useEffect, useState } from "react";
import { timeAgo } from "./dateFormatter";

export const useTimeAgo = (date, interval = 60000) => {
  const [value, setValue] = useState(timeAgo(date));

  useEffect(() => {
    if (!date) return;

    const update = () => {
      setValue(timeAgo(date));
    };

    update(); // initial

    const timer = setInterval(update, interval);

    return () => clearInterval(timer);
  }, [date, interval]);

  return value;
};