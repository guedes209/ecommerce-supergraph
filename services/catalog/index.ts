import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { buildSubgraphSchema } from '@apollo/subgraph';
import gql from 'graphql-tag';

const typeDefs = gql`
  extend schema
    @link(url: "https://specs.apollo.dev/federation/v2.0", import: ["@key"])

  type Product @key(fields: "id") {
    id: ID!
    name: String!
    price: Float!
  }

  type Query {
    products: [Product!]!
    product(id: ID!): Product
  }
`;

const products = [
  { id: '1', name: 'Notebook Pro', price: 2999.99 },
  { id: '2', name: 'Teclado Mecânico', price: 150.00 },
];

const resolvers = {
  Query: {
    products: () => products,
    product: (_: unknown, { id }: { id: string }) => products.find((p) => p.id === id),
  },
  Product: {
    __resolveReference(product: { id: string }) {
      return products.find((p) => p.id === product.id);
    },
  },
};

const server = new ApolloServer({
  schema: buildSubgraphSchema([{ typeDefs, resolvers }]),
});

startStandaloneServer(server, { listen: { port: 4001 } }).then(({ url }) => {
  console.log(`🚀 Catalog subgraph ready at ${url}`);
});

