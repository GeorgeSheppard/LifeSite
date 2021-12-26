import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ICameraParams } from "../../components/canvas_screenshotter";
import { IFullStoreState } from "./user";

export interface IModelProps {
  filename: string;
  description: string;
  /**
   * Not all models can be loaded and previewed
   */
  imageSrc?: string;
  modelSrc: string;
  uuid: string;
  cameraParams?: ICameraParams;
}

export interface IPrintingState {
  /**
   * The array of uuids corresponding to each card
   */
  cards: string[];
  /**
   * Map from uuid to the data associated with the card
   * It's much easier to maintain the store and use client side like this, as only
   * a uuid needs to be passed around, and when updating state don't have to find the index
   * of the existing card in the cards list
   */
  models: { [key: string]: IModelProps };
}

const initialState: IPrintingState = {
  cards: [],
  models: {},
};

export const printingSlice = createSlice({
  name: "printing",
  initialState,
  reducers: {
    addModel: (state, action: PayloadAction<IModelProps>) => {
      const uuid = action.payload.uuid;
      const existsAlready = uuid in state.models;
      state.models[uuid] = action.payload;
      if (!existsAlready) {
        state.cards.unshift(action.payload.uuid);
      }
    },
  },
  extraReducers: {
    "user/login": (state, action: PayloadAction<IFullStoreState>) => {
      return action.payload.printing;
    },
    "user/logout": (state) => {
      return initialState;
    },
  },
});

export const { addModel } = printingSlice.actions;

export default printingSlice.reducer;
