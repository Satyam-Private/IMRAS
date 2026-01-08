// test-db.js
import { pool } from './src/config/db.js';

const res = await pool.query('SELECT * from users');
console.log(res.rows);
process.exit();
