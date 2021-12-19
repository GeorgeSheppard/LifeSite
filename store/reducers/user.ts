import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface IUserState {
  id?: string;
}

export const userSlice = createSlice({
  name: "user",
  initialState: {
    userId: undefined,
  } as IUserState,
  reducers: {
    login: (state, action: PayloadAction<string>) => {
      state.id = action.payload;
    },
    logout: (state) => (state.id = undefined),
  },
});

export const { login } = userSlice.actions;

export default userSlice.reducer;
