import mongoose, { Schema } from "mongoose";

const orderSchema = new Schema({
    user_id: { type: Schema.Types.ObjectId, required: true, index: true },
    items_total: { type: Number, required: true },
    delivery_charges: { type: Number, default: 0 },
    final_amount: { type: Number, required: true },
    status: { 
        type: String, 
        enum: ["CREATED", "CONFIRMED", "SHIPPED", "OUT_FOR_DELIVERY", "DELIVERED"], 
        default: "CREATED" 
    },
    // Snapshot Address Fields
    shipping_name: { type: String, required: true },
    shipping_phone: { type: String, required: true },
    address_line_1: { type: String, required: true },
    address_line_2: { type: String },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pin_code: { type: String, required: true },
    country: { type: String, required: true }
}, { timestamps: true });

export const Order = mongoose.model("Order", orderSchema);