import React, { useEffect } from "react";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { initializeApolloClient } from "@/apollo";
import { ssrGetStore, Store } from "@/__generated__/ssr";
import StoreDetailsContainer from "@/components/pages/store/StoreDetailsContainer";
import PageTitle from "@/components/pages/PageTitle";
import Link from "next/link";
import { route } from "@/router";
import PlusIcon from "@/components/icons/PlusIcon";
import OptimizedImage from "@/components/shared/OptimizedImage";
import { asset } from "@/utils/assets";
import { Format } from "@/utils/format";
import TrashIcon from "@/components/icons/TrashIcon";
import EditIcon from "@/components/icons/EditIcon";
import { useDeleteProductMutation } from "@/__generated__/client";
import { useSignal } from "@preact/signals-react";
import Pagination from "@/utils/pagination";
import Paging from "@/components/shared/Paging";
import { useRouter } from "next/navigation";

export const getServerSideProps = (async (context) => {
  const page = parseInt((context.query.page as string) || "1");
  const client = initializeApolloClient(context);
  const response = await ssrGetStore.getServerPage(
    {
      variables: {
        pageSize: Pagination.pageSize,
        skip: Pagination.calculateSkip(page),
      },
    },
    client,
  );
  if (!response.props.data?.store)
    return { redirect: { destination: route("newStore"), permanent: false } };
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

const Store: React.FC<PageProps> = ({ data, page, totalPages }) => {
  const products = useSignal(data.storeProducts?.items || []);
  const router = useRouter();
  const [deleteProduct] = useDeleteProductMutation();

  useEffect(() => {
    products.value = data.storeProducts?.items || [];
  }, [data]);

  function calculatePrice(price: number, discount?: number | null) {
    return Format.currency(price - price * (discount || 0));
  }

  async function removeProduct(id: string) {
    await deleteProduct({ variables: { id } });
    products.value = products.value.filter((product) => product.id !== id);
  }

  function changePage(page: number) {
    router.push(route("userStore") + `?page=${page}`, { scroll: false });
    window.scroll({ top: 0 });
  }

  return (
    <div className="flex flex-col gap-10">
      <StoreDetailsContainer store={data.store as Store}>
        <PageTitle title="Products" />
        <div className="flex w-full flex-col gap-6">
          <div className="">
            <Link
              href={route("userStoreNewProduct")}
              className="flex items-center gap-4 text-xl font-medium"
            >
              <PlusIcon />
              <span>Add new product</span>
            </Link>
          </div>
          <div className="flex flex-col gap-6 empty:hidden">
            {products.value.map((product) => (
              <div
                key={product.id}
                className="flex flex-col gap-10 border-b border-dark-gray border-opacity-20 pb-2 xs:flex-row md:items-center"
              >
                <OptimizedImage
                  src={asset(product.coverImage)}
                  className="mx-auto w-48 mix-blend-darken xs:h-28"
                />
                <div className="flex flex-1 flex-wrap gap-x-6 gap-y-4 xs:grid md:grid-cols-2 lg:grid-cols-4">
                  <div className="flex flex-col gap-2 font-medium">
                    <p className="text-lg opacity-50">Product name</p>
                    <Link
                      href={route("userStorePreviewProduct", product.id)}
                      className="text-xl"
                    >
                      {product.name}
                    </Link>
                  </div>
                  <div className="flex flex-col gap-2 font-medium">
                    <p className="text-lg opacity-50">Category</p>
                    <Link
                      href={route("category", product.categories.at(0)?.slug)}
                      className="text-xl"
                    >
                      {product.categories.at(0)?.name}
                    </Link>
                  </div>
                  <div className="flex flex-col gap-2 font-medium">
                    <p className="text-lg opacity-50">Type</p>
                    <p className="text-xl first-letter:uppercase">
                      {product.productType}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2 font-medium">
                    <div className="flex items-center gap-2">
                      <p className="text-lg opacity-50">Price</p>
                      {!!product.discount && (
                        <p className="bg-warning px-1 py-0.5 text-sm">
                          Save {Format.percent(product.discount)}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col gap-2 xl:flex-row xl:items-center">
                      <p className="text-xl">
                        {calculatePrice(product.price, product.discount)}
                      </p>
                      {!!product.discount && (
                        <p className="text-sm line-through opacity-50">
                          {Format.currency(product.price)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2 font-medium">
                  <p className="text-lg opacity-50">Actions</p>
                  <div className="flex flex-wrap items-center gap-6 xs:flex-col xs:flex-nowrap lg:flex-row">
                    <Link
                      href={route("userStoreEditProduct", product.id)}
                      className="flex items-center gap-2 text-xl font-medium"
                    >
                      <EditIcon />
                      <span>Edit</span>
                    </Link>
                    <button
                      className="flex items-center gap-2 text-xl font-medium text-danger"
                      onClick={() => removeProduct(product.id)}
                    >
                      <TrashIcon />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <Paging
          initialPage={page}
          totalPages={totalPages}
          onPageChange={changePage}
        />
      </StoreDetailsContainer>
    </div>
  );
};

export default Store;
