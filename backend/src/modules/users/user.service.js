import * as userRepo from '../../repositories/user.repo.js';
import * as userWarehouseRepo from '../../repositories/userWarehouse.repo.js';
import { hashPassword } from '../../utils/password.js';

export const createUser = async (data) => {
    const existing = await userRepo.findByEmail(data.email);
    if (existing) {
        const err = new Error('Email already exists');
        err.status = 409;
        throw err;
    }

    const password_hash = await hashPassword(data.password);

    return userRepo.createUser({
        name: data.name,
        email: data.email,
        password_hash,
        role: data.role,
        warehouse_id: data.warehouse_id
    });
};

export const getUsers = async () => {
    return userRepo.getUsers();
};

export const getUsersByWarehouse = async (warehouseId) => {
    if (!warehouseId) {
        const err = new Error('warehouse_id is required');
        err.status = 400;
        throw err;
    }

    return userRepo.getUsersByWarehouse(warehouseId);
};
export const toggleUserStatus = async (userId, isActive) => {
    return userRepo.updateUserStatus(userId, isActive);
};

export const assignWarehouses = async (userId, warehouseIds) => {
    await userWarehouseRepo.clearUserWarehouses(userId);

    for (const warehouseId of warehouseIds) {
        await userWarehouseRepo.assignWarehouse(userId, warehouseId);
    }
};

export const getUsersByRole = async (role) => {
    if (!['INVENTORY_MANAGER', 'WAREHOUSE_STAFF'].includes(role)) {
        const err = new Error('Invalid role');
        err.status = 400;
        throw err;
    }

    return userRepo.getUsersByRoleUnassigned(role);
};

export const deleteUser = async (userId) => {
    const user = await userRepo.findById(userId);

    if (!user) {
        const err = new Error('User not found');
        err.status = 404;
        throw err;
    }

    if (user.role === 'ADMIN') {
        const err = new Error('Admin users cannot be deleted');
        err.status = 403;
        throw err;
    }

    await userRepo.deleteUser(userId);
};