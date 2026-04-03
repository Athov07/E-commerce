import { Router } from "express";
import { protect } from "../middlewares/auth.middleware.js";
import {
    createAddress,
    getMyAddresses,
    updateAddress,
    removeAddress
} from "../controllers/address.controller.js";

const router = Router();

router.use(protect);

router.route("/")
    .post(createAddress)
    .get(getMyAddresses);

router.route("/:id")
    .put(updateAddress)
    .delete(removeAddress);

export default router;