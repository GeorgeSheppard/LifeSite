import { createNextApiHandler } from '@trpc/server/adapters/next';
import { appRouter } from "../../../server";
import { createContext } from "../../../server/context";
import { captureException } from "@sentry/nextjs";

export default createNextApiHandler({
  router: appRouter,
  createContext,
  onError(opts) {
    console.error(`Error: ${opts.error}`);
    captureException(opts.error)
  },
  batching: {
    enabled: false
  }
});