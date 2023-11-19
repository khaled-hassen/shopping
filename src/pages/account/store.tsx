import React from "react";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { initializeApolloClient } from "@/apollo";
import { ssrGetStore } from "@/__generated__/ssr";
import CreateNewStore from "@/components/pages/store/CreateNewStore";
import AccountPageHeader from "@/components/pages/AccountPageHeader";
import { useSignal } from "@preact/signals-react";

export const getServerSideProps = (async (context) => {
  const client = initializeApolloClient(context);
  return await ssrGetStore.getServerPage({}, client);
}) satisfies GetServerSideProps;

type PageProps = InferGetServerSidePropsType<typeof getServerSideProps>;

const Store: React.FC<PageProps> = ({ data }) => {
  const store = useSignal(data.store);

  return (
    <div className="flex flex-col gap-20">
      <AccountPageHeader />
      {store.value ? null : (
        <CreateNewStore onCreated={(s) => (store.value = s)} />
      )}
    </div>
  );
};

export default Store;
