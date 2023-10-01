import { z } from "zod";
import {
  IInstruction,
  IQuantity,
  IRecipe,
  IRecipeComponent,
  IRecipeIngredient,
  Unit,
} from "../../../../core/types/recipes";
import { Image } from "../../../../core/types/general";

const imageValidator: z.ZodType<Image> = z.object({
  timestamp: z.number(),
  key: z.string(),
});
const quantityValidator: z.ZodType<IQuantity> = z.object({
  unit: z.nativeEnum(Unit),
  value: z.number().optional(),
});
const ingredientValidator: z.ZodType<IRecipeIngredient> = z.object({
  name: z.string(),
  quantity: quantityValidator,
});
const instructionValidator: z.ZodType<IInstruction> = z.object({
  text: z.string(),
  optional: z.boolean().optional(),
});

const componentValidator: z.ZodType<IRecipeComponent> = z.object({
  name: z.string(),
  uuid: z.string(),
  ingredients: ingredientValidator.array(),
  instructions: instructionValidator.array(),
  storeable: z.boolean().optional(),
  servings: z.number().optional()
});

export const recipeValidator: z.ZodType<IRecipe> = z.object({
  uuid: z.string(),
  name: z.string(),
  description: z.string(),
  images: imageValidator.array(),
  components: componentValidator.array()
})
