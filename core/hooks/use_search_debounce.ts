import { useRef, useState } from "react";

/**
 * Returns the current value, the same value but debounced by `time`, and a 
 * function to update both. 
 */
export function useSearchDebounce(
  initialState?: string,
  time?: number
) {
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [latestValue, setLatestValue] = useState(initialState ?? "");
  const [debouncedValue, setDebouncedValue] = useState(initialState ?? "");

  const updateValue = (newValue: string) => {
    setLatestValue(newValue);
    if (timerRef.current) clearTimeout(timerRef.current);
    const timer = setTimeout(() => setDebouncedValue(newValue), time ?? 300);
    timerRef.current = timer;
  }

  return [latestValue, debouncedValue, updateValue] as const
}
