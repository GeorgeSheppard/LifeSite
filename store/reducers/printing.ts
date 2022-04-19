import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ICameraParams } from "../../components/printing/canvas_screenshotter";
import { IFullStoreState } from "../store";
import { Image, S3Key } from "./types";

export type ModelUUID = string;

export interface IModelProps {
  filename: string;
  description: string;
  /**
   * Not all models can be loaded and previewed
   */
  image?: Image;
  key: S3Key;
  uuid: ModelUUID;
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
  models: { [key: ModelUUID]: IModelProps };
}

// Use a proper profile just want a good default profile for now
const initialState: IPrintingState = JSON.parse('{"cards":["d3ee371a-fb51-496f-8f04-dc7bf51ef695","086eae95-30c8-48ab-914d-7d4999d6e99e","72bab1db-007d-4e0e-9427-56d37f273e09"],"models":{"72bab1db-007d-4e0e-9427-56d37f273e09":{"filename":"Plant pot","description":"A plant pot for a succulent","image":{"key":"5137a78d-3099-4a4e-be6f-588528de396b/images/02dbe67c-722a-4125-8317-037b8655677b_72bab1db-007d-4e0e-9427-56d37f273e09_preview.png","timestamp":1650400948808},"key":"5137a78d-3099-4a4e-be6f-588528de396b/models/2683384a-1328-439d-bd17-05800571bde7_PlantPot_RoundedSpiral.STL","uuid":"72bab1db-007d-4e0e-9427-56d37f273e09","cameraParams":{"zoom":1,"position":[1.8367207323661945,-2.101421726459272,2.951352855702149],"quaternion":[0.25819498795068146,0.2646675741050642,-0.07378102649934545,0.9261980260954947]}},"086eae95-30c8-48ab-914d-7d4999d6e99e":{"filename":"Anenometer mount","description":"Mount for Jack for his dissertation","image":{"key":"5137a78d-3099-4a4e-be6f-588528de396b/images/0e275f08-ed68-4c2f-ba35-c38f76212452_086eae95-30c8-48ab-914d-7d4999d6e99e_preview.png","timestamp":1650403188619},"key":"5137a78d-3099-4a4e-be6f-588528de396b/models/55e77c65-1d47-401a-8a75-94673c320de9_Anenometer mount.stl","uuid":"086eae95-30c8-48ab-914d-7d4999d6e99e","cameraParams":{"zoom":1,"position":[2.429614928270677,0.11312702084446766,3.2533326877955786],"quaternion":[-0.013216169427293723,0.3152265243806622,0.004390372530608713,0.9489142721139773]}},"d3ee371a-fb51-496f-8f04-dc7bf51ef695":{"filename":"Plant pot","description":"Another plant pot for a succulent","image":{"key":"5137a78d-3099-4a4e-be6f-588528de396b/images/5762cdd5-14ae-48eb-b964-e5e43c1352c6_d3ee371a-fb51-496f-8f04-dc7bf51ef695_preview.png","timestamp":1650403299847},"key":"5137a78d-3099-4a4e-be6f-588528de396b/models/1a9112bd-8ef7-41d9-a21a-84366898db83_PlantPot_SquareHoles.STL","uuid":"d3ee371a-fb51-496f-8f04-dc7bf51ef695","cameraParams":{"zoom":1,"position":[-3.3488394347405155,2.2974751693110123,-0.08295954873473727],"quaternion":[-0.20674742588492367,-0.6837156692914748,-0.21193253162236134,0.6669879965152338]}}}}')

export const printingEmptyState: IPrintingState = {
  cards: [],
  models: {}
}

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
    deleteModel: (state, action: PayloadAction<ModelUUID>) => {
      const uuid = action.payload;
      delete state.models[uuid];
      state.cards = state.cards.filter((cardUuid) => cardUuid !== uuid);
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

export const { addModel, deleteModel } = printingSlice.actions;

export default printingSlice.reducer;
