import React from "react";
import { GetServerSideProps } from "next";
import { initializeApolloClient } from "@/apollo";
import { ssrGetHomeData } from "@/__generated__/ssr";

export const getServerSideProps: GetServerSideProps = async () => {
  const client = initializeApolloClient();
  return await ssrGetHomeData.getServerPage({}, client);
};

const Home: React.FC = () => {
  const { data } = ssrGetHomeData.usePage();

  return <div></div>;
};

export default Home;
