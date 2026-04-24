import { consumer } from "../kafkaClient.js";
import { Inventory } from "../../models/inventory.model.js";
import { addOrUpdateStock } from "../../services/inventory.service.js";
import { logAudit } from "../../utils/auditLogger.js";

export const startInventoryConsumers = async () => {
  try {
    await consumer.subscribe({ topic: "product-events", fromBeginning: true });
    await consumer.subscribe({ topic: "order-events", fromBeginning: true });

    await consumer.run({
      eachMessage: async ({ topic, message }) => {
        const rawData = JSON.parse(message.value.toString());
        const { event, payload } = rawData;
        const orderId = payload._id || payload.order_id;

        if (topic === "order-events" && event === "ORDER_CREATED") {
          try {
            // PROOF STEP: Record exactly when the message was received after downtime
            logAudit("INVENTORY-SERVICE", "ORDER_RECEIVED", orderId, "SUCCESS");

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
                // PROOF STEP: Record that consistency is now achieved
                logAudit("INVENTORY-SERVICE", "STOCK_UPDATED", orderId, "SUCCESS");
              }
            }
          } catch (error) {
            // PROOF STEP: Record failures for "Failure -> Retry" analysis
            logAudit("INVENTORY-SERVICE", "STOCK_UPDATED", orderId, "RETRY_REQUIRED");
            throw error; // Re-throw so Kafka retries
          }
        }
      },
    });
  } catch (error) {
    console.error("Kafka Consumer Error:", error.message);
  }
};