import { pool } from '../config/db.js';

export const getPendingIssues = async () => {
    const { rows } = await pool.query(`
    SELECT
      transaction_id AS id,
      'Pick Task #' || transaction_id AS description,
      'high' AS priority
    FROM stock_transactions
    WHERE transaction_type = 'OUT'
    ORDER BY created_at DESC
    LIMIT 10
  `);

    return rows;
};
