export type ImagePath = string;

export interface Image {
  timestamp: number;
  path: ImagePath;
}

export interface Checkboxes {
  /**
   * Note: Icon is any, watering passes the imported component, sun is the react element
   */
  [key: string]: { tooltip: string; icon: any };
}
