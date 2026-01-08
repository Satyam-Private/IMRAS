import express from 'express';

import { authenticate } from '../../middlewares/auth.middleware.js';
import { allowRoles } from '../../middlewares/rbac.middleware.js';

import {
    stockAgeing,
    stockAgeingCSV,
    fastSlowMoving,
    fastSlowMovingCSV,
    stockValuation,
    stockValuationCSV
} from './reports.controller.js';

const router = express.Router();

/**
 * STOCK AGEING
 */
router.get(
    '/stock-ageing',
    authenticate,
    allowRoles('ADMIN', 'INVENTORY_MANAGER'),
    stockAgeing
);

router.get(
    '/stock-ageing/export/csv',
    authenticate,
    allowRoles('ADMIN', 'INVENTORY_MANAGER'),
    stockAgeingCSV
);

/**
 * FAST / SLOW MOVING
 */
router.get(
    '/movement-analysis',
    authenticate,
    allowRoles('ADMIN', 'INVENTORY_MANAGER'),
    fastSlowMoving
);

router.get(
    '/movement-analysis/export/csv',
    authenticate,
    allowRoles('ADMIN', 'INVENTORY_MANAGER'),
    fastSlowMovingCSV
);

/**
 * STOCK VALUATION
 */
router.get(
    '/stock-valuation',
    authenticate,
    allowRoles('ADMIN', 'INVENTORY_MANAGER'),
    stockValuation
);

router.get(
    '/stock-valuation/export/csv',
    authenticate,
    allowRoles('ADMIN', 'INVENTORY_MANAGER'),
    stockValuationCSV
);

export default router;
