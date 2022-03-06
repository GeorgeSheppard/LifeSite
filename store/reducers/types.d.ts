export type ImagePath = string;

export interface Image {
  timestamp: number;
  path: ImagePath;
}

// TODO: I did try using a generic here for the keys in the checkbox,
// but it didn't work
export interface Checkboxes {
  [key: string]: { tooltip: string; icon: any };
}
