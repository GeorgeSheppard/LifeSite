import { useMemo, useState, useCallback, ChangeEvent } from "react";
import {
  IIngredientName,
  RecipeUuid,
} from "../../../../store/reducers/food/recipes/types";
import { useRecipes } from "../../../hooks/use_data";
import { useDebounce } from "../../../hooks/use_debounce";
import { useSearch } from "../../../hooks/use_search";

export interface SearchableRecipe {
  uuid: RecipeUuid;
  name: string;
  description: string;
  ingredients: IIngredientName[];
}

export interface IRecipeSearcher {
  searchResults: { uuid: RecipeUuid; visible: boolean }[];
  setSearchInput: (event: ChangeEvent<HTMLInputElement>) => void;
  searchInput: string;
}

export const useRecipeSearch = (
  keys: Set<string>
): IRecipeSearcher => {
  const recipes = useRecipes().data;
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
  const options = useMemo(
    () => ({
      keys: Array.from(keys),
    }),
    [keys]
  );
  const search = useSearch<SearchableRecipe>(searchableRecipes, options);
  const [searchInput, setSearchInput] = useState("");
  const defaultSearchResults = useMemo(
    () =>
      new Set(
        Object.values(recipes)
          .sort((recipeA, recipeB) => {
            return recipeB.images.length - recipeA.images.length;
          })
          .map((recipe) => recipe.uuid)
      ),
    [recipes]
  );

  const getSearchResults = useCallback(() => {
    if (searchInput.length === 0) {
      return defaultSearchResults;
    }

    const results = search(searchInput);
    return new Set(results.map((result) => result.item.uuid));
  }, [search, searchInput, defaultSearchResults]);

  const searchResults = useDebounce(
    defaultSearchResults,
    getSearchResults,
    300
  );

  const setSearchInputCallback = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setSearchInput(event.target.value);
    },
    [setSearchInput]
  );

  const uuidsWithVisibility = useMemo(() => {
    const visibleRecipes = Array.from(searchResults).map((result) => ({
      uuid: result,
      visible: true,
    }));
    const invisibleRecipes = Object.keys(recipes)
      .filter((uuid) => !searchResults.has(uuid))
      .map((result) => ({ uuid: result, visible: false }));
    return [...visibleRecipes, ...invisibleRecipes];
  }, [searchResults, recipes]);

  return {
    searchResults: uuidsWithVisibility,
    searchInput,
    setSearchInput: setSearchInputCallback,
  };
};
