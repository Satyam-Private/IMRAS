import express from 'express';
import { authenticate } from '../../middlewares/auth.middleware.js';
import { allowRoles } from '../../middlewares/rbac.middleware.js';
import { warehouseAccess } from '../../middlewares/warehouseAccess.middleware.js';

import {
    evaluateReorder,
    getReorderSuggestions,
    createPRFromReorder
} from './reorder.controller.js';

const router = express.Router();

router.post(
    '/reorder/evaluate',
    authenticate,
    allowRoles('ADMIN'),
    warehouseAccess(),
    evaluateReorder
);

router.get(
    '/reorder/suggestions',
    authenticate,
    allowRoles('WAREHOUSE_STAFF'),
    warehouseAccess(),
    getReorderSuggestions
);

router.post(
    '/reorder/create-pr',
    authenticate,
    allowRoles('WAREHOUSE_STAFF'),
    warehouseAccess(),
    createPRFromReorder
);

export default router;
