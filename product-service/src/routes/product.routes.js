import { Router } from "express";
import { addProduct, updateProduct, removeProduct, getAllProducts, getProductById, createCategory } from "../controllers/product.controller.js";
import { protect, authorize } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

// Public Routes
router.get("/", getAllProducts);
router.get("/:productId", getProductById);

// Admin Only Routes
router.post("/admin/add", protect, authorize("admin"), upload.fields([
    { name: "main_image", maxCount: 1 },
    { name: "gallery", maxCount: 5 }
]), addProduct);

router.patch("/admin/edit/:productId", protect, authorize("admin"), upload.fields([
    { name: "main_image", maxCount: 1 }
]), updateProduct);

router.delete("/admin/remove/:productId", protect, authorize("admin"), removeProduct);

// Admin Category Route
router.post("/admin/category", protect, authorize("admin"), createCategory);

export default router;