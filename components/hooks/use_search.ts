import Fuse from "fuse.js";
import { useCallback, useMemo } from "react";

const createFuseSearch = <T>(data: T[], options?: Fuse.IFuseOptions<T>) => {
  const defaultOptions = {
    includeScore: true,
    findAllMatches: true,
    ignoreLocation: true,
    threshold: 0.2,
  };
  return new Fuse(data, {
    ...defaultOptions,
    ...options,
  });
};

export const useSearch = <T>(data: T[], options?: Fuse.IFuseOptions<T>) => {
  const fuseSearch = useMemo(() => {
    return createFuseSearch(data, options);
  }, [options, data]);

  const query = useCallback(
    (query: string) => {
      return fuseSearch.search(query);
    },
    [fuseSearch]
  );

  return query;
};
