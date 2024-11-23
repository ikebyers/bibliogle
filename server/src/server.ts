import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { authMiddleware } from './services/auth';
import { typeDefs } from './schemas/typeDefs';
import { resolvers } from './schemas/resolvers';

const app = express();

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const startServer = async () => {
  await server.start();

  app.use(
    '/graphql',
    express.json(),
    expressMiddleware(server, {
      context: async ({ req }) => {
        const user = authMiddleware({ req });
        return { user }; // Attach the user to the context for resolvers
      },
    })
  );

  app.listen(3001, () => {
    console.log('Server running at http://localhost:3001/graphql');
  });
};

startServer();
