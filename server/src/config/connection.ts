import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.join(__dirname, '../../.env');

dotenv.config({ path: envPath });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/googlebooks';

const connectDB = async (): Promise<typeof mongoose> => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB!');
        return mongoose;
    } catch (error) {
        console.error('Database connection error:', error);
        throw new Error('Database connection failed');
    }
};

mongoose.connection.on('connected', () => {
    console.log('Mongoose connected to', MONGODB_URI);
});

mongoose.connection.on('error', (err) => {
    console.error('Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
    console.log('Mongoose disconnected');
});

// close db when app is terminated
process.on('SIGINT', async () => {
    await mongoose.connection.close();
    console.log('Mongoose disconnected on application termination');
    process.exit(0);
});

export default connectDB;