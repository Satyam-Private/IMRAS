import * as prRepo from '../../repositories/pr.repo.js';
import * as poRepo from '../../repositories/po.repo.js';
import * as grnRepo from '../../repositories/grn.repo.js';
import * as putawayRepo from '../../repositories/putaway.repository.js';
import * as stockRepo from '../../repositories/stock.repo.js';
import * as txnRepo from '../../repositories/transaction.repo.js';
import { pool } from '../../config/db.js';
/* =========================================================
   PURCHASE REQUISITION
========================================================= */

export const createPR = async (userId, warehouseId, items) => {
    if (!warehouseId) {
        const err = new Error('warehouse_id is required');
        err.status = 400;
        throw err;
    }

    const pr = await prRepo.createPR(userId, warehouseId);

    for (const item of items) {
        await prRepo.addPRItem(
            pr.pr_id,
            item.item_id,
            item.quantity
        );
    }

    return pr;
};

export const approvePR = async (prId, warehouseId) => {
    const pr = await prRepo.findById(prId, warehouseId);

    if (!pr) {
        const err = new Error('PR not found');
        err.status = 404;
        throw err;
    }

    if (pr.status !== 'DRAFT') {
        const err = new Error('Only DRAFT PR can be approved');
        err.status = 400;
        throw err;
    }

    await prRepo.approvePR(prId, warehouseId);
};

/* =========================================================
   PURCHASE ORDER
========================================================= */

export const convertPRToPO = async (prId, adminId, supplierId) => {
    if (!supplierId) {
        const err = new Error('supplier_id is required');
        err.status = 400;
        throw err;
    }

    const pr = await prRepo.getPRWithItems(prId);

    if (!pr) {
        const err = new Error('PR not found');
        err.status = 404;
        throw err;
    }

    if (pr.status !== 'APPROVED') {
        const err = new Error('Only APPROVED PR can be converted to PO');
        err.status = 400;
        throw err;
    }

    if (!pr.items.length) {
        const err = new Error('PR has no items');
        err.status = 400;
        throw err;
    }
    const warehouse_id = pr.warehouse_id
    const po = await poRepo.createPO(
        supplierId,
        adminId,
        warehouse_id
    );

    for (const item of pr.items) {
        await poRepo.addPOItem(po.po_id, {
            item_id: item.item_id,
            ordered_qty: item.quantity_required,
            unit_price: item.unit_price
        });
    }

    await prRepo.markPRConverted(prId);

    return po;
};

export const approvePO = async (poId, adminId) => {
    const po = await poRepo.findById(poId);

    if (!po) throw new Error('PO not found');
    if (po.status !== 'DRAFT') throw new Error('Only DRAFT PO can be approved');

    // 1️⃣ Approve PO
    await poRepo.approvePO(poId);

    // 2️⃣ Create GRN (PENDING)
    const grn = await grnRepo.createGRN(po.po_id,
        po.warehouse_id);

    // 3️⃣ Copy PO items → GRN items (expected quantities)
    const poItems = await poRepo.getPOItems(poId);

    for (const item of poItems) {
        await grnRepo.addGRNItem({
            grn_id: grn.grn_id,
            item_id: item.item_id,
            expected_qty: item.ordered_qty
        });
    }

    // 4️⃣ Mark PO converted
    await poRepo.markConverted(poId);

    return grn;
};


export const updatePOItems = async (poId, warehouseId, items) => {
    const po = await poRepo.findById(poId);

    if (!po || po.warehouse_id !== warehouseId) {
        const err = new Error('PO not found for this warehouse');
        err.status = 404;
        throw err;
    }

    if (po.status !== 'DRAFT') {
        const err = new Error('Only DRAFT PO can be modified');
        err.status = 400;
        throw err;
    }

    for (const item of items) {
        if (item.ordered_qty <= 0 || item.unit_price < 0) {
            const err = new Error('Invalid quantity or unit price');
            err.status = 400;
            throw err;
        }

        await poRepo.updatePOItem(
            poId,
            item.po_item_id,
            item.ordered_qty,
            item.unit_price
        );
    }
};

export const getPOById = async (poId, warehouseId) => {
    const po = await poRepo.getPOById(poId);

    if (!po || po.warehouse_id !== warehouseId) {
        const err = new Error('PO not found for this warehouse');
        err.status = 404;
        throw err;
    }

    return po;
};

export const getAllApprovedPRsForAdmin = async () => {
    return prRepo.getAllApprovedPRsForAdmin();
};


export const getPendingPOs = async () => {
    return poRepo.getPendingPOs();
};


/* =========================================================
   GRN (WAREHOUSE-AWARE)
========================================================= */



export const getTodayGRNs = async (warehouseId) => {
    return grnRepo.getTodayGRNs(warehouseId);
};

/* =========================================================
   PR LISTING
========================================================= */

export const getPRsByStatus = async (status, warehouseId) => {
    if (!warehouseId) {
        const err = new Error('warehouse_id is required');
        err.status = 400;
        throw err;
    }

    return prRepo.getPRsByStatus(status, warehouseId);
};



export const getPendingGRNs = async () => {
    return grnRepo.getPendingGRNs();
};

export const getGRNItems = async (grnId) => {
    return grnRepo.getGRNItems(grnId);
};


export const receiveGRN = async (grnId, userId, items) => {
    if (!items || !items.length) {
        throw new Error('No items to receive');
    }

    await pool.query('BEGIN');

    try {
        // 1. Get GRN
        const grn = await grnRepo.getById(grnId);
        if (!grn) throw new Error('GRN not found');

        const warehouseId = grn.warehouse_id;

        // 2. Process each received item
        for (const item of items) {

            // 2.1 Create batch
            const batch = await grnRepo.createBatch({
                item_id: item.item_id,
                batch_code: item.batch_code,
                expiry_date: item.expiry_date,
                warehouse_id: warehouseId
            });

            // 2.2 Update GRN item received qty
            const grnItem = await grnRepo.updateGRNItemReceivedQty({
                grn_id: grnId,
                item_id: item.item_id,
                received_qty: Number(item.received_qty),
                batch_id: batch.batch_id
            });

            // 🔥 2.3 CREATE PUTAWAY TASK (KEY STEP)
            await putawayRepo.createPutawayTask({
                grn_id: grnId,
                grn_item_id: grnItem.grn_item_id,
                item_id: item.item_id,
                batch_id: batch.batch_id,
                warehouse_id: warehouseId,
                quantity: Number(item.received_qty)
            });
        }

        // 3. Mark GRN received
        await grnRepo.markReceived(grnId, userId);

        await pool.query('COMMIT');
    } catch (err) {
        await pool.query('ROLLBACK');
        throw err;
    }
};


