import { Order } from "../models/order.model.js";
import { OrderItem } from "../models/orderItems.models.js";

export const findUserOrders = async (user_id) => {
    return await Order.find({ user_id }).sort({ createdAt: -1 });
};

export const getOrderDetails = async (order_id, user_id) => {
    const order = await Order.findOne({ _id: order_id, user_id });
    const items = await OrderItem.find({ order_id });
    return { order, items };
};