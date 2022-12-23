import clone from "just-clone";
import { addOrUpdatePlan } from "../../../store/reducers/food/meal_plan/meal_plan";
import { latestVersion } from "../../../store/reducers/food/meal_plan/migrations";
import { recipesEmptyState } from "../../../store/reducers/food/recipes/recipes";
import { printingEmptyState } from "../../../store/reducers/printing/printing";
import { userEmptyState } from "../../../store/reducers/user/user";
import { IFullStoreState } from "../../../store/store";

const state: IFullStoreState = {
  user: clone(userEmptyState),
  printing: clone(printingEmptyState),
  food: clone(recipesEmptyState),
  mealPlan: {
    version: latestVersion,
    plan: {
      "16/7/2022": {},
    },
  },
};

test("can add a recipe", () => {
  expect(
    addOrUpdatePlan(state, {
      date: "16/7/2022",
      components: [{ recipeId: "11", componentId: "1", servingsIncrease: 3 }],
    }).mealPlan
  ).toStrictEqual({
    version: latestVersion,
    plan: {
      "16/7/2022": { "11": [{ componentId: "1", servings: 3 }] },
    },
  });
});

test("can reduce serving quantity on existing recipe", () => {
  expect(
    addOrUpdatePlan(
      {
        ...state,
        mealPlan: {
          version: latestVersion,
          plan: {
            "16/7/2022": { "11": [{ componentId: "1", servings: 3 }] },
          },
        },
      },
      {
        date: "16/7/2022",
        components: [
          { recipeId: "11", componentId: "1", servingsIncrease: -1 },
        ],
      }
    ).mealPlan
  ).toStrictEqual({
    version: latestVersion,
    plan: {
      "16/7/2022": { "11": [{ componentId: "1", servings: 2 }] },
    },
  });
});

test("can reduce serving quantity with two existing recipes in the plan", () => {
  expect(
    addOrUpdatePlan(
      {
        ...state,
        mealPlan: {
          version: latestVersion,
          plan: {
            "16/7/2022": {
              "11": [{ componentId: "1", servings: 2 }],
              "22": [{ componentId: "2", servings: 3 }],
            },
          },
        },
      },
      {
        date: "16/7/2022",
        components: [
          {
            recipeId: "22",
            componentId: "2",
            servingsIncrease: -1,
          },
        ],
      }
    ).mealPlan
  ).toStrictEqual({
    version: latestVersion,
    plan: {
      "16/7/2022": {
        "11": [{ componentId: "1", servings: 2 }],
        "22": [{ componentId: "2", servings: 2 }],
      },
    },
  });
});

test("can reduce servings with multiple components", () => {
  expect(
    addOrUpdatePlan(
      {
        ...state,
        mealPlan: {
          version: latestVersion,
          plan: {
            "16/7/2022": {
              "11": [
                { componentId: "1", servings: 2 },
                { componentId: "2", servings: 4 },
              ],
            },
          },
        },
      },
      {
        date: "16/7/2022",
        components: [
          { recipeId: "11", componentId: "2", servingsIncrease: -1 },
        ],
      }
    ).mealPlan
  ).toStrictEqual({
    version: latestVersion,
    plan: {
      "16/7/2022": {
        "11": [
          { componentId: "1", servings: 2 },
          { componentId: "2", servings: 3 },
        ],
      },
    },
  });
});

test("can reduce servings with multiple components and multiple recipes", () => {
  expect(
    addOrUpdatePlan(
      {
        ...state,
        mealPlan: {
          version: latestVersion,
          plan: {
            "16/7/2022": {
              "11": [
                { componentId: "1", servings: 2 },
                { componentId: "2", servings: 4 },
              ],
              "22": [
                { componentId: "3", servings: 6 },
                { componentId: "4", servings: 8 },
              ],
            },
          },
        },
      },
      {
        date: "16/7/2022",
        components: [
          { recipeId: "22", componentId: "4", servingsIncrease: -2 },
          {
            recipeId: "11",
            componentId: "2",
            servingsIncrease: -2,
          },
        ],
      }
    ).mealPlan
  ).toStrictEqual({
    version: latestVersion,
    plan: {
      "16/7/2022": {
        "11": [
          { componentId: "1", servings: 2 },
          { componentId: "2", servings: 2 },
        ],
        "22": [
          { componentId: "3", servings: 6 },
          { componentId: "4", servings: 6 },
        ],
      },
    },
  });
});
