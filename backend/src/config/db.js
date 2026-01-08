import pkg from 'pg';
import { env } from './env.js';
import dotenv from "dotenv";
dotenv.config();
const { Pool } = pkg;

export const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl:
        process.env.NODE_ENV === "PRODUCTION" ? { rejectUnauthorized: false } : false
    ,

});

export const connectDB = async () => {
    try {
        await pool.query('SELECT 1');
        console.log('✅ Database connected');
    } catch (err) {
        console.error('❌ Database connection failed', err);
        process.exit(1);
    }
};
