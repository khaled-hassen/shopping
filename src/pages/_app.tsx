import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { ApolloProvider } from "@apollo/client";
import { useApollo } from "@/apollo";
import Layout from "@/components/layout";

export default function App({ Component, pageProps }: AppProps) {
  const client = useApollo(pageProps.apolloState);

  return (
    <ApolloProvider client={client}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ApolloProvider>
  );
}
