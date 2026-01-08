import { pool } from '../config/db.js';

export const create = async (data) => {
    const { rows } = await pool.query(
        `INSERT INTO suppliers (name, contact_details, lead_time_days)
     VALUES ($1,$2,$3)
     RETURNING *`,
        [data.name, data.contact_details, data.lead_time_days || 0]
    );
    return rows[0];
};

export const findAll = async () => {
    const { rows } = await pool.query(
        `SELECT * FROM suppliers ORDER BY name`
    );
    return rows;
};

// repositories/supplier.repo.js

export const toggle = async (supplierId) => {
    const { rows } = await pool.query(
        `
    UPDATE suppliers
    SET is_active = NOT is_active
    WHERE supplier_id = $1
    RETURNING supplier_id, name, is_active
    `,
        [supplierId]
    );

    if (!rows[0]) {
        const err = new Error("Supplier not found");
        err.status = 404;
        throw err;
    }

    return rows[0];
};
