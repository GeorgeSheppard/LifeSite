import { useMemo } from "react";
import { IIngredientName, RecipeUuid } from "../../types/recipes";
import { useRecipes } from "../../dynamo/hooks/use_dynamo_get";
import { useSearch } from "../../hooks/use_search";

export interface SearchableRecipe {
  uuid: RecipeUuid;
  name: string;
  description: string;
  ingredients: IIngredientName[];
}
export type SearchableAttributes = keyof Omit<SearchableRecipe, "uuid">;

export interface SearchResult {
  uuid: RecipeUuid;
  visible: boolean;
}

export const useRecipeSearch = (
  searchInput: string,
  keys: Set<SearchableAttributes>
): SearchResult[] => {
  const { data: recipes } = useRecipes();
  const searchableRecipes = useMemo(() => {
    // Note: Fuse.js had trouble searching the nested structure for ingredients
    // so I flatten out the recipes here
    return (
      recipes
        ?.sort(
          (recipeA, recipeB) => recipeB.images.length - recipeA.images.length
        )
        .map((recipe) => ({
          uuid: recipe.uuid,
          name: recipe.name,
          description: recipe.description,
          ingredients: recipe.components.flatMap((component) =>
            component.ingredients.map((ingredient) => ingredient.name)
          ),
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
  const defaultSearchResults = useMemo(
    () => new Set(searchableRecipes.map((recipe) => recipe.uuid)),
    [searchableRecipes]
  );

  const searchResults = useMemo(() => {
    if (searchInput.length === 0) {
      return defaultSearchResults;
    }

    const results = search(searchInput);
    return new Set(results.map((result) => result.item.uuid));
  }, [search, searchInput, defaultSearchResults]);

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

  return uuidsWithVisibility;
};
