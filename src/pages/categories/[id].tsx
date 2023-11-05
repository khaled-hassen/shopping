import React from "react";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { initializeApolloClient } from "@/apollo";
import { ssrGetCategoryData } from "@/__generated__/ssr";
import { route } from "@/router";
import OptimizedImage from "@/components/shared/OptimizedImage";
import { asset } from "@/utils/assets";
import PageTitle from "@/components/pages/PageTitle";
import CategoryCard from "@/components/pages/CategoryCard";

export const getServerSideProps = (async (ctx) => {
  const id = ctx.params?.id as string;
  const client = initializeApolloClient();
  const { props } = await ssrGetCategoryData.getServerPage(
    { variables: { id } },
    client,
  );
  if (!props.data?.category) return { notFound: true };
  return { props };
}) satisfies GetServerSideProps;
type PageProps = InferGetServerSidePropsType<typeof getServerSideProps>;

const Category: React.FC<PageProps> = ({ data }) => {
  return (
    <div className="flex flex-col gap-20">
      <section className="remove-page-right-padding remove-page-left-padding lg:page-left-padding flex flex-col items-center justify-between gap-10 bg-[#EAEBEF] lg:flex-row">
        <div className="hidden flex-col gap-12 lg:flex">
          <div className="flex flex-col gap-1">
            <h1 className="text-4xl font-medium">{data?.category?.name}</h1>
            <p className="max-w-lg text-3xl">
              Elevate Your Experience, Explore Our World.
            </p>
          </div>
        </div>
        <div className="relative w-full lg:w-auto">
          <OptimizedImage
            src={asset(data.category?.image)}
            alt={data.category?.name}
            className="w-full lg:w-auto lg:max-w-2xl lg:flex-1 xl:max-w-4xl"
          />
          <div className="page-left-padding absolute left-0 top-0 flex h-full w-full flex-col justify-center gap-8 bg-black/50 text-primary xs:gap-12 lg:hidden">
            <div className="flex flex-col gap-1">
              <h1 className="text-3xl font-medium sm:text-4xl">
                {data?.category?.name}
              </h1>
              <p className="text-2xl sm:text-3xl">
                Elevate Your Experience, Explore Our World.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-14">
        <PageTitle title="Subcategories" />
        <div className="grid md:grid-cols-2 xl:grid-cols-3">
          {data?.category?.subcategories.map((sub) => (
            <CategoryCard
              key={sub.id}
              title={sub.name}
              image={{
                src: asset(sub.image),
                alt: sub.name,
              }}
              link={route("products", sub.id)}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Category;
