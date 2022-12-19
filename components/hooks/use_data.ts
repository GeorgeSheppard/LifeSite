import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { CustomSession } from "../../pages/api/auth/[...nextauth]";
import { IFullStoreState, initialState } from "../../store/store";
import { attemptToFetchUserProfile } from "./user_data";

export const useData = <T>(select: (data: IFullStoreState) => T) => {
  const session = useSession().data as CustomSession;

  return useQuery({
    queryKey: [session?.id ?? ""],
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
