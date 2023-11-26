import React from "react";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { initializeApolloClient } from "@/apollo";
import {
  ProductResult,
  PublicStore,
  ssrGetStoreProducts,
} from "@/__generated__/ssr";
import PageTitle from "@/components/pages/PageTitle";
import { route } from "@/router";
import OptimizedImage from "@/components/shared/OptimizedImage";
import { asset } from "@/utils/assets";
import Pagination from "@/utils/pagination";
import Paging from "@/components/shared/Paging";
import { useRouter } from "next/navigation";
import ProductCard from "@/components/shared/ProductCard";

export const getServerSideProps = (async (context) => {
  const page = parseInt((context.query.page as string) || "1");
  const id = context.params?.id as string;
  const client = initializeApolloClient(context);
  const response = await ssrGetStoreProducts.getServerPage(
    {
      variables: {
        id,
        pageSize: Pagination.pageSize,
        skip: Pagination.calculateSkip(page),
      },
    },
    client,
  );
  if (!response.props.data?.publicStore) return { notFound: true };

  return {
    props: {
      ...response.props,
      page,
      totalPages: Pagination.calculateTotalPages(
        response.props.data.storeProducts?.totalCount || 0,
      ),
    },
  };
}) satisfies GetServerSideProps;

type PageProps = InferGetServerSidePropsType<typeof getServerSideProps>;

const Store: React.FC<PageProps> = ({
  data: { publicStore, storeProducts },
  page,
  totalPages,
}) => {
  const router = useRouter();

  function changePage(page: number) {
    router.push(route("store", publicStore?.id) + `?page=${page}`, {
      scroll: false,
    });
    window.scroll({ top: 0 });
  }

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-10">
        <div className="remove-page-right-padding remove-page-left-padding -mt-10">
          <OptimizedImage
            src={asset(publicStore?.image)}
            alt=""
            className="h-20 w-full object-cover object-center xs:h-40 md:h-auto"
          />
        </div>
        <div className="flex flex-col gap-4">
          <h1 className="text-5xl font-bold">{publicStore?.name}</h1>
          <p className="text-3xl">{publicStore?.description}</p>
        </div>

        <PageTitle title="Products" />
        <div className="grid empty:hidden md:grid-cols-2 xl:grid-cols-3">
          {storeProducts?.items?.map((product) => (
            <ProductCard
              key={product.id}
              product={product as ProductResult}
              store={publicStore as PublicStore}
            />
          ))}
        </div>
        <div className="flex justify-center">
          <Paging
            initialPage={page}
            totalPages={totalPages}
            onPageChange={changePage}
          />
        </div>
      </div>
    </div>
  );
};

export default Store;
