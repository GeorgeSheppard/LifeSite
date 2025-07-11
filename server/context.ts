import * as trpc from "@trpc/server";
import * as trpcNext from "@trpc/server/adapters/next";
import { getServerSession } from 'next-auth';
import { CustomSession, authOptions } from "../pages/api/auth/[...nextauth]";

export async function createContext(
  ctx: trpcNext.CreateNextContextOptions
) {
  const { req, res } = ctx
  const session: CustomSession | null = await getServerSession(req, res, authOptions)
  
  return {
    session
  };
}

export type Context = trpc.inferAsyncReturnType<typeof createContext>;
