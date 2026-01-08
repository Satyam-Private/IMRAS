import * as stockRepo from '../../repositories/stock.repo.js';
import * as txnRepo from '../../repositories/transaction.repo.js';
import * as movementRepo from '../../repositories/movement.repo.js';

export const issueStock = async (data, userId) => {
    const availableQty = await stockRepo.getQuantity(data);

    if (availableQty < data.quantity) {
        const err = new Error('Insufficient stock');
        err.status = 400;
        throw err;
    }

    // 1️⃣ Create OUT transaction
    await txnRepo.create({
        item_id: data.item_id,
        warehouse_id: data.warehouse_id,
        location_id: data.location_id,
        batch_id: data.batch_id || null,
        transaction_type: 'OUT',
        quantity: -data.quantity,
        reference_type: 'ISSUE',
        reference_id: Date.now(), // or issue_id if you store it
        performed_by: userId
    });

    // 2️⃣ Update stock snapshot
    await stockRepo.decrease({
        item_id: data.item_id,
        warehouse_id: data.warehouse_id,
        location_id: data.location_id,
        batch_id: data.batch_id || null,
        quantity: data.quantity
    });
};


export const transferStock = async (data, userId) => {
    const availableQty = await stockRepo.getQuantity({
        item_id: data.item_id,
        warehouse_id: data.from_warehouse_id,
        location_id: data.from_location_id,
        batch_id: null
    });

    if (availableQty < data.quantity) {
        const err = new Error('Insufficient stock at source');
        err.status = 400;
        throw err;
    }

    // MOVE OUT
    await txnRepo.create({
        item_id: data.item_id,
        warehouse_id: data.from_warehouse_id,
        location_id: data.from_location_id,
        transaction_type: 'MOVE',
        quantity: -data.quantity,
        reference_type: 'TRANSFER',
        reference_id: Date.now(),
        performed_by: userId
    });

    await stockRepo.increase({
        item_id: data.item_id,
        warehouse_id: data.from_warehouse_id,
        location_id: data.from_location_id,
        batch_id: null,
        quantity: -data.quantity
    });

    // MOVE IN
    await txnRepo.create({
        item_id: data.item_id,
        warehouse_id: data.to_warehouse_id,
        location_id: data.to_location_id,
        transaction_type: 'MOVE',
        quantity: data.quantity,
        reference_type: 'TRANSFER',
        reference_id: Date.now(),
        performed_by: userId
    });


};

export const getPendingIssues = async () => {
    return movementRepo.getPendingIssues();
};
