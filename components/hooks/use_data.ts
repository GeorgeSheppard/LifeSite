import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { CustomSession } from "../../pages/api/auth/[...nextauth]";
import { IFullStoreState, initialState } from "../../store/store";
import { attemptToFetchUserProfile } from "./user_data";
import { useAppSession } from "./use_app_session";

export const sessionQueryKey = (session: CustomSession) => [session?.id ?? ""];

export const useData = <T>(
  select: (data: IFullStoreState) => T,
  queryOptions?: UseQueryOptions<IFullStoreState, unknown, T, string[]>
) => {
  const session = useAppSession();

  return useQuery({
    queryKey: sessionQueryKey(session),
    queryFn: () => attemptToFetchUserProfile(session.id),
    select,
    placeholderData: initialState,
    enabled: !!session?.id,
    ...queryOptions,
  });
};

export const useRecipes = (
  options?: UseQueryOptions<IFullStoreState, unknown, any, string[]>
) => {
  return useData((data) => data.food.recipes, options);
};

export const useMealPlan = (
  options?: UseQueryOptions<IFullStoreState, unknown, any, string[]>
) => {
  return useData((data) => data.mealPlan.plan, options);
};

export const usePrinting = (
  options?: UseQueryOptions<IFullStoreState, unknown, any, string[]>
) => {
  return useData((data) => data.printing, options);
};

export const usePlants = (
  options?: UseQueryOptions<IFullStoreState, unknown, any, string[]>
) => {
  return useData((data) => data.plants, options);
};
