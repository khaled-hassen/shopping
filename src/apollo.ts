import {
  ApolloClient,
  InMemoryCache,
  NormalizedCacheObject,
} from "@apollo/client";
import { useMemo } from "react";
import { HttpLink } from "@apollo/client/link/http";
// @ts-ignore
import createUploadLink from "apollo-upload-client/createUploadLink.mjs";

let apolloClient: ApolloClient<NormalizedCacheObject> | null = null;

function createApolloLink() {
  if (typeof window === "undefined") {
    // server
    return new HttpLink({
      uri: process.env.API_URL + "/graphql",
    });
  }

  // client
  return createUploadLink({
    uri: process.env.NEXT_PUBLIC_API_URL + "/graphql",
    headers: { "GraphQL-Preflight": "true" },
  });
}

function createApolloClient() {
  return new ApolloClient({
    ssrMode: typeof window === "undefined",
    cache: new InMemoryCache(),
    link: createApolloLink(),
    defaultOptions: {
      watchQuery: { fetchPolicy: "cache-and-network" },
    },
  });
}

export function initializeApolloClient(
  apolloState: NormalizedCacheObject | null = null,
) {
  const client = apolloClient || createApolloClient();
  if (apolloState) client.cache.restore(apolloState);
  if (typeof window === "undefined") return client;
  apolloClient ||= client;
  return apolloClient;
}

export function useApollo(apolloState: NormalizedCacheObject) {
  return useMemo(() => initializeApolloClient(apolloState), [apolloState]);
}
