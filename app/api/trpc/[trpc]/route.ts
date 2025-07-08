import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { appRouter } from "../../../../server";
// import { captureException } from "@sentry/nextjs";
import { getServerSession } from 'next-auth';
import { CustomSession, authOptions } from "../../../../lib/auth";

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: appRouter,
    createContext: async () => {
      const session: CustomSession | null = await getServerSession(authOptions);
      return {
        session
      };
    },
    onError(opts) {
      console.error(`Error: ${opts.error}`);
      // captureException(opts.error)
    },
    batching: {
      enabled: true
    }
  });

export { handler as GET, handler as POST }; 