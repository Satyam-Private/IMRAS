import { pool } from "../../config/db.js";
import * as pickingRepo from "../../repositories/picking.repository.js";

export const fifoPick = async ({
    sku,
    quantity,
    warehouseId,
    userId,
    notes
}) => {
    const client = await pool.connect();
    const issuedFrom = [];

    try {
        await client.query("BEGIN");

        // 1️⃣ FIFO stock rows (locked)
        const stockRows = await pickingRepo.findFIFOStock(
            sku,
            warehouseId,
            client
        );

        let remaining = quantity;

        for (const row of stockRows) {
            if (remaining <= 0) break;

            const deductQty = Math.min(row.quantity, remaining);

            // 2️⃣ Deduct stock
            await pickingRepo.deductStock(
                row.stock_id,
                deductQty,
                client
            );
            console.log(row)
            await pickingRepo.insertStockTransaction(
                {
                    item_id: row.item_id,
                    warehouse_id: row.warehouse_id,
                    location_id: row.location_id,
                    batch_id: row.batch_id,
                    transaction_type: "OUT",
                    quantity: deductQty,
                    reference_type: "ISSUE",
                    performed_by: userId
                },
                client
            );
            // 3️⃣ Audit
            await pickingRepo.insertPickHistory(
                {
                    item_id: row.item_id,
                    location_id: row.location_id,
                    batch_id: row.batch_id,
                    quantity: deductQty,
                    picked_by: userId,
                    notes
                },
                client
            );

            issuedFrom.push({
                bin_code: row.bin_code,
                quantity: deductQty
            });

            remaining -= deductQty;
        }

        if (remaining > 0) {
            throw new Error("Insufficient stock for FIFO pick");
        }

        await client.query("COMMIT");
        return issuedFrom;
    } catch (err) {
        await client.query("ROLLBACK");
        throw err;
    } finally {
        client.release();
    }
};

export const getRecentPicks = async (warehouseId) => {
    return pickingRepo.findRecentPicks(warehouseId);
};
