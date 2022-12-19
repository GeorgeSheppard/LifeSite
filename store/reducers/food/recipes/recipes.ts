import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IRecipesState, IRecipe, RecipeUuid } from "./types";
import defaultProfileProduction from "./defaultProduction.json";
import defaultProfileDevelopment from "./defaultDevelopment.json";
import { Migrator } from "../../../migration/migrator";
import { latestVersion, migrations } from "./migrations";
import { IFullStoreState, MutateFunc } from "../../../store";
import { isRecipesValid } from "./schema";

export const recipesEmptyState = {
  version: latestVersion,
  cards: [],
  recipes: {},
  ingredients: {},
};

const migrator = new Migrator<IRecipesState>(
  migrations,
  latestVersion,
  isRecipesValid
);

export const productionDefault = {
  ...defaultProfileProduction,
  version: latestVersion,
} as IRecipesState;
export const developmentDefault = {
  ...defaultProfileDevelopment,
  version: latestVersion,
} as IRecipesState;

export const recipesInitialState: IRecipesState =
  process.env.NODE_ENV === "development"
    ? developmentDefault
    : productionDefault;

export interface IAddOrUpdateRecipe {
  store: IFullStoreState;
  payload: IRecipe;
}

export const addOrUpdateRecipe: MutateFunc<IRecipe> = (
  store: IFullStoreState,
  payload: IRecipe
) => {
  const state = store.food;
  const recipe = payload;
  const { uuid } = recipe;
  const existsAlready = uuid in state.recipes;
  state.recipes[uuid] = recipe;
  if (!existsAlready) {
    state.cards.unshift(uuid);
  }
  return store;
};

export const foodSlice = createSlice({
  name: "food",
  initialState: recipesInitialState,
  reducers: {
    deleteRecipe: (state, action: PayloadAction<RecipeUuid>) => {
      const uuid = action.payload;
      delete state.recipes[uuid];
      state.cards = state.cards.filter((cardUuid) => cardUuid !== uuid);
    },
  },
  extraReducers: {
    "user/login": (state, action: PayloadAction<IFullStoreState>) => {
      if (!action.payload.food) {
        return state;
      }

      if (migrator.needsMigrating(action.payload.food?.version)) {
        try {
          return migrator.migrate(action.payload.food);
        } catch (err) {
          console.log("An error occurrence migrating recipes: " + err);
          return state;
        }
      } else {
        if (!isRecipesValid(action.payload.food)) {
          console.error(
            "Recipes is invalid: " + JSON.stringify(action.payload.food)
          );
          return state;
        }
      }

      return action.payload.food;
    },
    "user/logout": (state) => {
      return recipesInitialState;
    },
  },
});

export const { deleteRecipe } = foodSlice.actions;

export default foodSlice.reducer;
