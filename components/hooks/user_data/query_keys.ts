import { CustomSession } from "../../../pages/api/auth/[...nextauth]";
import { RecipeUuid } from "../../../store/reducers/food/recipes/types";
import { ModelUuid } from "../../../store/reducers/printing/types";

export const sessionQueryKey = (session: CustomSession) => [session?.id ?? ""];
export const recipesQueryKey = (session: CustomSession) => [
  session?.id ?? "",
  "R-",
];
export const recipeQueryKey = (session: CustomSession, id: RecipeUuid) => [
  session?.id ?? "",
  "R-",
  id,
];
export const modelsQueryKey = (session: CustomSession) => [
  session?.id ?? "",
  "M-"
]
export const modelQueryKey = (session: CustomSession, id: ModelUuid) => [
  session?.id ?? "",
  "M-",
  id
]
export const mealPlanQueryKey = (session: CustomSession) => [session?.id ?? "", "MP"]
