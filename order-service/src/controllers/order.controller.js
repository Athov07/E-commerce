import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Order } from "../models/order.model.js";
import { OrderItem } from "../models/orderItems.models.js";
import { sendOrderEvent } from "../kafka/producers/order.producer.js";
import { ORDER_EVENTS } from "../kafka/kafkaEvents.js";

export const createOrder = asyncHandler(async (req, res) => {
  console.log("User from req:", req.user);
  const { items, shipping_address, items_total } = req.body;

  let delivery_charges = 0;

  if (items_total < 500) {
    delivery_charges = 50;
  }

  const user_id = req.user.id;
  const final_amount = items_total + delivery_charges;

  // 1. Save Order (Snapshotting Address)
  const order = await Order.create({
    user_id,
    items_total,
    delivery_charges,
    final_amount,
    shipping_name: shipping_address.full_name,
    shipping_phone: shipping_address.phone,
    address_line_1: shipping_address.address_line_1,
    address_line_2: shipping_address.address_line_2,
    city: shipping_address.city,
    state: shipping_address.state,
    pin_code: shipping_address.pin_code,
    country: shipping_address.country,
    status: "CREATED",
  });

  // 2. Save Order Items
  const orderItems = items.map((item) => ({
    order_id: order._id,
    product_id: item.productId || item.product_id,
    product_name: item.name,
    image: item.image || item.main_image,
    price: item.price,
    quantity: item.quantity,
  }));

  const savedItems = await OrderItem.insertMany(orderItems);

  // 3. Emit Kafka Event to reduce inventory and clear cart
  try {
    await sendOrderEvent(ORDER_EVENTS.ORDER_CREATED, {
      order_id: order._id,
      user_id: user_id,
      items: savedItems,
      total: final_amount,
    });
    console.log(`Kafka: ORDER_CREATED event sent for order ${order._id}`);
  } catch (kafkaError) {
    console.error("KAFKA ERROR:", kafkaError.message);
  }

  res.status(201).json({ success: true, data: order });
});


export const getOrderHistory = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user_id: req.user.id }).sort({
    createdAt: -1,
  });
  const ordersWithItems = await Promise.all(
    orders.map(async (order) => {
      const items = await OrderItem.find({ order_id: order._id });
      return {
        ...order._doc,
        items,
      };
    }),
  );
  res.status(200).json({ success: true, data: ordersWithItems });
});

export const getOrderSummary = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const order = await Order.findOne({ _id: id, user_id: req.user.id });
  if (!order) throw new ApiError(404, "Order not found");

  const items = await OrderItem.find({ order_id: id });

  res.status(200).json({
    success: true,
    data: {
      order,
      items,
    },
  });
});

export const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({}).sort({ createdAt: -1 });

  if (!orders) {
    throw new ApiError(404, "No orders found");
  }

  res.status(200).json({
    success: true,
    message: "Orders retrieved successfully",
    data: orders,
  });
});

export const updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const order = await Order.findByIdAndUpdate(id, { status }, { new: true });
  res.json({ success: true, data: order });
};
