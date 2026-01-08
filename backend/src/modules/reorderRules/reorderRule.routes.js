import { Router } from 'express';
import { authenticate } from '../../middlewares/auth.middleware.js';
import { allowRoles } from '../../middlewares/rbac.middleware.js';

import {
    listReorderRules,
    createReorderRule,
    updateReorderRule,
    deactivateReorderRule
} from './reorderRule.controller.js';

const router = Router();

/* LIST */
router.get(
    '/',
    authenticate,
    allowRoles('ADMIN', 'INVENTORY_MANAGER'),
    listReorderRules
);

/* CREATE */
router.post(
    '/',
    authenticate,
    allowRoles('ADMIN', 'INVENTORY_MANAGER'),
    createReorderRule
);

/* UPDATE */
router.put(
    '/:id',
    authenticate,
    allowRoles('ADMIN', 'INVENTORY_MANAGER'),
    updateReorderRule
);

/* DEACTIVATE */
router.put(
    '/:id/deactivate',
    authenticate,
    allowRoles('ADMIN', 'INVENTORY_MANAGER'),
    deactivateReorderRule
);

export default router;
