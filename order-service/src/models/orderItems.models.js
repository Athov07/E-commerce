import mongoose, { Schema } from "mongoose";

const orderItemSchema = new Schema({
    order_id: { type: Schema.Types.ObjectId, ref: "Order", required: true },
    product_id: { type: Schema.Types.ObjectId, required: true },
    product_name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true }
}, { timestamps: true });

export const OrderItem = mongoose.model("OrderItem", orderItemSchema);