import { consumer } from "../kafkaClient.js"; 
import { addOrUpdateStock } from "../../services/inventory.service.js";

export const startProductSync = async () => {
  try {
    // 1. Subscribe to the Product Service's topic
    await consumer.subscribe({ topic: "product-events", fromBeginning: true });

    console.log("Inventory Service subscribed to product-events");

    // 2. Run the listener
    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        const rawData = message.value.toString();
        const { event, payload } = JSON.parse(rawData);

        console.log(`Received event: ${event}`);

        if (event === "PRODUCT_CREATED") {
          console.log(`Seeding inventory for: ${payload.name}`);
          
          await addOrUpdateStock({
            product_id: payload._id,
            product_name: payload.name,
            stock: payload.stock || 0
          });
        }
      },
    });
  } catch (error) {
    console.error("Kafka Consumer Error:", error);
  }
};