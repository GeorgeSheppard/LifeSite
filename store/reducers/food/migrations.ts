import { IMigration } from "../../migration/types";

export const migrations: IMigration[] = [];

export const latestVersion = migrations[migrations.length - 1].toVersion;
