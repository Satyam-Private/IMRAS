import * as batchService from './batch.service.js';

export const getExpiringBatches = async (req, res, next) => {
    try {
        const days = Number(req.query.days || 30);
        const batches = await batchService.getExpiringBatches(days);
        res.json(batches);
    } catch (err) {
        next(err);
    }
};
