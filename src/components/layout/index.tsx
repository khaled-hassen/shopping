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
      await update({ user: data.me as any });
    },
  });
  const userFetched = useRef(false);

  useEffect(() => {
    if (!session) return;
    if (userFetched.current) return;
    getUser().then(() => (userFetched.current = true));
  }, [session, userFetched]);

  useEffect(() => {
    if (!session) return;

    async function refresh() {
      try {
        const { data, error } = await refreshAccessToken();
        if (error) return await signOut();
        const token = data?.refreshAccessToken;
        await update({ token });
      } catch (e) {
        await signOut();
      }
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
