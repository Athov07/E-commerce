import { Router } from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { initiateRazorpay, verifyRazorpayPayment, captureCardPayment } from "../controllers/payment.controller.js";

const router = Router();
router.use(protect);

router.post("/razorpay/initiate", initiateRazorpay);
router.post("/razorpay/verify", verifyRazorpayPayment);
router.post("/internal/card", captureCardPayment);

export default router;