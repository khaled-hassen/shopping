import NextAuth, { DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";
import { AccessToken, UserResult } from "@/__generated__/ssr";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */

  type User = UserResult;

  interface Session extends DefaultSession {
    user: UserResult;
    token: AccessToken;
  }
}

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT extends AccessToken {
    user: UserResult;
  }
}
