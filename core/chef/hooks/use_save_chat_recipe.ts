import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "@/src/lib/axios";
import { getRecipesQueryKey } from "@/client/hooks";
import type { IRecipe } from "@/core/types/recipes";

interface SaveRecipeResponse {
  uuid: string;
  success: boolean;
}

/**
 * Saves a recipe Chef found (or one it hasn't seen before) to the user's collection.
 * Hand-written (not Orval-generated) until the backend's OpenAPI spec is
 * redeployed and `yarn generate:api` is re-run — swap to a generated hook then.
 */
export const useSaveChatRecipe = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (recipe: IRecipe) =>
      axiosInstance<SaveRecipeResponse>({
        url: "/mise/recipes",
        method: "POST",
        data: {
          name: recipe.name,
          description: recipe.description,
          components: recipe.components,
        },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries(getRecipesQueryKey());
    },
  });
};
