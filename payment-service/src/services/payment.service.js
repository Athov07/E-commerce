import dotenv from "dotenv";
dotenv.config();
import Razorpay from "razorpay";
import crypto from "crypto";

console.log(process.env.RAZORPAY_KEY_ID); 
console.log(process.env.RAZORPAY_KEY_SECRET); 

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

export const createRazorpayOrder = async (amount) => {
  const options = {
    amount: Math.round(Number(amount) * 100), 
    currency: "INR",
    receipt: `receipt_${Date.now()}`,
  };
  return await razorpay.orders.create(options);
};

export const verifySignature = (orderId, paymentId, signature) => {
    const text = orderId + "|" + paymentId;
    const generated_signature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(text)
        .digest("hex");
    return generated_signature === signature;
};