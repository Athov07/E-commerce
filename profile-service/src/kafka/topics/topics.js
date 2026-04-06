import kafka from "../kafkaClient.js";
export const createTopics = async () => {
  const admin = kafka.admin();
  try {
    await admin.connect();
    const existingTopics = await admin.listTopics();
    
    if (!existingTopics.includes("profile-updated")) {
      await admin.createTopics({
        topics: [{ topic: "profile-updated", numPartitions: 1 }],
      });
      console.log("Kafka Topic 'profile-updated' created.");
    }
  } catch (error) {
    console.warn("Topic creation skipped (likely already exists):", error.message);
  } finally {
    await admin.disconnect();
  }
};