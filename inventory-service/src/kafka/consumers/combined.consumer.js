import { consumer } from "../kafkaClient.js";
import { Inventory } from "../../models/inventory.model.js";
import { addOrUpdateStock } from "../../services/inventory.service.js";

export const startInventoryConsumers = async () => {
  try {
    // 1. Subscribe to ALL relevant topics
    await consumer.subscribe({ topic: "product-events", fromBeginning: true });
    await consumer.subscribe({ topic: "order-events", fromBeginning: true });

    console.log("Inventory Service listening to Product & Order events");

    // 2. A single RUN loop for everything
    await consumer.run({
      eachMessage: async ({ topic, message }) => {
        const rawData = JSON.parse(message.value.toString());
        const { event, payload } = rawData;

        // --- Handle Product Service Events ---
        if (topic === "product-events") {
          if (event === "PRODUCT_CREATED") {
            console.log(`Seeding inventory for: ${payload.name}`);
            await addOrUpdateStock({
              product_id: payload._id,
              product_name: payload.name,
              stock: payload.stock || 0
            });
          }
        }

        // --- Handle Order Service Events ---
        if (topic === "order-events") {
          if (event === "ORDER_CREATED") {
            console.log("Processing stock reduction for order:", payload._id || payload.order_id);
            
            const items = payload.items || payload.products;
            if (!items) return;

            for (const item of items) {
              const pid = item.productId || item.product_id;
              const qty = item.quantity || item.qty;

              const updated = await Inventory.findOneAndUpdate(
                { product_id: pid },
                { $inc: { stock: -qty } },
                { returnDocument: "after" }
              );

              if (updated) {
                console.log(`Stock reduced. ${pid} now has ${updated.stock}`);
              }
            }
          }
        }
      },
    });
  } catch (error) {
    console.error("Kafka Consumer Error:", error.message);
  }
};