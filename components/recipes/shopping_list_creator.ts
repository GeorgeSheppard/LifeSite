import { IDailyMealPlan } from "../../store/reducers/food/meal_plan/types";
import {
  IIngredientName,
  IQuantity,
  IRecipe,
  RecipeUuid,
} from "../../store/reducers/food/recipes/types";

export function createShoppingList(
  recipes: { [key: RecipeUuid]: IRecipe },
  mealPlan: IDailyMealPlan[]
) {
  const ingredients: { [key: IIngredientName]: Set<IQuantity> } = {};

  // mealPlan.forEach((day) => {
  //   day.forEach((meal) => {
  //     const { uuid, servings } = meal;

  //     const recipe = recipes[uuid];
  //     if (!recipe) {
  //       console.error(`Could not find recipe with id: ${uuid}`);
  //       return;
  //     }

  //     recipe.components.forEach((component) => {
  //       component.servings;
  //     });
  //   });
  // });

  return "here is a recipe";
}
