import { useQuery } from "@tanstack/react-query";
import { CustomSession } from "../../pages/api/auth/[...nextauth]";
import { emptyStore, IFullStoreState } from "../../store/store";
import { attemptToFetchUserProfile } from "./user_data";
import { useAppSession } from "./use_app_session";

export const sessionQueryKey = (session: CustomSession) => [session?.id ?? ""];

export const useData = <T>(select: (data: IFullStoreState) => T) => {
  const session = useAppSession();

  const result = useQuery({
    queryKey: sessionQueryKey(session),
    queryFn: () => attemptToFetchUserProfile(session?.id),
    select,
    placeholderData: emptyStore,
  });

  // Note: This is pretty dirty, data will always exist because we have
  // placeholderData, but tanstack doesn't update the type for itself.
  // It will update the type if you use initialData but that value is placed
  // into the cache and we don't want that.
  return {
    ...result,
    data: result.data!,
  };
};

export const useRecipes = () => {
  return useData((data) => data.food.recipes);
};

export const useMealPlan = () => {
  return useData((data) => data.mealPlan.plan);
};

export const usePrinting = () => {
  return useData((data) => data.printing);
};

export const usePlants = () => {
  return useData((data) => data.plants);
};
