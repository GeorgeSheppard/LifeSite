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
  /**
   * e.g. Sauce, Toppings, Optional
   */
  title?: string;
  ingredients: IIngredient[];
  /**
   * Whether this recipe can be stored long term, e.g. frozen or
   * placed in pantry
   * Default is false if it doesn't exist
   */
  storeable?: boolean;
}

export interface IMethodStep {
  instruction: string;
}

export type RecipeUuid = string;

export interface IDisplayRecipe {
  uuid: RecipeUuid;
  /**
   * Recipes can be composed of multiple parts, e.g. the sauce for a dish
   * It is useful to seperate so that if something is batched cooked we can
   * specify which aspect we need to get from the shop
   */
  recipeAspects: IRecipe[];
  images?: Image[];
  method?: IMethodStep[];
}

export const exampleDisplayRecipe: IDisplayRecipe = {
  uuid: "12345",
  recipeAspects: [
    {
      title: "Sauce",
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
      title: "Main Dish",
      ingredients: [
        {
          name: "Noodles",
          quantity: new Quantity(Unit.GRAM, 200),
        },
        {
          name: "Spring Onion",
        },
      ],
    },
  ],
  images: [
    { timestamp: 1, path: "photo_of_dish.png" },
    { timestamp: 2, path: "photo_of_sauce.png" },
  ],
  method: [{ instruction: "Cook the dish" }, { instruction: "Enjoy" }],
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
