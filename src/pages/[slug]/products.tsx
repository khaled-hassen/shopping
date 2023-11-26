import React from "react";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { initializeApolloClient } from "@/apollo";
import { ProductResult, ssrGetProducts } from "@/__generated__/ssr";
import { route } from "@/router";
import OptimizedImage from "@/components/shared/OptimizedImage";
import { asset } from "@/utils/assets";
import PageTitle from "@/components/pages/PageTitle";
import Pagination from "@/utils/pagination";
import Link from "next/link";
import ProductCard from "@/components/shared/ProductCard";

export const getServerSideProps = (async (ctx) => {
  const slug = ctx.params?.slug as string;
  const page = parseInt((ctx.query.page as string) || "1");
  const client = initializeApolloClient();
  const { props } = await ssrGetProducts.getServerPage(
    {
      variables: {
        subcategorySlug: slug,
        pageSize: Pagination.pageSize,
        skip: Pagination.calculateSkip(page),
      },
    },
    client,
  );
  if (!props.data?.products) return { notFound: true };
  return {
    props: {
      ...props,
      page,
      totalPages: Pagination.calculateTotalPages(
        props.data.products?.totalCount || 0,
      ),
    },
  };
}) satisfies GetServerSideProps;
type PageProps = InferGetServerSidePropsType<typeof getServerSideProps>;

const Products: React.FC<PageProps> = ({ data: { products, subcategory } }) => {
  return (
    <div className="-mt-10 flex flex-col gap-20">
      <section className="remove-page-right-padding remove-page-left-padding lg:page-right-padding flex flex-col items-center gap-20 bg-[#EAEBEF] lg:flex-row">
        <div className="relative">
          <OptimizedImage
            src={asset(subcategory?.image)}
            alt={subcategory?.name}
            className="w-full lg:w-auto lg:max-w-xl lg:flex-1 xl:max-w-3xl"
          />

          <div className="page-left-padding absolute left-0 top-0 flex h-full w-full flex-col justify-center gap-8 bg-black/50 text-primary lg:hidden">
            <div className="">
              <Link
                href={route("category", subcategory?.category.slug)}
                className="text-2xl xs:text-3xl sm:text-4xl"
              >
                {subcategory?.category.name}
              </Link>
              <h1 className="text-3xl font-medium xs:text-4xl sm:text-5xl">
                {subcategory?.name}
              </h1>
            </div>
            <p className="text-2xl xs:text-3xl sm:text-4xl">
              Browser through the latest products
            </p>
          </div>
        </div>

        <div className="hidden flex-col gap-8 lg:flex">
          <div>
            <Link
              href={route("category", subcategory?.category.slug)}
              className="text-4xl"
            >
              {subcategory?.category.name}
            </Link>
            <h1 className="text-5xl font-medium">{subcategory?.name}</h1>
          </div>
          <p className="max-w-lg text-4xl">
            Browser through the latest products
          </p>
        </div>
      </section>

      <section className="flex flex-col gap-14">
        <PageTitle title="Products" />
        <div className="grid empty:hidden md:grid-cols-2 xl:grid-cols-3">
          {products?.items?.map((product) => (
            <ProductCard key={product.id} product={product as ProductResult} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Products;
