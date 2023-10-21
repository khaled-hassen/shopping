import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "@fontsource/inter";
import { BrowserRouter } from "react-router-dom";
import {
  ApolloClient,
  ApolloLink,
  ApolloProvider,
  InMemoryCache,
} from "@apollo/client";
import { createUploadLink } from "apollo-upload-client";
import { asset, getToken, removeToken } from "./utils.ts";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";

const formatImagesLink = new ApolloLink((operation, forward) => {
  function mutateImageKeys(obj: unknown): any {
    if (Array.isArray(obj)) return obj.map((item) => mutateImageKeys(item));
    if (typeof obj === "object" && obj !== null) {
      for (const key in obj) {
        // @ts-ignore
        obj[key] =
          // @ts-ignore
          key === "image" ? asset(obj[key]) : mutateImageKeys(obj[key]);
      }
    }
    return obj;
  }

  return forward(operation).map((response) => {
    response.data = mutateImageKeys(response.data);
    return response;
  });
});

const uploadLink = createUploadLink({
  uri: import.meta.env.VITE_API_URL + "/graphql",
  headers: {
    "GraphQL-Preflight": "true",
  },
});

const authLink = setContext((_, { headers }) => {
  const token = getToken();
  return {
    headers: { ...headers, Authorization: token ? `Bearer ${token}` : "" },
  };
});

const logoutLink = onError(({ networkError }: any) => {
  if (networkError.statusCode === 401) removeToken();
});

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: authLink.concat(logoutLink).concat(formatImagesLink).concat(uploadLink),
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ApolloProvider>
  </React.StrictMode>,
);
