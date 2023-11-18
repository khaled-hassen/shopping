import React from "react";
import FormContainer from "@/components/form/FormContainer";
import { route } from "@/router";
import Input from "@/components/form/Input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import PasswordInput from "@/components/form/PasswordInput";
import { useSignal } from "@preact/signals-react";
import { useRouter } from "next/navigation";
import { useCreateAccountMutation } from "@/__generated__/client";

interface IProps {}

const registerSchema = z
  .object({
    firstName: z.string().trim().min(1, "First name is required"),
    lastName: z.string().trim().min(1, "Last name is required"),
    email: z
      .string()
      .trim()
      .min(1, "Email address is required")
      .email("Invalid email address"),
    phoneNumber: z
      .string()
      .trim()
      .min(1, "Phone number is required")
      .min(7, "Phone number must be at least 7 characters")
      .max(15, "Phone number must be at most 15 characters")
      .regex(/^\+?[0-9]+$/, "Invalid phone number"),
    password: z
      .string()
      .min(1, "Password is required")
      .min(8, "Password must be at least 8 characters"),
    passwordConfirmation: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "Password does not match",
    path: ["passwordConfirmation"],
  });
type RegisterSchema = z.infer<typeof registerSchema>;

const Register: React.FC<IProps> = ({}) => {
  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<RegisterSchema>({ resolver: zodResolver(registerSchema) });
  const registerErrors = useSignal<string[] | null>(null);

  const router = useRouter();
  const [createAccount] = useCreateAccountMutation();

  async function createNewAccount(data: RegisterSchema) {
    const { data: res } = await createAccount({ variables: data });
    const emailSent = res?.createAccount.emailSent;
    const errors = res?.createAccount.errors;

    if (emailSent)
      return router.replace(
        route("verificationEmailSent") + `?email=${data.email}`,
      );

    if (errors) registerErrors.value = errors.map((e) => e.message);
  }

  return (
    <div className="pt-10">
      <FormContainer
        title="Create a new account"
        subtitle="Already have an account?"
        subtitleActionText="Login"
        subtitleActionHref={route("login")}
        formActionText="Create account"
        loading={isSubmitting}
        onSubmit={handleSubmit(createNewAccount)}
        errors={registerErrors.value ?? []}
      >
        <Input
          label="First name"
          placeholder="First name"
          error={errors.firstName?.message}
          {...register("firstName")}
        />
        <Input
          label="Last name"
          placeholder="Last name"
          error={errors.lastName?.message}
          {...register("lastName")}
        />
        <Input
          label="Email address"
          placeholder="example@gmail.com"
          error={errors.email?.message}
          {...register("email")}
        />
        <Input
          label="Phone number"
          placeholder="+36123456789"
          error={errors.phoneNumber?.message}
          {...register("phoneNumber")}
        />
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

export default Register;
