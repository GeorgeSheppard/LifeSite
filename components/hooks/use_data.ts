import { useQuery, useQueryClient } from "@tanstack/react-query";
import { CustomSession } from "../../pages/api/auth/[...nextauth]";
import { IFullStoreState, initialState } from "../../store/store";
import { attemptToFetchUserProfile } from "./user_data";
import { useAppSession } from "./use_app_session";
import { createRef, useEffect, useRef } from "react";

export const sessionQueryKey = (session: CustomSession) => [session?.id ?? ""];

export const useData = <T>(
  select: (data: IFullStoreState) => T,
  invalidateOnMount?: boolean
) => {
  const session = useAppSession();
  const queryClient = useQueryClient();
  const called = useRef(false);

  if (!called.current && invalidateOnMount) {
    called.current = true;
    queryClient.invalidateQueries();
  }

  return useQuery({
    queryKey: sessionQueryKey(session),
    queryFn: () => attemptToFetchUserProfile(session.id),
    select,
    initialData: initialState,
    enabled: !!session?.id,
  });
};

export const useRecipes = (invalidateOnMount?: boolean) => {
  return useData((data) => data.food.recipes, invalidateOnMount);
};

export const useMealPlan = (invalidateOnMount?: boolean) => {
  return useData((data) => data.mealPlan.plan, invalidateOnMount);
};

export const usePrinting = (invalidateOnMount?: boolean) => {
  return useData((data) => data.printing, invalidateOnMount);
};

export const usePlants = (invalidateOnMount?: boolean) => {
  return useData((data) => data.plants, invalidateOnMount);
};
