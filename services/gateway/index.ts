import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { ApolloGateway, IntrospectAndCompose } from '@apollo/gateway';

const gateway = new ApolloGateway({
  supergraphSdl: new IntrospectAndCompose({
    subgraphs: [
      { name: 'catalog', url: 'http://localhost:4001' },
      { name: 'users', url: 'http://localhost:4002' },
      { name: 'reviews', url: 'http://localhost:4003' },
    ],
  }),
});

const server = new ApolloServer({
  gateway,
});

startStandaloneServer(server, { listen: { port: 4000 } }).then(({ url }) => {
  console.log(`🚀 Gateway ready at ${url}`);
});

