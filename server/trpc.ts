import { initTRPC } from '@trpc/server';
import { createContext } from "./context";
import { shared } from "../core/dynamo/dynamo_utilities";
import superjson from 'superjson';

type Context = Awaited<ReturnType<typeof createContext>>
const t = initTRPC.context<Context>().create({
  transformer: superjson,
});

export const router = t.router;
export const publicProcedure = t.procedure;

const addUser = t.middleware(async (opts) => {
  const { ctx } = opts;

  console.log('addUser time', new Date().getTime())
  const id = ctx.session?.id

  return opts.next({
    ctx: {
      session: {
        id: id ?? shared
      }
    }
  })
});
export const withUser = publicProcedure.use(addUser)
