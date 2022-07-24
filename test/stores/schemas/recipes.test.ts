import {
  productionDefault,
  developmentDefault,
  recipesEmptyState,
} from "../../../store/reducers/food/recipes/recipes";
import { isRecipesValid } from "../../../store/reducers/food/recipes/schema";

test("validates", () => {
  expect(isRecipesValid(recipesEmptyState)).toBe(true);
});

test("validates default production profile", () => {
  expect(isRecipesValid(productionDefault)).toBe(true);
});

test("validates default development profile", () => {
  expect(isRecipesValid(developmentDefault)).toBe(true);
});

test("fails validation", () => {
  expect(isRecipesValid({ cards: [], models: {} })).toBe(false);
});
