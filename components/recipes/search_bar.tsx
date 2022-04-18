import { useMemo, useState, useCallback, ChangeEvent } from "react";
import { useAppSelector } from "../../store/hooks/hooks";
import { RecipeUuid } from "../../store/reducers/food/recipes";
import { useQuerySearch } from "./search";

export const useRecipeSearch = (keys: Set<string>): {
  searchResults: RecipeUuid[];
  setSearchInput: (event: ChangeEvent<HTMLInputElement>) => void;
  searchInput: string;
} => {
  const recipes = useAppSelector((store) => store.food.recipes);
  const searchableRecipes = useMemo(() => {
    // Note: Fuse.js had trouble searching the nested structure for ingredients
    // so I flatten out the recipes here
    return Object.values(recipes).map((recipe) => ({
      uuid: recipe.uuid,
      name: recipe.name,
      description: recipe.description,
      ingredients: recipe.components.flatMap((component) =>
        component.ingredients.map((ingredient) => ingredient.name)
      ),
    }));
  }, [recipes]);
  const options = useMemo(() => ({
    keys: Array.from(keys),
  }), [keys])
  const { search } = useQuerySearch(searchableRecipes, options);
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
