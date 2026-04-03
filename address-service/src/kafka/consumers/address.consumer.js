import { consumer } from "../kafkaClient.js";
import { TOPICS } from "../topics/topics.js";
import { Address } from "../../models/address.model.js";

export const runAddressConsumer = async () => {
    await consumer.subscribe({ topic: TOPICS.AUTH_TOPIC, fromBeginning: false });
    
    await consumer.run({
        eachMessage: async ({ message }) => {
            const { event, payload } = JSON.parse(message.value.toString());
            
            // If user is deleted in Auth Service, delete their addresses here
            if (event === "USER_DELETED") {
                await Address.deleteMany({ user_id: payload.id });
                console.log(`Cleanup: Addresses deleted for User ${payload.id}`);
            }
        },
    });
};