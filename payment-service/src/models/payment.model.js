import mongoose, { Schema } from "mongoose";

const paymentSchema = new Schema(
  {
    order_id: { type: Schema.Types.ObjectId, required: true, index: true },
    user_id: { type: Schema.Types.ObjectId, required: true },
    amount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["CREATED", "SUCCESS", "FAILED"],
      default: "CREATED",
    },
    razorpay_order_id: { type: String },
    razorpay_payment_id: { type: String },
    razorpay_signature: { type: String },
    payment_method: { type: String }, // "CARD", "UPI", "WALLET"
    currency: { type: String, default: "INR" },
    provider: { type: String, enum: ["RAZORPAY", "INTERNAL"], required: true },
    card: { type: String }, // Last 4 digits
    card_network: {
      type: String,
      enum: ["VISA", "MASTERCARD", "NONE"],
      default: "NONE",
    },
    card_type: {
      type: String,
      enum: ["CREDIT", "DEBIT", "NONE"],
      default: "NONE",
    },
  },
  { timestamps: true },
);

export const Payment = mongoose.model("Payment", paymentSchema);
