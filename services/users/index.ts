import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { buildSubgraphSchema } from '@apollo/subgraph';
import gql from 'graphql-tag';

const typeDefs = gql`
  extend schema
    @link(url: "https://specs.apollo.dev/federation/v2.0", import: ["@key"])

  type User @key(fields: "id") {
    id: ID!
    username: String!
  }

  type Query {
    me: User
  }
`;

const users = [
  { id: '1', username: 'bruno_dev' },
];

const resolvers = {
  Query: {
    me: () => users[0],
  },
  User: {
    __resolveReference(user: { id: string }) {
      return users.find((u) => u.id === user.id);
    },
  },
};

const server = new ApolloServer({
  schema: buildSubgraphSchema([{ typeDefs, resolvers }]),
});

startStandaloneServer(server, { listen: { port: 4002 } }).then(({ url }) => {
  console.log(`🚀 Users subgraph ready at ${url}`);
});

