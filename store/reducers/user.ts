import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IFullStoreState } from "../store";

export interface IUserState {
  id?: string;
}

const initialState: IUserState = {};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<IFullStoreState>) => {
      console.log("log in user slice");
      state = action.payload.user;
    },
    logout: (state) => {
      state = {};
    },
  },
});

export const { login, logout } = userSlice.actions;

export default userSlice.reducer;
