import Fuse from "fuse.js";
import { IRecipe, RecipeUuid } from "../../store/reducers/food/recipes";
import { useMemo, useCallback } from "react";


const createFuseSearch = (
  data: IRecipe[],
  options?: Fuse.IFuseOptions<IRecipe>
) => {
  const defaultOptions = {
    includeScore: true,
    keys: ["name", "description"],
    findAllMatches: true,
    ignoreLocation: true,
  };
  return new Fuse(data, {
    ...defaultOptions,
    ...options,
  });
};

export const useQuerySearch = (
  queries: { [key: RecipeUuid]: IRecipe },
  options?: Fuse.IFuseOptions<IRecipe>
) => {
  const fuseSearch = useMemo(() => {
    return createFuseSearch(Object.values(queries), options);
  }, [options, queries]);

  const query = useCallback(
    (query: string) => {
      return fuseSearch.search(query);
    },
    [fuseSearch]
  );

  return {
    search: query,
  };
};