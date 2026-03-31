import kafka from '../kafkaClient.js';

export const createTopics = async () => {
    const admin = kafka.admin();
    try {
        await admin.connect({ timeout: 5000 }); 
        await admin.createTopics({
            waitForLeaders: true,
            topics: [
                { topic: 'user-registered', numPartitions: 1 },
                { topic: 'auth-audit-log', numPartitions: 1 } 
            ],
        });
        console.log("Kafka Topics Created Successfully");
    } catch (error) {
        console.warn("Kafka not reachable - Topics might already exist or Broker is starting.");
    } finally {
        await admin.disconnect();
    }
};