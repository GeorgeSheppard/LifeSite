import { configureStore } from "@reduxjs/toolkit";
import printing from "./reducers/printing";
import user from "./reducers/user";

// TODO: Write some checks to make sure defaultProfile and any profiles conform
// to the state schema, already had a hard to find bug from forgetting about this
// possibly make it a pre commit hook
export const store = configureStore({
  reducer: {
    printing,
    user,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
