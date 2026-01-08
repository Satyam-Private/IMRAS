import { Router } from 'express';
import { authenticate } from '../../middlewares/auth.middleware.js';
import { allowRoles } from '../../middlewares/rbac.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { warehouseAccess } from '../../middlewares/warehouseAccess.middleware.js';

import { createPRSchema } from '../../validations/pr.schema.js';
import { createPR, approvePR, listPRs, createPOFromPR, getApprovedPRsForAdmin } from './pr.controller.js';

import {
    createPO,
    approvePO,
    getPendingPOs,
    updatePOItems,
    getPOById
} from './po.controller.js';

import { createPOSchema } from '../../validations/po.schema.js';
import { createGRN, getTodayGRNs, getPendingGRNs, receiveGRN, getGRNItems } from './grn.controller.js';
import { createGRNSchema } from '../../validations/grn.schema.js';

const router = Router();

/* ================= PR ================= */

router.post(
    '/pr',
    authenticate,
    allowRoles('WAREHOUSE_STAFF'),
    warehouseAccess(),
    validate(createPRSchema),
    createPR
);

router.post(
    '/pr/:id/approve',
    authenticate,
    allowRoles('INVENTORY_MANAGER'),
    warehouseAccess(),
    approvePR
);

router.get(
    '/pr',
    authenticate,
    allowRoles('INVENTORY_MANAGER', 'WAREHOUSE_STAFF', 'ADMIN'),
    warehouseAccess(),
    listPRs
);

router.get(
    '/admin/prs/approved',
    authenticate,
    allowRoles('ADMIN'),
    getApprovedPRsForAdmin
);


router.post(
    '/pr/:id/create-po',
    authenticate,
    allowRoles('ADMIN'),
    warehouseAccess(),
    createPOFromPR
);

/* ================= PO ================= */

router.post(
    '/po',
    authenticate,
    allowRoles('ADMIN'),
    warehouseAccess(),
    validate(createPOSchema),
    createPO
);

router.post(
    '/po/:id/approve',
    authenticate,
    allowRoles('ADMIN'),
    approvePO
);


router.get(
    '/po',
    authenticate,
    allowRoles('ADMIN'),
    warehouseAccess(),
    getPendingPOs
);

router.put(
    '/po/:id/items',
    authenticate,
    allowRoles('ADMIN'),
    updatePOItems
);

router.get(
    '/po/:id',
    authenticate,
    allowRoles('ADMIN'),
    getPOById
);

/* ================= GRN ================= */

router.post(
    '/grn',
    authenticate,
    allowRoles('WAREHOUSE_STAFF'),
    warehouseAccess(),
    validate(createGRNSchema),
    createGRN
);

router.get(
    '/grns/today',
    authenticate,
    allowRoles('WAREHOUSE_STAFF', 'ADMIN'),
    warehouseAccess(),
    getTodayGRNs
);

router.get(
    '/grns/pending',
    authenticate,
    allowRoles('WAREHOUSE_STAFF'),
    warehouseAccess(),
    getPendingGRNs
);

router.get(
    '/grns/:id/items',
    authenticate,
    allowRoles('WAREHOUSE_STAFF'),
    warehouseAccess(),
    getGRNItems
);

router.post(
    '/grns/:id/receive',
    authenticate,
    allowRoles('WAREHOUSE_STAFF'),
    warehouseAccess(),
    receiveGRN
);


export default router;
