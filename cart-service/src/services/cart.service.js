import { Cart } from "../models/cart.model.js";

export const getCartByUserId = async (user_id) => await Cart.findOne({ user_id });

export const updateCartItems = async (user_id, items) => {
    if (items.length === 0) {
        return await Cart.findOneAndDelete({ user_id });
    }
    return await Cart.findOneAndUpdate(
        { user_id },
        { user_id, items },
        { upsert: true, new: true }
    );
};