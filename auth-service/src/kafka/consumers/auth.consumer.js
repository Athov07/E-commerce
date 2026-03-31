import kafka from "../kafkaClient.js";

const consumer = kafka.consumer({ groupId: "auth-service-group" });
let isConsumerConnected = false;

export const runConsumer = async () => {
  if (isConsumerConnected) return;
  try {
    await new Promise((resolve) => setTimeout(resolve, 10000));

    await consumer.connect();
    console.log("Kafka Consumer Connected");

    await consumer.subscribe({
      topics: ["auth-audit-log", "user-registered"],
      fromBeginning: false,
    });

    await consumer.run({
      eachMessage: async ({ topic, message }) => {
        const prefix = topic === "auth-audit-log" ? " [AUDIT]" : " [USER]";
        console.log(
          `${prefix} Received on ${topic}: ${message.value.toString()}`,
        );
      },
    });
  } catch (error) {
    console.error("Kafka Consumer waiting for Broker...");
    isConsumerConnected = false;
    setTimeout(runConsumer, 10000);
  }
};
