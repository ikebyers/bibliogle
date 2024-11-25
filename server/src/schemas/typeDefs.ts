import { gql } from "graphql-tag";

export const typeDefs = gql`
    type Book {
        bookId: String!
        title: String!
        authors: [String]
        description: String
        image: String
        link: String
    }

    type User {
        id: ID!
        username: String!
        email: String!
        bookCount: Int
        savedBooks: [Book]
    }

    type Auth {
        token: String!
        user: User
    }

    type Query {
        me: User
    }

    type Mutation {
        login(email: String!, password: String!): Auth
        addUser(username: String!, email: String!, password: String!): Auth
        saveBook(input: BookInput!): User
        removeBook(bookId: String!): User
    }

    input BookInput {
        bookId: String!
        title: String!
        authors: [String]
        description: String
        image: String
        link: String
    }
`;
