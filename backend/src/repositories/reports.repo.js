import { pool } from '../config/db.js';

/**
 * STOCK AGEING
 */
export const fetchStockAgeing = async (user, filters) => {
    let query = `
    SELECT
      i.sku,
      i.name,
      b.batch_code,
      s.quantity,
      (CURRENT_DATE - s.received_at::date) AS age_in_days
    FROM stock s
    JOIN items i ON i.item_id = s.item_id
    LEFT JOIN batches b ON b.batch_id = s.batch_id
    WHERE 1=1
  `;

    const params = [];

    // Role-based warehouse filter
    if (user.role === 'INVENTORY_MANAGER') {
        params.push(user.warehouse_id);
        query += ` AND s.warehouse_id = $${params.length}`;
    }

    // Date range filter
    if (filters.fromDate) {
        params.push(filters.fromDate);
        query += ` AND s.received_at >= $${params.length}`;
    }

    if (filters.toDate) {
        params.push(filters.toDate);
        query += ` AND s.received_at <= $${params.length}`;
    }

    query += ` ORDER BY age_in_days DESC`;

    const { rows } = await pool.query(query, params);
    return rows;
};

/**
 * FAST / SLOW MOVING (Last 30 days)
 */
export const fetchFastSlowMoving = async (user, filters) => {
    let query = `
    SELECT
      i.sku,
      i.name,
      COALESCE(SUM(ABS(st.quantity)), 0) AS issued_quantity
    FROM items i
    LEFT JOIN stock_transactions st
      ON st.item_id = i.item_id
     AND st.transaction_type = 'OUT'
  `;

    const params = [];

    // Warehouse filter
    if (user.role === 'INVENTORY_MANAGER') {
        params.push(user.warehouse_id);
        query += ` AND st.warehouse_id = $${params.length}`;
    }

    // Date range filter
    if (filters.fromDate) {
        params.push(filters.fromDate);
        query += ` AND st.created_at >= $${params.length}`;
    }

    if (filters.toDate) {
        params.push(filters.toDate);
        query += ` AND st.created_at <= $${params.length}`;
    }

    query += `
    GROUP BY i.sku, i.name
    ORDER BY issued_quantity DESC
  `;

    const { rows } = await pool.query(query, params);
    return rows;
};



/**
 * STOCK VALUATION
 */
export const fetchStockValuation = async (user, filters) => {
    let query = `
    SELECT
      i.sku,
      i.name,
      SUM(s.quantity * i.unit_price) AS stock_value
    FROM stock s
    JOIN items i ON i.item_id = s.item_id
    WHERE 1=1
  `;

    const params = [];

    if (user.role === 'INVENTORY_MANAGER') {
        params.push(user.warehouse_id);
        query += ` AND s.warehouse_id = $${params.length}`;
    }

    if (filters.fromDate) {
        params.push(filters.fromDate);
        query += ` AND s.received_at >= $${params.length}`;
    }

    if (filters.toDate) {
        params.push(filters.toDate);
        query += ` AND s.received_at <= $${params.length}`;
    }

    query += `
    GROUP BY i.sku, i.name
    ORDER BY stock_value DESC
  `;

    const { rows } = await pool.query(query, params);
    return rows;
};

