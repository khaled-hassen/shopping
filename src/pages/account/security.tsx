import React from "react";
import AccountPageHeader from "@/components/pages/AccountPageHeader";
import FormContainer from "@/components/form/FormContainer";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUpdatePasswordMutation } from "@/__generated__/client";
import PasswordInput from "@/components/form/PasswordInput";

interface IProps {}

const editSecuritySchema = z
  .object({
    oldPassword: z
      .string()
      .min(1, "Password is required")
      .min(8, "Password must be at least 8 characters"),
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
type EditSecuritySchema = z.infer<typeof editSecuritySchema>;

const Security: React.FC<IProps> = ({}) => {
  const {
    register,
    handleSubmit,
    trigger,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EditSecuritySchema>({
    resolver: zodResolver(editSecuritySchema),
  });

  const [updatePassword, { data }] = useUpdatePasswordMutation();

  async function saveChange(data: EditSecuritySchema) {
    await updatePassword({ variables: data });
    reset();
  }

  return (
    <div className="flex flex-col gap-20">
      <AccountPageHeader />
      <FormContainer
        title="Edit your security details"
        formActionText="Save"
        loading={isSubmitting}
        onSubmit={handleSubmit(saveChange)}
        errors={(data?.updatePassword?.errors || []).map(
          (error) => error.message,
        )}
        extraInfo={
          data?.updatePassword.updated && (
            <p className="text-success font-bold">
              Password updated successfully
            </p>
          )
        }
      >
        <PasswordInput
          label="Old password"
          placeholder="Old password"
          error={errors.oldPassword?.message}
          {...register("oldPassword")}
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

export default Security;
