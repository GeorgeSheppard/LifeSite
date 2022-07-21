import { createShoppingList } from "../../components/recipes/shopping_list_creator";
import { IDailyMealPlan } from "../../store/reducers/food/meal_plan/types";
import { IRecipe, RecipeUuid } from "../../store/reducers/food/recipes/types";

const recipes: { [key: RecipeUuid]: IRecipe } = {
  "1": {
    uuid: "1",
    name: "Recipe 1",
    description: "",
    images: [],
    components: [],
  },
};

const mealPlan: IDailyMealPlan = {};

test("", () => {});
