import { initialVersion, Migrator } from "../../migration/migrator";
import { IFullStoreState } from "../../store";
import { latestVersion, migrations } from "./migrations";
import { IUserState } from "./types";
import { isUserValid } from "./schema";
import clone from "just-clone";

export const userEmptyState: IUserState = {
  version: latestVersion,
};

export const userInitialState: IUserState = userEmptyState;

const migrator = new Migrator<IUserState>(
  migrations,
  latestVersion,
  isUserValid
);

export const migrateUser = (store: IFullStoreState): IFullStoreState => {
  if (!store.user) {
    store.user = clone(userEmptyState);
  }

  // We handle this case slightly differently, originally the version field
  // was a number, which means the migrator won't be able to tell whether it
  // should be migrated. We first change to semver then allow the migrator
  // to operate
  if (typeof store.user.version === "number") {
    store.user.version = initialVersion;
  }

  if (migrator.needsMigrating(store.user.version)) {
    store.user = migrator.migrate(store.user);
  }
  if (!isUserValid(store.user)) {
    throw new Error("User is invalid: " + JSON.stringify(store.user));
  }

  return store;
};
