import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IPrintingState } from "./printing";

interface IUserState {}

export interface IFullStoreState {
  user: IUserState;
  printing: IPrintingState;
}

export const userSlice = createSlice({
  name: "user",
  initialState: {} as IUserState,
  reducers: {
    login: (state, action: PayloadAction<IFullStoreState>) => {
      console.log("log in user slice");
      state = action.payload.user;
    },
    logout: (state) => {},
  },
});

export const { login, logout } = userSlice.actions;

export default userSlice.reducer;
