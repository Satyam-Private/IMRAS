// grn.controller.js
import * as procurementService from './procurement.service.js';

export const createGRN = async (req, res, next) => {
    try {
        const grn = await procurementService.createGRN(
            req.body,
            req.user.user_id
        );

        res.status(201).json(grn);
    } catch (err) {
        next(err);
    }
};



export const getTodayGRNs = async (req, res, next) => {
    try {
        const grns = await procurementService.getTodayGRNs(
            req.context.warehouse_id
        );
        res.json(grns);
    } catch (err) {
        next(err);
    }
};


export const getPendingGRNs = async (req, res, next) => {
    try {
        const data = await procurementService.getPendingGRNs();
        res.json(data);
    } catch (err) {
        next(err);
    }
};

export const getGRNItems = async (req, res, next) => {
    try {
        const items = await procurementService.getGRNItems(req.params.id);
        res.json(items);
    } catch (err) {
        next(err);
    }
};

export const receiveGRN = async (req, res, next) => {
    try {
        await procurementService.receiveGRN(
            req.params.id,
            req.user.user_id,
            req.body.items,
        );

        res.json({ message: 'GRN received successfully' });
    } catch (err) {
        next(err);
    }
};
