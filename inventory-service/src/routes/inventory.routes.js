import { Router } from "express";
import {
  manageStock,
  getStock,
  fetchAllInventory,
  removeInventory
} from "../controllers/inventory.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { isAdmin } from "../middlewares/admin.middleware.js";

const router = Router();

router.post("/manage", protect, isAdmin, manageStock);

router.get("/all", protect, isAdmin, fetchAllInventory);

router.get("/:productId", protect, getStock);

router.delete("/:productId", protect, isAdmin, removeInventory);


export default router;
