import { httpLink } from "@trpc/client";
import type { AppRouter } from "../server";
import { createTRPCNext } from "@trpc/next";
import superjson from 'superjson';

function getBaseUrl() {
  if (typeof window !== 'undefined')
    // browser should use relative path
    return '';
  return `https://${process.env.ENV_DOMAIN}`;
}

export const trpc = createTRPCNext<AppRouter>({
  config(opts) {
    return {
      links: [
        httpLink({
          url: `${getBaseUrl()}/api/trpc`,
        }),
      ],
      transformer: superjson
    };
  },
  ssr: false,
});
