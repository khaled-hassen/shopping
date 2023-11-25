import React from "react";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { initializeApolloClient } from "@/apollo";
import { ssrGetStore } from "@/__generated__/ssr";
import { useSignal } from "@preact/signals-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateStoreMutation } from "@/__generated__/client";
import ImageUpload from "@/components/form/ImageUpload";
import Input from "@/components/form/Input";
import TextArea from "@/components/form/TextArea";
import FormContainer from "@/components/form/FormContainer";
import { useRouter } from "next/navigation";
import { route } from "@/router";

export const getServerSideProps = (async (context) => {
  const client = initializeApolloClient(context);
  const response = await ssrGetStore.getServerPage({}, client);
  if (response.props.data?.store)
    return { redirect: { destination: route("store"), permanent: false } };
  return { props: {} };
}) satisfies GetServerSideProps;

type PageProps = InferGetServerSidePropsType<typeof getServerSideProps>;

const storeSchema = z.object({
  name: z.string().trim().min(1, "Required"),
  description: z.string().trim().min(1, "Required"),
  imageUploaded: z.boolean().refine((val) => val, "Required"),
});
type StoreSchema = z.infer<typeof storeSchema>;

const NewStore: React.FC<PageProps> = () => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { isSubmitting, errors },
  } = useForm<StoreSchema>({ resolver: zodResolver(storeSchema) });
  const image = useSignal<File | null>(null);
  const [createStore, { data }] = useCreateStoreMutation();
  const router = useRouter();

  async function createNewStore(data: StoreSchema) {
    if (!image.value) return;
    const response = await createStore({
      variables: {
        name: data.name,
        description: data.description,
        image: image.value,
      },
    });
    if (response.data?.createStore.errors) return;
    router.replace(route("store"));
  }

  return (
    <div className="flex flex-col gap-10">
      <FormContainer
        title="New store details"
        formActionText="Create store"
        loading={isSubmitting}
        errors={(data?.createStore.errors || []).map((e) => e.message)}
        onSubmit={handleSubmit(createNewStore)}
      >
        <ImageUpload
          label="Store image"
          error={errors.imageUploaded?.message}
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
    </div>
  );
};

export default NewStore;
