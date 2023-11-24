import React from "react";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { initializeApolloClient } from "@/apollo";
import { ssrGetStore } from "@/__generated__/ssr";
import { useSignal } from "@preact/signals-react";
import ImageUpload from "@/components/form/ImageUpload";
import Input from "@/components/form/Input";
import TextArea from "@/components/form/TextArea";
import FormContainer from "@/components/form/FormContainer";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUpdateStoreDetailsMutation } from "@/__generated__/client";
import { z } from "zod";
import { asset } from "@/utils/assets";
import StoreDetailsContainer from "@/components/pages/store/StoreDetailsContainer";
import PageTitle from "@/components/pages/PageTitle";

export const getServerSideProps = (async (context) => {
  const client = initializeApolloClient(context);
  return await ssrGetStore.getServerPage({}, client);
}) satisfies GetServerSideProps;

type PageProps = InferGetServerSidePropsType<typeof getServerSideProps>;

const storeSchema = z.object({
  name: z.string().trim().min(1, "Required"),
  description: z.string().trim().min(1, "Required"),
  imageUploaded: z.boolean().refine((val) => val, "Required"),
});
type StoreSchema = z.infer<typeof storeSchema>;

const Settings: React.FC<PageProps> = ({ data: storeData }) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { isSubmitting, errors },
  } = useForm<StoreSchema>({
    resolver: zodResolver(storeSchema),
    defaultValues: {
      name: storeData?.store?.name,
      description: storeData?.store?.description,
      imageUploaded: true,
    },
  });
  const image = useSignal<File | null>(null);
  const [updateStore, { data }] = useUpdateStoreDetailsMutation();

  async function saveChanges(data: StoreSchema) {
    if (!image.value) return;
    await updateStore({
      variables: {
        name: data.name,
        description: data.description,
        image: image.value,
      },
    });
  }

  return (
    <div className="flex flex-col gap-10">
      <StoreDetailsContainer onlyNavigation>
        <PageTitle title="Products" />
        <FormContainer
          title="Edit store details"
          formActionText="Save changes"
          loading={isSubmitting}
          errors={(data?.updateStore.errors || []).map((e) => e.message)}
          onSubmit={handleSubmit(saveChanges)}
          extraInfo={
            data?.updateStore?.updated && (
              <p className="text-success font-bold">
                Store details updated successfully
              </p>
            )
          }
        >
          <ImageUpload
            label="Store image"
            error={errors.imageUploaded?.message}
            defaultValue={asset(storeData?.store?.image)}
            onUpload={(file) => {
              image.value = file;
              setValue("imageUploaded", !!file);
            }}
          />
          <Input
            label="Store name"
            placeholder="Store name"
            {...register("name")}
            error={errors.name?.message}
          />
          <TextArea
            label="Description"
            placeholder="Store description"
            {...register("description")}
            error={errors.description?.message}
          />
        </FormContainer>
      </StoreDetailsContainer>
    </div>
  );
};

export default Settings;
