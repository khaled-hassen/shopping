import NextAuth, { AuthOptions, Session, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { route } from "@/router";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      id: "credentials",
      credentials: {
        user: { type: "text" },
      },
      async authorize(credentials) {
        if (!credentials) throw new Error("Empty credentials.");
        const userJson = credentials.user as string;
        const user = JSON.parse(userJson);
        if (!user) throw new Error("Something went wrong.");
        return user;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account, user, trigger, session }) {
      if (account) {
        const activeUser = user as User;
        token.user = activeUser;
        token.value = activeUser.accessToken.value;
        token.expires = activeUser.accessToken.expires;
      }
      if (trigger === "update") {
        const accessToken = (session as Session).token;
        token.value = accessToken.value;
        token.expires = accessToken.expires;
        token.user = (session as Session).user;
      }
      return token;
    },
    async session({ session, token }) {
      session.token = token;
      session.user = token.user;
      return session;
    },
  },
  session: { strategy: "jwt" },
  pages: {
    signIn: route("login"),
    signOut: route("home"),
  },
};

export default NextAuth(authOptions);
