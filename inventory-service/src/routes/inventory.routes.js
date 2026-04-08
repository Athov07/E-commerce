import { Router } from "express";
import { manageStock, getStock } from "../controllers/inventory.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { isAdmin } from "../middlewares/admin.middleware.js";

const router = Router();

router.post("/manage", protect, isAdmin, manageStock);

router.get("/:productId", protect, getStock);

export default router;
