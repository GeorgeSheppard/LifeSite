import { isPrintingValid } from "../../../store/reducers/printing/schema";
import {
  printingEmptyState,
  productionDefault,
} from "../../../store/reducers/printing/printing";

test("validates", () => {
  expect(isPrintingValid(printingEmptyState)).toBe(true);
});

test("validates default production profile", () => {
  expect(isPrintingValid(productionDefault)).toBe(true);
});

test("fails validation", () => {
  expect(isPrintingValid({ cards: [], models: {} })).toBe(false);
});
