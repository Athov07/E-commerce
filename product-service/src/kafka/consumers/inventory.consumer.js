
export const runInventoryConsumer = async () => {
    await consumer.subscribe({ topic: 'product-events' });

    await consumer.run({
        eachMessage: async ({ message }) => {
            const { event, payload } = JSON.parse(message.value.toString());

            if (event === "PRODUCT_CREATED") {
                await inventoryService.addOrUpdateStock({
                    product_id: payload._id,
                    product_name: payload.name,
                    stock: payload.stock
                });
                console.log(`Inventory Seeded for: ${payload.name}`);
            }
        }
    });
};