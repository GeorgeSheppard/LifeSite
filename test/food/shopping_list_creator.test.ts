import { createShoppingList } from "../../components/recipes/shopping_list_creator";
import { IDailyMealPlan } from "../../store/reducers/food/meal_plan";
import { IRecipe, RecipeUuid } from "../../store/reducers/food/recipes";

const recipes: {[key: RecipeUuid]: IRecipe} = {
  "1": {
    uuid: "1",
    name: "Recipe 1",
    description: "",
    images: [],
    components: []
  }
}

const mealPlan: IDailyMealPlan[] = [
  [
    {
      uuid: "1",
      servings: 1
    }
  ]
] 

test("create a shopping list", () => {
  expect(createShoppingList(recipes, mealPlan)).toBe(2);
})