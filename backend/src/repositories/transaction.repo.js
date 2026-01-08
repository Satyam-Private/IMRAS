import { pool } from '../config/db.js';

export const create = async ({
    item_id,
    warehouse_id,
    location_id,
    batch_id,
    serial_id = null,
    transaction_type,
    quantity,
    reference_type,
    reference_id,
    performed_by
}) => {
    const { rows } = await pool.query(
        `INSERT INTO stock_transactions (
      item_id,
      warehouse_id,
      location_id,
      batch_id,
      serial_id,
      transaction_type,
      quantity,
      reference_type,
      reference_id,
      performed_by
    )
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
    RETURNING *`,
        [
            item_id,
            warehouse_id,
            location_id,
            batch_id,
            serial_id,
            transaction_type,
            quantity,
            reference_type,
            reference_id,
            performed_by
        ]
    );

    return rows[0];
};
