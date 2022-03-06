import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Image } from "../types";
import { Quantity, Unit } from "./units";
import { IFullStoreState } from "../../store";

export type IIngredientName = string;

export interface IIngredient {
  name: IIngredientName;
  quantity?: Quantity;
}

export interface IRecipe {
  ingredients: IIngredient[];
  /**
   * Whether this recipe can be stored long term, e.g. frozen or
   * placed in pantry
   * Default is false if it doesn't exist
   */
  storeable?: boolean;
}

export interface IMethodStage {
  /**
   * If the recipe is split into multiple parts, e.g. sauce, main then
   * the method can be split as well
   */
  name?: string;
  instructions: string[];
  recipe: IRecipe;
}

export type RecipeUuid = string;

export interface IDisplayRecipe {
  uuid: RecipeUuid;
  name: string;
  description: string;
  images?: Image[];
  method?: IMethodStage[];
}

export const exampleDisplayRecipe: IDisplayRecipe = {
  uuid: "12345",
  name: "Pho",
  description:
    "Vietnamese dish, broth and noodles with some meat and vegetables.",
  images: [
    { timestamp: 1, path: "photo_of_dish.png" },
    { timestamp: 2, path: "photo_of_sauce.png" },
  ],
  method: [
    {
      name: "Sauce",
      instructions: [
        "Heat spices",
        "Char onion and ginger",
        "Add beef broth",
        "Simmer",
      ],
      recipe: {
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
    },
    {
      name: "Main Dish",
      instructions: ["Enjoy"],
      recipe: {
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
    },
    {
      instructions: ["More instructions"],
      recipe: {
        ingredients: [],
      },
    },
  ],
};

export interface IRecipesState {
  cards: RecipeUuid[];
  recipes: { [key: RecipeUuid]: IDisplayRecipe };
}

const initialState: IRecipesState = {
  cards: [exampleDisplayRecipe.uuid],
  recipes: { [exampleDisplayRecipe.uuid]: exampleDisplayRecipe },
};

export const foodSlice = createSlice({
  name: "food",
  initialState,
  reducers: {
    addOrUpdateRecipe: (state, action: PayloadAction<IDisplayRecipe>) => {
      const recipe = action.payload;
      const { uuid } = recipe;
      const existsAlready = uuid in state.recipes;
      state.recipes[uuid] = recipe;
      if (!existsAlready) {
        state.cards.unshift(uuid);
      }
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

export const { addOrUpdateRecipe } = foodSlice.actions;

export default foodSlice.reducer;
