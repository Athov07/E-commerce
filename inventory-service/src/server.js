import dotenv from "dotenv";
dotenv.config();
import app from "./app.js";
import { connectDB } from "./config/db.js";
import { connectKafka } from "./kafka/kafkaClient.js";
import { createTopics } from "./kafka/topics/topics.js";
import { runOrderConsumer } from "./kafka/consumers/order.consumer.js";
import { startProductSync } from "./kafka/consumers/product.consumer.js";

const PORT = process.env.PORT;

const startServer = async () => {
    try {
        // 1. Connect to MongoDB
        await connectDB();

        // 2. Connect Kafka with your specific retry logic
        await connectKafka();

        // 3. Ensure Inventory topics exist
        await createTopics();

        startProductSync();

        // 4. Start listening for "order-placed" events
        runOrderConsumer();

        // 5. Start Express Server
        app.listen(PORT, () => {
            console.log(`Inventory Service is running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Critical Failure: Could not start Inventory Service", error.message);
        process.exit(1);
    }
};

startServer();