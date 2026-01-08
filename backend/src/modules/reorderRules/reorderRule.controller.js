import * as service from './reorderRule.service.js';

/* ---------- GET ---------- */
export const listReorderRules = async (req, res, next) => {
    try {
        const rules = await service.listRules();
        res.json(rules);
    } catch (err) {
        next(err);
    }
};

/* ---------- POST ---------- */
export const createReorderRule = async (req, res, next) => {
    try {
        const rule = await service.createRule(req.body);
        res.status(201).json(rule);
    } catch (err) {
        next(err);
    }
};

/* ---------- PUT ---------- */
export const updateReorderRule = async (req, res, next) => {
    try {
        const rule = await service.updateRule(req.params.id, req.body);
        res.json(rule);
    } catch (err) {
        next(err);
    }
};

/* ---------- DEACTIVATE ---------- */
export const deactivateReorderRule = async (req, res, next) => {
    try {
        const rule = await service.deactivateRule(req.params.id);
        res.json(rule);
    } catch (err) {
        next(err);
    }
};
