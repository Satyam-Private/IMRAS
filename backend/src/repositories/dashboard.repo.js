import { pool } from '../config/db.js';

export const getWarehouseKPIs = async () => {
  const [
    grnsResult,
    grns,
    putawayResult,
    lowStockResult
  ] = await Promise.all([
    pool.query(`
      SELECT COUNT(*) FROM grns
      WHERE received_at::date = CURRENT_DATE
    `),
    pool.query(`
      SELECT 
    g.grn_id,
    g.po_id,
    g.received_by,
    g.received_at,
    g.warehouse_id,
    g.status,
    COUNT(gi.grn_item_id) as total_items,
    SUM(gi.received_qty) as total_quantity,
    STRING_AGG(DISTINCT i.name, ', ') as item_names,
    STRING_AGG(DISTINCT i.category, ', ') as categories
FROM 
    grns g
    LEFT JOIN grn_items gi ON g.grn_id = gi.grn_id
    LEFT JOIN items i ON gi.item_id = i.item_id
WHERE 
    DATE(g.received_at) = CURRENT_DATE
    
GROUP BY 
    g.grn_id, 
    g.po_id, 
    g.received_by, 
    g.received_at, 
    g.warehouse_id, 
    g.status
ORDER BY 
    g.received_at DESC;
      `),
    pool.query(`
      select count(*) from putaway_tasks 
	where status = 'PENDING'
    `),
    pool.query(`
      SELECT COUNT(*) FROM stock_transactions
      WHERE transaction_type = 'OUT'
    `),
    pool.query(`
      SELECT COUNT(DISTINCT item_id) FROM stock
      WHERE quantity < 10
    `)
  ]);

  return {
    todays_grns: Number(grnsResult.rows[0].count),
    grns,
    pending_putaway: Number(putawayResult.rows[0].count),
    low_stock_items: Number(lowStockResult.rows[0].count)
  };
};


export const getKPIs = async (user) => {
  const params = [];
  let whereClause = "";

  if (user.role === "INVENTORY_MANAGER") {
    params.push(user.warehouse_id);
    whereClause = `WHERE s.warehouse_id = $1`;
  }

  const query = `
    SELECT
      COALESCE(SUM(s.quantity * i.unit_price), 0) AS total_stock_value,

      COUNT(DISTINCT s.item_id) FILTER (
        WHERE s.quantity < rr.min_qty
      ) AS below_reorder_items

    FROM stock s
    JOIN items i ON i.item_id = s.item_id
    LEFT JOIN reorder_rules rr 
      ON rr.item_id = s.item_id
     AND rr.is_active = true
    ${whereClause};
  `;

  const { rows } = await pool.query(query, params);
  return rows[0];
};

export const getTransactions = async (user) => {
  let query = `
    SELECT
      st.transaction_type,
      i.sku,
      i.name,
      st.quantity,
      st.created_at
    FROM stock_transactions st
    JOIN items i ON i.item_id = st.item_id
  `;

  const params = [];

  if (user.role === "INVENTORY_MANAGER") {
    params.push(user.warehouse_id);
    query += ` WHERE st.warehouse_id = $1`;
  }

  query += `
    ORDER BY st.created_at DESC
    LIMIT 5
  `;

  const { rows } = await pool.query(query, params);
  return rows;
};



export const getStaff = async (user) => {
  let query = `
    SELECT
      name,
      role,
      CASE 
        WHEN is_active = true THEN 'Active'
        ELSE 'Inactive'
      END AS status
    FROM users
    WHERE role IN (
      'WAREHOUSE_STAFF'
    )
  `;

  const params = [];

  if (user.role === "INVENTORY_MANAGER") {
    params.push(user.warehouse_id);
    query += ` AND warehouse_id = $1`;
  }

  query += ` ORDER BY name`;

  const { rows } = await pool.query(query, params);
  return rows;
};



export const getReorderItems = async (user) => {
  let query = `
    SELECT
      i.sku,
      i.name,
      SUM(s.quantity) AS current_stock,
      rr.min_qty,
      rr.reorder_qty,
      (rr.min_qty - SUM(s.quantity)) AS gap
    FROM stock s
    JOIN items i ON i.item_id = s.item_id
    JOIN reorder_rules rr 
      ON rr.item_id = s.item_id
     AND rr.is_active = true
    WHERE SUM(s.quantity) < rr.min_qty
  `;

  const params = [];

  if (user.role === "INVENTORY_MANAGER") {
    params.push(user.warehouse_id);
    query += ` AND s.warehouse_id = $1`;
  }

  query += `
    GROUP BY 
      i.item_id, i.sku, i.name, rr.min_qty, rr.reorder_qty
    ORDER BY gap DESC
    LIMIT 10
  `;

  const { rows } = await pool.query(query, params);
  return rows;
};

