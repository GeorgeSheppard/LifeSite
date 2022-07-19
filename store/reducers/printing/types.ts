import { IVersion } from "../../migration/types";
import { S3Key, Image } from "../types";

export type ModelUuid = string;

export interface ICameraParams {
  zoom: number;
  position: number[];
  quaternion: number[];
}

export interface IModelProps {
  filename: string;
  description: string;
  /**
   * Not all models can be loaded and previewed
   */
  image?: Image;
  key: S3Key;
  uuid: ModelUuid;
  cameraParams?: ICameraParams;
}

export interface IPrintingState {
  version: IVersion;
  /**
   * The array of uuids corresponding to each card
   */
  cards: ModelUuid[];
  /**
   * Map from uuid to the data associated with the card
   * It's much easier to maintain the store and use client side like this, as only
   * a uuid needs to be passed around, and when updating state don't have to find the index
   * of the existing card in the cards list
   */
  models: { [key: ModelUuid]: IModelProps };
}
