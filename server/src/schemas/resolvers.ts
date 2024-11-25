import { GraphQLContext } from '../types/types';
import User from '../models/User.js';
import { signToken } from '../services/auth.js';
import mongoose from 'mongoose';

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
            const token = signToken(user.username, user.email, user.id.toString());
            return { token, user };
        },
        addUser: async (_: unknown, { username, email, password }: { username: string; email: string; password: string }) => {
            const user = await User.create({ username, email, password });
            const token = signToken(user.username, user.email, user.id);
            return { token, user };
        },
        saveBook: async (
            _: unknown, 
            args: any,
            // { input }: { input: { bookId: string; title: string; authors: string[]; description?: string; image?: string; link?: string } },
            context: GraphQLContext
        ) => {
            // console.log('User:', context.user);
            console.log('something else', args.input.title);

            const userId = new mongoose.Types.ObjectId(context?.user?.id);

            // const { user } = context;
            // console.log(user?.id);
            
            // // Ensure the user is logged in
            // if (!user) {
            //     throw new Error('You must be logged in to save a book!');
            // }

            // Validate required fields
            // if (!input.bookId || !input.title) {
            //     throw new Error('Missing required fields: bookId and title are required.');
            // }

            // Provide defaults for optional fields
            // const { bookId, title, authors, description = 'No description available', image = '', link = '' } = input;

            // Save the book
            const updatedUser = await User.findByIdAndUpdate(
                // user.id,
                // { id: context.user?.id },
                userId,
                // { $addToSet: { savedBooks: { bookId, title, authors, description, image, link } } },
                { $addToSet: { savedBooks: args.input } },
                { new: true, runValidators: true }
            ).populate('savedBooks');

            // if (!updatedUser) {
            //     throw new Error('Could not save the book. Please try again.');
            // }

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
            ).populate('savedBooks');
            return updatedUser;
        },
    },
};