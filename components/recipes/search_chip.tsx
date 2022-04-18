import Chip, { ChipProps } from "@mui/material/Chip";
import { useCallback, useMemo } from "react";

export interface ISearchChipProps extends ChipProps {
  label: string;
  property: string;
  removeOrAddKey: (key: string) => void;
  keys: Set<string>;
}

export const SearchChip = (props: ISearchChipProps) => {
  const { removeOrAddKey, label, property, keys, sx } = props;
  
  const onClick = useCallback(
    () => removeOrAddKey(property),
    [property, removeOrAddKey]
  );

  const selected = useMemo(() => keys.has(property), [keys, property]);

  return (
    <Chip
      label={label}
      size="small"
      variant={selected ? "filled" : "outlined"}
      color={selected ? "primary" : "default"}
      onClick={onClick}
      sx={sx}
    />
  );
};
