import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
/**
 * Establishing connection to MongoDB Atlas or Local instance
 */
const connectDB = async () => {
    try {
    const conn = await mongoose.connect(process.env.DATABASE_URL, {
      dbName: process.env.DATABASE_NAME,
    });
    console.log(`MongoDB DB: ${mongoose.connection.name}`);
    console.log(`MongoDB Connected`);
  } catch (error) {
        console.error("MongoDB connection FAILED: ", error.message);
        process.exit(1);
    }
};

export default connectDB;