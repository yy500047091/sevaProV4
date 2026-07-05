import mongoose from 'mongoose';
import { env } from './env';

export async function connectDatabase() {
  const uri = env.mongodbUri || 'mongodb://127.0.0.1:27017/sevaPro';
  await mongoose.connect(uri);
  console.log('MongoDB connected.');
}
