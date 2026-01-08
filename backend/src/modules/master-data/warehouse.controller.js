import * as masterService from './master.service.js';

export const createWarehouse = async (req, res, next) => {
    try {
        const warehouse = await masterService.createWarehouse(req.body);
        res.status(201).json(warehouse);
    } catch (err) {
        next(err);
    }
};

export const listWarehouses = async (req, res, next) => {
    try {
        const warehouses = await masterService.listWarehouses();
        res.json(warehouses);
    } catch (err) {
        next(err);
    }
};

export const toggleWarehouse = async (req, res, next) => {
    try {
        await masterService.toggleWarehouse(req.params.id);
        res.json({ message: 'Warehouse status changed successfully' });
    } catch (err) {
        next(err);
    }
};

export const recruitWarehouseUsers = async (req, res, next) => {
    try {
        const result = await masterService.recruitUsersToWarehouse(
            req.params.id,
            req.body
        );

        res.json(result);
    } catch (err) {
        // handle unique constraint errors cleanly
        if (err.code === '23505') {
            err.status = 400;
            err.message = 'User already assigned to a warehouse or manager already exists';
        }
        next(err);
    }
};


