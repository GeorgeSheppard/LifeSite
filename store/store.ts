import { configureStore } from "@reduxjs/toolkit";
import printing, { IPrintingState } from "./reducers/printing";
import user, { IUserState } from "./reducers/user";
import plants, { IPlantsState } from "./reducers/plants";

export interface IFullStoreState {
  user: IUserState;
  printing: IPrintingState;
  plants: IPlantsState;
}

// TODO: Write some checks to make sure defaultProfile and any profiles conform
// to the state schema, already had a hard to find bug from forgetting about this
// possibly make it a pre commit hook
export const store = configureStore({
  reducer: {
    printing,
    user,
    plants,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
