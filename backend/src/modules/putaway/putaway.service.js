import { pool } from '../../config/db.js';
import * as putawayRepo from '../../repositories/putaway.repository.js';
import * as pickingRepo from '../../repositories/picking.repository.js'
/* ================= READ ================= */

export const getPendingPutawayTasks = async (warehouseId) => {
    return putawayRepo.getPendingPutawayTasks(warehouseId);
};

export const getCompletedPutaways = async (
    warehouseId,
    todayOnly
) => {
    return putawayRepo.findCompletedPutaways(
        warehouseId,
        todayOnly
    );
};

/* ================= WRITE (TRANSACTIONAL) ================= */

export const completePutaway = async (
    putawayId,
    locationId,
    userId
) => {
    if (!locationId) {
        throw new Error('Destination bin is required');
    }

    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        /* 1️⃣ Lock and fetch task */
        const task = await putawayRepo.getPendingTaskById(
            putawayId,
            client
        );

        if (!task) {
            throw new Error('Putaway task not found or already completed');
        }

        /* 2️⃣ Validate bin capacity (locked row) */
        const bin = await putawayRepo.getBinCapacity(
            locationId,
            task.warehouse_id,
            client
        );

        if (!bin || bin.available_capacity < task.quantity) {
            throw new Error('Bin capacity exceeded');
        }

        /* 3️⃣ FIFO-safe stock INSERT */
        await putawayRepo.insertStock(
            {
                item_id: task.item_id,
                warehouse_id: task.warehouse_id,
                location_id: locationId,
                batch_id: task.batch_id,
                grn_id: task.grn_id,
                quantity: task.quantity
            },
            client
        );

        /* 4️⃣ Update bin capacity */
        await putawayRepo.updateBinCapacity(
            locationId,
            task.quantity,
            client
        );

        /* 5️⃣ Complete putaway task */
        await putawayRepo.markPutawayCompleted(
            putawayId,
            locationId,
            client
        );
        await pickingRepo.insertStockTransaction(
            {
                item_id: task.item_id,
                warehouse_id: task.warehouse_id,
                location_id: locationId,
                batch_id: task.batch_id,
                transaction_type: "IN",
                quantity: task.quantity,
                reference_type: "GRN",
                performed_by: userId
            },
            client
        );
        /* 6️⃣ Auto-complete GRN if no pending putaways */
        await putawayRepo.autoCompleteGRN(
            task.grn_id,
            client
        );

        await client.query('COMMIT');
    } catch (err) {
        await client.query('ROLLBACK');
        throw err;
    } finally {
        client.release();
    }
};
