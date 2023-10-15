import { initTRPC } from '@trpc/server';
import { shared } from "../core/dynamo/dynamo_utilities";
import superjson from 'superjson';
import { getServerSession } from "next-auth";
import { CustomSession, authOptions } from "../pages/api/auth/[...nextauth]";
import { Context } from "./context";

const t = initTRPC.context<Context>().create({
  transformer: superjson,
});

export const router = t.router;
export const publicProcedure = t.procedure;

const addUser = t.middleware(async (opts) => {
  const { ctx } = opts;

  if (!ctx.req || !ctx.res) throw new Error('Protected methods must be called correctly')

  const session: CustomSession | null = await getServerSession(ctx.req, ctx.res, authOptions)

  const id = session?.id

  return opts.next({
    ctx: {
      session: {
        id: id ?? shared
      }
    }
  })
});
export const withUser = publicProcedure.use(addUser)
