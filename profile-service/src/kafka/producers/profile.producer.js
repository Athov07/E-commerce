import { producer } from "../kafkaClient.js";
import { KAFKA_EVENTS } from "../kafkaEvents.js";

export const publishProfileUpdated = async (profileData) => {
    try {
        await producer.send({
            topic: KAFKA_EVENTS.PROFILE_UPDATED,
            messages: [
                { 
                    key: profileData.userId.toString(),
                    value: JSON.stringify({
                        userId: profileData.userId,
                        fullName: profileData.fullName,
                        avatar_url: profileData.avatar_url,
                        updatedAt: new Date()
                    }) 
                }
            ],
        });
        console.log("Kafka: Profile updated event published");
    } catch (error) {
        console.error("Kafka Producer Error (Profile Updated):", error.message);
    }
};