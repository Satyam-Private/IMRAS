import express from 'express';

import { authenticate } from '../../middlewares/auth.middleware.js';
import { allowRoles } from '../../middlewares/rbac.middleware.js';

import {
    getPendingPutawayTasks,
    completePutaway,
    getCompletedPutaways
} from './putaway.controller.js';

const router = express.Router();

router.get(
    "/completed",
    authenticate,
    allowRoles("WAREHOUSE_STAFF", "INVENTORY_MANAGER"),
    getCompletedPutaways
);

router.get(
    '/pending',
    authenticate,
    allowRoles('WAREHOUSE_STAFF'),
    getPendingPutawayTasks
);

router.post(
    '/:id/complete',
    authenticate,
    allowRoles('WAREHOUSE_STAFF'),
    completePutaway
);

export default router;
