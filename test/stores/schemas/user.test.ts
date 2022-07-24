import { isUserValid } from "../../../store/reducers/user/schema";
import { userEmptyState } from "../../../store/reducers/user/user";

test("validates", () => {
  expect(isUserValid(userEmptyState)).toBe(true);
});

test("fails validation", () => {
  expect(isUserValid({})).toBe(false);
});
