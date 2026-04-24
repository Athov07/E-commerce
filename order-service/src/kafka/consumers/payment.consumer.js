import { consumer } from "../kafkaClient.js";
import { TOPICS } from "../topics/topics.js";
import { Order } from "../../models/order.model.js";
import { logAudit } from "../../utils/auditLogger.js";

export const runPaymentConsumer = async () => {
    await consumer.subscribe({ topic: TOPICS.PAYMENT_TOPIC, fromBeginning: false });

    await consumer.run({
        eachMessage: async ({ message }) => {
            try {
                const rawData = message.value.toString();
                const { event, payload } = JSON.parse(rawData);

                console.log(`Order Service: Received Kafka event [${event}]`);

                if (event === "PAYMENT_SUCCESS") {
                    const orderId = payload.order_id || payload.orderId;

                    const updatedOrder = await Order.findByIdAndUpdate(
                        orderId, 
                        { status: "CONFIRMED" },
                        { new: true }
                    );

                    if (updatedOrder) {
                        console.log(`Order ${orderId} status updated to CONFIRMED`);
                        logAudit("ORDER-SERVICE", "PAYMENT_SYNCED", orderId, "SUCCESS");
                    } else {
                        console.warn(`Order ${orderId} not found in Order Service DB`);
                        logAudit("ORDER-SERVICE", "PAYMENT_SYNCED", orderId, "NOT_FOUND");
                    }
                }
            } catch (err) {
                console.error("Order Consumer processing error:", err.message);
                logAudit("ORDER-SERVICE", "PAYMENT_SYNCED", "UNKNOWN", "ERROR");
            }
        },
    });
};