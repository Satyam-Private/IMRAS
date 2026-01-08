import * as masterService from './master.service.js';

export const createSupplier = async (req, res, next) => {
    try {
        const supplier = await masterService.createSupplier(req.body);
        res.status(201).json(supplier);
    } catch (err) {
        next(err);
    }
};

export const listSuppliers = async (req, res, next) => {
    try {
        const suppliers = await masterService.listSuppliers();
        res.json(suppliers);
    } catch (err) {
        next(err);
    }
};

export const toggleSupplier = async (req, res, next) => {
    try {
        const supplier = await masterService.toggleSupplier(req.params.id);
        res.json(supplier);
    } catch (err) {
        next(err);
    }
};