// po.controller.js
import * as procurementService from './procurement.service.js';

export const createPO = async (req, res, next) => {
    try {
        const po = await procurementService.createPO(
            req.body,
            req.user.user_id,
            req.context.warehouse_id
        );
        res.status(201).json(po);
    } catch (err) {
        next(err);
    }
};

export const approvePO = async (req, res, next) => {
    try {
        const poId = req.params.id;
        const adminId = req.user.user_id;

        const grn = await procurementService.approvePO(poId, adminId);

        res.json({
            message: 'PO approved and GRN created',
            grn
        });
    } catch (err) {
        next(err);
    }
};



export const getPendingPOs = async (req, res, next) => {
    try {
        const pos = await procurementService.getPendingPOs();
        res.json(pos);
    } catch (err) {
        next(err);
    }
};


export const updatePOItems = async (req, res, next) => {
    try {
        await procurementService.updatePOItems(
            req.params.id,
            req.body.items
        );
        res.json({ message: 'PO items updated successfully' });
    } catch (err) {
        next(err);
    }
};

export const getPOById = async (req, res, next) => {
    try {
        const po = await procurementService.getPOById(req.params.id);
        res.json(po);
    } catch (err) {
        next(err);
    }
};
