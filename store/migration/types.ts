export interface IMigration {
  toVersion: string;
  migration: (state: any) => any;
  description?: string;
}

export type IVersion = string;
