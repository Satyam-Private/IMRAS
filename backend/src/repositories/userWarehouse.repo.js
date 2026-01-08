import { pool } from '../config/db.js';

export const clearUserWarehouses = async (userId) => {
    await pool.query(
        `DELETE FROM user_warehouses WHERE user_id = $1`,
        [userId]
    );
};

export const assignWarehouse = async (userId, warehouseId) => {
    await pool.query(
        `
    INSERT INTO user_warehouses (user_id, warehouse_id)
    VALUES ($1, $2)
    `,
        [userId, warehouseId]
    );
};
