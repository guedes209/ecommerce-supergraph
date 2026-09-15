import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { buildSubgraphSchema } from '@apollo/subgraph';
import gql from 'graphql-tag';
import { PrismaClient } from './prisma/generated/client';

const prisma = new PrismaClient();

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

const resolvers = {
  Query: {
    me: async () => {
      // Injeta um usuário padrão caso o banco esteja vazio
      let user = await prisma.user.findFirst();
      if (!user) {
        user = await prisma.user.create({ data: { username: 'bruno_dev' } });
      }
      return user;
    },
  },
  User: {
    __resolveReference(reference: { id: string }) {
      return prisma.user.findUnique({ where: { id: reference.id } });
    },
  },
};

const server = new ApolloServer({
  schema: buildSubgraphSchema([{ typeDefs, resolvers }]),
});

startStandaloneServer(server, { listen: { port: 4002 } }).then(({ url }) => {
  console.log(`🚀 Users subgraph ready at ${url}`);
});

