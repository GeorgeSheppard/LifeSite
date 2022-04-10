import NextAuth, { Session } from "next-auth";
import CognitoProvider from "next-auth/providers/cognito";
import GoogleProvider from 'next-auth/providers/google';

export type CustomSession = Session & { id: string };

export default NextAuth({
  providers: [
    CognitoProvider({
      clientId: process.env.COGNITO_CLIENT_ID ?? "",
      clientSecret: process.env.COGNITO_CLIENT_SECRET ?? "",
      issuer: process.env.COGNITO_CLIENT_ISSUER,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID ?? "",
      clientSecret: process.env.GOOGLE_SECRET ?? "",
    })
  ],
  pages: {
    signIn: "/signin"
  }
});
