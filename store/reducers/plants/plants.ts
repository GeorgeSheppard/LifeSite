import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Migrator } from "../../migration/migrator";
import { IFullStoreState } from "../../store";
import defaultProduction from "./defaultProduction.json"
import { latestVersion, migrations } from "./migrations";
import IPlantsState, { IPlant, PlantUuid } from "./types";
import validate from "./types.d.validator";

export const plantsEmptyState: IPlantsState = {
  version: latestVersion,
  cards: [],
  plants: {},
};

const migrator = new Migrator<IPlantsState>(
  migrations,
  latestVersion,
  validate
);


const initialState: IPlantsState =
  process.env.NODE_ENV === "development"
    ? plantsEmptyState
    // TODO: For some reason, the correct enum string in the json for lightLevelKeys
    // is not assignable to LightLevelKeys, but the unit in recipes is...
    : { version: latestVersion, ...defaultProduction } as IPlantsState;

export const plantsSlice = createSlice({
  name: "plants",
  initialState,
  reducers: {
    addOrUpdatePlant: (state, action: PayloadAction<IPlant>) => {
      const plant = action.payload;
      const { uuid } = plant;
      const existsAlready = uuid in state.plants;
      state.plants[uuid] = plant;
      if (!existsAlready) {
        state.cards.unshift(uuid);
      }
    },
    deletePlant: (state, action: PayloadAction<PlantUuid>) => {
      const uuid = action.payload;
      if (uuid in state.plants) {
        delete state.plants[uuid];
        state.cards = state.cards.filter((cardUuid) => cardUuid !== uuid);
      }
    },
  },
  extraReducers: {
    "user/login": (state, action: PayloadAction<IFullStoreState>) => {
      if (!action.payload.plants) {
        return state;
      }

      if (migrator.needsMigrating(action.payload.plants?.version)) {
        try {
          return migrator.migrate(action.payload.plants);
        } catch (err) {
          console.log("An error occurrence migrating plants: " + err);
          return state;
        }
      }

      return action.payload.plants;
    },
    "user/logout": (state) => {
      return initialState;
    },
  },
});

export const { addOrUpdatePlant, deletePlant } = plantsSlice.actions;

export default plantsSlice.reducer;
