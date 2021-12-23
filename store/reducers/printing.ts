import { createSlice } from "@reduxjs/toolkit";

export const printingSlice = createSlice({
  name: "printing",
  initialState: {
    previewPath: "",
  },
  reducers: {
    previewPath: (state, action) => {
      state.previewPath = action.payload;
    },
  },
});

export const { previewPath } = printingSlice.actions;

export default printingSlice.reducer;
