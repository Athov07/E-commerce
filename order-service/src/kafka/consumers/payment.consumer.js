import { consumer } from "../kafkaClient.js";
import { TOPICS } from "../topics/topics.js";
import { Order } from "../../models/order.model.js";

export const runPaymentConsumer = async () => {
    await consumer.subscribe({ topic: TOPICS.PAYMENT_TOPIC });
    await consumer.run({
        eachMessage: async ({ message }) => {
            const { event, payload } = JSON.parse(message.value.toString());
            if (event === "PAYMENT_SUCCESS") {
                await Order.findByIdAndUpdate(payload.order_id, { status: "CONFIRMED" });
            }
        },
    });
};