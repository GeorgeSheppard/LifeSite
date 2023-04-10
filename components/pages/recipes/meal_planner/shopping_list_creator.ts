import { Quantities } from "../../../../store/reducers/food/units";
import {
  DateString,
  IDailyMealPlan,
} from "../../../../store/reducers/food/meal_plan/types";
import {
  IIngredientName,
  IQuantity,
  IRecipe,
  Unit,
} from "../../../../store/reducers/food/recipes/types";

export interface IQuantitiesAndMeals {
  [index: IIngredientName]: {
    meals: Set<string>;
    quantities: IQuantity[];
  };
}

export function createShoppingListData(
  recipes: IRecipe[],
  mealPlan: { [index: DateString]: IDailyMealPlan },
  selectedDays: Set<DateString>
): IQuantitiesAndMeals {
  const quantityAndMeals: IQuantitiesAndMeals = {};

  for (const date of Object.keys(mealPlan)) {
    if (!selectedDays.has(date)) {
      continue;
    }

    const dayMealPlan = mealPlan[date];
    for (const [recipeId, components] of Object.entries(dayMealPlan)) {
      const recipe = recipes.find(rec => rec.uuid === recipeId);
      if (!recipe) {
        continue;
      }

      for (const component of components) {
        if (component.servings === 0) {
          continue;
        }

        const recipeComponent = recipe.components.find(
          (comp) => comp.uuid === component.componentId
        );
        if (!recipeComponent) {
          continue;
        }

        const { servings = 1 } = recipeComponent;
        recipeComponent.ingredients.forEach((recipeIngredient) => {
          const { name, quantity } = recipeIngredient;

          if (!(name in quantityAndMeals)) {
            quantityAndMeals[name] = {
              meals: new Set<string>(),
              quantities: [],
            };
          }

          const ratio = component.servings / servings;

          quantityAndMeals[name].meals.add(recipe.name);
          const currentQuantities = quantityAndMeals[name].quantities;

          const quantityIndex = currentQuantities.findIndex(
            (quant) => quant.unit === quantity.unit
          );
          const value = (quantity.value ?? 0) * ratio;
          if (quantityIndex > -1) {
            if (quantity.unit !== Unit.NO_UNIT) {
              currentQuantities[quantityIndex] = {
                unit: quantity.unit,
                value: (currentQuantities[quantityIndex].value ?? 0) + value,
              };
            }
          } else {
            currentQuantities.push({
              unit: quantity.unit,
              value,
            });
          }
        });
      }
    }
  }
  return quantityAndMeals;
}

export function createShoppingList(
  quantityAndMeals: IQuantitiesAndMeals,
  options: {
    includeMeals: boolean;
  }
): string {
  return Object.entries(quantityAndMeals)
    .map(([ingredient, { meals, quantities }]) => {
      const quantityString = quantities.map((quantity) => {
        // We display extra for when there is no unit
        return Quantities.toString(quantity) ?? "extra";
      });

      let text = `${ingredient} (${quantityString.join(" + ")})`;
      if (options.includeMeals) {
        text += ` [${Array.from(meals).join(", ")}]`;
      }
      return text;
    })
    .join("\n");
}
