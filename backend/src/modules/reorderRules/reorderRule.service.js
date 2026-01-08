import * as reorderRepo from '../../repositories/reorderRule.repo.js';

export const createRule = async (data) => {
    if (!data.item_id || !data.min_qty || !data.max_qty || !data.reorder_qty) {
        const err = new Error('Missing required fields');
        err.status = 400;
        throw err;
    }

    if (data.min_qty >= data.max_qty) {
        const err = new Error('Min quantity must be less than max quantity');
        err.status = 400;
        throw err;
    }

    return reorderRepo.create(data);
};

export const listRules = async () => {
    return reorderRepo.findAll();
};

export const updateRule = async (id, data) => {
    return reorderRepo.update(id, data);
};

export const deactivateRule = async (id) => {
    return reorderRepo.deactivate(id);
};
