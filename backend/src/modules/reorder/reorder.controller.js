import * as reorderService from './reorder.service.js';
export const evaluateReorder = async (req, res, next) => {
    try {
        const warehouseId = req.body.warehouse_id;
        const prs = await reorderService.evaluateReorder(
            req.user.user_id,
            warehouseId
        );
        res.json({ message: 'Reorder evaluation completed', prs_created: prs });
    } catch (err) {
        next(err);
    }
};

export const createPRFromReorder = async (req, res, next) => {
    try {
        const { items } = req.body;
        const warehouseId = req.context.warehouse_id;

        const result = await reorderService.createPRFromReorder(
            items,
            req.user.user_id,
            warehouseId
        );

        res.status(201).json(result);
    } catch (err) {
        next(err);
    }
};



export const getReorderSuggestions = async (req, res, next) => {
    try {
        const warehouseId = req.context.warehouse_id;
        const data = await reorderService.getReorderSuggestions(warehouseId);
        res.json(data);
    } catch (err) {
        next(err);
    }
};



