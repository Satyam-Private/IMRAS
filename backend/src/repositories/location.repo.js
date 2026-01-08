import { pool } from '../config/db.js';

export const create = async ({ warehouse_id, code }) => {
    const { rows } = await pool.query(
        `INSERT INTO locations (warehouse_id, code)
     VALUES ($1, $2)
     RETURNING *`,
        [warehouse_id, code]
    );
    return rows[0];
};

export const findAll = async () => {
    const { rows } = await pool.query(
        `SELECT * FROM locations WHERE is_active = true ORDER BY code`
    );
    return rows;
};
