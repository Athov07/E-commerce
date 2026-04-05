import { Router } from "express";
import { protect } from "../middlewares/auth.middleware.js";
import {
  initiateRazorpay,
  verifyRazorpayPayment,
  captureCardPayment,
  getAllPayments
} from "../controllers/payment.controller.js";
import { authorize } from "../middlewares/admin.middleware.js";

const router = Router();
router.use(protect);

router.post("/razorpay/initiate", initiateRazorpay);
router.post("/razorpay/verify", verifyRazorpayPayment);
router.post("/internal/card", captureCardPayment);

router.get("/admin/all", protect, authorize("admin"), getAllPayments);

export default router;
