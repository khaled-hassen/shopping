import React, { useEffect, useRef } from "react";
import Header from "@/components/layout/Header";
import { signOut } from "next-auth/react";
import {
  useGetUserLazyQuery,
  useLogoutMutation,
  useRefreshAccessTokenLazyQuery,
} from "@/__generated__/client";
import { useSession } from "@/hooks/useSession";
import Cart from "@/components/shared/Cart";
import { signIn } from "next-auth/react";

interface IProps {
  children: React.ReactNode;
}

const Layout: React.FC<IProps> = ({ children }) => {
  const { session, update } = useSession();
  const [refreshAccessToken] = useRefreshAccessTokenLazyQuery();
  const timer = useRef<NodeJS.Timeout>();
  const [logout] = useLogoutMutation();
  const [getUser] = useGetUserLazyQuery({
    async onCompleted(data) {
      userFetched.current = true;
      await update({ user: data.me as any });
    },
  });
  const userFetched = useRef(false);
  const refreshingUser = useRef(false);

  useEffect(() => {
    if (session === undefined) return;
    if (session) return;
    if (refreshingUser.current) return;
    refreshingUser.current = true;
    refreshAccessToken()
      .then(async ({ data, error }) => {
        if (error) return;
        const user = data?.refreshAccessToken;
        await signIn("credentials", {
          user: JSON.stringify(user),
          redirect: false,
        });
      })
      .then(() => (refreshingUser.current = false));
  }, [session, refreshingUser]);

  useEffect(() => {
    if (!session) return;
    if (userFetched.current) return;
    getUser().finally(() => {});
  }, [session, userFetched]);

  useEffect(() => {
    if (!session) return;

    async function refresh() {
      try {
        const { data, error } = await refreshAccessToken();
        if (error) return await signOut();
        const token = data?.refreshAccessToken?.accessToken;
        await update({ token });
      } catch (e) {}
    }

    (async () => {
      if (!session?.user.emailVerified) {
        await logout();
        await signOut();
        return;
      }

      const expiresAt = new Date(session.token.expires).getTime();
      const now = new Date().getTime();
      const diff = expiresAt - now;

      clearTimeout(timer.current);
      timer.current = setTimeout(refresh, diff);
    })();

    return () => {
      clearTimeout(timer.current);
    };
  }, [session, timer, update, refreshAccessToken]);

  return (
    <div className="flex min-h-screen animate-reveal flex-col">
      <Header />
      <main className="page-x-padding flex-1 bg-primary pb-20 pt-10 transition-[padding]">
        {children}
      </main>
      <Cart />
    </div>
  );
};

export default Layout;
