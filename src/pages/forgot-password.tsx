import React from "react";
import FormContainer from "@/components/form/FormContainer";
import { route } from "@/router";
import Input from "@/components/form/Input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import PasswordInput from "@/components/form/PasswordInput";
import { useSignal } from "@preact/signals-react";
import { useRequestPasswordRestLazyQuery } from "@/__generated__/client";
import Link from "next/link";
import Button from "@/components/shared/Button";

interface IProps {}

const resetPasswordSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email address is required")
    .email("Invalid email address"),
});
type ResetPasswordSchema = z.infer<typeof resetPasswordSchema>;

const ForgotPassword: React.FC<IProps> = ({}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordSchema>({
    resolver: zodResolver(resetPasswordSchema),
  });
  const resetError = useSignal<string | null>(null);
  const emailSent = useSignal(false);
  const [requestPasswordRest, { loading }] = useRequestPasswordRestLazyQuery();

  async function resetPassword(data: ResetPasswordSchema) {
    const { data: res, error } = await requestPasswordRest({ variables: data });
    if (error) {
      // @ts-ignore
      const errorMessage = error?.networkError?.result?.errors?.[0]?.message;
      resetError.value = errorMessage ?? null;
      return;
    }
    emailSent.value = true;
  }

  if (emailSent.value)
    return (
      <div className="pt-20">
        <div className="mx-auto flex max-w-2xl flex-col gap-2">
          <h1 className="text-3xl font-bold">Password reset email sent</h1>
          <p className="text-2xl">
            If your account exists you will receive a password reset email.
            Please check your inbox and click the link in the email to verify
            your account.
          </p>
        </div>
      </div>
    );

  return (
    <div className="pt-20">
      <FormContainer
        title="Forgot your password?"
        subtitle="Please enter your email address below and we'll email you a password reset link."
        formActionText="Reset password"
        loading={isSubmitting}
        onSubmit={handleSubmit(resetPassword)}
        errors={resetError.value ? [resetError.value] : undefined}
      >
        <Input
          label="Email address"
          placeholder="example@gmail.com"
          error={errors.email?.message}
          {...register("email")}
        />
      </FormContainer>
    </div>
  );
};

export default ForgotPassword;
