import { NoSsr } from "@mui/material";
import { useState } from "react";
import { useIsMobileLayout } from "../../components/hooks/is_mobile_layout";
import { DesktopLayout } from "../../components/pages/food/index/desktop_layout";
import { MobileLayout } from "../../components/pages/food/index/mobile_layout";
import { IQuantitiesAndMeals } from "../../core/meal_plan/shopping_list_creator";
import { useRecipeIds } from "../../core/dynamo/hooks/use_dynamo_get";
import { useBoolean } from "../../core/hooks/use_boolean";
import {
  SearchableAttributes,
  useRecipeSearch,
} from "../../core/recipes/hooks/use_recipe_search";
import { DateString } from "../../core/types/meal_plan";
import { ParsedUrlQuery } from "querystring";
import { useSearchDebounce } from "../../core/hooks/use_search_debounce";
import { SharedRecipeId } from "../../core/dynamo/dynamo_utilities";
import { IRecipe } from "../../core/types/recipes";
import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { createServerSideHelpers } from '@trpc/react-query/server';
import superjson from 'superjson';
import { appRouter } from '../../server/index';
import { CustomSession, authOptions } from "../api/auth/[...nextauth]";
import { getServerSession } from "next-auth";

const allSearchValues = new Set<SearchableAttributes>([
  "name",
  "description",
  "ingredients",
]);

const getSharedRecipe = (query: ParsedUrlQuery): SharedRecipeId | undefined => {
  const { share } = query;
  if (share instanceof Array) return;
  if (!share) return;
  return share;
};

type Props = { sharedRecipe: IRecipe | null };

export const getServerSideProps = async (
  context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<Props>> => {
  const session: CustomSession | null = await getServerSession(
    context.req,
    context.res,
    authOptions
  );

  const helpers = createServerSideHelpers({
    router: appRouter,
    ctx: { session },
    transformer: superjson,
  });

  return { props: { sharedRecipe: null }}

  // const { query } = context;

  // const sharedRecipe = getSharedRecipe(query);
  // if (!sharedRecipe) return { props: { sharedRecipe: null } };

  // const caller = appRouter.createCaller({ session });
  // const recipe = await caller.recipes.getSharedRecipe({ share: sharedRecipe });

  // return {
  //   props: { sharedRecipe: recipe },
  // };
};

const Recipes = (props: Props) => {
  const mobileLayout = useIsMobileLayout();

  const [keys, setKeys] = useState(() => allSearchValues);
  const [searchString, debouncedValue, setSearchString] = useSearchDebounce("");
  const searchResults = useRecipeSearch(
    debouncedValue,
    mobileLayout ? allSearchValues : keys
  );
  const recipeIds = useRecipeIds();
  const [selected, setSelected] = useState<Set<DateString>>(() => new Set());
  const booleanState = useBoolean(false);
  const [shoppingListData, setShoppingListData] = useState<IQuantitiesAndMeals>(
    {}
  );

  // NoSsr because of media query used to determine mobile layout or not
  return (
    <NoSsr>
      {mobileLayout ? (
        <MobileLayout
          searchResults={searchResults}
          recipeIds={recipeIds}
          selected={selected}
          setSelected={setSelected}
          booleanState={booleanState}
          shoppingListData={shoppingListData}
          setShoppingListData={setShoppingListData}
          sharedRecipe={props.sharedRecipe}
          searchString={searchString}
          setSearchString={setSearchString}
        />
      ) : (
        <DesktopLayout
          keys={keys}
          setKeys={setKeys}
          searchResults={searchResults}
          recipeIds={recipeIds}
          selected={selected}
          setSelected={setSelected}
          booleanState={booleanState}
          shoppingListData={shoppingListData}
          setShoppingListData={setShoppingListData}
          sharedRecipe={props.sharedRecipe}
          searchString={searchString}
          setSearchString={setSearchString}
        />
      )}
    </NoSsr>
  );
};

export default Recipes;
