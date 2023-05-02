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

export const useRecipeSearch = (
  searchInput: string,
  keys: Set<SearchableAttributes>
): RecipeUuid[] => {
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
    () => Array.from(new Set(searchableRecipes.map((recipe) => recipe.uuid))),
    [searchableRecipes]
  );

  const searchResults = useMemo(() => {
    if (searchInput.length === 0) {
      return defaultSearchResults;
    }

    const results = search(searchInput);
    return Array.from(new Set(results.map((result) => result.item.uuid)));
  }, [search, searchInput, defaultSearchResults]);

  return searchResults;
};
