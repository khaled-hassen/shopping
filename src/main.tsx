import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "@fontsource/inter";
import { BrowserRouter } from "react-router-dom";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  ApolloLink,
} from "@apollo/client";
import { createUploadLink } from "apollo-upload-client";
import { asset } from "./utils.ts";

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

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: formatImagesLink.concat(uploadLink),
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
