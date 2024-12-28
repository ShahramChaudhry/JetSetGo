import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { MONGODB_URI } from './config.mjs';

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

export default connectDB;
