export interface IMigration {
  toVersion: string;
  migration: (state: any) => any;
}

export type IVersion = string;
