import {
  ApolloClient,
  concat,
  InMemoryCache,
  NormalizedCacheObject,
} from "@apollo/client";
import { useMemo } from "react";
import { HttpLink } from "@apollo/client/link/http";
// @ts-ignore
import createUploadLink from "apollo-upload-client/createUploadLink.mjs";
import { setContext } from "@apollo/client/link/context";
import { getSession, GetSessionParams } from "next-auth/react";

let apolloClient: ApolloClient<NormalizedCacheObject> | null = null;

function createApolloLink(context?: GetSessionParams) {
  const authMiddleware = setContext(async (_, { headers }) => {
    const session = await getSession(context);
    if (!session) return headers;

    return {
      headers: {
        ...headers,
        authorization: `Bearer ${session.token.value}`,
      },
    };
  });

  let link: HttpLink;
  if (typeof window === "undefined") {
    // server
    link = new HttpLink({
      uri: process.env.API_URL + "/graphql",
      credentials: "include",
    });
  } else {
    // client
    link = createUploadLink({
      uri: process.env.NEXT_PUBLIC_API_URL + "/graphql",
      headers: { "GraphQL-Preflight": "true" },
      credentials: "include",
    });
  }

  return concat(authMiddleware, link);
}

function createApolloClient(context?: GetSessionParams) {
  return new ApolloClient({
    ssrMode: typeof window === "undefined",
    cache: new InMemoryCache(),
    link: createApolloLink(context),
    defaultOptions: {
      watchQuery: { fetchPolicy: "cache-and-network" },
    },
  });
}

export function initializeApolloClient(
  context?: GetSessionParams,
  apolloState: NormalizedCacheObject | null = null,
) {
  const client = apolloClient || createApolloClient(context);
  if (apolloState) client.cache.restore(apolloState);
  if (typeof window === "undefined") return client;
  apolloClient ||= client;
  return apolloClient;
}

export function useApollo(apolloState: NormalizedCacheObject) {
  return useMemo(
    () => initializeApolloClient(undefined, apolloState),
    [apolloState],
  );
}
