// pr.controller.js
import * as procurementService from './procurement.service.js';

export const createPR = async (req, res, next) => {
    try {
        const pr = await procurementService.createPR(
            req.user.user_id,
            req.context.warehouse_id,
            req.body.items
        );
        res.status(201).json(pr);
    } catch (err) {
        next(err);
    }
};

export const approvePR = async (req, res, next) => {
    try {
        await procurementService.approvePR(
            req.params.id,
            req.context.warehouse_id
        );
        res.json({ message: 'PR approved' });
    } catch (err) {
        next(err);
    }
};

export const listPRs = async (req, res, next) => {
    try {
        const { status } = req.query;

        if (!status) {
            return res.status(400).json({ message: 'status is required' });
        }

        const prs = await procurementService.getPRsByStatus(
            status,
            req.context.warehouse_id
        );

        res.json(prs);
    } catch (err) {
        next(err);
    }
};

// this controller lets admin access pr list with approved status without stricting warehouse Id 
export const getApprovedPRsForAdmin = async (req, res, next) => {
    try {
        const prs = await procurementService.getAllApprovedPRsForAdmin();
        res.json(prs);
    } catch (err) {
        next(err);
    }
};



export const createPOFromPR = async (req, res, next) => {
    try {
        const po = await procurementService.convertPRToPO(
            req.params.id,
            req.user.user_id,
            req.body.supplier_id
        );

        res.status(201).json(po);
    } catch (err) {
        next(err);
    }
};