import { initialVersion } from "../../../migration/migrator";
import { IMigration } from "../../../migration/types";

export const migrations: IMigration[] = [
  {
    toVersion: initialVersion,
    migration: (state) => state,
  },
];

export const latestVersion = migrations[migrations.length - 1].toVersion;
