import { addOrUpdatePlan } from "../../../core/meal_plan/meal_plan_utilities";

test("can add a recipe", () => {
  expect(
    addOrUpdatePlan(
      {
        "16/7/2022": {},
      },
      {
        date: "16/7/2022",
        components: [{ recipeId: "11", componentId: "1", servingsIncrease: 3 }],
      }
    )
  ).toStrictEqual({
    "16/7/2022": { "11": [{ componentId: "1", servings: 3 }] },
  });
});

test("can reduce serving quantity on existing recipe", () => {
  expect(
    addOrUpdatePlan(
      {
        "16/7/2022": { "11": [{ componentId: "1", servings: 3 }] },
      },
      {
        date: "16/7/2022",
        components: [
          { recipeId: "11", componentId: "1", servingsIncrease: -1 },
        ],
      }
    )
  ).toStrictEqual({
    "16/7/2022": { "11": [{ componentId: "1", servings: 2 }] },
  });
});

test("can reduce serving quantity with two existing recipes in the plan", () => {
  expect(
    addOrUpdatePlan(
      {
        "16/7/2022": {
          "11": [{ componentId: "1", servings: 2 }],
          "22": [{ componentId: "2", servings: 3 }],
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
    )
  ).toStrictEqual({
    "16/7/2022": {
      "11": [{ componentId: "1", servings: 2 }],
      "22": [{ componentId: "2", servings: 2 }],
    },
  });
});

test("can reduce servings with multiple components", () => {
  expect(
    addOrUpdatePlan(
      {
        "16/7/2022": {
          "11": [
            { componentId: "1", servings: 2 },
            { componentId: "2", servings: 4 },
          ],
        },
      },
      {
        date: "16/7/2022",
        components: [
          { recipeId: "11", componentId: "2", servingsIncrease: -1 },
        ],
      }
    )
  ).toStrictEqual({
    "16/7/2022": {
      "11": [
        { componentId: "1", servings: 2 },
        { componentId: "2", servings: 3 },
      ],
    },
  });
});

test("can reduce servings with multiple components and multiple recipes", () => {
  expect(
    addOrUpdatePlan(
      {
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
    )
  ).toStrictEqual({
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
  });
});
