import * as reorderRepo from '../../repositories/reorder.repo.js';
import * as prRepo from '../../repositories/pr.repo.js';

export const evaluateReorder = async (systemUserId, warehouseId) => {
    const candidates = await reorderRepo.getReorderCandidates(warehouseId);

    const createdPRs = [];

    for (const item of candidates) {
        if (item.current_stock <= item.min_qty) {
            const pr = await prRepo.createPR(systemUserId, warehouseId);

            await prRepo.addPRItem(
                pr.pr_id,
                item.item_id,
                item.reorder_qty
            );

            createdPRs.push({
                pr_id: pr.pr_id,
                item_id: item.item_id,
                quantity: item.reorder_qty
            });
        }
    }

    return createdPRs;
};



export const getReorderSuggestions = async (warehouseId) => {
    const rows = await reorderRepo.getReorderSuggestions(warehouseId);

    return rows.map(r => ({
        item_id: r.item_id,
        sku: r.sku,
        name: r.name,
        currentStock: Number(r.current_stock),
        minQty: Number(r.min_qty),
        maxQty: Number(r.max_qty),
        suggestedQty: Number(r.suggested_qty),
        priority: r.priority
    }));
};


export const createPRFromReorder = async (items, userId, warehouseId) => {
    if (!items?.length) {
        const err = new Error('No items provided');
        err.status = 400;
        throw err;
    }

    const pr = await prRepo.createPR(userId, warehouseId);

    for (const item of items) {
        await prRepo.addPRItem(
            pr.pr_id,
            item.item_id,
            item.quantity,
            warehouseId
        );

    }

    return {
        pr_id: pr.pr_id,
        status: 'DRAFT',
        item_count: items.length
    };
};


