import React, { useMemo } from "react";
import * as Form from "@radix-ui/react-form";
import Button from "@/components/shared/Button";
import Input from "@/components/form/Input";
import RickTextEditor from "@/components/form/RickTextEditor";
import ProductImagesUpload, {
  Image,
} from "@/components/form/ProductImagesUpload";
import SmallInput from "@/components/form/SmallInput";
import WarningIcon from "@/components/icons/WarningIcon";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { initializeApolloClient } from "@/apollo";
import { ssrGetNewProductInitialData } from "@/__generated__/ssr";
import { Format } from "@/utils/format";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Select from "@/components/form/Select";
import {
  FilterType,
  useAddNewProductMutation,
  useGetSubcategoriesLazyQuery,
} from "@/__generated__/client";
import Checkbox from "@/components/form/Checkbox";
import { useSignal } from "@preact/signals-react";
import { redirect, useRouter } from "next/navigation";
import { route } from "@/router";
import sanitize from "sanitize-html";

export const getServerSideProps = (async (context) => {
  const client = initializeApolloClient(context);
  const result = await ssrGetNewProductInitialData.getServerPage({}, client);
  if (!result.props.data?.store)
    return { redirect: { destination: route("userStore"), permanent: false } };
  return result;
}) satisfies GetServerSideProps;
type PageProps = InferGetServerSidePropsType<typeof getServerSideProps>;

const productSchema = z.object({
  name: z.string().trim().min(1, "Required"),
  briefDescription: z.string().trim().min(1, "Required"),
  description: z.string().trim().min(1, "Required"),
  price: z
    .string()
    .trim()
    .min(1, "Required")
    .refine((val) => !isNaN(parseFloat(val)), "Must be a number")
    .refine((val) => parseFloat(val) >= 0, "Must be positive"),
  discount: z
    .string()
    .trim()
    .min(1, "Required")
    .refine((val) => !isNaN(parseFloat(val)), "Must be a number")
    .refine((val) => parseFloat(val ?? "0") >= 0, "Must be positive")
    .refine(
      (val) => parseFloat(val ?? "0") <= 100,
      "Discount cannot be more than 100",
    )
    .default("0"),
  shipmentPrice: z
    .string()
    .trim()
    .min(1, "Required")
    .refine((val) => !isNaN(parseFloat(val)), "Must be a number")
    .refine((val) => parseFloat(val ?? "0") >= 0, "Must be positive"),
  discountedPrice: z.string(),
  totalPrice: z.string(),
  storeFees: z.string(),
  receivedPrice: z.string(),
  categoryId: z.string().trim().min(1, "Required"),
  subcategoryId: z.string().trim().min(1, "Required"),
  productType: z.string().trim().min(1, "Required"),
  details: z.record(z.string(), z.string().trim().min(1, "Required")),
  coverImageAdded: z
    .boolean()
    .default(false)
    .refine((val) => val, "At least one image is required"),
});
type ProductSchema = z.infer<typeof productSchema>;

