import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Image } from "../types";
import { IQuantity, Unit } from "./units";
import { IFullStoreState } from "../../store";

export type RecipeUuid = string;
export type IngredientUuid = string;
export type IIngredientName = string;

export interface INutritionData { }

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

export const exampleDisplayRecipe: IRecipe = {
  uuid: "12345",
  name: "Pho",
  description:
    "Vietnamese dish, broth and noodles with some meat and vegetables.",
  images: [],
  components: [
    {
      name: "Sauce",
      instructions: [
        {
          text: "Heat spices",
        },
        {
          text: "Char onion and ginger",
        },
        {
          text: "Add beef broth",
        },
        {
          text: "Simmer",
        },
      ],
      ingredients: [
        {
          name: "Star Anise",
          quantity: {
            unit: Unit.NUMBER,
            value: 3,
          },
        },
        {
          name: "Beef Broth",
          quantity: {
            unit: Unit.MILLILITER,
            value: 800,
          },
        },
      ],
      storeable: true,
      servings: 3
    },
    {
      name: "Main Dish",
      instructions: [{ text: "Enjoy" }],
      ingredients: [
        {
          name: "Noodles",
          quantity: {
            value: 200,
            unit: Unit.GRAM,
          },
        },
        {
          name: "Spring Onion",
          quantity: {}
        },
      ],
    },
    {
      name: "Extra",
      instructions: [{ text: "More instructions", optional: true }],
      ingredients: [],
    },
  ],
};

export const secondExampleRecipe: IRecipe = {
  uuid: "11111",
  name: "Chilli",
  description: "Chilli",
  images: [],
  components: [
    {
      name: "Everything",
      ingredients: [
        { name: "Beef", quantity: { value: 300, unit: Unit.GRAM } },
      ],
      instructions: [
        {
          text: "Cook beef",
        },
      ],
    },
  ],
};

export interface IRecipesState {
  cards: RecipeUuid[];
  recipes: { [key: RecipeUuid]: IRecipe };
  ingredients: IIngredientsDatabase;
}

const initialState: IRecipesState = {
  cards: [exampleDisplayRecipe.uuid, secondExampleRecipe.uuid],
  recipes: {
    [exampleDisplayRecipe.uuid]: exampleDisplayRecipe,
    [secondExampleRecipe.uuid]: secondExampleRecipe,
  },
  ingredients: {},
};

export const foodSlice = createSlice({
  name: "food",
  initialState,
  reducers: {
    addOrUpdateRecipe: (state, action: PayloadAction<IRecipe>) => {
      const recipe = action.payload;
      const { uuid } = recipe;
      const existsAlready = uuid in state.recipes;
      state.recipes[uuid] = recipe;
      if (!existsAlready) {
        state.cards.unshift(uuid);
      }
    },
    deleteRecipe: (state, action: PayloadAction<RecipeUuid>) => {
      const uuid = action.payload;
      delete state.recipes[uuid];
      state.cards = state.cards.filter((cardUuid) => cardUuid !== uuid);
    },
  },
  extraReducers: {
    "user/login": (state, action: PayloadAction<IFullStoreState>) => {
      return action.payload.food ?? initialState;
    },
    "user/logout": (state) => {
      return initialState;
    },
  },
});

export const { addOrUpdateRecipe, deleteRecipe } = foodSlice.actions;

export default foodSlice.reducer;
