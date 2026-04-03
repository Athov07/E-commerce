import { Router } from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { createOrder, getOrderHistory, getOrderSummary } from "../controllers/order.controller.js";

const router = Router();
router.use(protect);

router.post("/create", createOrder);
router.get("/history", getOrderHistory);
router.get("/summary/:id", getOrderSummary);

export default router;