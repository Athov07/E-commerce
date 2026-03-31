import dotenv from "dotenv";
dotenv.config();
import app from "./app.js";
import connectDB from "./config/db.js";
import logger from "./utils/logger.js";
import { createTopics } from "./kafka/topics/topics.js";
import { runConsumer } from "./kafka/consumers/auth.consumer.js";

const startServer = async () => {
  try {
    // 1. Connect to Database
    await connectDB();

    // 2. Initialize Kafka
    try {
      await createTopics();
      logger.info("Kafka topics initialized");

      // Run consumer in the background
      runConsumer().catch((err) =>
        logger.error(`Kafka Consumer Error: ${err.message}`),
      );
    } catch (kafkaError) {
      logger.error(`Kafka Setup Failed: ${kafkaError.message}`);
    }

    const PORT = process.env.PORT || 5100;
    app.listen(PORT, () => {
      logger.info(`Auth Service running on port ${PORT}`);
    });
  } catch (error) {
    logger.error(`Server startup failed: ${error.message}`);
    process.exit(1);
  }
};

process.on("unhandledRejection", (err) => {
  logger.error(`Unhandled Rejection: ${err.message}`);
  process.exit(1);
});

startServer();
