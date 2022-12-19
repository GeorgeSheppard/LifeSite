import { useQuery } from "@tanstack/react-query";
import { CustomSession } from "../../pages/api/auth/[...nextauth]";
import { IFullStoreState, initialState } from "../../store/store";
import { attemptToFetchUserProfile } from "./user_data";
import { useAppSession } from "./use_app_session";

export const sessionQueryKey = (session: CustomSession) => [session?.id ?? ""];

export const useData = <T>(select: (data: IFullStoreState) => T) => {
  const session = useAppSession();

  return useQuery({
    queryKey: sessionQueryKey(session),
    queryFn: () => attemptToFetchUserProfile(session.id),
    select,
    initialData: initialState,
    enabled: !!session?.id,
  });
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
