import { Inventory } from "../models/inventory.model.js";

// Add new stock or update existing stock levels

export const addOrUpdateStock = async (data) => {
    return await Inventory.findOneAndUpdate(
        { product_id: data.product_id },
        { 
            $set: { 
                product_name: data.product_name,
                stock: data.stock 
            } 
        },
        { 
            upsert: true, 
            returnDocument: 'after',
            runValidators: true 
        }
    );
};


// Find inventory record for a specific product

export const getInventoryByProductId = async (productId) => {
    return await Inventory.findOne({ product_id: productId });
};


// Atomically decrement stock when an order is processed

export const reduceStock = async (productId, quantity) => {
    return await Inventory.findOneAndUpdate(
        { product_id: productId },
        { $inc: { stock: -quantity } },
        { new: true }
    );
};


export const getAllInventory = async () => {
    return await Inventory.find({}).sort({ updated_at: -1 });
};


export const deleteInventoryItem = async (productId) => {
    return await Inventory.findOneAndDelete({ product_id: productId });
};