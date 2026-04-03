import { consumer } from "../kafkaClient.js";
import { TOPICS } from "../topics/topics.js";
import { Cart } from "../../models/cart.model.js";

export const runCartConsumer = async () => {
  await consumer.subscribe({
    topic: TOPICS.PRODUCT_TOPIC,
    fromBeginning: false,
  });
  await consumer.run({
    eachMessage: async ({ message }) => {
      const { event, payload } = JSON.parse(message.value.toString());
      if (event === "PRODUCT_DELETED") {
        await Cart.updateMany(
          {},
          { $pull: { items: { productId: payload.id } } },
        );
        // Clean up empty carts after deletion
        await Cart.deleteMany({ items: { $size: 0 } });
      }
    },
  });
};
