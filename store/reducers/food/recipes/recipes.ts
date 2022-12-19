import { IRecipesState, IRecipe, RecipeUuid } from "./types";
import defaultProfileProduction from "./defaultProduction.json";
import defaultProfileDevelopment from "./defaultDevelopment.json";
import { Migrator } from "../../../migration/migrator";
import { latestVersion, migrations } from "./migrations";
import { IFullStoreState, MutateFunc } from "../../../store";
import { isRecipesValid } from "./schema";
import clone from "just-clone";

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

export const deleteRecipe: MutateFunc<RecipeUuid> = (
  store: IFullStoreState,
  payload: RecipeUuid
) => {
  const uuid = payload;
  const state = store.food;
  delete state.recipes[uuid];
  state.cards = state.cards.filter((cardUuid) => cardUuid !== uuid);

  for (const mealPlan of Object.values(store.mealPlan.plan)) {
    if (uuid in mealPlan) {
      delete mealPlan[uuid];
    }
  }

  return store;
};

export const migrateRecipes = (store: IFullStoreState): IFullStoreState => {
  if (!store.food) {
    store.food = clone(recipesEmptyState);
  }
  if (migrator.needsMigrating(store.food.version)) {
    store.food = migrator.migrate(store.food);
  }
  if (!isRecipesValid(store.food)) {
    throw new Error("Recipes is invalid: " + JSON.stringify(store.food));
  }
  return store;
};
