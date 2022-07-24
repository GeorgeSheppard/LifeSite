import {
  plantsEmptyState,
  productionDefault,
} from "../../../store/reducers/plants/plants";
import { isPlantsValid } from "../../../store/reducers/plants/schema";

test("validates", () => {
  expect(isPlantsValid(plantsEmptyState)).toBe(true);
});

test("validates default production profile", () => {
  expect(isPlantsValid(productionDefault)).toBe(true);
});

test("fails validation", () => {
  expect(isPlantsValid({ cards: [], models: {} })).toBe(false);
});
