import { useState } from "react";

export const useTemporaryState = <T>(
  normalState: T,
  temporaryState: T
) => {
  const [useJustClicked, setUseJustClicked] = useState(false);

  const toggleStateTemporarily = () => {
    setUseJustClicked(true);
    setTimeout(() => setUseJustClicked(false), 1000);
  };

  return [
    useJustClicked ? temporaryState : normalState,
    toggleStateTemporarily,
  ] as const;
};
