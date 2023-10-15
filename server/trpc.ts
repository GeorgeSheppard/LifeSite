import { initTRPC } from '@trpc/server';
import { shared } from "../core/dynamo/dynamo_utilities";
import superjson from 'superjson';
import { Context } from "./context";

const t = initTRPC.context<Context>().create({
  transformer: superjson,
});

export const router = t.router;
export const publicProcedure = t.procedure;

const addUser = t.middleware(async (opts) => {
  const id = opts.ctx.session?.id

  return opts.next({
    ctx: {
      session: {
        id: id ?? shared
      }
    }
  })
});
export const withUser = publicProcedure.use(addUser)
