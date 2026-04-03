import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
/**
 * Establishing connection to MongoDB Atlas or Local instance
 */
const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(
            `${process.env.DATABASE_URL}/${process.env.DATABASE_NAME}`
        );

        console.log(`MongoDB Connected!`);
        console.log(`DB NAME: ${process.env.DATABASE_NAME}`);
        
    } catch (error) {
        console.error("MongoDB connection FAILED: ", error.message);
        process.exit(1);
    }
};

export default connectDB;