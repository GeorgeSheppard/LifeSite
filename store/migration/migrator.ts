import clone from "just-clone";
import { lt } from "semver";
import { IMigration, IVersion } from "./types";

export const initialVersion = "0.0.1";

export class Migrator<T> {
  private _migrations: IMigration[];
  private _latestVersion: IVersion;
  private _validate: (state: unknown) => boolean;

  /**
   * @param validate Validation function for output of migration, make sure it throws if it doesn't pass
   */
  constructor(
    migrations: IMigration[],
    latestVersion: IVersion,
    validate: (state: unknown) => boolean
  ) {
    this._migrations = migrations;
    this._latestVersion = latestVersion;
    this._validate = validate;
  }

  public migrate(state: any): T {
    let newState = clone(state);

    if (!newState.version) {
      newState.version = initialVersion;
    }

    for (const { toVersion, migration } of this._migrations) {
      if (lt(newState.version, toVersion)) {
        newState = migration(newState);
        newState.version = toVersion;
      }
    }

    if (this._validate(newState)) {
      return newState;
    } else {
      throw new Error(`Migration failed: ${newState}`);
    }
  }

  public needsMigrating(currentVersion: IVersion): boolean {
    if (!currentVersion) {
      return true;
    }
    return lt(currentVersion, this._latestVersion);
  }
}
