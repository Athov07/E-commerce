import dotenv from "dotenv";
dotenv.config();
import connectDB from "./config/db.js";
import { app } from "./app.js";
import { connectKafka } from "./kafka/kafkaClient.js";
import { runAddressConsumer } from "./kafka/consumers/address.consumer.js";

const startServer = async () => {
    try {
        // 1. Database Connection
        await connectDB();

        // 2. Kafka Connection
        try {
            await connectKafka();
            // Start listening for Auth events (like user deletion)
            runAddressConsumer().catch(err => console.error("Kafka Consumer Error:", err));
        } catch (kafkaError) {
            console.warn("Kafka not available. Address cleanup features disabled.");
        }

        // 3. Start Express
        const PORT = process.env.PORT;
        app.listen(PORT, () => {
            console.log(`Address Service is running on port: ${PORT}`);
        });

    } catch (error) {
        console.error("Server failed to start:", error.message);
        process.exit(1);
    }
};

startServer();