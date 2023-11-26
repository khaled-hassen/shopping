import React, { useMemo } from "react";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { initializeApolloClient } from "@/apollo";
import { ssrGetStoreProductPreview } from "@/__generated__/ssr";
import { route } from "@/router";
import Gallery from "@/components/shared/Gallery";
import { asset } from "@/utils/assets";
import { Format } from "@/utils/format";
import Button from "@/components/shared/Button";
import OutlinedButton from "@/components/shared/OutlinedButton";
import ShipmentIcon from "@/components/icons/ShipmentIcon";
import { clsx } from "clsx";
import Expandable from "@/components/shared/Expandable";
import sanitize from "sanitize-html";

export const getServerSideProps = (async (context) => {
  const id = context.params?.id as string;
  const client = initializeApolloClient(context);
  const result = await ssrGetStoreProductPreview.getServerPage(
    { variables: { id } },
    client,
  );
  if (!result.props.data?.store)
    return { redirect: { destination: route("userStore"), permanent: false } };
  if (!result.props.data?.storeProduct) return { notFound: true };
  return result;
}) satisfies GetServerSideProps;
type PageProps = InferGetServerSidePropsType<typeof getServerSideProps>;

const PreviewProduct: React.FC<PageProps> = ({ data }) => {
  function calculatePrice(price: number, discount?: number | null) {
    return Format.currency(price - price * (discount || 0));
  }

  const units = useMemo(() => {
    return (
      data.storeProduct?.units?.reduce(
        (old, newVal) => ({ ...old, [newVal.key]: newVal.value }),
        {} as Record<string, string>,
      ) || {}
    );
  }, [data]);

  return (
    <div className="flex flex-col gap-10">
      <h1 className="text-4xl font-bold uppercase">Product preview</h1>
      <div className="flex flex-col items-start gap-8 lg:flex-row">
        <div className="w-full transition-[width] lg:w-[36rem] xl:w-[40rem]">
          <Gallery
            images={[
              asset(data.storeProduct?.coverImage),
              ...(data.storeProduct?.images || []).map(asset),
            ]}
          />
        </div>
        <div className="flex flex-1 flex-col gap-6">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-6">
              <h2 className="text-4xl font-medium">
                {data.storeProduct?.name}
              </h2>
              {data.storeProduct?.discount && (
                <p className="bg-warning px-1 py-0.5 text-sm">
                  Save {Format.percent(data.storeProduct?.discount)}
                </p>
              )}
            </div>
            <p className="text-2xl">By {data.store?.name}</p>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-4 text-2xl">
              <p className="font-medium">Price:</p>
              <p
                className={clsx({
                  "line-through opacity-50": data.storeProduct?.discount,
                })}
              >
                {Format.currency(data.storeProduct?.price)}
              </p>
            </div>
            {!!data.storeProduct?.discount && (
              <div className="flex items-center gap-4 text-2xl">
                <p className="font-medium">New Price:</p>
                <p className="">
                  {calculatePrice(
                    data.storeProduct?.price || 0,
                    data.storeProduct?.discount,
                  )}
                </p>
              </div>
            )}
          </div>
          <Button title="Add to cart" className="w-full max-w-lg" />
          <OutlinedButton title="Add to wishlist" className="w-full max-w-lg" />
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-4">
              <p className="text-2xl font-medium">Shipment</p>
              <ShipmentIcon />
            </div>
            {data.storeProduct?.shipmentPrice ? (
              <p className="text-xl">
                This product shipment costs{" "}
                {Format.currency(data.storeProduct?.shipmentPrice)}
              </p>
            ) : (
              <p className="text-xl">This item has free shipment</p>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-2xl font-medium">Brief description</p>
            <p className="text-xl">{data.storeProduct?.briefDescription}</p>
          </div>
        </div>
      </div>
      <Expandable title="Product description" defaultOpen>
        <div
          className="all-revert"
          dangerouslySetInnerHTML={{
            __html: sanitize(data.storeProduct?.description || ""),
          }}
        />
      </Expandable>

      <Expandable title="Product description" defaultOpen>
        <div className="flex flex-col gap-4 empty:hidden">
          {Object.entries(data.storeProduct?.details).map(
            ([key, val]: [string, any]) => (
              <div key={key} className="flex items-end gap-2">
                <p className="text-2xl font-medium first-letter:uppercase">
                  {key}:
                </p>
                <p className="text-xl">
                  {val}{" "}
                  {!!units[key] && (
                    <span className="uppercase">{units[key]}</span>
                  )}
                </p>
              </div>
            ),
          )}
        </div>
      </Expandable>
    </div>
  );
};

export default PreviewProduct;
