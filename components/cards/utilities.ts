import { MouseEvent } from "react";

export const stopPropagation = (event: MouseEvent<HTMLElement>) => {
  event.stopPropagation();
};
