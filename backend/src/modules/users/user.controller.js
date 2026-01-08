import * as userService from './user.service.js';

export const createUser = async (req, res, next) => {
    try {
        const user = await userService.createUser(req.body);
        res.status(201).json(user);
    } catch (err) {
        next(err);
    }
};

export const activateUser = async (req, res, next) => {
    try {
        const { is_active } = req.body;
        const user = await userService.toggleUserStatus(req.params.id, is_active);
        res.json(user);
    } catch (err) {
        next(err);
    }
};

export const assignWarehousesToUser = async (req, res, next) => {
    try {
        const { warehouse_ids } = req.body;

        if (!Array.isArray(warehouse_ids)) {
            return res.status(400).json({ message: 'warehouse_ids must be an array' });
        }

        await userService.assignWarehouses(req.params.id, warehouse_ids);
        res.json({ message: 'Warehouses assigned successfully' });
    } catch (err) {
        next(err);
    }
};

export const getUsers = async (req, res, next) => {
    try {
        const { role } = req.query;

        if (role) {
            const users = await userService.getUsersByRole(role);
            return res.json(users);
        }

        const users = await userService.getUsers();
        res.json(users);
    } catch (err) {
        next(err);
    }
};

export const getUsersByWarehouse = async (req, res, next) => {
    try {
        const users = await userService.getUsersByWarehouse(
            req.params.id
        );
        res.json(users);
    } catch (err) {
        next(err);
    }
};

export const deleteUser = async (req, res, next) => {
    try {
        await userService.deleteUser(req.params.id);
        res.json({ message: 'User removed successfully' });
    } catch (err) {
        next(err);
    }
};