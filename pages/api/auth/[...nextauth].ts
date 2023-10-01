import NextAuth, { NextAuthOptions, Session } from "next-auth";
import CognitoProvider from "next-auth/providers/cognito";
import { RealUserId } from "../../../core/types/utilities";

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
