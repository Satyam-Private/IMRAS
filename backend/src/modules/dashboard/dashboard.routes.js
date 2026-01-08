import express from 'express';
import { authenticate } from '../../middlewares/auth.middleware.js';
import { allowRoles } from '../../middlewares/rbac.middleware.js';
import {
    getWarehouseDashboard, getDashboardKPIs,
    getRecentTransactions,
    getWarehouseStaff,
    getCriticalReorderItems,
} from './dashboard.controller.js';

const router = express.Router();

router.get(
    '/warehouse',
    authenticate,
    allowRoles('WAREHOUSE_STAFF'),
    getWarehouseDashboard
);

router.get(
    "/kpis",
    authenticate,
    allowRoles("ADMIN", "INVENTORY_MANAGER"),
    getDashboardKPIs
);

router.get(
    "/recent-transactions",
    authenticate,
    allowRoles("ADMIN", "INVENTORY_MANAGER"),
    getRecentTransactions
);

router.get(
    "/warehouse-staff",
    authenticate,
    allowRoles("ADMIN", "INVENTORY_MANAGER"),
    getWarehouseStaff
);

router.get(
    "/critical-reorder-items",
    authenticate,
    allowRoles("ADMIN", "INVENTORY_MANAGER"),
    getCriticalReorderItems
);


export default router;
