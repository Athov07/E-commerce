import dotenv from "dotenv";
dotenv.config();
import app from "./app.js";
import connectDB from "./config/db.js";
import { connectKafka } from "./kafka/kafkaClient.js";
import { createTopics } from "./kafka/topics/topics.js";
import { runAuthConsumer } from "./kafka/consumers/auth.consumer.js";

const PORT = process.env.PORT;

const startServer = async () => {
    try {
        await connectDB();

        await connectKafka();

        await createTopics();

        await runAuthConsumer();

        app.listen(PORT, () => {
            console.log(`Profile Service is running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Failed to start Profile Service:", error.message);
        process.exit(1);
    }
};

startServer();