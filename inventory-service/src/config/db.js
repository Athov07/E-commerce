import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.DATABASE_URL, {
      dbName: process.env.DATABASE_NAME,
    });
    console.log(`MongoDB DB: ${mongoose.connection.name}`);
    console.log(`MongoDB Connected`);
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};
