import { pool } from '../config/db.js';

export const create = async ({ name, location }) => {
    const { rows } = await pool.query(
        `INSERT INTO warehouses (name, location)
     VALUES ($1, $2)
     RETURNING *`,
        [name, location]
    );
    return rows[0];
};

export const findAll = async () => {
    const { rows } = await pool.query(
        `SELECT * FROM warehouses ORDER BY name`
    );
    return rows;
};

export const toggleWarehouse = async (warehouseId) => {
    const { rowCount } = await pool.query(
        `
    UPDATE warehouses
    SET is_active = NOT is_active
    WHERE warehouse_id = $1
    `,
        [warehouseId]
    );

    if (rowCount === 0) {
        const err = new Error('Warehouse not found');
        err.status = 404;
        throw err;
    }
};


export const recruitUsers = async (warehouseId, managerId, staffIds) => {
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        // 1️⃣ Assign manager
        if (managerId) {
            await client.query(`
        INSERT INTO user_warehouses (user_id, warehouse_id, role)
        VALUES ($1, $2, 'INVENTORY_MANAGER')
      `, [managerId, warehouseId]);
        }

        // 2️⃣ Assign staff
        for (const staffId of staffIds || []) {
            await client.query(`
        INSERT INTO user_warehouses (user_id, warehouse_id, role)
        VALUES ($1, $2, 'WAREHOUSE_STAFF')
      `, [staffId, warehouseId]);
        }

        await client.query('COMMIT');
    } catch (err) {
        await client.query('ROLLBACK');
        throw err;
    } finally {
        client.release();
    }
};

export const getById = async (warehouseId) => {
    const { rows } = await pool.query(
        `
    SELECT warehouse_id, name, location
    FROM warehouses
    WHERE warehouse_id = $1
    `,
        [warehouseId]
    );

    return rows[0];
};