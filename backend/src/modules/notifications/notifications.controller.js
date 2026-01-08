import { pool } from '../../config/db.js';

export const getNotifications = async (req, res, next) => {
    try {
        const { rows } = await pool.query(`
      SELECT *
      FROM notifications
      ORDER BY created_at DESC
    `);
        res.json(rows);
    } catch (err) {
        next(err);
    }
};
