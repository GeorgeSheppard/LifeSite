import { createSlice } from "@reduxjs/toolkit";

export const printingSlice = createSlice({
  name: "printing",
  initialState: {},
  reducers: {
    increment: (state) => state,
  },
});

export const { increment } = printingSlice.actions;

export default printingSlice.reducer;
