import dotenv from "dotenv";
dotenv.config();
import Razorpay from "razorpay";
import crypto from "crypto";

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

export const createRazorpayOrder = async (amount) => {
    return await razorpay.orders.create({
        amount: amount * 100, 
        currency: "INR",
        receipt: `receipt_${Date.now()}`
    });
};

export const verifySignature = (orderId, paymentId, signature) => {
    const text = orderId + "|" + paymentId;
    const generated_signature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(text)
        .digest("hex");
    return generated_signature === signature;
};