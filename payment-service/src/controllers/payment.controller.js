import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Payment } from "../models/payment.model.js";
import {
  createRazorpayOrder,
  verifySignature,
} from "../services/payment.service.js";
import { sendPaymentEvent } from "../kafka/producers/payment.producer.js";
import { PAYMENT_EVENTS } from "../kafka/kafkaEvents.js";

export const initiateRazorpay = asyncHandler(async (req, res) => {
  const { order_id, amount } = req.body;
  const rzpOrder = await createRazorpayOrder(amount);

  const payment = await Payment.create({
    order_id,
    user_id: req.user.id,
    amount,
    razorpay_order_id: rzpOrder.id,
    provider: "RAZORPAY",
  });

  res.status(200).json({ success: true, rzpOrder, payment_id: payment._id });
});



export const captureCardPayment = asyncHandler(async (req, res) => {
  const { order_id, amount, card_info } = req.body;

  if (!card_info || !card_info.number) {
    console.error("Payment Failed: card_info or card_number is missing in request body");
    return res.status(400).json({ 
      success: false, 
      message: "Card information is required to process internal payment." 
    });
  }

  const payment = await Payment.create({
    order_id,
    user_id: req.user.id,
    amount,
    provider: "INTERNAL",
    payment_method: "CARD",
    status: "SUCCESS",
    card: card_info.number.slice(-4), 
    card_network: card_info.network || "UNKNOWN",
    card_type: card_info.type || "DEBIT",
  });

  try {
    await sendPaymentEvent(PAYMENT_EVENTS.PAYMENT_SUCCESS, {
      order_id,
      status: "SUCCESS",
    });
    console.log(`Payment event sent for Order: ${order_id}`);
  } catch (kafkaError) {
    console.error("Kafka failed to send event, but payment was saved:", kafkaError.message);
  }

  res.status(200).json({ success: true, message: "Internal Payment Success", data: payment });
});



export const verifyRazorpayPayment = asyncHandler(async (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    order_id,
  } = req.body;

  const isValid = verifySignature(
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
  );

  if (!isValid) {
    await Payment.findOneAndUpdate({ razorpay_order_id }, { status: "FAILED" });
    throw new ApiError(400, "Payment Verification Failed");
  }

  await Payment.findOneAndUpdate(
    { razorpay_order_id },
    { status: "SUCCESS", razorpay_payment_id, razorpay_signature },
  );

  await sendPaymentEvent(PAYMENT_EVENTS.PAYMENT_SUCCESS, {
    order_id: order_id,
    status: "SUCCESS",
  });

  res.status(200).json({ success: true, message: "Payment Verified" });
});
