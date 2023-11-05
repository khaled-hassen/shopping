import React from "react";
import { GetServerSideProps } from "next";
import { initializeApolloClient } from "@/apollo";
import { CategoryResult, ssrGetCategoriesData } from "@/__generated__/ssr";
import LinkButton from "@/components/shared/LinkButton";
import { route } from "@/router";
import OptimizedImage from "@/components/shared/OptimizedImage";
import { asset } from "@/utils/assets";
import PageTitle from "@/components/pages/PageTitle";
import CategoryCard from "@/components/pages/CategoryCard";
import { useComputed } from "@preact/signals-react";

interface IProps {}

export const getServerSideProps: GetServerSideProps = async () => {
  const client = initializeApolloClient();
  return await ssrGetCategoriesData.getServerPage({}, client);
};

const Categories: React.FC<IProps> = ({}) => {
  const { data } = ssrGetCategoriesData.usePage();

  const categories = useComputed<CategoryResult[]>(
    () =>
      data?.categories.filter(
        (cat: CategoryResult) => cat.id !== data?.config?.heroCategory.id,
      ),
  );

  return (
    <div className="flex flex-col gap-20">
      <section
        style={{ backgroundColor: data?.config?.heroBgColor }}
        className="remove-page-right-padding remove-page-left-padding lg:page-right-padding flex flex-col items-center justify-between gap-10 lg:flex-row"
      >
        <div className="relative">
          <OptimizedImage
            src={asset(data?.config?.heroCategory.image)}
            alt={data?.config?.heroCategory.name}
            className="w-full lg:w-auto lg:max-w-2xl lg:flex-1 xl:max-w-4xl"
          />
          <div className="page-left-padding absolute left-0 top-0 flex h-full w-full flex-col justify-center gap-8 bg-black/50 text-primary xs:gap-12 lg:hidden">
            <div className="flex flex-col gap-1">
              <h1 className="text-3xl font-medium sm:text-4xl">
                {data?.config?.heroTitle}
              </h1>
              <p className="text-2xl sm:text-3xl">
                {data?.config?.heroSubtitle}
              </p>
            </div>
            <LinkButton
              title="Discover"
              href={route("category", data?.config?.heroCategory.id)}
              style={{ backgroundColor: data?.config?.heroActionBgColor }}
            />
          </div>
        </div>
        <div className="hidden flex-col gap-12 lg:flex">
          <div className="flex flex-col gap-1">
            <h1 className="text-4xl font-medium">{data?.config?.heroTitle}</h1>
            <p className="max-w-lg text-3xl">{data?.config?.heroSubtitle}</p>
          </div>
          <LinkButton
            title="Discover"
            href={route("category", data?.config?.heroCategory.id)}
            style={{ backgroundColor: data?.config?.heroActionBgColor }}
          />
        </div>
      </section>

      <section className="flex flex-col gap-14">
        <PageTitle title="Categories" />
        <div className="grid md:grid-cols-2 xl:grid-cols-3">
          {categories.value.map((cat) => (
            <CategoryCard
              key={cat.id}
              title={cat.name}
              image={{
                src: asset(cat.image),
                alt: cat.name,
              }}
              link={route("category", cat.id)}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Categories;
