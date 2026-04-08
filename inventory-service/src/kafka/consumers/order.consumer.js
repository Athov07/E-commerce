import { consumer } from "../kafkaClient.js";
import { Inventory } from "../../models/inventory.model.js";

export const runOrderConsumer = async () => {
  // 1. Match the topic name from Order Service
  await consumer.subscribe({ topic: "order-events", fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ message }) => {
      try {
        const rawData = JSON.parse(message.value.toString());

        // 2. Destructure because Order Service sends { event, payload }
        const { event, payload } = rawData;

        // 3. Only reduce stock if the event is ORDER_CREATED
        if (event === "ORDER_CREATED") {
          const orderId = payload.order_id || payload._id || payload.id || payload.orderId;
          console.log(
            "Inventory Service: Processing stock reduction for order:",
            orderId,
          );

          const items = payload.items || payload.products;

          for (const item of items) {
            const pid = item.productId || item.product_id;
            const qty = item.quantity || item.qty;

            const updated = await Inventory.findOneAndUpdate(
              { product_id: pid },
              { $inc: { stock: -qty } },
              { returnDocument: "after" },
            );

            if (updated) {
              console.log(
                `Stock reduced for ${pid}. Remaining: ${updated.stock}`,
              );
            } else {
              console.warn(`Product ${pid} not found in Inventory DB`);
            }
          }
        }
      } catch (error) {
        console.error("Inventory Consumer Error:", error.message);
      }
    },
  });
};
