import clone from "just-clone";
import { Migrator } from "../../migration/migrator";
import { IFullStoreState, MutateFunc } from "../../store";
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

export const addModel: MutateFunc<IModelProps> = (
  store: IFullStoreState,
  payload: IModelProps
) => {
  const uuid = payload.uuid;
  const state = store.printing;
  const existsAlready = uuid in state.models;
  state.models[uuid] = payload;
  if (!existsAlready) {
    state.cards.unshift(payload.uuid);
  }
  return store;
};

export const deleteModel: MutateFunc<ModelUuid> = (
  store: IFullStoreState,
  payload: ModelUuid
) => {
  const uuid = payload;
  const state = store.printing;
  delete state.models[uuid];
  state.cards = state.cards.filter((cardUuid) => cardUuid !== uuid);
  return store;
};

export const migratePrinting = (store: IFullStoreState): IFullStoreState => {
  if (!store.printing) {
    store.printing = clone(printingEmptyState);
  }
  if (migrator.needsMigrating(store.printing.version)) {
    store.printing = migrator.migrate(store.printing);
  }
  if (!isPrintingValid(store.printing)) {
    throw new Error("Printing is invalid: " + JSON.stringify(store.printing));
  }
  return store;
};
