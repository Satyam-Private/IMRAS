import { pool } from '../config/db.js';

export const findSuggestedLocation = async ({
    item_id,
    warehouse_id,
    quantity
}) => {
    // 1️⃣ Same item, enough capacity
    const sameItem = await pool.query(
        `
        SELECT b.location_id
        FROM stock s
        JOIN bins b ON b.location_id = s.location_id
        WHERE s.item_id = $1
          AND b.warehouse_id = $2
          AND b.available_capacity >= $3
          AND b.is_active = true
          AND b.status = 'ACTIVE'
        LIMIT 1
        `,
        [item_id, warehouse_id, quantity]
    );

    if (sameItem.rows.length) {
        return {
            location_id: sameItem.rows[0].location_id,
            reason: 'Same item already stored'
        };
    }

    // 2️⃣ Fallback bin
    const fallback = await pool.query(
        `
        SELECT location_id
        FROM bins
        WHERE warehouse_id = $1
          AND available_capacity >= $2
          AND is_active = true
          AND status = 'ACTIVE'
        ORDER BY available_capacity DESC
        LIMIT 1
        `,
        [warehouse_id, quantity]
    );

    if (fallback.rows.length) {
        return {
            location_id: fallback.rows[0].location_id,
            reason: 'Available bin with sufficient space'
        };
    }

    return null;
};

export const findCompletedPutaways = async (
    warehouseId,
    todayOnly
) => {
    let query = `
    SELECT
      pt.putaway_id,
      pt.grn_id,
      pt.quantity,
      pt.completed_at,

      i.sku,
      b.bin_code

    FROM putaway_tasks pt
    JOIN items i
      ON i.item_id = pt.item_id
    JOIN bins b
      ON b.location_id = pt.actual_location_id

    WHERE pt.status = 'COMPLETED'
      AND pt.warehouse_id = $1
  `;

    const params = [warehouseId];

    if (todayOnly) {
        query += ` AND pt.completed_at::date = CURRENT_DATE`;
    }

    query += ` ORDER BY pt.completed_at DESC`;

    const { rows } = await pool.query(query, params);
    return rows;
};

export const createPutawayTask = async ({
    grn_id,
    grn_item_id,
    item_id,
    batch_id,
    warehouse_id,
    quantity
}) => {
    const suggestion = await findSuggestedLocation({
        item_id,
        warehouse_id,
        quantity
    });

    const res = await pool.query(
        `
        INSERT INTO putaway_tasks (
          grn_id,
          grn_item_id,
          item_id,
          batch_id,
          warehouse_id,
          quantity,
          status,
          suggested_location_id,
          suggested_reason
        )
        VALUES ($1,$2,$3,$4,$5,$6,'PENDING',$7,$8)
        RETURNING *
        `,
        [
            grn_id,
            grn_item_id,
            item_id,
            batch_id,
            warehouse_id,
            quantity,
            suggestion?.location_id || null,
            suggestion?.reason || null
        ]
    );

    return res.rows[0];
};


export const getPendingPutawayTasks = async (warehouseId) => {
    const { rows } = await pool.query(
        `
SELECT
  pt.putaway_id,
  pt.grn_id,
  pt.grn_item_id,
  pt.item_id,
  pt.batch_id,
  pt.quantity,
  pt.status,
  pt.created_at,

  pt.suggested_location_id,
  sb.bin_code        AS suggested_bin_code,
  pt.suggested_reason,

  g.po_id,
  b.batch_code,
  b.expiry_date

FROM putaway_tasks pt

JOIN grns g
  ON g.grn_id = pt.grn_id

JOIN batches b
  ON b.batch_id = pt.batch_id

LEFT JOIN bins sb
  ON sb.location_id = pt.suggested_location_id

WHERE pt.status = 'PENDING'
  AND pt.warehouse_id = $1

ORDER BY pt.created_at ASC;

    `,
        [warehouseId]
    );

    return rows;
};

export const getPendingTaskById = async (id, client) => {
    const { rows } = await client.query(
        `
        SELECT *
        FROM putaway_tasks
        WHERE putaway_id = $1
          AND status = 'PENDING'
        FOR UPDATE
        `,
        [id]
    );
    return rows[0];
};


export const getBinCapacity = async (
    locationId,
    warehouseId,
    client
) => {
    const { rows } = await client.query(`
        SELECT available_capacity
        FROM bins
        WHERE location_id = $1
          AND warehouse_id = $2
          AND status = 'ACTIVE'
          AND is_active = true
        FOR UPDATE
    `, [locationId, warehouseId]);

    return rows[0];
};


export const insertStock = async (data, client) => {
    await client.query(
        `
        INSERT INTO stock (
            item_id,
            warehouse_id,
            location_id,
            batch_id,
            grn_id,
            quantity,
            received_at
        )
        VALUES ($1,$2,$3,$4,$5,$6,NOW())
        `,
        [
            data.item_id,
            data.warehouse_id,
            data.location_id,
            data.batch_id,
            data.grn_id,
            data.quantity
        ]
    );
};

export const updateBinCapacity = async (
    locationId,
    qty,
    client
) => {
    await client.query(`
        UPDATE bins
        SET used_capacity = used_capacity + $1,
            available_capacity = available_capacity - $1
        WHERE location_id = $2
    `, [qty, locationId]);
};


export const markPutawayCompleted = async (
    putawayId,
    locationId,
    client
) => {
    await client.query(`
        UPDATE putaway_tasks
        SET status = 'COMPLETED',
            actual_location_id = $1,
            completed_at = NOW()
        WHERE putaway_id = $2
    `, [locationId, putawayId]);
};



export const autoCompleteGRN = async (
    grnId,
    client
) => {
    await client.query(`
        UPDATE grns
        SET status = 'COMPLETED'
        WHERE grn_id = $1
          AND NOT EXISTS (
              SELECT 1
              FROM putaway_tasks
              WHERE grn_id = $1
                AND status = 'PENDING'
          )
    `, [grnId]);
};

