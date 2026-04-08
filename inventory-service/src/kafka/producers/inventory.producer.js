import { producer } from "../kafkaClient.js";
import { KAFKA_EVENTS } from "../kafkaEvents.js";

export const publishStockUpdate = async (stockData) => {
    try {
        await producer.send({
            topic: KAFKA_EVENTS.STOCK_UPDATED,
            messages: [
                {
                    key: stockData.product_id.toString(),
                    value: JSON.stringify({
                        product_id: stockData.product_id,
                        stock: stockData.stock,
                        updated_at: new Date(),
                    }),
                },
            ],
        });
        console.log(`Kafka: Stock update published for ${stockData.product_id}`);
    } catch (error) {
        console.error("Kafka Producer Error (Stock Update):", error.message);
    }
};