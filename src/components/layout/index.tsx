import React, { useEffect, useRef } from "react";
import Header from "@/components/layout/Header";
import { useSession, signOut } from "next-auth/react";
import { useRefreshAccessTokenMutation } from "@/__generated__/client";

interface IProps {
  children: React.ReactNode;
}

const Layout: React.FC<IProps> = ({ children }) => {
  const { data: session, update } = useSession();
  const [refreshAccessToken] = useRefreshAccessTokenMutation();
  const timer = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (!session) return;
    const expiresAt = new Date(session.token.expires).getTime();
    const now = new Date().getTime();
    const diff = expiresAt - now;

    async function refresh() {
      try {
        const { data } = await refreshAccessToken();
        const token = data?.refreshAccessToken.accessToken;
        await update({ ...session, token });
      } catch (e) {
        await signOut();
      }
    }

    clearTimeout(timer.current);
    timer.current = setTimeout(refresh, diff);

    return () => {
      clearTimeout(timer.current);
    };
  }, [session, timer, update, refreshAccessToken]);

  return (
    <div className="flex min-h-screen animate-reveal flex-col">
      <Header />
      <main className="page-x-padding flex-1 bg-primary pb-20 transition-[padding]">
        {children}
      </main>
    </div>
  );
};

export default Layout;
