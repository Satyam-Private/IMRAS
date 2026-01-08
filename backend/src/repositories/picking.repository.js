import { pool } from "../config/db.js";

/* ================= FIFO STOCK ================= */

export const findFIFOStock = async (
    sku,
    warehouseId,
    client
) => {
    const { rows } = await client.query(
        `
    SELECT
      s.stock_id,
      s.item_id,
      s.location_id,
      s.batch_id,
      s.quantity,
      b.bin_code, 
      s.warehouse_id
    FROM stock s
    JOIN items i ON i.item_id = s.item_id
    JOIN bins b ON b.location_id = s.location_id
    WHERE i.sku = $1
      AND s.warehouse_id = $2
      AND s.quantity > 0
    ORDER BY s.received_at ASC
    FOR UPDATE
    `,
        [sku, warehouseId]
    );

    return rows;
};

/* ================= STOCK DEDUCTION ================= */

export const deductStock = async (
    stockId,
    qty,
    client
) => {
    await client.query(
        `
    UPDATE stock
    SET quantity = quantity - $1
    WHERE stock_id = $2
    `,
        [qty, stockId]
    );
};

/* ================= PICK HISTORY ================= */

export const insertPickHistory = async (
    {
        item_id,
        location_id,
        batch_id,
        quantity,
        picked_by,
        notes
    },
    client
) => {
    await client.query(
        `
    INSERT INTO pick_history (
      item_id,
      location_id,
      batch_id,
      quantity,
      picked_by,
      notes
    )
    VALUES ($1,$2,$3,$4,$5,$6)
    `,
        [
            item_id,
            location_id,
            batch_id,
            quantity,
            picked_by,
            notes
        ]
    );
};

export const insertStockTransaction = async (
    {
        item_id,
        warehouse_id,
        location_id,
        batch_id,
        quantity,
        transaction_type,
        reference_type,
        performed_by
    },
    client
) => {
    await client.query(
        `
    INSERT INTO stock_transactions (
      item_id,
      warehouse_id,
      location_id,
      batch_id,
      transaction_type,
      quantity,
      reference_type,
      performed_by,
      created_at
    )
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8 ,NOW())
    `,
        [
            item_id,
            warehouse_id,
            location_id,
            batch_id,
            transaction_type,
            quantity,
            reference_type,
            performed_by
        ]
    );
};


export const findRecentPicks = async (warehouseId) => {
    const { rows } = await pool.query(
        `
        SELECT
            ph.pick_id,
            ph.item_id,
            ph.quantity,
            ph.location_id,
            ph.batch_id,
            ph.picked_by,
            ph.picked_at,
            ph.notes,
            i.sku,
            i.name,
            b.bin_code,
            bat.batch_code
        FROM pick_history ph
        JOIN items i ON i.item_id = ph.item_id
        JOIN bins b ON b.location_id = ph.location_id
        LEFT JOIN batches bat ON bat.batch_id = ph.batch_id
        JOIN stock s ON s.item_id = ph.item_id
        WHERE s.warehouse_id = $1
        ORDER BY ph.picked_at DESC
        LIMIT 20
        `,
        [warehouseId]
    );

    return rows;
};