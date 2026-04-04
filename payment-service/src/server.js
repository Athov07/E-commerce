import dotenv from "dotenv";
dotenv.config();
import connectDB from "./config/db.js";
import { app } from "./app.js";
import { connectKafka } from "./kafka/kafkaClient.js";
import { runPaymentConsumer } from "./kafka/consumers/payment.consumer.js";

const startServer = async () => {
    try {
        await connectDB();

        await connectKafka();

        runPaymentConsumer().catch(err => {
            console.error("Payment Consumer Failure:", err.message);
        });

        const PORT = process.env.PORT;
        app.listen(PORT, () => {
            console.log(`Payment Service running on port: ${PORT}`);
            console.log(`Integration: Razorpay & Internal Card Ready`);
        });

    } catch (error) {
        console.error("Server Startup Failed:", error.message);
        process.exit(1);
    }
};

process.on("SIGINT", async () => {
    console.log("Shutting down gracefully...");
    process.exit(0);
});

startServer();