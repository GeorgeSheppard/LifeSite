import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Migrator } from "../../migration/migrator";
import { IFullStoreState } from "../../store";
import defaultProduction from "./defaultProduction.json";
import { latestVersion, migrations } from "./migrations";
import IPrintingState, { IModelProps, ModelUUID } from "./types";
// import validate from "./types.validator";

export const printingEmptyState: IPrintingState = {
  version: latestVersion,
  cards: [],
  models: {},
};

const migrator = new Migrator<IPrintingState>(
  migrations,
  latestVersion,
  validate
);

const initialState: IPrintingState =
  process.env.NODE_ENV === "development"
    ? printingEmptyState
    : ({ version: latestVersion, ...defaultProduction } as IPrintingState);

export const printingSlice = createSlice({
  name: "printing",
  initialState,
  reducers: {
    addModel: (state, action: PayloadAction<IModelProps>) => {
      const uuid = action.payload.uuid;
      const existsAlready = uuid in state.models;
      state.models[uuid] = action.payload;
      if (!existsAlready) {
        state.cards.unshift(action.payload.uuid);
      }
    },
    deleteModel: (state, action: PayloadAction<ModelUUID>) => {
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
      }

      return action.payload.printing;
    },
    "user/logout": (state) => {
      return initialState;
    },
  },
});

export const { addModel, deleteModel } = printingSlice.actions;

export default printingSlice.reducer;
