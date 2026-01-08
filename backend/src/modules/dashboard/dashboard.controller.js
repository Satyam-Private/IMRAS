import * as dashboardService from './dashboard.service.js';

export const getWarehouseDashboard = async (req, res, next) => {
    try {
        const data = await dashboardService.getWarehouseDashboard();
        res.json(data);
    } catch (err) {
        next(err);
    }
};

export const getDashboardKPIs = async (req, res, next) => {
    try {
        const data = await dashboardService.fetchDashboardKPIs(req.user);
        res.json(data);
    } catch (err) {
        next(err);
    }
};

export const getRecentTransactions = async (req, res, next) => {
    try {
        const data = await dashboardService.fetchRecentTransactions(req.user);
        res.json(data);
    } catch (err) {
        next(err);
    }
};

export const getWarehouseStaff = async (req, res, next) => {
    try {
        const data = await dashboardService.fetchWarehouseStaff(req.user);
        res.json(data);
    } catch (err) {
        next(err);
    }
};

export const getCriticalReorderItems = async (req, res, next) => {
    try {
        const data = await dashboardService.fetchCriticalReorderItems(req.user);
        res.json(data);
    } catch (err) {
        next(err);
    }
};