export const RecipeUploaderPrompt = `
I am going to paste some recipe instructions, I would like you to extract the recipe information and paste it in JSON in a way that satisfies these TypeScript interfaces.

The TypeScript interfaces are the following:
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

Just to clarify, a 'component' is a separable part of a recipe, for instance if you are making a Victoria Sponge then the cake would be a component, and the icing would be another.
`