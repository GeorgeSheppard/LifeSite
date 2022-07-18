import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import IRecipesState, { IRecipe, RecipeUuid } from "./types";
import defaultProfileProduction from "./defaultProduction.json";
import { Migrator } from "../../../migration/migrator";
import { latestVersion, migrations } from "./migrations";
import validate from "./types.validator";
import { IFullStoreState } from "../../../store";

export const foodEmptyState = {
  version: latestVersion,
  cards: [],
  recipes: {},
  ingredients: {},
};

const migrator = new Migrator<IRecipesState>(
  migrations,
  latestVersion,
  validate
);

const initialState: IRecipesState =
  process.env.NODE_ENV === "development"
    ? foodEmptyState
    : ({
        version: latestVersion,
        ...defaultProfileProduction,
      } as IRecipesState);

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
      }

      return action.payload.food;
    },
    "user/logout": (state) => {
      return initialState;
    },
  },
});

export const { addOrUpdateRecipe, deleteRecipe } = foodSlice.actions;

export default foodSlice.reducer;
