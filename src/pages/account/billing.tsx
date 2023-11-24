import React from "react";
import AccountPageHeader from "@/components/pages/AccountPageHeader";
import FormContainer from "@/components/form/FormContainer";
import Input from "@/components/form/Input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "@/hooks/useSession";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { route } from "@/router";
import { useUpdateBillingDetailsMutation } from "@/__generated__/client";

export const getServerSideProps = (async ({ req, res }) => {
  const session = await getServerSession(req, res, authOptions);
  if (!session)
    return { redirect: { destination: route("login"), permanent: false } };
  return { props: { ...session.user } };
}) satisfies GetServerSideProps;

type PageProps = InferGetServerSidePropsType<typeof getServerSideProps>;

const billingDetailsSchema = z.object({
  firstName: z.string().trim().min(1, "Required"),
  lastName: z.string().trim().min(1, "Required"),
  country: z.string().trim().min(1, "Required"),
  address: z.string().trim().min(1, "Required"),
  city: z.string().trim().min(1, "Required"),
  state: z.string().trim().min(1, "Required"),
  postalCode: z
    .string()
    .trim()
    .min(1, "Required")
    .refine((val) => /^\d+$/.test(val), { message: "Must be a number" })
    .refine((val) => parseInt(val) !== 0, { message: "Cannot be 0" }),
});
type BillingDetailsSchema = z.infer<typeof billingDetailsSchema>;

const Billing: React.FC<PageProps> = ({ billingDetails }) => {
  const { update } = useSession();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<BillingDetailsSchema>({
    resolver: zodResolver(billingDetailsSchema),
    defaultValues: {
      ...billingDetails,
      postalCode: billingDetails?.postalCode.toString(),
    },
  });
  const [updateBillingDetails, { data }] = useUpdateBillingDetailsMutation();

  async function saveChange(billingDetails: BillingDetailsSchema) {
    const newBillingDetails = {
      ...billingDetails,
      postalCode: parseInt(billingDetails.postalCode),
    };

    const { data } = await updateBillingDetails({
      variables: {
        billingDetails: {
          ...billingDetails,
          postalCode: parseInt(billingDetails.postalCode),
        },
      },
    });
    if (data?.updateBillingDetails?.errors) return;
    await update({ user: { billingDetails: newBillingDetails } });
  }

  return (
    <div className="flex flex-col gap-20">
      <AccountPageHeader />
      <FormContainer
        title="Edit your billing details"
        formActionText="Save"
        loading={isSubmitting}
        onSubmit={handleSubmit(saveChange)}
        errors={(data?.updateBillingDetails?.errors || []).map(
          (error) => error.message,
        )}
        extraInfo={
          data?.updateBillingDetails.updated && (
            <p className="text-success font-bold">
              Billing details updated successfully
            </p>
          )
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
          label="Country"
          placeholder="Your current country"
          error={errors.country?.message}
          {...register("country")}
        />
        <Input
          label="City"
          placeholder="Your current city"
          error={errors.city?.message}
          {...register("city")}
        />
        <Input
          label="Address"
          placeholder="Your current address"
          error={errors.address?.message}
          {...register("address")}
        />
        <div className="grid items-end gap-6 sm:grid-cols-2">
          <Input
            label="State / Region"
            placeholder="State / Region"
            error={errors.state?.message}
            {...register("state")}
          />
          <Input
            label="Zip / Postal code"
            placeholder="1000"
            error={errors.postalCode?.message}
            {...register("postalCode")}
          />
        </div>
      </FormContainer>
    </div>
  );
};

export default Billing;
