import { consumer } from "../kafkaClient.js";
import { TOPICS } from "../topics/topics.js";
import { Product } from "../../models/product.model.js";

export const runConsumer = async () => {
    try {
        // 1. Safety: Verify topic exists before subscribing
        // This helps prevent the 'leadership election' loop 
        await consumer.subscribe({ 
            topic: TOPICS.INVENTORY_TOPIC, 
            fromBeginning: false 
        });

        console.log(`Subscribed to topic: ${TOPICS.INVENTORY_TOPIC}`);

        await consumer.run({
            // 2. Added autoCommit: true (default) for reliability
            eachMessage: async ({ topic, partition, message }) => {
                try {
                    const rawData = message.value.toString();
                    const parsedData = JSON.parse(rawData);
                    
                    // Standardize extraction based on your producer's structure
                    const event = parsedData.event;
                    const payload = parsedData.payload;

                    console.log(`Received [${event}] from ${topic}`);

                    // 3. Logic: Sync stock if Inventory Service emits a change
                    if (event === "INVENTORY_SYNC" || event === "STOCK_UPDATED") {
                        const { productId, newStock } = payload;
                        
                        if (!productId) return;

                        const updatedProduct = await Product.findByIdAndUpdate(
                            productId, 
                            { stock: newStock },
                            { new: true }
                        );

                        if (updatedProduct) {
                            console.log(`Stock Synced: ${updatedProduct.name} is now ${newStock}`);
                        }
                    }
                } catch (parseError) {
                    console.error("❌ Error processing Kafka message:", parseError.message);
                    // We don't throw here to keep the consumer from crashing on a bad message
                }
            },
        });
    } catch (error) {
        console.error("Kafka Consumer Subscription Error:", error);
        
        // 4. Retry Logic: If Kafka isn't ready, try again in 5 seconds
        console.log("Retrying consumer subscription in 5 seconds...");
        setTimeout(runConsumer, 5000);
    }
};