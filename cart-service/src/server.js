import dotenv from "dotenv";
import connectDB from "./config/db.js";
import { app } from "./app.js";
import { connectKafka } from "./kafka/kafkaClient.js";
import { runCartConsumer } from "./kafka/consumers/cart.consumer.js";

// 1. Load environment variables
dotenv.config();

const startServer = async () => {
    try {
        // 2. Connect to MongoDB (Cart Database)
        await connectDB();
        
        // 3. Connect to Kafka (Producer & Consumer)
        try {
            await connectKafka();
            
            // 4. Start the Consumer to listen for Product/Inventory events
            runCartConsumer().catch(err => {
                console.error("Kafka Consumer Failed to Initialize:", err.message);
            });
            
        } catch (kafkaError) {
            console.error("Kafka initialization failed. Messaging features will be unavailable.");
        }

        // 5. Start Express Server
        const PORT = process.env.PORT || 5300;
        app.listen(PORT, () => {
            console.log(`Cart Service is live on port: ${PORT}`);
            console.log(`Mode: ${process.env.NODE_ENV || 'development'}`);
        });

    } catch (error) {
        console.error("Critical Server Startup Error:", error.message);
        process.exit(1);
    }
};

process.on("unhandledRejection", (err) => {
    console.error(`Error: ${err.message}`);
});

startServer();