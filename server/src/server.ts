import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { authenticateToken } from './services/auth.js';
import { typeDefs } from './schemas/typeDefs.js';
import { resolvers } from './schemas/resolvers.js';
import { GraphQLContext } from './types/types.js';
import { fileURLToPath } from 'url';

import express from 'express';
import path from 'path';
import routes from './routes/index.js'
import connectDB from './config/connection.js';
import cors from 'cors';
import dotenv from 'dotenv';



const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.join(__dirname, '../.env')
dotenv.config({path: envPath});


const PORT = process.env.PORT || 3001;
const app = express();

app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  })
);

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

    // add Apollo GraphQL middleware for authentication
    app.use(
      '/graphql',
      expressMiddleware(server, {
        context: async ({ req }): Promise<GraphQLContext> => {
          const user = authenticateToken({ req });
          return { req, user }; 
        },
      })
    );

    // Serve static files from react
    app.use(express.static(path.join(__dirname, '../../client/dist')));
    app.use(routes);

    // wild card route to serve react index
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, '../../client/dist/index.html'));
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