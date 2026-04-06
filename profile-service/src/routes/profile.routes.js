import { Router } from "express";
import { getProfile, editProfile, getAllProfiles } from "../controllers/profile.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { isAdmin } from "../middlewares/admin.middleware.js";
import { upload } from "../middlewares/upload.middleware.js";

const router = Router();
router.get("/me", protect, getProfile);
router.put("/edit", protect, upload.single("avatar"), editProfile);
router.get("/admin/all", protect, isAdmin, getAllProfiles);

export default router;