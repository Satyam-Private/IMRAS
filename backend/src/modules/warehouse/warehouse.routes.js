import express from "express";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { allowRoles } from "../../middlewares/rbac.middleware.js";
import {
    getMyWarehouse,
    getBinsByWarehouse,
    createBin,
    deleteBin,
    getAvailableBins
} from "./warehouse.controller.js";

const router = express.Router();

/* ================= WAREHOUSE ================= */

router.get(
    "/my",
    authenticate,
    allowRoles("INVENTORY_MANAGER"),
    getMyWarehouse
);

/* ================= BINS ================= */

router.get(
    "/available",
    authenticate,
    allowRoles("WAREHOUSE_STAFF", "INVENTORY_MANAGER"),
    getAvailableBins
);

router.get(
    "/:warehouseId/bins",
    authenticate,
    allowRoles("INVENTORY_MANAGER", "WAREHOUSE_STAFF"),
    getBinsByWarehouse
);

router.post(
    "/:warehouseId/bins",
    authenticate,
    allowRoles("INVENTORY_MANAGER"),
    createBin
);

router.delete(
    "/bins/:binId",
    authenticate,
    allowRoles("INVENTORY_MANAGER"),
    deleteBin
);

export default router;
