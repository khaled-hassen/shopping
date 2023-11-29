import { useSession as useActiveSession } from "next-auth/react";
import { Session } from "next-auth";

interface UpdateSessionParams {
  user?: Partial<Session["user"]>;
  token?: Partial<Session["token"]>;
  expires?: Session["expires"];
}

export function useSession() {
  const { data: session, update: updateSession } = useActiveSession();

  async function update({ user, token, expires }: UpdateSessionParams) {
    const newUser = { ...session?.user, ...user };
    const newToken = { ...session?.token, ...token };

    await updateSession({
      ...session,
      ...{ user: newUser, token: newToken, expires },
    });
  }

  return { session, update };
}
