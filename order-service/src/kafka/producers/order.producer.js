import { producer } from "../kafkaClient.js";
import { TOPICS } from "../topics/topics.js";
import { logAudit } from "../../utils/auditLogger.js";


export const sendOrderEvent = async (event, payload) => {
    try {
        await producer.send({
            topic: TOPICS.ORDER_TOPIC,
            messages: [{ value: JSON.stringify({ event, payload }) }]
        });
        
        const orderId = payload._id || payload.order_id;
        logAudit("ORDER-SERVICE", "ORDER_PRODUCED", orderId, "SUCCESS");
        
    } catch (error) {
        console.error("Kafka Producer Error:", error);
    }
};