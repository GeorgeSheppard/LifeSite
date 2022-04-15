import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IFullStoreState } from "../store";

export enum ThemeKey {
  LIGHT = "light",
  DARK = "dark",
}

export interface IUserState {
  theme: ThemeKey;
  version: number;
}

export const currentSchemaVersion = 1;

const initialState: IUserState = {
  theme: ThemeKey.LIGHT,
  version: currentSchemaVersion
};

export const userEmptyState: IUserState = {
  theme: ThemeKey.LIGHT,
  version: currentSchemaVersion
}

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<IFullStoreState>) => {
      return action.payload.user;
    },
    logout: (state) => {
      return initialState;
    },
    toggleTheme: (state) => {
      if (state.theme === ThemeKey.LIGHT) {
        state.theme = ThemeKey.DARK;
      } else if (state.theme === ThemeKey.DARK) {
        state.theme = ThemeKey.LIGHT;
      }
    },
  },
});

export const { login, logout, toggleTheme } = userSlice.actions;

export default userSlice.reducer;
