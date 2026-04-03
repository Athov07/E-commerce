import { producer } from "../kafkaClient.js";
import { TOPICS } from "../topics/topics.js";

export const sendCartEvent = async (event, data) => {
    await producer.send({
        topic: TOPICS.CART_TOPIC,
        messages: [{ value: JSON.stringify({ event, payload: data }) }]
    });
};