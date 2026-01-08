import { pool } from '../config/db.js';

/* ================= CREATE PO ================= */
export const createPO = async (supplierId, approvedBy, warehouse_id) => {
    const { rows } = await pool.query(
        `
    INSERT INTO purchase_orders (supplier_id, approved_by, warehouse_id)
    VALUES ($1, $2, $3)
    RETURNING *
    `,
        [supplierId, approvedBy, warehouse_id]
    );
    return rows[0];
};

export const addPOItem = async (poId, item) => {
    const { item_id, ordered_qty, unit_price } = item;

    if (!item_id || !ordered_qty) {
        const err = new Error('item_id and ordered_qty are required');
        err.status = 400;
        throw err;
    }

    const { rows } = await pool.query(
        `
    INSERT INTO po_items (
      po_id,
      item_id,
      ordered_qty,
      unit_price
    )
    VALUES ($1, $2, $3, $4)
    RETURNING *
    `,
        [
            poId,
            item_id,
            ordered_qty,
            unit_price ?? 0
        ]
    );

    return rows[0];
};

/* ================= GET PENDING ================= */
export const getPendingPOs = async () => {
    const { rows } = await pool.query(`
    SELECT
  po.po_id,
  po.created_at,
  po.status,

  s.name AS supplier_name,
  u.name AS approved_by,

  w.warehouse_id,
  w.name AS warehouse_name,

  COUNT(poi.po_item_id) AS items_count,
  COALESCE(SUM(poi.ordered_qty * poi.unit_price), 0) AS total_value

FROM purchase_orders po

JOIN warehouses w
  ON w.warehouse_id = po.warehouse_id

JOIN suppliers s
  ON s.supplier_id = po.supplier_id

LEFT JOIN users u
  ON u.user_id = po.approved_by

JOIN po_items poi
  ON poi.po_id = po.po_id

WHERE po.status = 'DRAFT'

GROUP BY
  po.po_id,
  s.name,
  u.name,
  w.warehouse_id,
  w.name

ORDER BY po.created_at DESC;

  `);

    return rows;
};

export const approvePO = async (poId) => {
    const { rowCount } = await pool.query(
        `
        UPDATE purchase_orders
        SET 
            status = 'APPROVED'
        WHERE po_id = $1
          AND status = 'DRAFT'
        `,
        [poId]
    );

    if (rowCount === 0) {
        const err = new Error('PO not found or already approved');
        err.status = 404;
        throw err;
    }
};



export const findById = async (poId) => {
    const { rows } = await pool.query(
        `
        SELECT *
        FROM purchase_orders
        WHERE po_id = $1
        `,
        [poId]
    );
    return rows[0];
};

export const updatePOItem = async (
    poId,
    poItemId,
    orderedQty,
    unitPrice,
    warehouseId
) => {
    const res = await pool.query(
        `
        UPDATE po_items poi
        SET ordered_qty = $1,
            unit_price = $2
        FROM purchase_orders po
        WHERE poi.po_item_id = $3
          AND poi.po_id = po.po_id
          AND po.po_id = $4
          AND po.warehouse_id = $5
        `,
        [orderedQty, unitPrice, poItemId, poId, warehouseId]
    );

    if (res.rowCount === 0) {
        const err = new Error("PO item not found for this warehouse");
        err.status = 404;
        throw err;
    }
};

export const markConverted = async (
    poId
) => {
    const res = await pool.query(
        `
        UPDATE purchase_orders 
        SET status = 'SENT'
        where po_id = $1
        `,
        [poId]
    );

    if (res.rowCount === 0) {
        const err = new Error("PO item not found for this warehouse");
        err.status = 404;
        throw err;
    }
};

export const getPOItems = async (poId) => {
    const { rows } = await pool.query(`
    SELECT
      poi.po_item_id,
      poi.item_id,
      poi.ordered_qty,
      i.sku,
      i.name
    FROM po_items poi
    JOIN items i ON i.item_id = poi.item_id
    WHERE poi.po_id = $1
  `, [poId]);

    return rows;
};
