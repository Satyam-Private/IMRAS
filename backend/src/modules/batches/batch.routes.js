import express from 'express';
import { authenticate } from '../../middlewares/auth.middleware.js';
import { allowRoles } from '../../middlewares/rbac.middleware.js';
import { getExpiringBatches } from './batch.controller.js';

const router = express.Router();

router.get(
    '/batches/expiring',
    authenticate,
    allowRoles('WAREHOUSE_STAFF', 'INVENTORY_MANAGER', 'ADMIN'),
    getExpiringBatches
);

export default router;
