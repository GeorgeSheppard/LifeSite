import { v4 as uuidv4 } from "uuid";
import type { IRecipe } from "@/core/types/recipes";
import type { ChatRecipe } from "@/core/chef/types";

/**
 * Adapts a recipe Chef found (not yet saved, so it has no uuid) into the
 * app's IRecipe shape so it can be rendered with the existing RecipeCard.
 */
export function chatRecipeToIRecipe(chatRecipe: ChatRecipe): IRecipe {
  return {
    uuid: uuidv4(),
    name: chatRecipe.name,
    description: chatRecipe.description,
    images: [],
    components: chatRecipe.components.map((component) => ({
      ...component,
      uuid: uuidv4(),
    })),
  };
}
