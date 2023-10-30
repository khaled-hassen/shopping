import React from "react";
import { ssrGetCategories } from "@/__generated__/ssr";
import { GetServerSideProps } from "next";
import { initializeApolloClient } from "@/apollo";

export const getServerSideProps: GetServerSideProps = async () => {
  const client = initializeApolloClient();
  return await ssrGetCategories.getServerPage({}, client);
};

const Home: React.FC = () => {
  const { data } = ssrGetCategories.usePage();

  return (
    <div>
      <pre>{JSON.stringify(data?.categories, null, 2)}</pre>
    </div>
  );
};

export default Home;
