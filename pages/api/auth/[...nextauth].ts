import NextAuth, { Session } from "next-auth";
import CognitoProvider from "next-auth/providers/cognito";

export type CustomSession = Session & { id: string };

export default NextAuth({
  providers: [
    CognitoProvider({
      clientId: process.env.ENV_AWS_COGNITO_CLIENT_ID ?? "",
      clientSecret: process.env.ENV_AWS_COGNITO_CLIENT_SECRET ?? "",
      issuer: process.env.ENV_AWS_COGNITO_CLIENT_ISSUER,
    }),
  ],
  callbacks: {
    async session({ session, user, token }) {
      session.id = token.sub;
      return session
    },
  },
});
