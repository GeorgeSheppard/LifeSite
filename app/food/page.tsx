import { getServerSession } from "next-auth";
import { CustomSession, authOptions } from "../../lib/auth";
import { appRouter } from '../../server/index';
import { SharedRecipeId } from "../../core/dynamo/dynamo_utilities";
import { IRecipe } from "../../core/types/recipes";
import { FoodClient } from "./food-client";

interface Props {
  searchParams: { [key: string]: string | string[] | undefined };
}

const getSharedRecipe = (searchParams: any): SharedRecipeId | undefined => {
  const { share } = searchParams;
  if (share instanceof Array) return;
  if (!share) return;
  return share;
};

export default async function FoodPage({ searchParams }: Props) {
  const session: CustomSession | null = await getServerSession(authOptions);
  
  let sharedRecipe: IRecipe | null = null;
  
  const sharedRecipeId = getSharedRecipe(searchParams);
  if (sharedRecipeId) {
    const caller = appRouter.createCaller({ session });
    sharedRecipe = await caller.recipes.getSharedRecipe({ share: sharedRecipeId });
  }

  return <FoodClient sharedRecipe={sharedRecipe} />;
} 