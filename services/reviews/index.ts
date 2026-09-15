import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { buildSubgraphSchema } from '@apollo/subgraph';
import gql from 'graphql-tag';
import { PrismaClient } from './prisma/generated/client';

const prisma = new PrismaClient();

const typeDefs = gql`
  extend schema
    @link(url: "https://specs.apollo.dev/federation/v2.0", import: ["@key"])

  type Review {
    id: ID!
    body: String!
    author: User!
    product: Product!
  }

  type User @key(fields: "id") {
    id: ID!
    reviews: [Review!]!
  }

  type Product @key(fields: "id") {
    id: ID!
    reviews: [Review!]!
  }

  type Mutation {
    createReview(productId: ID!, authorId: ID!, body: String!): Review!
  }
`;

const resolvers = {
  Mutation: {
    createReview: (_: unknown, { productId, authorId, body }: { productId: string; authorId: string; body: string }) => {
      return prisma.review.create({
        data: { productId, authorId, body },
      });
    },
  },
  Review: {
    author(review: { authorId: string }) {
      return { __typename: 'User', id: review.authorId };
    },
    product(review: { productId: string }) {
      return { __typename: 'Product', id: review.productId };
    },
  },
  User: {
    reviews(user: { id: string }) {
      return prisma.review.findMany({ where: { authorId: user.id } });
    },
  },
  Product: {
    reviews(product: { id: string }) {
      return prisma.review.findMany({ where: { productId: product.id } });
    },
  },
};

const server = new ApolloServer({
  schema: buildSubgraphSchema([{ typeDefs, resolvers }]),
});

startStandaloneServer(server, { listen: { port: 4003 } }).then(({ url }) => {
  console.log(`🚀 Reviews subgraph ready at ${url}`);
});

