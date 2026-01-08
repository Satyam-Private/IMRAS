import { Router } from 'express';
import { createItem, listItems, deleteItem, toggleItem, updateItem } from './item.controller.js';
import { authenticate } from '../../middlewares/auth.middleware.js';
import { allowRoles } from '../../middlewares/rbac.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { createItemSchema } from '../../validations/item.schema.js';
import { createWarehouse, listWarehouses, toggleWarehouse, recruitWarehouseUsers } from './warehouse.controller.js';
import { createWarehouseSchema } from '../../validations/warehouse.schema.js';
import { createLocation, listLocations } from './location.controller.js';
import { createLocationSchema } from '../../validations/location.schema.js';
import { createSupplier, listSuppliers, toggleSupplier } from './supplier.controller.js';
import { createSupplierSchema } from '../../validations/supplier.schema.js';
const router = Router();

/* ITEMS */
router.post(
    '/items',
    authenticate,
    allowRoles('ADMIN', 'INVENTORY_MANAGER'),
    validate(createItemSchema),
    createItem
);

router.get(
    '/items',
    authenticate,
    allowRoles('ADMIN', 'INVENTORY_MANAGER'),
    listItems
);

router.delete(
    "/items/:id",
    authenticate,
    allowRoles("ADMIN", 'INVENTORY_MANAGER'),
    deleteItem
);

router.put(
    '/items/:id/toggle',
    authenticate,
    allowRoles('ADMIN', 'INVENTORY_MANAGER'),
    toggleItem
);

router.put(
    '/items/:id',
    authenticate,
    allowRoles('ADMIN', 'INVENTORY_MANAGER'),
    validate(createItemSchema),
    updateItem
);

router.post(
    '/warehouses',
    authenticate,
    allowRoles('ADMIN'),
    validate(createWarehouseSchema),
    createWarehouse
);

router.get(
    '/warehouses',
    authenticate,
    listWarehouses
);

router.post(
    '/warehouses/:id/recruit',
    authenticate,
    allowRoles('ADMIN'),
    recruitWarehouseUsers
);




router.post(
    '/locations',
    authenticate,
    allowRoles('ADMIN'),
    validate(createLocationSchema),
    createLocation
);

router.get(
    '/locations',
    authenticate,
    listLocations
);

router.post(
    '/suppliers',
    authenticate,
    allowRoles('ADMIN'),
    validate(createSupplierSchema),
    createSupplier
);

router.get(
    '/suppliers',
    authenticate,
    allowRoles('ADMIN', 'INVENTORY_MANAGER'),
    listSuppliers
);

router.put(
    '/suppliers/:id/toggle',
    authenticate,
    allowRoles('ADMIN'),
    toggleSupplier
);

router.put(
    '/warehouses/:id/toggle',
    authenticate,
    allowRoles('ADMIN'),
    toggleWarehouse
);
export default router;
