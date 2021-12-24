import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IFullStoreState } from "./user";

export interface IPrintingState {}

export const printingSlice = createSlice({
  name: "printing",
  initialState: {} as IPrintingState,
  reducers: {},
  extraReducers: {
    "user/login": (state, action: PayloadAction<IFullStoreState>) => {
      console.log("log in printing slice");
      state = action.payload.printing;
    },
    "user/logout": (state) => {},
  },
});

export default printingSlice.reducer;
