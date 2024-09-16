
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL || '', { });
    console.log('MongoDB: successful connecting');
  } catch (error) {
    console.error('connection to MongoDB fails:', error);
    process.exit(1);
  }
};

export default connectDB;
