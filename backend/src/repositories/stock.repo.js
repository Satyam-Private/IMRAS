import { pool } from '../config/db.js';

export const increaseStock = async ({
  item_id,
  warehouse_id,
  batch_id,
  quantity
}) => {
  await pool.query(`
    INSERT INTO stock (item_id, warehouse_id, batch_id, quantity)
    VALUES ($1, $2, $3, $4)
    ON CONFLICT (item_id, warehouse_id, batch_id)
    DO UPDATE
      SET quantity = stock.quantity + EXCLUDED.quantity
  `, [item_id, warehouse_id, batch_id, quantity]);
};



export const getQuantity = async ({
  item_id,
  warehouse_id,
  location_id,
  batch_id
}) => {
  const { rows } = await pool.query(
    `
    SELECT quantity
    FROM stock
    WHERE item_id = $1
      AND warehouse_id = $2
      AND location_id = $3
      AND batch_id IS NOT DISTINCT FROM $4
    `,
    [item_id, warehouse_id, location_id, batch_id]
  );

  return rows[0]?.quantity || 0;
};

export const decrease = async ({
  item_id,
  warehouse_id,
  location_id,
  batch_id,
  quantity
}) => {
  const result = await pool.query(
    `
    UPDATE stock
    SET quantity = quantity - $5
    WHERE item_id = $1
      AND warehouse_id = $2
      AND location_id = $3
      AND batch_id IS NOT DISTINCT FROM $4
      AND quantity >= $5
    RETURNING *
    `,
    [item_id, warehouse_id, location_id, batch_id, quantity]
  );

  if (result.rowCount === 0) {
    throw new Error('Insufficient stock');
  }

  return result.rows[0];
};

export const getStockAgingFromDB = async () => {
  const query = `
    SELECT
      i.sku,
      i.name AS item_name,
      s.quantity,
      s.warehouse_id,
      s.received_at,
      i.unit_price,
      (CURRENT_DATE - s.received_at::date) AS age_days,
      (s.quantity * i.unit_price) AS total_value
    FROM stock s
    JOIN items i ON i.item_id = s.item_id
    ORDER BY age_days DESC;
  `;

  const { rows } = await pool.query(query);
  return rows;
};