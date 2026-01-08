import express from 'express';

import { authenticate } from '../../middlewares/auth.middleware.js';
import { allowRoles } from '../../middlewares/rbac.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';

import { issueSchema } from '../../validations/issue.schema.js';
import { transferSchema } from '../../validations/transfer.schema.js';

import { issueStock } from './issue.controller.js';
import { transferStock } from './transfer.controller.js';
import { getPendingIssues } from './issue.controller.js';

const router = express.Router();

/**
 * =========================
 * ISSUE STOCK (OUT)
 * =========================
 * Role: WAREHOUSE_STAFF
 * Effect:
 *  - Creates OUT stock_transaction
 *  - Updates stock snapshot
 */
router.post(
    '/issues',
    authenticate,
    allowRoles('WAREHOUSE_STAFF'),
    validate(issueSchema),
    issueStock
);

/**
 * =========================
 * TRANSFER STOCK (MOVE)
 * =========================
 * Role: INVENTORY_MANAGER
 * Effect:
 *  - MOVE OUT transaction (source)
 *  - MOVE IN transaction (destination)
 *  - Updates stock snapshot
 */
router.post(
    '/transfers',
    authenticate,
    allowRoles('INVENTORY_MANAGER'),
    validate(transferSchema),
    transferStock
);

router.get(
    '/issues/pending',
    authenticate,
    allowRoles('WAREHOUSE_STAFF'),
    getPendingIssues
);
export default router;
