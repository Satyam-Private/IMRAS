import { pool } from '../config/db.js';

export const findByEmail = async (email) => {
  const { rows } = await pool.query(
    `SELECT * FROM users WHERE email = $1`,
    [email]
  );
  return rows[0];
};

export const findById = async (userId) => {  // this function is used to delete the users   
  const { rows } = await pool.query(
    `SELECT * FROM users WHERE user_id = $1`,
    [userId]
  );
  return rows[0];
};

export const createUser = async ({ name, email, password_hash, role, warehouse_id }) => {
  const { rows } = await pool.query(
    `
    INSERT INTO users (name, email, password_hash, role,  warehouse_id)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING user_id, name, email, role, is_active,  warehouse_id
    `,
    [name, email, password_hash, role, warehouse_id]
  );
  return rows[0];
};

export const getUsers = async () => {
  const { rows } = await pool.query(`
    SELECT
  u.user_id,
  u.name,
  u.email,
  u.role,
  u.is_active,
  u.warehouse_id,
  w.name AS warehouse_name
FROM users u
LEFT JOIN warehouses w ON w.warehouse_id = u.warehouse_id
ORDER BY u.created_at DESC;

  `);

  return rows;
};


export const getUsersByWarehouse = async (warehouseId) => {
  const { rows } = await pool.query(`
    SELECT
      u.user_id,
      u.name,
      u.email,
      u.role,
      u.is_active
    FROM users u
    WHERE u.warehouse_id = $1
    ORDER BY u.created_at DESC
  `, [warehouseId]);

  return rows;
};



export const updateUserStatus = async (userId, isActive) => {
  const { rows } = await pool.query(
    `
    UPDATE users
    SET is_active = $2
    WHERE user_id = $1
    RETURNING user_id, name, email, role, is_active
    `,
    [userId, isActive]
  );
  return rows[0];
};

export const getUsersByRoleUnassigned = async (role) => {
  const { rows } = await pool.query(`
    SELECT u.user_id, u.name, u.email, u.role
    FROM users u
    LEFT JOIN user_warehouses uw ON uw.user_id = u.user_id
    WHERE u.role = $1
      AND u.is_active = true
      AND uw.user_id IS NULL
  `, [role]);

  return rows;
};

export const isUserReferenced = async (userId) => {
  const { rows } = await pool.query(
    `
    SELECT 1 FROM purchase_requisitions WHERE requested_by = $1
    UNION
    SELECT 1 FROM purchase_orders WHERE approved_by = $1
    UNION
    SELECT 1 FROM grns WHERE received_by = $1
    LIMIT 1
    `,
    [userId]
  );
  return rows.length > 0;
};

export const deleteUser = async (userId) => {
  await pool.query(
    `DELETE FROM users WHERE user_id = $1`,
    [userId]
  );
};
