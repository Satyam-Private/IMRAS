import * as batchRepo from '../../repositories/batch.repo.js';

export const getExpiringBatches = async (days = 30) => {
    return batchRepo.getExpiringBatches(days);
};
