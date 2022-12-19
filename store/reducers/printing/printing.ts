import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Migrator } from "../../migration/migrator";
import { IFullStoreState } from "../../store";
import defaultProduction from "./defaultProduction.json";
import { latestVersion, migrations } from "./migrations";
import { isPrintingValid } from "./schema";
import { IPrintingState, IModelProps, ModelUuid } from "./types";

export const printingEmptyState: IPrintingState = {
  version: latestVersion,
  cards: [],
  models: {},
};

const migrator = new Migrator<IPrintingState>(
  migrations,
  latestVersion,
  isPrintingValid
);

export const productionDefault: IPrintingState = {
  ...defaultProduction,
  version: latestVersion,
} as IPrintingState;

export const printingInitialState: IPrintingState =
  process.env.NODE_ENV === "development"
    ? printingEmptyState
    : productionDefault;

export const printingSlice = createSlice({
  name: "printing",
  initialState: printingInitialState,
  reducers: {
    addModel: (state, action: PayloadAction<IModelProps>) => {
      const uuid = action.payload.uuid;
      const existsAlready = uuid in state.models;
      state.models[uuid] = action.payload;
      if (!existsAlready) {
        state.cards.unshift(action.payload.uuid);
      }
    },
    deleteModel: (state, action: PayloadAction<ModelUuid>) => {
      const uuid = action.payload;
      delete state.models[uuid];
      state.cards = state.cards.filter((cardUuid) => cardUuid !== uuid);
    },
  },
  extraReducers: {
    "user/login": (state, action: PayloadAction<IFullStoreState>) => {
      if (!action.payload.printing) {
        return state;
      }

      if (migrator.needsMigrating(action.payload.printing?.version)) {
        try {
          return migrator.migrate(action.payload.printing);
        } catch (err) {
          console.log("An error occurrence migrating printing: " + err);
          return state;
        }
      } else {
        if (!isPrintingValid(action.payload.printing)) {
          console.error(
            "Printing is invalid: " + JSON.stringify(action.payload.printing)
          );
          return state;
        }
      }

      return action.payload.printing;
    },
    "user/logout": (state) => {
      return printingInitialState;
    },
  },
});

export const { addModel, deleteModel } = printingSlice.actions;

export default printingSlice.reducer;
