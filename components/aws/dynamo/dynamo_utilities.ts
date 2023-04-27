import { mealPlanEmptyState } from "../../../store/reducers/food/meal_plan/meal_plan";
import { IMealPlan } from "../../../store/reducers/food/meal_plan/types";
import {
  IRecipe,
  RecipeUuid,
} from "../../../store/reducers/food/recipes/types";
import { AwsDynamoDocClient } from "./dynamo_client";

// Recipe, or Meal Plan. Note meal plan does not have a dash after because there is only one
// meal plan per account
export type ItemType = "R-" | "MP";

type RecipeKey = { type: "R-"; id: RecipeUuid };
type MealPlanKey = { type: "MP" };

type Keys = RecipeKey | MealPlanKey;

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
  }
};

export const uploadToDynamo = async (item: Item, userId: string) => {
  return await AwsDynamoDocClient.put({
    TableName: process.env.ENV_AWS_DYNAMO_NAME,
    Item: {
      ...item.item,
      UserId: userId,
      Item: getSortKey(item),
    },
  });
};

export const getFromDynamo = async (key: Keys, userId: string) => {
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
  userId: string
): Promise<IRecipe> => {
  const result = await getFromDynamo({ type: "R-", id: recipeId }, userId);
  return result.Item as IRecipe;
};

export const putRecipe = async (recipe: IRecipe, userId: string) => {
  return await uploadToDynamo(
    { type: "R-", item: recipe, id: recipe.uuid },
    userId
  );
};

export const deleteFromDynamo = async (key: Keys, userId: string) => {
  return await AwsDynamoDocClient.delete({
    TableName: process.env.ENV_AWS_DYNAMO_NAME,
    Key: {
      UserId: userId,
      Item: getSortKey(key),
    },
  });
};

export const getAllItemsForAUser = async (
  userId: string,
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
  userId: string
): Promise<IRecipe[]> => {
  const result = await getAllItemsForAUser(userId, "R-");
  return result.Items?.map(({ Item, UserId, ...obj }) => obj as IRecipe) ?? [];
};

export const getMealPlanForAUser = async (
  userId: string
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
  userId: string
) => {
  return await uploadToDynamo({ type: "MP", item: mealPlan }, userId);
};
