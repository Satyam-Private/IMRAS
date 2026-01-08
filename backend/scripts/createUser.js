import { hashPassword } from '../src/utils/password.js';
import { pool } from '../src/config/db.js';

const createUser = async () => {
    const hashedPassword = await hashPassword('password123');

    await pool.query(
        `INSERT INTO users (name, email, password_hash, role)
     VALUES ($1, $2, $3, $4)`,
        ['Admin User', 'admin1@imras.com', hashedPassword, 'ADMIN']
    );

    console.log('User created');
    process.exit(0);
};

createUser();
