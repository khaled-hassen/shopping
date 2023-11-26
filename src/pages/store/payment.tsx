import React from "react";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { initializeApolloClient } from "@/apollo";
import { ssrGetStore, Store } from "@/__generated__/ssr";
import StoreDetailsContainer from "@/components/pages/store/StoreDetailsContainer";
import { Format } from "@/utils/format";
import { useComputed } from "@preact/signals-react";

export const getServerSideProps = (async (context) => {
  const client = initializeApolloClient(context);
  return await ssrGetStore.getServerPage({}, client);
}) satisfies GetServerSideProps;

type PageProps = InferGetServerSidePropsType<typeof getServerSideProps>;

const Payment: React.FC<PageProps> = ({ data }) => {
  const storeFees = useComputed(() => {
    if (!data.userStore || !data.storeFee) return 0;
    return data.userStore.balance.totalSales * data.storeFee;
  });

  return (
    <div className="flex flex-col gap-10">
      <StoreDetailsContainer hideDetails store={data.userStore as Store}>
        <div className="flex flex-col justify-between gap-10 sm:max-w-2xl sm:flex-row sm:items-start">
          <div className="flex items-center gap-10">
            <p className="text-3xl font-bold">Balance</p>
            <p className="text-3xl">
              {Format.currency(data.userStore?.balance.balance)}
            </p>
          </div>
          <div className="flex flex-col gap-4 text-2xl">
            <p className="font-bold">Details</p>
            <div className="flex items-center justify-between gap-10">
              <p>Total sales</p>
              <p>{Format.currency(data.userStore?.balance.totalSales)}</p>
            </div>
            <div className="flex items-center justify-between gap-10">
              <p>Store sales fee</p>
              <p>{(data.storeFee || 0) * 100}%</p>
            </div>
            <div className="flex items-center justify-between gap-10">
              <p>Store fees</p>
              <p>{Format.currency(storeFees.value)}</p>
            </div>
          </div>
        </div>
      </StoreDetailsContainer>
    </div>
  );
};

export default Payment;
