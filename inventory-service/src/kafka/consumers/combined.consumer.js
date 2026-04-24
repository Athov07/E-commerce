import { consumer } from "../kafkaClient.js";
import { Inventory } from "../../models/inventory.model.js";
import { addOrUpdateStock } from "../../services/inventory.service.js";
import { logAudit } from "../../utils/auditLogger.js";

export const startInventoryConsumers = async () => {
  try {
    await consumer.subscribe({ topic: "product-events", fromBeginning: true });
    await consumer.subscribe({ topic: "order-events", fromBeginning: true });

    await consumer.run({
      autoCommit: false,
      eachMessage: async ({ topic, partition, message, heartbeat }) => {
        const rawData = JSON.parse(message.value.toString());
        const { event, payload } = rawData;
        const orderId = payload._id || payload.order_id;

        if (topic === "order-events" && event === "ORDER_CREATED") {
          try {
            logAudit("INVENTORY-SERVICE", "ORDER_RECEIVED", orderId, "SUCCESS");

            const items = payload.items || payload.products;
            if (items) {
              for (const item of items) {
                const pid = item.productId || item.product_id;
                const qty = item.quantity || item.qty;

                await Inventory.findOneAndUpdate(
                  { product_id: pid },
                  { $inc: { stock: -qty } },
                  { returnDocument: "after" },
                );
                logAudit(
                  "INVENTORY-SERVICE",
                  "STOCK_UPDATED",
                  orderId,
                  "SUCCESS",
                );
              }
            }

            await consumer.commitOffsets([
              {
                topic,
                partition,
                offset: (BigInt(message.offset) + 1n).toString(),
              },
            ]);
          } catch (error) {
            logAudit(
              "INVENTORY-SERVICE",
              "STOCK_UPDATED",
              orderId,
              "RETRY_REQUIRED",
            );
            throw error;
          }
        }
      },
    });
  } catch (error) {
    console.error("Kafka Consumer Error:", error.message);
  }
};
