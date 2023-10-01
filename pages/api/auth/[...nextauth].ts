import NextAuth, { NextAuthOptions, Session } from "next-auth";
import CognitoProvider from "next-auth/providers/cognito";
import { Flavor } from "../../../core/types/utilities";
import { Shared } from "../../../core/dynamo/dynamo_utilities";

/**
 * We restrict certain calls so that the "shared" user cannot make modifications
 * to the database
 */
export type RealUserId = Flavor<string, "UserId">
export type UserId = RealUserId | Shared
export type CustomSession = Session & { id?: RealUserId };

export const authOptions: NextAuthOptions = {
  providers: [
    CognitoProvider({
      clientId: process.env.ENV_AWS_COGNITO_CLIENT_ID ?? "",
      clientSecret: process.env.ENV_AWS_COGNITO_CLIENT_SECRET ?? "",
      issuer: process.env.ENV_AWS_COGNITO_CLIENT_ISSUER,
      checks: "nonce",
    }),
  ],
  callbacks: {
    async session({ session, user, token }) {
      (session as any).id = token.sub;
      return session;
    },
  },
}

export default NextAuth(authOptions);
