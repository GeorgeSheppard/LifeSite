import { IVersion } from "../../migration/types";

export type RecipeUuid = string;
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

export interface IRecipeIngredient {
  name: IIngredientName;
  quantity: IQuantity;
}

export interface IRecipeComponent {
  name: string;
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

// Do not change the name or from type -> interface, part of CI validation process
export type IRecipesState = {
  version: IVersion;
  cards: RecipeUuid[];
  recipes: { [key: RecipeUuid]: IRecipe };
  ingredients: IIngredientsDatabase;
};

export interface IQuantity {
  unit?: Unit;
  value?: number;
}
