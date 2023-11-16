import React, { useEffect } from "react";
import Link from "next/link";
import { route } from "@/router";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useVerifyEmailAddressMutation } from "@/__generated__/client";
import { useSignal } from "@preact/signals-react";

interface IProps {
  token: string;
}

export const getServerSideProps = (async (context) => {
  const token = context.query.token ? String(context.query.token) : "";
  return { props: { token } };
}) satisfies GetServerSideProps<IProps>;

type PageProps = InferGetServerSidePropsType<typeof getServerSideProps>;

const VerificationEmailSent: React.FC<PageProps> = ({ token }) => {
  const [verifyEmail, { loading }] = useVerifyEmailAddressMutation();
  const success = useSignal(true);

  useEffect(() => {
    verifyEmail({ variables: { token } }).then(({ data }) => {
      success.value = !!data?.verifyEmail.success;
    });
  }, [token]);

  if (loading) return null;

  return (
    <div className="pt-56">
      <div className="mx-auto flex max-w-2xl flex-col gap-2">
        <h1 className="text-3xl font-bold">
          {success.value
            ? "Email verified successfully"
            : "Email verification failed"}
        </h1>
        <div className="flex items-center gap-2 text-xl">
          <p>
            {success.value
              ? "You can now login with your email address and password"
              : "The verification link is invalid or expired"}
          </p>
          {success.value && (
            <Link href={route("login")} className="font-bold">
              Login
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerificationEmailSent;
