import NextAuth, { DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";
import { AccessToken, AuthUserResult } from "@/__generated__/ssr";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */

  type User = AuthUserResult;

  interface Session extends DefaultSession {
    user: AuthUserResult;
    token: AccessToken;
  }
}

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT extends AccessToken {
    user: AuthUserResult;
  }
}
