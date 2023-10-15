import * as trpc from "@trpc/server";
import * as trpcNext from "@trpc/server/adapters/next";

export async function createContext(ctx: Partial<trpcNext.CreateNextContextOptions>) {
  const { req, res } = ctx;

  return {
    req,
    res,
  };
}

export type Context = trpc.inferAsyncReturnType<typeof createContext>;