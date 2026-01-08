import { pool } from '../config/db.js';


export const getById = async (grnId) => {
  const res = await pool.query(
    `
    SELECT 
      g.grn_id,
      g.po_id,
      g.warehouse_id,
      g.status,
      g.received_at,
      w.name AS warehouse_name,
      s.name AS supplier_name
    FROM grns g
    JOIN purchase_orders po ON po.po_id = g.po_id
    JOIN suppliers s ON s.supplier_id = po.supplier_id
    JOIN warehouses w ON w.warehouse_id = g.warehouse_id
    WHERE g.grn_id = $1
    `,
    [grnId]
  );

  return res.rows[0] || null;
};

/* ================= CREATE GRN ================= */
export const createGRN = async (poId, warehouseId) => {
  const { rows } = await pool.query(`
    INSERT INTO grns (po_id, warehouse_id, status)
    VALUES ($1, $2, 'PENDING')
    RETURNING *
  `, [poId, warehouseId]);

  return rows[0];
};

export const addGRNItem = async ({ grn_id, item_id, expected_qty, batch_id = null, warehouse_id = null }) => {
  await pool.query(`
    INSERT INTO grn_items (grn_id, item_id, received_qty , batch_id , warehouse_id)
    VALUES ($1, $2, $3 , $4, $5)
  `, [grn_id, item_id, expected_qty, batch_id, warehouse_id]);
};



/* ================= PENDING GRNs ================= */
export const getPendingGRNs = async () => {
  const { rows } = await pool.query(`
   SELECT
  g.grn_id,
  g.received_at,
  g.status,
  s.name AS supplier_name,
  w.name AS warehouse_name,
  COUNT(gi.grn_item_id) AS total_items,
  COALESCE(SUM(gi.received_qty), 0) AS total_quantity
FROM grns g
JOIN purchase_orders po ON po.po_id = g.po_id
JOIN suppliers s ON s.supplier_id = po.supplier_id
JOIN warehouses w ON w.warehouse_id = g.warehouse_id
LEFT JOIN grn_items gi ON gi.grn_id = g.grn_id
WHERE g.status = 'PENDING'
GROUP BY
  g.grn_id,
  g.received_at,
  g.status,
  s.name,
  w.name
ORDER BY g.received_at DESC;

  `);

  return rows;
};

/* ================= GRN ITEMS ================= */
export const getGRNItems = async (grnId) => {
  const { rows } = await pool.query(`
    SELECT
      gi.grn_item_id,
      gi.item_id,
      i.sku,
      i.name,
      gi.received_qty
    FROM grn_items gi
    JOIN items i ON i.item_id = gi.item_id
    WHERE gi.grn_id = $1
  `, [grnId]);

  return rows;
};

/* ================= CREATE BATCH ================= */
export const createBatch = async ({
  item_id,
  batch_code,
  expiry_date,
  warehouse_id
}) => {
  const { rows } = await pool.query(`
    INSERT INTO batches (item_id, batch_code, expiry_date, warehouse_id)
    VALUES ($1, $2, $3, $4)
    RETURNING *
  `, [item_id, batch_code, expiry_date || null, warehouse_id]);

  return rows[0];
};


/* ================= UPDATE GRN ITEM RECEIVED QTY ================= */
export const updateGRNItemReceivedQty = async ({ grn_id, item_id, received_qty, batch_id = null }) => {
  const { rows } = await pool.query(`
    UPDATE grn_items
    SET received_qty = $3,
        batch_id = $4
    WHERE grn_id = $1 AND item_id = $2
    RETURNING *
  `, [grn_id, item_id, received_qty, batch_id]);

  return rows[0] || null;
};


/* ================= MARK GRN RECEIVED ================= */
export const markReceived = async (grnId, userId) => {
  await pool.query(`
    UPDATE grns
    SET status = 'RECEIVED',
        received_by = $2,
        received_at = NOW()
    WHERE grn_id = $1
  `, [grnId, userId]);
};

