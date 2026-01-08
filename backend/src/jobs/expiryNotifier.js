import cron from 'node-cron';
import { pool } from '../config/db.js';

export const startExpiryNotifier = () => {
    cron.schedule('0 2 * * *', async () => {
        // Runs daily at 2 AM
        const { rows } = await pool.query(`
      SELECT
        b.batch_id,
        b.item_id,
        b.expiry_date,
        i.name
      FROM batches b
      JOIN items i ON i.item_id = b.item_id
      WHERE b.expiry_date BETWEEN CURRENT_DATE
                              AND CURRENT_DATE + INTERVAL '30 days'
    `);

        for (const row of rows) {
            await pool.query(`
        INSERT INTO notifications (type, message, item_id, batch_id)
        VALUES ($1, $2, $3, $4)
      `, [
                'EXPIRY',
                `Batch for ${row.name} expires on ${row.expiry_date}`,
                row.item_id,
                row.batch_id
            ]);
        }
    });
};
