import { Image } from "../../types";

export type RecipeUuid = string;
export type ComponentUuid = string;
export type IngredientUuid = string;
export type IIngredientName = string;

export interface INutritionData {}

export interface IIngredient {
  /**
   * Name acts as uuid
   */
  name: IIngredientName;
  nutritionData?: INutritionData;
}

export interface IInstruction {
  text: string;
  /**
   * Assumed false
   */
  optional?: boolean;
}

export interface IQuantity {
  unit: Unit;
  value?: number;
}

export interface IRecipeIngredient {
  name: IIngredientName;
  quantity: IQuantity;
}

export interface IRecipeComponent {
  name: string;
  uuid: ComponentUuid;
  ingredients: IRecipeIngredient[];
  instructions: IInstruction[];
  storeable?: boolean;
  servings?: number;
}

export interface IRecipe {
  uuid: RecipeUuid;
  name: string;
  description: string;
  images: Image[];
  components: IRecipeComponent[];
}

export type IIngredientsDatabase = {
  [index: IIngredientName]: IIngredient;
};

export enum Unit {
  NO_UNIT = "none",
  MILLILITER = "mL",
  LITER = "L",
  GRAM = "g",
  KILOGRAM = "kg",
  CUP = "cup",
  TEASPOON = "tsp",
  TABLESPOON = "tbsp",
  NUMBER = "quantity",
}

export interface IRecipesState {
  cards: RecipeUuid[];
  recipes: { [key: RecipeUuid]: IRecipe };
  ingredients: IIngredientsDatabase;
}
