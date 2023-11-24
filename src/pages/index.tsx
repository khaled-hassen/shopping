import React from "react";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { initializeApolloClient } from "@/apollo";
import { ssrGetHomeData } from "@/__generated__/ssr";
import LinkButton from "@/components/shared/LinkButton";
import { route } from "@/router";
import { asset } from "@/utils/assets";
import OptimizedImage from "@/components/shared/OptimizedImage";
import Link from "next/link";

export const getServerSideProps = (async (context) => {
  const client = initializeApolloClient(context);
  return await ssrGetHomeData.getServerPage({}, client);
}) satisfies GetServerSideProps;
type PageProps = InferGetServerSidePropsType<typeof getServerSideProps>;

const Home: React.FC<PageProps> = ({ data }) => {
  return (
    <div className="-mb-20 -mt-10 flex flex-col gap-20">
      <section className="remove-page-right-padding remove-page-left-padding flex flex-col items-center justify-between gap-10 lg:ml-0 lg:flex-row">
        <div className="hidden flex-col gap-12 lg:flex">
          <div className="flex flex-col gap-1">
            <h1 className="text-4xl font-medium">
              Shop {data?.config?.homeHeroCategory.name}
            </h1>
            <p className="text-3xl">
              Discover the latest <br /> products
            </p>
          </div>
          <LinkButton
            title="Discover"
            href={route("category", data?.config?.homeHeroCategory.slug)}
          />
        </div>
        <div className="relative">
          <OptimizedImage
            src={asset(data?.config?.homeHeroCategory.image)}
            alt={data?.config?.homeHeroCategory.name}
            className="w-full lg:w-auto lg:max-w-2xl lg:flex-1 xl:max-w-4xl"
          />
          <div className="page-left-padding absolute left-0 top-0 flex h-full w-full flex-col justify-center gap-8 bg-black/50 text-primary xs:gap-12 lg:hidden">
            <div className="flex flex-col gap-1">
              <h1 className="text-3xl font-medium sm:text-4xl">
                Shop {data?.config?.homeHeroCategory.name}
              </h1>
              <p className="text-2xl sm:text-3xl">
                Discover the latest <br /> products
              </p>
            </div>
            <LinkButton
              title="Discover"
              href={route("category", data?.config?.homeHeroCategory.slug)}
            />
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-14">
        <h2 className="text-4xl font-bold">Top categories</h2>
        <div className="grid grid-cols-[repeat(auto-fit,_minmax(18rem,_1fr))] gap-8">
          {data?.topCategories.map((cat) => (
            <Link
              href={route("category", cat.slug)}
              key={cat.slug}
              className="relative transition-transform duration-300 hover:scale-105"
            >
              <OptimizedImage
                src={asset(cat.image)}
                alt={cat.image}
                className="h-full w-full select-none object-cover"
              />
              <div className="absolute left-0 top-0 grid h-full w-full place-content-center bg-black/50 p-10">
                <p className="text-3xl font-medium text-primary">{cat.name}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="remove-page-left-padding remove-page-right-padding page-left-padding page-right-padding flex flex-col items-center justify-between gap-8 bg-[#EADBC8] py-20 md:flex-row">
        <div className="flex flex-col gap-6">
          <p className="text-2xl xs:text-3xl">
            Discover More, Shop More, Earn More
          </p>
          <p className="max-w-xl text-3xl font-bold xs:text-4xl">
            Register Now and Elevate Your Shopping Experience!
          </p>
        </div>
        <div className="flex flex-col items-center gap-6 xs:flex-row md:flex-col lg:flex-row">
          <LinkButton title="Register" href={route("register")} />
          <LinkButton title="Discover" color="white" href={route("latest")} />
        </div>
      </section>
    </div>
  );
};

export default Home;
