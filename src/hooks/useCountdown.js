import { useEffect, useState } from "react";

export default function useCountdown(start, active) {
  const [count, setCount] = useState(start);

  useEffect(() => {
    if (!active) {
      setCount(start);
      return;
    }

    setCount(start);

    const interval = setInterval(() => {
      setCount((c) => {
        if (c <= 1) {
          clearInterval(interval);
          return 0;
        }
        return c - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [active, start]);

  return count;
}
