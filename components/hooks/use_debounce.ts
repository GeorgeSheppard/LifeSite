import { useEffect, useState } from "react";

export function useDebounce<T>(
  initialState: T,
  callback: () => T,
  time: number
) {
  const [debouncedValue, setDebouncedValue] = useState<T>(initialState);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(callback()), time);
    return () => clearTimeout(timer);
  }, [callback, time]);

  return debouncedValue;
}
