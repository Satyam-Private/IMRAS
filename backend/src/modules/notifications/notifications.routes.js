import express from 'express';
import { authenticate } from '../../middlewares/auth.middleware.js';
import { allowRoles } from '../../middlewares/rbac.middleware.js';
import { getNotifications } from './notifications.controller.js';

const router = express.Router();

router.get(
    '/',
    authenticate,
    allowRoles('ADMIN', 'INVENTORY_MANAGER'),
    getNotifications
);

export default router;
