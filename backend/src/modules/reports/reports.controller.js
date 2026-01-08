import * as reportsService from './reports.service.js';
import { toCSV } from '../../utils/csv.js';

/**
 * STOCK AGEING (JSON)
 */
export const stockAgeing = async (req, res, next) => {
    try {
        const data = await reportsService.getStockAgeing(
            req.user,
            req.query
        );
        res.json(data);
    } catch (err) {
        next(err);
    }
};

/**
 * STOCK AGEING (CSV)
 */
export const stockAgeingCSV = async (req, res, next) => {
    try {
        const data = await reportsService.getStockAgeing(
            req.user,
            req.query
        );
        const csv = toCSV(data);

        res.header('Content-Type', 'text/csv');
        res.attachment('stock-ageing.csv');
        res.send(csv);
    } catch (err) {
        next(err);
    }
};

/**
 * FAST / SLOW MOVING
 */
export const fastSlowMoving = async (req, res, next) => {
    try {
        const data = await reportsService.getFastSlowMoving(
            req.user,
            req.query
        );
        res.json(data);
    } catch (err) {
        next(err);
    }
};

export const fastSlowMovingCSV = async (req, res, next) => {
    try {
        const data = await reportsService.getFastSlowMoving(
            req.user,
            req.query
        );
        const csv = toCSV(data);

        res.header('Content-Type', 'text/csv');
        res.attachment('fast-slow-moving.csv');
        res.send(csv);
    } catch (err) {
        next(err);
    }
};

/**
 * STOCK VALUATION
 */
export const stockValuation = async (req, res, next) => {
    try {
        const data = await reportsService.getStockValuation(
            req.user,
            req.query
        );
        res.json(data);
    } catch (err) {
        next(err);
    }
};

export const stockValuationCSV = async (req, res, next) => {
    try {
        const data = await reportsService.getStockValuation(
            req.user,
            req.query
        );
        const csv = toCSV(data);

        res.header('Content-Type', 'text/csv');
        res.attachment('stock-valuation.csv');
        res.send(csv);
    } catch (err) {
        next(err);
    }
};
