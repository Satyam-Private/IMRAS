import { pool } from '../config/db.js';

export const getReorderCandidates = async (warehouseId) => {
  const { rows } = await pool.query(`
    SELECT
      rr.item_id,
      rr.min_qty,
      rr.reorder_qty,
      COALESCE(SUM(s.quantity), 0) AS current_stock
    FROM reorder_rules rr
    LEFT JOIN stock s
      ON s.item_id = rr.item_id
     AND s.warehouse_id = rr.warehouse_id
    WHERE rr.is_active = true
      AND rr.warehouse_id = $1
    GROUP BY rr.item_id, rr.min_qty, rr.reorder_qty
  `, [warehouseId]);

  return rows;
};




export const getReorderSuggestions = async (warehouseId) => {
  const { rows } = await pool.query(`
    SELECT
      rr.reorder_rule_id,
      i.item_id,
      i.sku,
      i.name,
      COALESCE(SUM(s.quantity), 0) AS current_stock,
      rr.min_qty,
      rr.max_qty,
      rr.reorder_qty AS suggested_qty,
      CASE
        WHEN COALESCE(SUM(s.quantity), 0) = 0 THEN 'high'
        WHEN COALESCE(SUM(s.quantity), 0) < rr.min_qty THEN 'medium'
        ELSE 'low'
      END AS priority
    FROM reorder_rules rr
    JOIN items i ON i.item_id = rr.item_id
    LEFT JOIN stock s
      ON s.item_id = rr.item_id
     AND s.warehouse_id = $1
    WHERE rr.is_active = TRUE AND i.is_active = TRUE
    GROUP BY
      rr.reorder_rule_id,
      i.item_id,
      i.sku,
      i.name,
      rr.min_qty,
      rr.max_qty,
      rr.reorder_qty
    HAVING COALESCE(SUM(s.quantity), 0) < rr.min_qty
    ORDER BY priority DESC
  `, [warehouseId]);

  return rows;
};




