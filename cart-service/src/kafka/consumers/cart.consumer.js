import { consumer } from "../kafkaClient.js";
import { TOPICS } from "../topics/topics.js";
import { Cart } from "../../models/cart.model.js";

export const runCartConsumer = async () => {
  await consumer.subscribe({ 
    topics: [TOPICS.PRODUCT_TOPIC, TOPICS.ORDER_TOPIC], 
    fromBeginning: false 
  });

  await consumer.run({
    eachMessage: async ({ topic, message }) => {
      try {
        const { event, payload } = JSON.parse(message.value.toString());
        console.log(`[Cart Service] Received event: ${event} from topic: ${topic}`);

        if (event === "PRODUCT_DELETED") {
          await Cart.updateMany(
            {},
            { $pull: { items: { productId: payload.id } } }
          );
          await Cart.deleteMany({ items: { $size: 0 } });
        }

        if (event === "ORDER_CREATED") {
          const { user_id } = payload;
          
          const result = await Cart.deleteOne({ user_id });
          
          if (result.deletedCount > 0) {
            console.log(`Cart cleared for user: ${user_id}`);
          }
        }
      } catch (error) {
        console.error("Error in Cart Consumer:", error.message);
      }
    },
  });
};