import kafka from "../kafkaClient.js";
import { Profile } from "../../models/profile.model.js";

const consumer = kafka.consumer({ groupId: "profile-service-group" });

export const runAuthConsumer = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: "user-registered", fromBeginning: true });
  
  await consumer.run({
    eachMessage: async ({ message }) => {
      try {
        const rawData = JSON.parse(message.value.toString());
        console.log("Received Kafka Message:", rawData);

        const userId = rawData.userId; 
        const phone = rawData.phone;
        const fullName = rawData.fullName;

        if (!userId) {
          console.error("Skipping: No userId found in the keys:", Object.keys(rawData));
          return;
        }

        await Profile.findOneAndUpdate(
          { userId: userId },
          { 
            userId, 
            phone, 
            fullName 
          },
          { upsert: true, new: true }
        );

        console.log(`Profile successfully synced for: ${userId}`);
      } catch (error) {
        console.error("Error processing Kafka message:", error.message);
      }
    },
  });
};