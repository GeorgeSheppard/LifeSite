import { initialVersion } from "../../../migration/migrator";
import { IMigration } from "../../../migration/types";
import { v4 as uuidv4 } from "uuid";

export const migrations: IMigration[] = [
  {
    toVersion: initialVersion,
    migration: (state) => state,
  },
  {
    toVersion: "0.0.2",
    description:
      "Added ComponentUuid to IRecipeComponent to allow user to specify quantity of each component " +
      "in the meal plan",
    migration: (state) => {
      for (const recipeId of state.cards) {
        state.recipes[recipeId].components.forEach((component: any) => {
          component.uuid = uuidv4();
        });
      }
      return state;
    },
  },
];

export const latestVersion = migrations[migrations.length - 1].toVersion;
