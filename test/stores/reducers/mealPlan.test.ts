import {
  addOrUpdate,
  addOrUpdatePlan,
} from "../../../store/reducers/food/meal_plan/meal_plan";
import { latestVersion } from "../../../store/reducers/food/meal_plan/migrations";
import { IMealPlanState } from "../../../store/reducers/food/meal_plan/types";

const state: IMealPlanState = {
  version: latestVersion,
  plan: {
    "16/7/2022": {},
  },
};

test("can add a recipe", () => {
  expect(
    addOrUpdate(state, {
      type: "",
      payload: {
        date: "16/7/2022",
        components: [{ recipeId: "11", componentId: "1", servingsIncrease: 3 }],
      },
    })
  ).toStrictEqual({
    version: latestVersion,
    plan: {
      "16/7/2022": { "11": [{ componentId: "1", servings: 3 }] },
    },
  });
});

test("can reduce serving quantity on existing recipe", () => {
  expect(
    addOrUpdate(
      {
        version: latestVersion,
        plan: {
          "16/7/2022": { "11": [{ componentId: "1", servings: 3 }] },
        },
      },
      {
        type: "",
        payload: {
          date: "16/7/2022",
          components: [
            { recipeId: "11", componentId: "1", servingsIncrease: -1 },
          ],
        },
      }
    )
  ).toStrictEqual({
    version: latestVersion,
    plan: {
      "16/7/2022": { "11": [{ componentId: "1", servings: 2 }] },
    },
  });
});

test("can reduce serving quantity with two existing recipes in the plan", () => {
  expect(
    addOrUpdate(
      {
        version: latestVersion,
        plan: {
          "16/7/2022": {
            "11": [{ componentId: "1", servings: 2 }],
            "22": [{ componentId: "2", servings: 3 }],
          },
        },
      },
      {
        type: "",
        payload: {
          date: "16/7/2022",
          components: [
            {
              recipeId: "22",
              componentId: "2",
              servingsIncrease: -1,
            },
          ],
        },
      }
    )
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
    addOrUpdate(
      {
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
      {
        type: "",
        payload: {
          date: "16/7/2022",
          components: [
            { recipeId: "11", componentId: "2", servingsIncrease: -1 },
          ],
        },
      }
    )
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
    addOrUpdate(
      {
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
      {
        type: "",
        payload: {
          date: "16/7/2022",
          components: [
            { recipeId: "22", componentId: "4", servingsIncrease: -2 },
            {
              recipeId: "11",
              componentId: "2",
              servingsIncrease: -2,
            },
          ],
        },
      }
    )
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
