import express from "express";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { allowRoles } from "../../middlewares/rbac.middleware.js";
import {
    fifoPick,
    getRecentPicks
} from "./picking.controller.js";

const router = express.Router();

router.post(
    "/fifo",
    authenticate,
    allowRoles("WAREHOUSE_STAFF"),
    fifoPick
);

router.get(
    "/recent",
    authenticate,
    allowRoles("WAREHOUSE_STAFF", "INVENTORY_MANAGER"),
    getRecentPicks
);

export default router;
