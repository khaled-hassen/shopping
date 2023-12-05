import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  overwrite: true,
  schema: process.env.API_URL + "/graphql",
  documents: "./src/**/*.graphql",
  generates: {
    "src/__generated__/client.ts": {
      plugins: [
        "typescript",
        "typescript-operations",
        "typescript-react-apollo",
        { add: { content: "// @ts-nocheck" } },
      ],
      config: {
        preResolveTypes: true,
        scalars: {
          Decimal: "number",
          Byte: "number",
          DateTime: "string",
        },
      },
    },
    "src/__generated__/ssr.tsx": {
      plugins: [
        "typescript",
        "typescript-operations",
        "graphql-codegen-apollo-next-ssr",
        { add: { content: "// @ts-nocheck" } },
      ],
      config: {
        preResolveTypes: true,
        withHOC: false,
        reactApolloVersion: 3,
        gqlImport: "@apollo/client#gql",
        withHooks: true,
        scalars: {
          Decimal: "number",
          Byte: "number",
          DateTime: "string",
        },
      },
    },
  },
};

export default config;
