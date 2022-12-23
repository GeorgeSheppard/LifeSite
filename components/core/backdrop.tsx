import { useState, useCallback, PropsWithChildren } from "react";
import Backdrop from "@mui/material/Backdrop";

export function useCustomBackdrop<T>() {
  const [selected, setSelected] = useState<T | null>(null);

  const removeSelected = useCallback(() => {
    setSelected(null);
  }, []);

  return { removeSelected, setSelected, selected };
}

export interface IBackdropProps<T> {
  selected: T;
  removeSelected: () => void;
}

export const CustomBackdrop = <T extends any>(
  props: PropsWithChildren<IBackdropProps<T>>
) => {
  const { removeSelected, selected } = props;

  return (
    <Backdrop
      sx={{
        color: "#fff",
        zIndex: (theme) => theme.zIndex.drawer + 1,
        overflowY: "scroll",
        paddingTop: 12,
      }}
      open={!!selected}
      onClick={removeSelected}
    >
      {props.children}
    </Backdrop>
  );
};
