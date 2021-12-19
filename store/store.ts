import { configureStore } from "@reduxjs/toolkit";
import printing from "./reducers/printing";
import user from "./reducers/user";

export const store = configureStore({
  reducer: {
    printing,
    user,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
