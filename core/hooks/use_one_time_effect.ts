import { useEffect, useRef } from 'react';

/**
 * Run `effect` the first time `condition` is true
 * @param effect 
 * @param condition 
 */
export const useOneTimeEffect = (effect: () => void, condition: () => boolean) => {
  const ref = useRef(false);

  useEffect(() => {
    if (condition() && !ref.current) {
      effect()
      ref.current = true;
    }
  }, [condition, effect])
}