import React from "react";
import FormContainer from "@/components/form/FormContainer";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Input from "@/components/form/Input";
import TextArea from "@/components/form/TextArea";
import ImageUpload from "@/components/form/ImageUpload";
import { useSignal } from "@preact/signals-react";
import { Store, useCreateStoreMutation } from "@/__generated__/client";

interface IProps {
  onCreated(store: Store): void;
}

const storeSchema = z.object({
  name: z.string().trim().min(1, "Required"),
  description: z.string().trim().min(1, "Required"),
  imageUploaded: z.boolean().refine((val) => val, "Required"),
});
type StoreSchema = z.infer<typeof storeSchema>;

const CreateNewStore: React.FC<IProps> = ({ onCreated }) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { isSubmitting, errors },
  } = useForm<StoreSchema>({ resolver: zodResolver(storeSchema) });
  const image = useSignal<File | null>(null);
  const [createStore, { data }] = useCreateStoreMutation();

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
    onCreated(response.data?.createStore.store as Store);
  }

  return (
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
  );
};

export default CreateNewStore;
