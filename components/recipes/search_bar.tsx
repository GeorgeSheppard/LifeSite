import { useMemo, useState, useCallback, ChangeEvent } from "react";
import { useAppSelector } from "../../store/hooks/hooks";
import { RecipeUuid } from "../../store/reducers/food/recipes";
import { useQuerySearch } from "./search";

export const useRecipeSearch = (): {
  searchResults: RecipeUuid[];
  setSearchInput: (event: ChangeEvent<HTMLInputElement>) => void;
  searchInput: string;
} => {
  const recipes = useAppSelector((store) => store.food.recipes);
  const { search } = useQuerySearch(recipes);
  const [searchInput, setSearchInput] = useState("");

  const searchResults = useMemo(() => {
    if (searchInput.length === 0) {
      return Object.keys(recipes);
    }

    const results = search(searchInput);
    return results.map((result) => result.item.uuid);
  }, [search, searchInput, recipes]);

  const setSearchInputCallback = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setSearchInput(event.target.value);
    },
    [setSearchInput]
  );

  return { searchResults, searchInput, setSearchInput: setSearchInputCallback };
};
