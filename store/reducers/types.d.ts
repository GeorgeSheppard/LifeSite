export type ImagePath = string;

export interface Image {
  timestamp: number;
  path: ImagePath;
}

export interface Checkboxes<T> {
  [key in T]: { tooltip: string; icon: any };
}
