import { pool } from '../config/db.js';

/* ================= CREATE PR ================= */
export const createPR = async (requestedBy, warehouseId) => {
    const { rows } = await pool.query(
        `
    INSERT INTO purchase_requisitions (requested_by, warehouse_id)
    VALUES ($1, $2)
    RETURNING *
    `,
        [requestedBy, warehouseId]
    );
    return rows[0];
};

/* ================= ADD PR ITEM ================= */
export const addPRItem = async (prId, itemId, qty, warehouseId) => {
    const res = await pool.query(
        `
        INSERT INTO pr_items (pr_id, item_id, quantity_required)
        SELECT pr.pr_id, $2, $3
        FROM purchase_requisitions pr
        WHERE pr.pr_id = $1
          AND pr.warehouse_id = $4
        `,
        [prId, itemId, qty, warehouseId]
    );

    if (res.rowCount === 0) {
        const err = new Error("PR not found for this warehouse");
        err.status = 404;
        throw err;
    }
};


/* ================= FIND PR ================= */
export const findById = async (prId, warehouseId) => {
    const { rows } = await pool.query(
        `
    SELECT *
    FROM purchase_requisitions
    WHERE pr_id = $1 AND warehouse_id = $2
    `,
        [prId, warehouseId]
    );
    return rows[0];
};

/* ================= APPROVE PR ================= */
export const approvePR = async (prId, warehouseId) => {
    await pool.query(
        `
    UPDATE purchase_requisitions
    SET status = 'APPROVED'
    WHERE pr_id = $1 AND warehouse_id = $2
    `,
        [prId, warehouseId]
    );
};

/* ================= PR WITH ITEMS ================= */
export const getPRWithItems = async (prId) => {
    const { rows } = await pool.query(
        `
    SELECT
      pr.pr_id,
      pr.status,
      pr.requested_by,
      pr.warehouse_id,
      pr.created_at,
            json_agg(
                json_build_object(
                    'item_id', pri.item_id,
                    'sku', i.sku,
                    'name', i.name,
                    'quantity_required', pri.quantity_required,
                    'unit_price', i.unit_price
                )
            ) AS items
    FROM purchase_requisitions pr
        LEFT JOIN pr_items pri ON pri.pr_id = pr.pr_id
        LEFT JOIN items i ON i.item_id = pri.item_id
    WHERE pr.pr_id = $1
    GROUP BY pr.pr_id
    `,
        [prId]
    );

    return rows[0];
};


/* ================= MARK CONVERTED ================= */
export const markPRConverted = async (prId) => {
    await pool.query(
        `
    UPDATE purchase_requisitions
    SET status = 'CONVERTED'
    WHERE pr_id = $1
    `,
        [prId]
    );
};

/* ================= LIST PRs BY STATUS ================= */
export const getPRsByStatus = async (status, warehouseId) => {
    const { rows } = await pool.query(
        `
    SELECT
      pr.pr_id,
      pr.status,
      pr.created_at,
      u.name AS requested_by
    FROM purchase_requisitions pr
    JOIN users u ON u.user_id = pr.requested_by
    WHERE pr.status = $1
      AND pr.warehouse_id = $2
    ORDER BY pr.created_at DESC
    `,
        [status, warehouseId]
    );

    for (const pr of rows) {
        const itemsRes = await pool.query(
            `
      SELECT
        pri.item_id,
        i.sku,
        i.name,
        pri.quantity_required
      FROM pr_items pri
      JOIN items i ON i.item_id = pri.item_id
      WHERE pri.pr_id = $1
      `,
            [pr.pr_id]
        );

        pr.items = itemsRes.rows;
    }

    return rows;
};

export const getAllApprovedPRsForAdmin = async () => {
    const { rows } = await pool.query(`
    SELECT
      pr.pr_id,
      pr.status,
      pr.created_at,
      pr.warehouse_id,
      w.name AS warehouse_name,
      u.name AS requested_by,
      json_agg(
        json_build_object(
          'item_id', i.item_id,
          'sku', i.sku,
          'name', i.name,
          'quantity_required', pri.quantity_required
        )
      ) AS items
    FROM purchase_requisitions pr
    JOIN users u ON u.user_id = pr.requested_by
    JOIN warehouses w ON w.warehouse_id = pr.warehouse_id
    LEFT JOIN pr_items pri ON pri.pr_id = pr.pr_id
    LEFT JOIN items i ON i.item_id = pri.item_id
    WHERE pr.status = 'APPROVED'
    GROUP BY pr.pr_id, w.name, u.name
    ORDER BY pr.created_at DESC
  `);

    return rows;
};
