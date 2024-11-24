import { GraphQLContext } from '../types/types'; // Create a custom type for the GraphQL context
import User from '../models/User.js';
import { signToken } from '../services/auth.js';

export const resolvers = {
    Query: {
        me: async (_: unknown, __: unknown, context: GraphQLContext) => {
            const { user } = context;
            if (!user) {
                throw new Error('You must be logged in!');
            }
            return await User.findById(user.id).populate('savedBooks');
        },
    },
    Mutation: {
        login: async (_: unknown, { email, password }: { email: string; password: string }) => {
            const user = await User.findOne({ email });
            if (!user || !(await user.isCorrectPassword(password))) {
                throw new Error('Invalid credentials');
            }
            const token = signToken(user.username, user.email, user._id.toString());
            return { token, user };
        },
        addUser: async (
            _: unknown,
            { username, email, password }: { username: string; email: string; password: string }
        ) => {
            const user = await User.create({ username, email, password });
            const token = signToken(user.username, user.email, user.id);
            return { token, user };
        },
        saveBook: async (
            _: unknown,
            { book }: { book: any },
            context: GraphQLContext
        ) => {
            const { user } = context;
            if (!user) {
                throw new Error('You must be logged in!');
            }
            const updatedUser = await User.findByIdAndUpdate(
                user.id,
                { $addToSet: { savedBooks: book } },
                { new: true }
            );
            return updatedUser;
        },
        removeBook: async (_: unknown, { bookId }: { bookId: string }, context: GraphQLContext) => {
            const { user } = context;
            if (!user) {
                throw new Error('You must be logged in!');
            }
            const updatedUser = await User.findByIdAndUpdate(
                user.id,
                { $pull: { savedBooks: { bookId } } },
                { new: true }
            );
            return updatedUser;
        },
    },
};