import kafka from "../kafkaClient.js";

export const createTopics = async () => {
    const admin = kafka.admin();
    try {
        await admin.connect();
        await admin.createTopics({
            topics: [
                { topic: "order-events", numPartitions: 1 }, // Must match Order Service
                { topic: "inventory-events", numPartitions: 1 }
            ],
        });
    } catch (error) {
        console.error("Topic creation error:", error.message);
    } finally {
        await admin.disconnect();
    }
};