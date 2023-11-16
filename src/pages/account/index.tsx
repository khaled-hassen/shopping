import React from "react";
import AccountPageHeader from "@/components/pages/AccountPageHeader";
import FormContainer from "@/components/form/FormContainer";
import Input from "@/components/form/Input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSignal } from "@preact/signals-react";
import { useSession } from "@/hooks/useSession";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { route } from "@/router";
import { useUpdatePersonalInfoMutation } from "@/__generated__/client";

export const getServerSideProps = (async ({ req, res }) => {
  const session = await getServerSession(req, res, authOptions);
  if (!session)
    return { redirect: { destination: route("login"), permanent: false } };

  return { props: { ...session.user } };
}) satisfies GetServerSideProps;

type PageProps = InferGetServerSidePropsType<typeof getServerSideProps>;

const editProfileSchema = z.object({
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
});
type EditProfileSchema = z.infer<typeof editProfileSchema>;

const Account: React.FC<PageProps> = ({
  email,
  firstName,
  lastName,
  phoneNumber,
}) => {
  const { update } = useSession();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<EditProfileSchema>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: { email, firstName, lastName, phoneNumber },
  });
  const editErrors = useSignal<string[] | null>(null);
  const [editPersonalData] = useUpdatePersonalInfoMutation();
  const success = useSignal(false);
  const emailUpdated = useSignal(false);

  async function saveChange(data: EditProfileSchema) {
    const { data: response } = await editPersonalData({ variables: data });
    if (response?.editPersonalData?.errors) {
      editErrors.value = response.editPersonalData.errors.map(
        (error) => error.message,
      );
      return;
    }

    success.value =
      !!response?.editPersonalData.personalDataEditResult?.success;
    const emailChanged =
      !!response?.editPersonalData.personalDataEditResult?.emailChanged;
    emailUpdated.value = emailChanged;
    editErrors.value = null;
    await update({ user: { ...data, emailVerified: !emailChanged } });
  }

  return (
    <div className="flex flex-col gap-20">
      <AccountPageHeader />
      <FormContainer
        title="Edit your personal data"
        formActionText="Save"
        loading={isSubmitting}
        onSubmit={handleSubmit(saveChange)}
        errors={editErrors.value ?? []}
        extraInfo={
          <>
            {success.value && (
              <p className="font-bold text-green-600">
                Personal data updated successfully
              </p>
            )}
            {emailUpdated.value && (
              <p className="font-bold text-green-600">
                Check your email inbox for to verify your new email address
              </p>
            )}
          </>
        }
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
      </FormContainer>
    </div>
  );
};

export default Account;
