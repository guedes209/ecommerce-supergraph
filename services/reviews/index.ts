import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { buildSubgraphSchema } from '@apollo/subgraph';
import gql from 'graphql-tag';

const typeDefs = gql`
  extend schema
    @link(url: "https://specs.apollo.dev/federation/v2.0", import: ["@key"])

  type Review {
    id: ID!
    body: String!
    author: User!
    product: Product!
  }

  # Estendemos o User que vive em outro serviço
  type User @key(fields: "id") {
    id: ID!
    reviews: [Review!]!
  }

  # Estendemos o Product que vive em outro serviço
  type Product @key(fields: "id") {
    id: ID!
    reviews: [Review!]!
  }
`;

const reviews = [
  { id: '1', authorId: '1', productId: '1', body: 'Excelente notebook, super rápido!' },
  { id: '2', authorId: '1', productId: '2', body: 'Teclado muito barulhento.' },
];

const resolvers = {
  Review: {
    // Resolvemos as referências cruzadas devolvendo apenas o tipo e o ID.
    // O Gateway vai se virar para buscar o resto dos dados nos serviços donos!
    author(review: { authorId: string }) {
      return { __typename: 'User', id: review.authorId };
    },
    product(review: { productId: string }) {
      return { __typename: 'Product', id: review.productId };
    },
  },
  User: {
    reviews(user: { id: string }) {
      return reviews.filter((review) => review.authorId === user.id);
    },
  },
  Product: {
    reviews(product: { id: string }) {
      return reviews.filter((review) => review.productId === product.id);
    },
  },
};

const server = new ApolloServer({
  schema: buildSubgraphSchema([{ typeDefs, resolvers }]),
});

startStandaloneServer(server, { listen: { port: 4003 } }).then(({ url }) => {
  console.log(`🚀 Reviews subgraph ready at ${url}`);
});

