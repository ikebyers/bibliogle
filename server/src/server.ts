import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { authMiddleware } from './services/auth';
import { typeDefs } from './schemas/typeDefs';
import { resolvers } from './schemas/resolvers';
import path from 'path';
import connectDB from './config/connection';

const PORT = process.env.PORT || 3001;
const app = express();

// Create apollo server
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const startServer = async () => {
  try {
    // initialize db
    await connectDB();
    
    // start apollo server
    await server.start();

    // Middleware for parsing requests
    app.use(express.urlencoded({ extended: true }));
    app.use(express.json()); 

    // Add Apollo GraphQL middleware with context for authentication
    app.use(
      '/graphql',
      expressMiddleware(server, {
        context: async ({ req }) => {
          const user = authMiddleware({ req });
          return { user };
        },
      })
    );

    // Serve static files from react
    app.use(express.static(path.join(__dirname, '../client/dist')));

    // wild card route to serve react index
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, '../client/dist/index.html'));
    });

    // start server
    app.listen(PORT, () => {
      console.log(`API server running on port ${PORT}!`);
      console.log(`GraphQL playground available at http://localhost:${PORT}/graphql`);
    });
  } catch (error) {
    console.error('Failed to start the server:', error);
  }
};

startServer();