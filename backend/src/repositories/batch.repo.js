import { pool } from '../config/db.js';

export const getExpiringBatches = async (days) => {
  const { rows } = await pool.query(
    `
    SELECT
      b.batch_id,
      b.batch_code,
      i.name AS item_name,
      l.bin_code AS location,
      b.expiry_date,
      (b.expiry_date - CURRENT_DATE) AS days_left
    FROM batches b
    JOIN items i ON i.item_id = b.item_id
    LEFT JOIN stock s ON s.batch_id = b.batch_id
    LEFT JOIN bins l ON l.location_id = s.location_id
    WHERE b.expiry_date IS NOT NULL
      AND b.expiry_date <= CURRENT_DATE + ($1 || ' days')::interval
    ORDER BY b.expiry_date ASC
    `,
    [days]
  );

  return rows;
};
