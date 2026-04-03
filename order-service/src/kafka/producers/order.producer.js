import { producer } from "../kafkaClient.js";
import { TOPICS } from "../topics/topics.js";

export const sendOrderEvent = async (event, payload) => {
    await producer.send({
        topic: TOPICS.ORDER_TOPIC,
        messages: [{ value: JSON.stringify({ event, payload }) }]
    });
};