import dotenv from "dotenv";
dotenv.config();

import connectDB from "./config/db.js";
import { app } from "./app.js";
import { connectKafka } from "./kafka/kafkaClient.js";
import { runConsumer } from "./kafka/consumers/product.consumer.js";


const startServer = async () => {
    try {
        await connectDB();
        await connectKafka();
        
        // Start listening for Kafka messages
        runConsumer().catch(err => console.error("Kafka Consumer Error", err));

        app.listen(process.env.PORT || 5200, () => {
            console.log(`Product Service running at port: ${process.env.PORT}`);
        });
    } catch (err) {
        console.error("Critical Server Failure:", err);
        process.exit(1);
    }
};

startServer();