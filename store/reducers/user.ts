import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IFullStoreState } from "../store";

export interface IUserState {
  version: number;
}

export const currentSchemaVersion = 1;

const initialState: IUserState = {
  version: currentSchemaVersion
};

export const userEmptyState: IUserState = {
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
  },
});

export const { login, logout } = userSlice.actions;

export default userSlice.reducer;
