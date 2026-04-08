import * as inventoryService from "../services/inventory.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { publishStockUpdate } from "../kafka/producers/inventory.producer.js";

// Add or Update stock for a specific product (Admin only)

export const manageStock = asyncHandler(async (req, res) => {
    const { product_id, product_name, stock } = req.body;

    if (!product_id || stock === undefined) {
        throw new ApiError(400, "Product ID and stock quantity are required");
    }

    // Update database via service
    const inventoryItem = await inventoryService.addOrUpdateStock({
        product_id,
        product_name,
        stock
    });

    // Notify other services (like Product Service) that stock has changed
    await publishStockUpdate(inventoryItem);

    res.status(200).json({
        success: true,
        message: "Inventory updated successfully",
        data: inventoryItem
    });
});

// Get current stock level for a product

export const getStock = asyncHandler(async (req, res) => {
    const { productId } = req.params;
    const inventory = await inventoryService.getInventoryByProductId(productId);

    if (!inventory) {
        throw new ApiError(404, "Product inventory not found");
    }

    res.status(200).json({
        success: true,
        data: inventory
    });
});