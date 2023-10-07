import { mealPlanEmptyState } from "../meal_plan/meal_plan_utilities";
import { IMealPlan } from "../types/meal_plan";
import { IRecipe, RecipeUuid } from "../types/recipes";
import { AwsDynamoDocClient } from "./dynamo_client";
import { Flavor, RealUserId, UserId } from "../types/utilities";

// Recipe, or Meal Plan. Note meal plan does not have a dash after because there is only one
// meal plan per account
export type ItemType = "R-" | "MP";

export type Shared = Flavor<string, "Shared">
export const shared: Shared = "shared";

export const isSharedUser = (userId: UserId): userId is Shared => userId === shared

type RecipeKey = { type: "R-"; id: RecipeUuid };
type MealPlanKey = { type: "MP" };
type TestKey = { type: "Test" };

type Keys = RecipeKey | MealPlanKey | TestKey;

type Item =
  | (RecipeKey & {
      item: IRecipe;
    })
  | (MealPlanKey & { item: IMealPlan });

class NotFoundError extends Error {
  constructor(msg: string) {
    super(msg);

    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}

const getSortKey = (key: Keys) => {
  switch (key.type) {
    case "R-":
      return `R-${key.id}`;
    case "MP":
      return "MP";
    case "Test":
      return "Test"
  }
};

export const uploadToDynamo = async (item: Item, userId: RealUserId) => {
  return await AwsDynamoDocClient.put({
    TableName: process.env.ENV_AWS_DYNAMO_NAME,
    Item: {
      ...item.item,
      UserId: userId,
      Item: getSortKey(item),
    },
  });
};

export const getFromDynamo = async (key: Keys, userId: UserId) => {
  const result = await AwsDynamoDocClient.get({
    TableName: process.env.ENV_AWS_DYNAMO_NAME,
    Key: {
      UserId: userId,
      Item: getSortKey(key),
    },
  });
  if (result.$metadata.httpStatusCode !== 200) {
    throw new Error(`Error fetching: ${result.$metadata.httpStatusCode}`);
  }
  if (!result.Item) {
    throw new NotFoundError(`Cannot find item ${getSortKey(key)}`);
  }
  return result;
};

export const getRecipe = async (
  recipeId: RecipeUuid,
  userId: UserId
): Promise<IRecipe> => {
  const result = await getFromDynamo({ type: "R-", id: recipeId }, userId);
  return result.Item as IRecipe;
};

export const putRecipe = async (recipe: IRecipe, userId: RealUserId) => {
  return await uploadToDynamo(
    { type: "R-", item: recipe, id: recipe.uuid },
    userId
  );
};

export const deleteFromDynamo = async (key: Keys, userId: RealUserId) => {
  return await AwsDynamoDocClient.delete({
    TableName: process.env.ENV_AWS_DYNAMO_NAME,
    Key: {
      UserId: userId,
      Item: getSortKey(key),
    },
  });
};

export const getAllItemsForAUser = async (
  userId: UserId,
  itemType: ItemType
) => {
  return await AwsDynamoDocClient.query({
    TableName: process.env.ENV_AWS_DYNAMO_NAME,
    KeyConditions: {
      UserId: {
        ComparisonOperator: "EQ",
        AttributeValueList: [userId],
      },
      Item: {
        ComparisonOperator: "BEGINS_WITH",
        AttributeValueList: [itemType],
      },
    },
  });
};

export const getAllRecipesForAUser = async (
  userId: UserId
): Promise<IRecipe[]> => {
  const result = await getAllItemsForAUser(userId, "R-");
  return result.Items?.map(({ Item, UserId, ...obj }) => obj as IRecipe) ?? [];
};

export const getMealPlanForAUser = async (
  userId: UserId
): Promise<IMealPlan> => {
  try {
    const result = await getFromDynamo({ type: "MP" }, userId);
    const { Item, UserId, ...obj } = result.Item!;
    return obj;
  } catch (err) {
    if (err instanceof NotFoundError) {
      return mealPlanEmptyState;
    } else {
      throw err;
    }
  }
};

export const putMealPlanForUser = async (
  mealPlan: IMealPlan,
  userId: RealUserId
) => {
  return await uploadToDynamo({ type: "MP", item: mealPlan }, userId);
};
