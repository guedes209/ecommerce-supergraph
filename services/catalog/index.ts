import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { buildSubgraphSchema } from '@apollo/subgraph';
import gql from 'graphql-tag';
import { PrismaClient } from './prisma/generated/client';

const prisma = new PrismaClient();

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

  type Mutation {
    createProduct(name: String!, price: Float!): Product!
  }
`;

const resolvers = {
  Query: {
    products: () => prisma.product.findMany(),
    product: (_: unknown, { id }: { id: string }) => prisma.product.findUnique({ where: { id } }),
  },
  Mutation: {
    createProduct: (_: unknown, { name, price }: { name: string; price: number }) => {
      return prisma.product.create({
        data: { name, price },
      });
    },
  },
  Product: {
    __resolveReference(reference: { id: string }) {
      return prisma.product.findUnique({ where: { id: reference.id } });
    },
  },
};

const server = new ApolloServer({
  schema: buildSubgraphSchema([{ typeDefs, resolvers }]),
});

startStandaloneServer(server, { listen: { port: 4001 } }).then(({ url }) => {
  console.log(`🚀 Catalog subgraph ready at ${url}`);
});