const NewProduct: React.FC<PageProps> = ({ data }) => {
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    trigger,
    watch,
    formState: { isSubmitting, errors },
  } = useForm<ProductSchema>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      discount: "0",
      shipmentPrice: "0",
      discountedPrice: "0",
      totalPrice: "0",
      storeFees: "0",
      receivedPrice: "0",
    },
  });
  const router = useRouter();
  const [fetchSubcategories, { data: subcategories }] =
    useGetSubcategoriesLazyQuery();
  const [addProduct, { data: addProductData }] = useAddNewProductMutation();
  const images = useSignal<Image[]>([]);

  const productTypes = useMemo(
    () =>
      subcategories?.subcategories?.find(
        (s) => s.id === getValues("subcategoryId"),
      )?.productTypes,
    [getValues, subcategories?.subcategories, getValues("subcategoryId")],
  );

  const productDetails = useMemo(
    () =>
      subcategories?.subcategories
        ?.find(({ id }) => id === getValues("subcategoryId"))
        ?.filters?.filter((filter) =>
          filter.productTypes.includes(getValues("productType")),
        ),
    [
      getValues,
      subcategories?.subcategories,
      getValues("subcategoryId"),
      getValues("productType"),
    ],
  );

  function calculatePrices() {
    const price = parseFloat(getValues("price"));
    const discount = parseFloat(getValues("discount"));
    const shipmentPrice = parseFloat(getValues("shipmentPrice"));
    const discountedPrice = price - (price * discount) / 100;
    const totalPrice = (discountedPrice || price) + shipmentPrice;
    const storeFees = totalPrice * data.storeFee;
    const receivedPrice = totalPrice - storeFees;

    setValue("discountedPrice", discountedPrice.toFixed(2));
    setValue("totalPrice", totalPrice.toFixed(2));
    setValue("storeFees", storeFees.toFixed(2));
    setValue("receivedPrice", receivedPrice.toFixed(2));
  }

  async function selectCategory(id: string) {
    setValue("categoryId", id);
    setValue("subcategoryId", "");
    setValue("productType", "");
    setValue("details", {});
    await trigger("categoryId");
    await fetchSubcategories({ variables: { categoryId: id } });
  }

  async function selectSubcategory(id: string) {
    setValue("subcategoryId", id);
    setValue("productType", "");
    setValue("details", {});
    await trigger("subcategoryId");
  }

  async function selectProductType(value: string) {
    setValue("productType", value.toLowerCase());
    setValue("details", {});
    await trigger("productType");
  }

  async function createNewProduct(product: ProductSchema) {
    if (!images.value.length) return;
    const coverImage =
      images.value.find((i) => i.cover)?.file || images.value[0].file;
    const otherImages = images.value
      .filter((i) => i.file !== coverImage)
      .map((i) => i.file);
    const { data } = await addProduct({
      variables: {
        product: {
          name: product.name,
          description: sanitize(product.description),
          briefDescription: product.briefDescription,
          categoryId: product.categoryId,
          subcategoryId: product.subcategoryId,
          productType: product.productType,
          coverImage: { newImage: true, file: coverImage },
          images: otherImages.map((file) => ({ newImage: true, file })),
          price: parseFloat(product.price),
          discount: parseFloat(product.discount) / 100,
          shipmentPrice: parseFloat(product.shipmentPrice),
          details: product.details,
        },
      },
    });
    if (data?.createNewProduct.created) router.push(route("userStore"));
  }

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-bold">Create a new product</h1>
        {addProductData?.createNewProduct?.errors?.map((err) => (
          <p key={err.message} className="font-bold text-danger">
            {err.message}
          </p>
        ))}
      </div>
      <Form.Root
        className="flex flex-col gap-10"
        onSubmit={handleSubmit(createNewProduct)}
      >
        <ProductImagesUpload
          label="Product images"
          error={errors.coverImageAdded?.message}
          onUpload={async (values) => {
            images.value = values;
            setValue("coverImageAdded", values.length > 0);
            await trigger("coverImageAdded");
          }}
        />
        <Input
          label="Produt name"
          placeholder="Product name"
          error={errors.name?.message}
          {...register("name")}
        />
        <Input
          label="Product brief description"
          placeholder="Short description"
          error={errors.briefDescription?.message}
          {...register("briefDescription")}
        />
        <RickTextEditor
          label="Product description"
          error={errors.description?.message}
          onChange={async (val) => {
            setValue("description", val);
            await trigger("description");
          }}
        />

        <div className="flex flex-col gap-6">
          <p className="text-2xl font-bold">Product details</p>
          <div className="grid gap-4 xs:grid-cols-2 md:grid-cols-3">
            <Select
              label="Categories"
              placeholder="Select a category"
              options={data.categories.map((c) => ({
                label: c.name,
                value: c.id,
              }))}
              error={errors.categoryId?.message}
              onSelect={async (val) => selectCategory(val.value)}
            />
            <Select
              key={watch("categoryId")}
              disabled={!subcategories?.subcategories}
              label="Subcategories"
              placeholder="Select a category"
              options={subcategories?.subcategories?.map((c) => ({
                label: c.name,
                value: c.id,
              }))}
              error={errors.subcategoryId?.message}
              onSelect={async (val) => selectSubcategory(val.value)}
            />
            <Select
              key={watch("subcategoryId")}
              disabled={!watch("subcategoryId")}
              label="Product type"
              placeholder="Select a category"
              options={productTypes?.map((name) => ({
                label: name,
                value: name,
              }))}
              error={errors.productType?.message}
              onSelect={(val) => selectProductType(val.value)}
            />
          </div>
          <div className="flex flex-wrap items-center gap-4 empty:hidden">
            {productDetails?.map((detail, i) => (
              <div key={i} className="w-full xs:w-auto xs:max-w-sm">
                {detail.type === FilterType.Boolean ? (
                  <Checkbox
                    label={detail.name}
                    error={errors.details?.[detail.name]?.message}
                    {...register(`details.${detail.name}`)}
                  />
                ) : (
                  <SmallInput
                    label={detail.name}
                    placeholder={detail.name}
                    unit={detail.unit}
                    type={detail.type === FilterType.Number ? "number" : "text"}
                    inputClassName="w-full"
                    error={errors.details?.[detail.name]?.message}
                    {...register(`details.${detail.name}`)}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-6">
          <p className="text-2xl font-bold">Product pricing</p>
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-start gap-4">
              <SmallInput
                label="Price"
                placeholder={100}
                error={errors.price?.message}
                unit="EUR"
                type="number"
                {...register("price", { onChange: calculatePrices })}
              />
              <SmallInput
                label="Discount"
                placeholder={20}
                unit="%"
                type="number"
                maxValue={100}
                error={errors.discount?.message}
                {...register("discount", { onChange: calculatePrices })}
              />
              <SmallInput
                disabled
                label="Discounted price"
                placeholder={80}
                unit="EUR"
                type="number"
                {...register("discountedPrice")}
              />
            </div>
            <div className="flex flex-wrap items-start gap-4">
              <SmallInput
                label="Delivery"
                placeholder={5}
                unit="EUR"
                type="number"
                error={errors.shipmentPrice?.message}
                {...register("shipmentPrice", {
                  onChange: calculatePrices,
                })}
              />
              <SmallInput
                label="Total price"
                placeholder={85}
                unit="EUR"
                type="number"
                {...register("totalPrice")}
              />
            </div>
            <div className="flex items-center gap-2 text-xl">
              <WarningIcon />
              <p className="">
                On every transaction{" "}
                <strong>{Format.percent(data.storeFee)}</strong> goes to
                OneStopMALL.
              </p>
            </div>
            <div className="flex flex-wrap items-start gap-4">
              <SmallInput
                label="Store fees"
                placeholder={12.75}
                unit="EUR"
                type="number"
                disabled
                {...register("storeFees")}
              />
              <SmallInput
                label="Received price"
                placeholder={72.25}
                unit="EUR"
                type="number"
                disabled
                {...register("receivedPrice")}
              />
            </div>
          </div>
        </div>
        <Form.Submit asChild className="self-end">
          <Button title="Create product" type="submit" loading={isSubmitting} />
        </Form.Submit>
      </Form.Root>
    </div>
  );
};

export default NewProduct;
