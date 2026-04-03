import { Router } from "express";
import { addToCart, updateItemCount, removeFromCart } from "../controllers/cart.controller.js";

const router = Router();

router.post("/add", addToCart);
router.patch("/update-count", updateItemCount);
router.delete("/remove/:user_id/:productId", removeFromCart);

export default router;