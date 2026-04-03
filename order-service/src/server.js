import dotenv from "dotenv";
dotenv.config();
import connectDB from "./config/db.js";
import { app } from "./app.js";
import { connectKafka } from "./kafka/kafkaClient.js";
import { runPaymentConsumer } from "./kafka/consumers/payment.consumer.js";


const startServer = async () => {
    try {
        await connectDB();

        try {
            await connectKafka();
            
            runPaymentConsumer().catch(err => {
                console.error("Payment Consumer Error:", err.message);
            });
            
            console.log("Order Service Kafka Consumers Active");
        } catch (kafkaError) {
            console.warn("Kafka not available. Order status updates via events will be disabled.");
        }

        const PORT = process.env.PORT || 5500;
        app.listen(PORT, () => {
            console.log(`Order Service is live on port: ${PORT}`);
            console.log(`Ready for checkouts and order history`);
        });

    } catch (error) {
        console.error("Critical Startup Error:", error.message);
        process.exit(1);
    }
};

process.on("unhandledRejection", (err) => {
    console.error(`Unhandled Rejection: ${err.message}`);
});

startServer();