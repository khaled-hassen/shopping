import React from "react";
import FormContainer from "@/components/form/FormContainer";
import { route } from "@/router";
import Input from "@/components/form/Input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import PasswordInput from "@/components/form/PasswordInput";

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

  function loginUser(data: LoginSchema) {}

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
