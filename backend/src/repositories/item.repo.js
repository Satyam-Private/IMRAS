import { pool } from '../config/db.js';

export const create = async (data) => {
    const {
        sku,
        name,
        unit_of_measure,
        tracking_type,
        unit_price
    } = data;

    const { rows } = await pool.query(
        `INSERT INTO items
     (sku, name, unit_of_measure, tracking_type, unit_price)
     VALUES ($1,$2,$3,$4,$5)
     RETURNING *`,
        [
            sku,
            name,
            unit_of_measure,
            tracking_type,
            unit_price
        ]
    );

    return rows[0];
};

export const findAll = async () => {
    const { rows } = await pool.query(
        `SELECT * FROM items ORDER BY name`
    );
    return rows;
};

export const deleteItem = async (itemId) => {
    await pool.query(
        `delete from items WHERE item_id = $1`,
        [itemId]
    );
};

export const updateItem = async (itemId, data) => {
    const { sku, name, unit_of_measure, tracking_type, unit_price } = data;

    const { rows, rowCount } = await pool.query(
        `UPDATE items
        SET sku = $1, name = $2, unit_of_measure = $3, tracking_type = $4, unit_price = $5
        WHERE item_id = $6
        RETURNING *`,
        [sku, name, unit_of_measure, tracking_type, unit_price, itemId]
    );

    if (rowCount === 0) {
        const err = new Error('Item not found');
        err.status = 404;
        throw err;
    }

    return rows[0];
};

export const toggleItem = async (item_id) => {
    const { rowCount } = await pool.query(
        `
    UPDATE items
    SET is_active = NOT is_active
    WHERE item_id = $1
    `,
        [item_id]
    );

    if (rowCount === 0) {
        const err = new Error('Item not found');
        err.status = 404;
        throw err;
    }
};