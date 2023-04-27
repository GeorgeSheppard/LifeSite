import Chip, { ChipProps } from "@mui/material/Chip";
import { useCallback, useMemo, SetStateAction, Dispatch, memo } from 'react';
import { SearchableAttributes } from "../../../../core/recipes/hooks/use_recipe_search";

export interface ISearchChipsProps {
  setKeys: Dispatch<SetStateAction<Set<SearchableAttributes>>>;
  keys: Set<SearchableAttributes>;
}

export const SearchChips = memo(function RenderSearchChips(props: ISearchChipsProps) {
  const { setKeys, keys } = props;

  const removeOrAddKey = useCallback(
    (key: SearchableAttributes) => {
      setKeys((prevSet) => {
        const newSet = new Set(prevSet);
        if (newSet.has(key)) {
          newSet.delete(key);
        } else {
          newSet.add(key);
        }
        return newSet;
      });
    },
    [setKeys]
  );

  return (
    <div style={{ justifyContent: "end", display: "flex" }}>
      <SearchChip
        label="Name"
        keys={keys}
        removeOrAddKey={removeOrAddKey}
        property="name"
        sx={{ boxSizing: "border-box", width: 60 }}
      />
      <SearchChip
        label="Description"
        keys={keys}
        removeOrAddKey={removeOrAddKey}
        property="description"
        sx={{ ml: 1, boxSizing: "border-box", width: 90 }}
      />
      <SearchChip
        label="Ingredients"
        keys={keys}
        removeOrAddKey={removeOrAddKey}
        property="ingredients"
        sx={{ ml: 1, boxSizing: "border-box", width: 90 }}
      />
    </div>
  );
});

export interface ISearchChipProps extends ChipProps {
  label: string;
  property: SearchableAttributes;
  removeOrAddKey: (key: SearchableAttributes) => void;
  keys: Set<SearchableAttributes>;
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
