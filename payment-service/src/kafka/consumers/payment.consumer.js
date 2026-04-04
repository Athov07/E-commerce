import { consumer } from "../kafkaClient.js";
import { TOPICS } from "../topics/topics.js";

export const runPaymentConsumer = async () => {
    await consumer.subscribe({ topic: TOPICS.ORDER_TOPIC, fromBeginning: false });

    await consumer.run({
        eachMessage: async ({ message }) => {
            const { event, payload } = JSON.parse(message.value.toString());

            if (event === "ORDER_CREATED") {
                console.log(`Payment Service: Order Received for ID ${payload.order_id}. Awaiting user payment action.`);
            }
        },
    });
};