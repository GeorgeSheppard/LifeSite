import Ajv, { JSONSchemaType } from "ajv";
import { imageSchema } from "../../schema";
import {
  IIngredient,
  IInstruction,
  IRecipeIngredient,
  Unit,
  IRecipeComponent,
  IRecipe,
  IIngredientsDatabase,
  IRecipesState,
} from "./types";

const ingredientSchema: JSONSchemaType<IIngredient> = {
  type: "object",
  properties: {
    name: { type: "string" },
    nutritionData: { type: "object", nullable: true },
  },
  required: ["name"],
};

const instructionSchema: JSONSchemaType<IInstruction> = {
  type: "object",
  properties: {
    text: { type: "string" },
    optional: { type: "boolean", nullable: true },
  },
  required: ["text"],
};

const unitSchema: JSONSchemaType<Unit> = {
  type: "string",
  enum: ["mL", "none", "L", "g", "kg", "cup", "tsp", "tbsp", "quantity"],
  nullable: true,
};

const recipeIngredientSchema: JSONSchemaType<IRecipeIngredient> = {
  type: "object",
  properties: {
    name: { type: "string" },
    quantity: {
      type: "object",
      properties: {
        unit: unitSchema,
        value: {
          type: "number",
          nullable: true,
        },
      },
      required: ["unit"],
    },
  },
  required: ["name", "quantity"],
};

const recipeComponentSchema: JSONSchemaType<IRecipeComponent> = {
  type: "object",
  properties: {
    name: { type: "string" },
    uuid: { type: "string" },
    ingredients: {
      type: "array",
      items: recipeIngredientSchema,
    },
    instructions: {
      type: "array",
      items: instructionSchema,
    },
    storeable: { type: "boolean", nullable: true },
    servings: { type: "number", nullable: true },
  },
  required: ["name", "ingredients", "instructions"],
};

const recipeSchema: JSONSchemaType<IRecipe> = {
  type: "object",
  properties: {
    uuid: { type: "string" },
    name: { type: "string" },
    description: { type: "string" },
    images: {
      type: "array",
      items: imageSchema,
    },
    components: { type: "array", items: recipeComponentSchema },
  },
  required: ["uuid", "name", "description", "images", "components"],
};

const ingredientsDatabaseSchema: JSONSchemaType<IIngredientsDatabase> = {
  type: "object",
  patternProperties: {
    ".*": ingredientSchema,
  },
  required: [],
};

const recipesStateSchema: JSONSchemaType<IRecipesState> = {
  type: "object",
  properties: {
    version: { type: "string" },
    cards: { type: "array", items: { type: "string" } },
    recipes: {
      type: "object",
      patternProperties: {
        ".*": recipeSchema,
      },
      required: [],
    },
    ingredients: ingredientsDatabaseSchema,
  },
  required: ["version", "cards", "recipes", "ingredients"],
};

const ajv = new Ajv();
export const isRecipesValid = ajv.compile(recipesStateSchema);
export const isRecipeValid = ajv.compile(recipeSchema);
