import { pool } from '../config/db.js';

/* ---------- Create ---------- */
export const create = async ({
    item_id,
    min_qty,
    max_qty,
    reorder_qty
}) => {
    const { rows } = await pool.query(
        `
    INSERT INTO reorder_rules
      (item_id, min_qty, max_qty, reorder_qty)
    VALUES ($1,$2,$3,$4)
    RETURNING *
    `,
        [item_id, min_qty, max_qty, reorder_qty]
    );

    return rows[0];
};

/* ---------- Find All ---------- */
export const findAll = async () => {
    const { rows } = await pool.query(
        `
    SELECT rr.*, i.sku, i.name
    FROM reorder_rules rr
    JOIN items i ON i.item_id = rr.item_id
    WHERE rr.is_active = true
    ORDER BY i.name
    `
    );
    return rows;
};

/* ---------- Update ---------- */
export const update = async (id, data) => {
    const { min_qty, max_qty, reorder_qty } = data;

    const { rows } = await pool.query(
        `
    UPDATE reorder_rules
    SET min_qty=$2, max_qty=$3, reorder_qty=$4
    WHERE reorder_rule_id=$1
    RETURNING *
    `,
        [id, min_qty, max_qty, reorder_qty]
    );

    return rows[0];
};

/* ---------- Deactivate ---------- */
export const deactivate = async (id) => {
    const { rows } = await pool.query(
        `
    UPDATE reorder_rules
    SET is_active = false
    WHERE reorder_rule_id = $1
    RETURNING *
    `,
        [id]
    );
    return rows[0];
};
