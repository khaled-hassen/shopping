import React from "react";
import AccountPageHeader from "@/components/pages/AccountPageHeader";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import ProductCard from "@/components/shared/ProductCard";
import {
  ProductResult,
  PublicStore,
  ssrGetUserWishlistItems,
} from "@/__generated__/ssr";
import { initializeApolloClient } from "@/apollo";
import Pagination from "@/utils/pagination";
import Paging from "@/components/shared/Paging";
import { route } from "@/router";
import { useRouter } from "next/navigation";

export const getServerSideProps = (async (context) => {
  const client = initializeApolloClient(context);
  const page = parseInt((context.query.page as string) || "1");
  const { props } = await ssrGetUserWishlistItems.getServerPage(
    {
      variables: {
        pageSize: Pagination.pageSize,
        skip: Pagination.calculateSkip(page),
      },
    },
    client,
  );

  return {
    props: {
      ...props,
      page,
      totalPages: Pagination.calculateTotalPages(
        props.data?.userWishlistProducts?.totalCount || 0,
      ),
    },
  };
}) satisfies GetServerSideProps;

type PageProps = InferGetServerSidePropsType<typeof getServerSideProps>;

const Wishlist: React.FC<PageProps> = ({
  data: { userWishlistProducts },
  page,
  totalPages,
}) => {
  const router = useRouter();

  function changePage(page: number) {
    router.push(route("wishlist") + `?page=${page}`, { scroll: false });
    window.scroll({ top: 0 });
  }

  return (
    <div className="flex flex-col gap-20">
      <AccountPageHeader />
      <div className="grid empty:hidden md:grid-cols-2 xl:grid-cols-3">
        {userWishlistProducts?.items?.map((product) => (
          <ProductCard
            key={product.id}
            product={product as ProductResult}
            store={product.store as PublicStore}
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
  );
};

export default Wishlist;
