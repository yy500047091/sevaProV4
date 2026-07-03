import mongoose from 'mongoose';
import { env } from './env';

export async function connectDatabase() {
  if (!env.useMongo || !env.mongodbUri) {
    console.log('MongoDB disabled. Using in-memory development store.');
    return;
  }

  await mongoose.connect(env.mongodbUri);
  console.log('MongoDB connected.');
}
