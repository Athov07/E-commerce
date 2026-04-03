import { Router } from "express";
import { addToCart, updateItemCount, removeFromCart, getCart } from "../controllers/cart.controller.js";

const router = Router();

router.get("/:user_id", getCart);

router.post("/add", addToCart);
router.patch("/update-count", updateItemCount);
router.delete("/remove/:user_id/:productId", removeFromCart);


export default router;