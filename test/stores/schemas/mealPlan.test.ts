import { isMealPlanValid } from "../../../store/reducers/food/meal_plan/schema";
import { mealPlanEmptyState } from "../../../store/reducers/food/meal_plan/meal_plan";

test("validates", () => {
  expect(isMealPlanValid(mealPlanEmptyState)).toBe(true);
});

test("fails validation", () => {
  expect(
    isMealPlanValid({
      version: "1.0.0",
    })
  ).toBe(false);

  expect(
    isMealPlanValid({
      version: "1.0.0",
      plan: {
        date: [{ uuid: "123", servings: "1" }],
      },
    })
  ).toBe(false);
});
