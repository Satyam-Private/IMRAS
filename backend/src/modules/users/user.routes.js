import express from 'express';
import { authenticate } from '../../middlewares/auth.middleware.js';
import { allowRoles } from '../../middlewares/rbac.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';

import {
    createUser,
    getUsers,
    activateUser,
    assignWarehousesToUser,
    getUsersByWarehouse,
    deleteUser
} from './user.controller.js';

import { createUserSchema } from '../../validations/user.schema.js';

const router = express.Router();

/* Create user */
router.post(
    '/',
    authenticate,
    allowRoles('ADMIN'),
    validate(createUserSchema),
    createUser
);

/* List users */
router.get(
    '/',
    authenticate,
    allowRoles('ADMIN'),
    getUsers
);

router.get(  // users with perticular warehouses 
    '/:id',
    authenticate,
    allowRoles('ADMIN'),
    getUsersByWarehouse
);

/* Activate / deactivate user */
router.put(
    '/:id/activate',
    authenticate,
    allowRoles('ADMIN'),
    activateUser
);

/* Assign warehouses to user */
router.put(
    '/:id/warehouses',
    authenticate,
    allowRoles('ADMIN'),
    assignWarehousesToUser
);

router.delete(
    '/:id',
    authenticate,
    allowRoles('ADMIN'),
    deleteUser
);

export default router;
