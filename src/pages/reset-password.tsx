import React from "react";
import FormContainer from "@/components/form/FormContainer";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import PasswordInput from "@/components/form/PasswordInput";
import { useSignal } from "@preact/signals-react";
import { useResetPasswordMutation } from "@/__generated__/client";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Link from "next/link";
import { route } from "@/router";

interface IProps {
  token: string;
}

export const getServerSideProps = (async (context) => {
  const token = context.query.token ? String(context.query.token) : "";
  return { props: { token } };
}) satisfies GetServerSideProps<IProps>;

type PageProps = InferGetServerSidePropsType<typeof getServerSideProps>;

const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(1, "Password is required")
      .min(8, "Confirm password must be at least 8 characters"),
    passwordConfirmation: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "Password does not match",
    path: ["passwordConfirmation"],
  });
type ResetPasswordSchema = z.infer<typeof resetPasswordSchema>;

const ResetPassword: React.FC<PageProps> = ({ token }) => {
  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordSchema>({
    resolver: zodResolver(resetPasswordSchema),
  });
  const resetErrors = useSignal<string[] | null>(null);
  const success = useSignal(false);
  const [resetPassword] = useResetPasswordMutation();

  async function createNewPassword(data: ResetPasswordSchema) {
    const { data: res } = await resetPassword({
      variables: { token, ...data },
    });
    success.value = !!res?.resetPassword.success;
    const errors = res?.resetPassword.errors;

    if (errors) resetErrors.value = errors.map((e) => e.message);
  }

  if (success.value)
    return (
      <div className="pt-20">
        <div className="mx-auto flex max-w-2xl flex-col gap-2">
          <h1 className="text-3xl font-bold">Email changed successfully</h1>
          <div className="flex items-center gap-2 text-xl">
            <p>You can now login with your email address and password</p>

            <Link href={route("login")} className="font-bold">
              Login
            </Link>
          </div>
        </div>
      </div>
    );

  return (
    <div className="pt-20">
      <FormContainer
        title="Create a new password"
        formActionText="Reset password"
        loading={isSubmitting}
        onSubmit={handleSubmit(createNewPassword)}
        errors={resetErrors.value ?? []}
      >
        <PasswordInput
          label="Password"
          placeholder="Minimum 8 characters"
          error={errors.password?.message}
          {...register("password", {
            onBlur: () => trigger("passwordConfirmation"),
          })}
        />
        <PasswordInput
          label="Confirm password"
          placeholder="Repeat your password"
          error={errors.passwordConfirmation?.message}
          {...register("passwordConfirmation", {
            onBlur: () => trigger("passwordConfirmation"),
          })}
        />
      </FormContainer>
    </div>
  );
};

export default ResetPassword;
