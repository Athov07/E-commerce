import { Router } from "express";
import { protect } from "../middlewares/auth.middleware.js";
import {
    createAddress,
    getMyAddresses,
    updateAddress,
    removeAddress,
    getAllUserAddresses
} from "../controllers/address.controller.js";

import { authorize } from "../middlewares/admin.middleware.js";

const router = Router();

router.use(protect);

router.route("/")
    .post(createAddress)
    .get(getMyAddresses);

router.route("/:id")
    .put(updateAddress)
    .delete(removeAddress);

router.get("/admin/all", protect, authorize("admin"), getAllUserAddresses);

export default router;