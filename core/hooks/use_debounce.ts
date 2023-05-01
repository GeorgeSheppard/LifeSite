import { useEffect, useState } from "react";

export function useDebounce<T>(callback: () => T, time: number) {
  const [debouncedValue, setDebouncedValue] = useState<T>(callback);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(callback()), time);
    return () => clearTimeout(timer);
  }, [callback, time]);

  return debouncedValue;
}
