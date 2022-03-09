import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Image } from "../types";
import { Quantity, Unit } from "./units";
import { IFullStoreState } from "../../store";

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

export interface IRecipeComponent {
  name: string;
  ingredients: { name: IIngredientName; quantity: Quantity }[];
  instructions: IInstruction[];
  storeable?: boolean;
}

export interface IRecipe {
  uuid: RecipeUuid;
  name: string;
  description: string;
  images?: Image[];
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
  images: [
    { timestamp: 1, path: "photo_of_dish.png" },
    { timestamp: 2, path: "photo_of_sauce.png" },
  ],
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
          quantity: new Quantity(Unit.NUMBER, 3),
        },
        {
          name: "Beef Broth",
          quantity: new Quantity(Unit.MILLILITER, 800),
        },
      ],
      storeable: true,
    },
    {
      name: "Main Dish",
      instructions: [{ text: "Enjoy" }],
      ingredients: [
        {
          name: "Noodles",
          quantity: new Quantity(Unit.GRAM, 200),
        },
        {
          name: "Spring Onion",
          quantity: new Quantity(Unit.NO_UNIT),
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
  components: [
    {
      name: "Everything",
      ingredients: [{ name: "Beef", quantity: new Quantity(Unit.GRAM, 300) }],
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
      return action.payload.recipes ?? initialState;
    },
    "user/logout": (state) => {
      return initialState;
    },
  },
});

export const { addOrUpdateRecipe, deleteRecipe } = foodSlice.actions;

export default foodSlice.reducer;
