import React, { useMemo } from "react";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { initializeApolloClient } from "@/apollo";
import { ssrGetProduct, ssrGetReviews } from "@/__generated__/ssr";
import Gallery from "@/components/shared/Gallery";
import { asset } from "@/utils/assets";
import { Format } from "@/utils/format";
import Button from "@/components/shared/Button";
import OutlinedButton from "@/components/shared/OutlinedButton";
import ShipmentIcon from "@/components/icons/ShipmentIcon";
import { clsx } from "clsx";
import Expandable from "@/components/shared/Expandable";
import sanitize from "sanitize-html";
import Link from "next/link";
import { route } from "@/router";
import ChevronIcon from "@/components/icons/ChevronIcon";
import {
  useAddProductToWishlistMutation,
  useRemoveProductFromWishlistMutation,
} from "@/__generated__/client";
import { useSession } from "@/hooks/useSession";
import { useSignal } from "@preact/signals-react";
import { usePathname, useRouter } from "next/navigation";
import { useCart } from "@/hooks/useCart";
import Pagination from "@/utils/pagination";
import OutlinedStarIcon from "@/components/icons/OutlinedStarIcon";
import ReviewSection from "@/components/pages/product/ReviewSection";

export const getServerSideProps = (async (context) => {
  const id = context.params?.id as string;
  const page = parseInt((context.query.page as string) || "1");
  const client = initializeApolloClient(context);
  const [product, reviews] = await Promise.all([
    ssrGetProduct.getServerPage({ variables: { id } }, client),
    ssrGetReviews.getServerPage(
      {
        variables: {
          id,
          pageSize: Pagination.pageSize,
          skip: Pagination.calculateSkip(page),
        },
      },
      client,
    ),
  ]);

  if (!product.props.data?.product) return { notFound: true };
  return {
    props: {
      ...product.props.data,
      reviews: reviews.props.data.productReviews?.items,
      page,
      totalPages: Pagination.calculateTotalPages(
        reviews.props.data.productReviews?.totalCount || 0,
      ),
    },
  };
}) satisfies GetServerSideProps;
type PageProps = InferGetServerSidePropsType<typeof getServerSideProps>;

const Product: React.FC<PageProps> = ({
  product,
  reviews,
  page,
  totalPages,
}) => {
  const { session } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const { addToCartLoading, addProductToCart, isInCart, openCart } = useCart();

  const [addToWishlist, { loading: addingLoading }] =
    useAddProductToWishlistMutation();
  const [deleteFromWishlist, { loading: removingLoading }] =
    useRemoveProductFromWishlistMutation();
  const inWishlist = useSignal(product?.inWishlist || false);

  const units = useMemo(() => {
    return (
      product?.units?.reduce(
        (old, newVal) => ({ ...old, [newVal.key]: newVal.value }),
        {} as Record<string, string>,
      ) || {}
    );
  }, [product]);

  function calculatePrice(price: number, discount?: number | null) {
    return Format.currency(price - price * (discount || 0));
  }

  async function toggleWishlist() {
    if (!session)
      return router.push(
        route("login") + `?callbackUrl=${encodeURIComponent(pathname)}`,
      );
    if (!product?.id) return;
    if (inWishlist.value)
      await deleteFromWishlist({ variables: { productId: product?.id } });
    else await addToWishlist({ variables: { productId: product?.id } });
    inWishlist.value = !inWishlist.value;
  }

  function changePage(page: number) {
    router.push(route("product", product?.id) + `?page=${page}`, {
      scroll: false,
    });
  }

  return (
    <div className="flex flex-col gap-10">
      <div className="flex w-fit flex-col items-start">
        <div className="h-1 w-10 bg-dark-gray/50" />
        <div className="flex items-center text-xl font-medium">
          <Link href={route("category", product?.category?.slug)}>
            {product?.category?.name}
          </Link>
          <ChevronIcon />
          <Link href={route("products", product?.subcategory?.slug)}>
            {product?.subcategory?.name}
          </Link>
          <ChevronIcon />
          <p>{product?.name}</p>
        </div>
      </div>

      <div className="flex flex-col items-start gap-8 lg:flex-row">
        <div className="w-full transition-[width] lg:w-[36rem] xl:w-[40rem]">
          <Gallery
            images={[
              asset(product?.coverImage),
              ...(product?.images || []).map(asset),
            ]}
          />
        </div>

        <div className="flex flex-1 flex-col gap-6">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-6">
              <h2 className="text-4xl font-medium">{product?.name}</h2>
              {product?.discount && (
                <p className="bg-warning px-1 py-0.5 text-sm">
                  Save {Format.percent(product?.discount)}
                </p>
              )}
            </div>
            <Link
              href={route("store", product?.store?.id)}
              className="w-fit text-2xl"
            >
              By {product?.store?.name}
            </Link>
            <div className="flex items-center gap-2">
              <OutlinedStarIcon size={24} thickness={2} />
              <p className="text-xl">
                {Format.rating(
                  reviews?.[0].averageRating,
                  reviews?.[0].totalRatings,
                )}
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-4 text-2xl">
              <p className="font-medium">Price:</p>
              <p
                className={clsx({
                  "line-through opacity-50": product?.discount,
                })}
              >
                {Format.currency(product?.price)}
              </p>
            </div>
            {!!product?.discount && (
              <div className="flex items-center gap-4 text-2xl">
                <p className="font-medium">New Price:</p>
                <p className="">
                  {calculatePrice(product?.price || 0, product?.discount)}
                </p>
              </div>
            )}
          </div>
          <Button
            title={isInCart(product?.id || "") ? "View in cart" : "Add to cart"}
            className="w-full max-w-lg"
            loading={addToCartLoading}
            onClick={() =>
              isInCart(product?.id || "")
                ? openCart()
                : addProductToCart(product?.id || "")
            }
          />
          <OutlinedButton
            title={
              inWishlist.value ? "Remove from wishlist" : "Add to wishlist"
            }
            loading={addingLoading || removingLoading}
            className="w-full max-w-lg"
            onClick={toggleWishlist}
          />
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-4">
              <p className="text-2xl font-medium">Shipment</p>
              <ShipmentIcon />
            </div>
            {product?.shipmentPrice ? (
              <p className="text-xl">
                This product shipment costs{" "}
                {Format.currency(product?.shipmentPrice)}
              </p>
            ) : (
              <p className="text-xl">This item has free shipment</p>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-2xl font-medium">Brief description</p>
            <p className="text-xl">{product?.briefDescription}</p>
          </div>
        </div>
      </div>

      <Expandable title="Product description" defaultOpen>
        <div
          className="all-revert"
          dangerouslySetInnerHTML={{
            __html: sanitize(product?.description || ""),
          }}
        />
      </Expandable>

      <Expandable title="Product description" defaultOpen>
        <div className="flex flex-col gap-4 empty:hidden">
          {Object.entries(product?.details).map(([key, val]: [string, any]) => (
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
          ))}
        </div>
      </Expandable>

      <ReviewSection
        avgRating={reviews?.[0].averageRating || 0}
        totalReviews={reviews?.[0].totalRatings || 0}
        reviews={reviews || []}
        page={page}
        totalPages={totalPages}
        onPageChange={changePage}
      />
    </div>
  );
};

export default Product;
