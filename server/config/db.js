import mongoose from 'mongoose';
import env from './env.js';

let hasConnected = false;

export async function connectDB() {
  try {
    mongoose.set('strictQuery', true);
    await mongoose.connect(env.mongoUri, { serverSelectionTimeoutMS: 5000 });
    hasConnected = true;
    // eslint-disable-next-line no-console
    console.log(`[db] MongoDB connected: ${mongoose.connection.host}`);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[db] MongoDB connection failed:', err.message);
    // eslint-disable-next-line no-console
    console.error('[db] The API will keep running, but any DB-backed route will fail until MongoDB is reachable.');
  }

  mongoose.connection.on('disconnected', () => {
    if (hasConnected) {
      // eslint-disable-next-line no-console
      console.warn('[db] MongoDB disconnected');
    }
  });
}

export default connectDB;
