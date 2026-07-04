import { IRecipe, IRecipeComponent, Unit } from "../../core/types/recipes";
import type { Recipe, RecipePart, Ingredient } from "../recipe-data";

function unitToString(unit: Unit): string | undefined {
  switch (unit) {
    case Unit.NO_UNIT:
      return undefined;
    case Unit.NUMBER:
      return undefined;
    case Unit.MILLILITER:
      return "mL";
    case Unit.LITER:
      return "L";
    case Unit.GRAM:
      return "g";
    case Unit.KILOGRAM:
      return "kg";
    case Unit.CUP:
      return "cup";
    case Unit.TEASPOON:
      return "tsp";
    case Unit.TABLESPOON:
      return "tbsp";
    default:
      return unit;
  }
}

function componentToRecipePart(
  component: IRecipeComponent,
  scaleFactor: number
): RecipePart {
  return {
    title: component.name || "Main",
    ingredients: component.ingredients.map((ing): Ingredient => {
      const rawValue = ing.quantity.value;
      const amount =
        rawValue !== undefined
          ? parseFloat((rawValue * scaleFactor).toFixed(2)).toString()
          : "";
      const unit = unitToString(ing.quantity.unit);
      return {
        name: ing.name,
        amount,
        ...(unit ? { unit } : {}),
      };
    }),
    instructions: component.instructions.map((inst) => inst.text),
  };
}

export function iRecipeToRecipe(
  iRecipe: IRecipe,
  imageUrl?: string,
  servingsOverride?: number
): Recipe {
  const baseServings = iRecipe.components[0]?.servings;
  const servings = baseServings ? servingsOverride ?? baseServings : undefined;
  const scaleFactor = baseServings && servings ? servings / baseServings : 1;
  const servingsStr = servings
    ? `${servings} serving${servings === 1 ? "" : "s"}`
    : "";

  return {
    title: iRecipe.name || "Untitled Recipe",
    description: iRecipe.description || "",
    image: imageUrl || "/placeholder.svg",
    prepTime: "",
    cookTime: "",
    totalTime: "",
    servings: servingsStr,
    baseServings,
    tags: [],
    parts: iRecipe.components.map((component) =>
      componentToRecipePart(component, scaleFactor)
    ),
  };
}
