import { useMemo, useState, useCallback, ChangeEvent } from 'react';
import {
  IIngredientName,
  RecipeUuid,
} from "../../types/recipes";
import { useRecipes } from "../../dynamo/hooks/use_dynamo_get";
import { useSearch } from "../../hooks/use_search";
import { useDebounce } from "../../hooks/use_debounce";

export interface SearchableRecipe {
  uuid: RecipeUuid;
  name: string;
  description: string;
  ingredients: IIngredientName[];
}
export type SearchableAttributes = keyof Omit<SearchableRecipe, "uuid">

export interface IRecipeSearcher {
  searchResults: { uuid: RecipeUuid; visible: boolean }[];
  setSearchInput: (event: ChangeEvent<HTMLInputElement>) => void;
  searchInput: string;
}

export const useRecipeSearch = (keys: Set<SearchableAttributes>): IRecipeSearcher => {
  const { data: recipes } = useRecipes();
  const searchableRecipes = useMemo(() => {
    // Note: Fuse.js had trouble searching the nested structure for ingredients
    // so I flatten out the recipes here
    return (
      recipes?.sort((recipeA, recipeB) => recipeB.images.length - recipeA.images.length).map((recipe) => ({
        uuid: recipe.uuid,
        name: recipe.name,
        description: recipe.description,
        ingredients: recipe.components.flatMap((component) =>
          component.ingredients.map((ingredient) => ingredient.name)
        )
      })) ?? []
    );
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
        searchableRecipes
          .map((recipe) => recipe.uuid)
      ),
    [searchableRecipes]
  );

  const getSearchResults = useCallback(() => {
    if (searchInput.length === 0) {
      return defaultSearchResults;
    }

    const results = search(searchInput);
    return new Set(results.map((result) => result.item.uuid));
  }, [search, searchInput, defaultSearchResults]);

  const searchResults = useDebounce(
    getSearchResults,
    300
  );

  // Visible recipes need to be sorted first
  const uuidsWithVisibility = useMemo(() => {
    const visibleRecipes = Array.from(searchResults).map((result) => ({
      uuid: result,
      visible: true,
    }));
    const invisibleRecipes =
      recipes
        ?.filter(({ uuid }) => !searchResults.has(uuid))
        .map(({ uuid }) => ({ uuid, visible: false })) ?? [];
    return [...visibleRecipes, ...invisibleRecipes];
  }, [searchResults, recipes]);

  return {
    searchResults: uuidsWithVisibility,
    searchInput,
    setSearchInput: (event: ChangeEvent<HTMLInputElement>) => setSearchInput(event.target.value)
  };
};
