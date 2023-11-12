import React from "react";
import FormContainer from "@/components/form/FormContainer";
import { route } from "@/router";
import Input from "@/components/form/Input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import PasswordInput from "@/components/form/PasswordInput";
import { signIn } from "next-auth/react";
import { useSignal } from "@preact/signals-react";
import { useRouter, useSearchParams } from "next/navigation";

interface IProps {}

const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email address is required")
    .email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});
type LoginSchema = z.infer<typeof loginSchema>;

const Login: React.FC<IProps> = ({}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginSchema>({ resolver: zodResolver(loginSchema) });
  const loginError = useSignal<string | null>(null);

  const router = useRouter();
  const params = useSearchParams();

  async function loginUser(data: LoginSchema) {
    const callbackUrl = params.get("callbackUrl") || route("home");

    const response = await signIn("credentials", {
      ...data,
      redirect: false,
    });
    loginError.value = response?.error ?? null;
    if (response?.ok) router.replace(callbackUrl);
  }

  return (
    <div className="pt-20">
      <FormContainer
        title="Login to your account"
        subtitle="Don’t have an account yet?"
        subtitleActionText="Register"
        subtitleActionHref={route("register")}
        formActionText="Login"
        loading={isSubmitting}
        onSubmit={handleSubmit(loginUser)}
        errors={loginError.value ? [loginError.value] : undefined}
      >
        <Input
          label="Email address"
          placeholder="example@gmail.com"
          error={errors.email?.message}
          {...register("email")}
        />
        <PasswordInput
          label="Password"
          placeholder="Password"
          error={errors.password?.message}
          {...register("password")}
        />
      </FormContainer>
    </div>
  );
};

export default Login;
