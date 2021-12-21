import NextAuth, { Session } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export type CustomSession = Session & { id: string };

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID ?? "",
      clientSecret: process.env.GOOGLE_SECRET ?? "",
    }),
  ],
  callbacks: {
    async session({ session, user, token }) {
      // NB: Sub is the uuid from google
      session.id = token.sub;
      return session;
    },
  },
});
