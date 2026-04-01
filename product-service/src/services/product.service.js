import { Product } from "../models/product.model.js";
import { sendProductEvent } from "../kafka/producers/product.producer.js";

export const createProductService = async (productData) => {
    const product = await Product.create(productData);
    await sendProductEvent("PRODUCT_CREATED", product);
    return product;
};

export const updateProductService = async (id, updateData) => {
    const product = await Product.findByIdAndUpdate(id, updateData, { new: true });
    await sendProductEvent("PRODUCT_UPDATED", product);
    return product;
};

export const deleteProductService = async (id) => {
    await Product.findByIdAndDelete(id);
    await sendProductEvent("PRODUCT_DELETED", { id });
};