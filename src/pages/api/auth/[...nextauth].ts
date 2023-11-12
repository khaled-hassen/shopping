import NextAuth, { AuthOptions, Session, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { ssrLogin } from "@/__generated__/ssr";
import { initializeApolloClient } from "@/apollo";
import { route } from "@/router";
import { ApolloError } from "@apollo/client";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      id: "credentials",
      credentials: {
        email: { type: "text" },
        password: { type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) return null;
        const email = credentials.email as string;
        const password = credentials.password as string;
        const client = initializeApolloClient();
        try {
          const response = await ssrLogin.getServerPage(
            { variables: { email, password } },
            client,
          );
          return response.props.data.login as any;
        } catch (e) {
          const defaultErrorMessage = "Something went wrong.";
          if (!(e instanceof ApolloError)) throw new Error(defaultErrorMessage);
          const { networkError } = e;
          // @ts-ignore
          const error = networkError?.result?.errors?.[0]?.message;
          throw new Error(error || defaultErrorMessage);
        }
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
  },
};

export default NextAuth(authOptions);
