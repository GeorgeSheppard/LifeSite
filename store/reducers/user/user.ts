import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { initialVersion, Migrator } from "../../migration/migrator";
import { IFullStoreState } from "../../store";
import { latestVersion, migrations } from "./migrations";
import { IUserState } from "./types";
import { isUserValid } from "./schema";

export const userEmptyState: IUserState = {
  version: latestVersion,
};

const initialState: IUserState = userEmptyState;

const migrator = new Migrator<IUserState>(
  migrations,
  latestVersion,
  isUserValid
);

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<IFullStoreState>) => {
      if (!action.payload.user) {
        return state;
      }

      // We handle this case slightly differently, originally the version field
      // was a number, which means the migrator won't be able to tell whether it
      // should be migrated. We first change to semver then allow the migrator
      // to operate
      if (typeof action.payload.user?.version === "number") {
        action.payload.user.version = initialVersion;
      }

      if (migrator.needsMigrating(action.payload.user?.version)) {
        try {
          return migrator.migrate(action.payload.user);
        } catch (err) {
          console.log("An error occurrence migrating user: " + err);
          return state;
        }
      } else {
        if (!isUserValid(action.payload.user)) {
          console.error(
            "User is invalid: " + JSON.stringify(action.payload.user)
          );
          return state;
        }
      }

      return action.payload.user;
    },
    logout: (state) => {
      return initialState;
    },
  },
});

export const { login, logout } = userSlice.actions;

export default userSlice.reducer;
