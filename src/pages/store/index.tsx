import React from "react";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { initializeApolloClient } from "@/apollo";
import { ssrGetStore, Store } from "@/__generated__/ssr";
import CreateNewStore from "@/components/pages/store/CreateNewStore";
import AccountPageHeader from "@/components/pages/AccountPageHeader";
import { useSignal } from "@preact/signals-react";
import StoreDetailsContainer from "@/components/pages/store/StoreDetailsContainer";
import PageTitle from "@/components/pages/PageTitle";

export const getServerSideProps = (async (context) => {
  const client = initializeApolloClient(context);
  return await ssrGetStore.getServerPage({}, client);
}) satisfies GetServerSideProps;

type PageProps = InferGetServerSidePropsType<typeof getServerSideProps>;

const Store: React.FC<PageProps> = ({ data }) => {
  const store = useSignal(data.store);

  if (!store.value)
    return (
      <div className="flex flex-col gap-10">
        <AccountPageHeader />
        <CreateNewStore onCreated={(s) => (store.value = s)} />
      </div>
    );

  return (
    <div className="flex flex-col gap-10">
      <AccountPageHeader />
      <StoreDetailsContainer store={store.value as Store}>
        <PageTitle title="Products" />
      </StoreDetailsContainer>
    </div>
  );
};

export default Store;
