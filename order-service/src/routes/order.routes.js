import { Router } from "express";
import { protect } from "../middlewares/auth.middleware.js";
import {
  createOrder,
  getOrderHistory,
  getOrderSummary,
  getAllOrders,
  updateOrderStatus,
} from "../controllers/order.controller.js";

const router = Router();
router.use(protect);

router.post("/create", createOrder);
router.get("/history", getOrderHistory);
router.get("/summary/:id", getOrderSummary);

router.get("/admin/all", getAllOrders);
router.patch("/admin/status/:id", updateOrderStatus);

export default router;
