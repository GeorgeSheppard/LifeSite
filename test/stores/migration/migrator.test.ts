import { Migrator } from "../../../store/migration/migrator";
import { IMigration } from "../../../store/migration/types";
import profile from "../../../store/reducers/food/recipes/defaultProduction.json";
import {
  latestVersion,
  migrations,
} from "../../../store/reducers/food/recipes/migrations";
import { isRecipesValid } from "../../../store/reducers/food/recipes/schema";

describe("Migrator", () => {
  describe("needsMigrating", () => {
    test("no current version", () => {
      expect(
        new Migrator([], "1.0.0", () => true).needsMigrating(
          undefined as any as string
        )
      ).toBe(true);
    });

    test("lower current version", () => {
      expect(
        new Migrator([], "1.0.0", () => true).needsMigrating("0.0.0")
      ).toBe(true);
    });

    test("higher current version", () => {
      expect(
        new Migrator([], "1.0.0", () => true).needsMigrating("1.0.1")
      ).toBe(false);
    });

    test("same current version", () => {
      expect(
        new Migrator([], "1.0.0", () => true).needsMigrating("1.0.0")
      ).toBe(false);
    });
  });
});

const initialState = {
  value: "0.0.0",
};

const fakeMigrations: IMigration[] = [
  {
    toVersion: "1.0.0",
    migration: (state: any) => {
      state.value = "1.0.0";
      return state;
    },
  },
  {
    toVersion: "1.0.1",
    migration: (state: any) => {
      state.value = "1.0.1";
      return state;
    },
  },
  {
    toVersion: "2.0.0",
    migration: (state: any) => {
      state.value = "2.0.0";
      state.newProperty = true;
      return state;
    },
  },
];

describe("migrate", () => {
  test("adds version", () => {
    const migrator = new Migrator([], "1.0.0", () => true);
    expect(migrator.migrate({})).toEqual({ version: "0.0.1" });
  });

  test("doesn't mutate original state", () => {
    const originalState = {
      value: 1,
    };
    const migrator = new Migrator(
      [
        {
          toVersion: "1.0.0",
          migration: (state: any) => {
            state.value = 2;
            return state;
          },
        },
      ],
      "1.0.0",
      () => true
    );
    expect(migrator.migrate(originalState)).not.toBe(originalState);
  });

  test("no migration required", () => {
    const migrator = new Migrator(
      fakeMigrations,
      fakeMigrations[fakeMigrations.length - 1].toVersion,
      () => true
    );
    expect(migrator.migrate({ version: "2.0.0", ...initialState })).toEqual({
      version: "2.0.0",
      value: "0.0.0",
    });
  });

  test("only some migrations required", () => {
    const migrator = new Migrator(
      fakeMigrations,
      fakeMigrations[fakeMigrations.length - 1].toVersion,
      () => true
    );

    expect(migrator.migrate({ version: "1.3.5", ...initialState })).toEqual({
      version: "2.0.0",
      value: "2.0.0",
      newProperty: true,
    });
  });

  test("throws error for poor validation", () => {
    expect(() => new Migrator([], "1.0.0", () => false).migrate({})).toThrow();
  });
});
