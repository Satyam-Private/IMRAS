import { pool } from '../config/db.js';

export const getByWarehouseId = async (warehouseId) => {
    const { rows } = await pool.query(
        `
    SELECT
      location_id,
      bin_code,
      max_units,
      used_capacity,
      available_capacity,
      bin_type,
      status
    FROM bins
    WHERE warehouse_id = $1
      AND is_active = true
    ORDER BY bin_code
    `,
        [warehouseId]
    );

    return rows;
};

export const getById = async (binId) => {
    const { rows } = await pool.query(
        `SELECT * FROM bins WHERE location_id = $1`,
        [binId]
    );
    return rows[0];
};

export const createBin = async ({
    warehouse_id,
    bin_code,
    max_capacity,
    bin_type,
}) => {
    await pool.query(
        `
    INSERT INTO bins
    (warehouse_id, bin_code, max_units, used_capacity, available_capacity, bin_type, status, is_active)
    VALUES ($1, $2, $3, 0, $3, $4, 'ACTIVE', true)
    `,
        [warehouse_id, bin_code, max_capacity, bin_type]
    );
};


export const softDelete = async (binId) => {
    await pool.query(
        `
    UPDATE bins
    SET is_active = false
    WHERE location_id = $1
    `,
        [binId]
    );
};

export const findAvailableBins = async (warehouseId) => {
    const { rows } = await pool.query(
        `
    SELECT
      location_id,
      bin_code,
      available_capacity
    FROM bins
    WHERE warehouse_id = $1
      AND status = 'ACTIVE'
      AND is_active = true
      AND available_capacity > 0
    ORDER BY bin_code ASC
    `,
        [warehouseId]
    );

    return rows;
};