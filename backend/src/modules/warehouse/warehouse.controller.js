import * as warehouseService from "./warehouse.service.js";

/* ================= WAREHOUSE ================= */

export const getMyWarehouse = async (req, res, next) => {
    try {
        const warehouse = await warehouseService.getWarehouseById(
            req.user.warehouse_id
        );
        res.json(warehouse);
    } catch (err) {
        next(err);
    }
};

/* ================= BINS ================= */

export const getBinsByWarehouse = async (req, res, next) => {
    try {
        const warehouseId = Number(req.params.warehouseId);

        if (warehouseId !== req.user.warehouse_id) {
            const err = new Error("Unauthorized warehouse access");
            err.status = 403;
            throw err;
        }

        const bins = await warehouseService.getBinsByWarehouse(warehouseId);
        res.json(bins);
    } catch (err) {
        next(err);
    }
};

export const createBin = async (req, res, next) => {
    try {
        const warehouseId = Number(req.params.warehouseId);

        if (warehouseId !== req.user.warehouse_id) {
            const err = new Error("Unauthorized warehouse access");
            err.status = 403;
            throw err;
        }

        await warehouseService.createBin({
            ...req.body,
            warehouse_id: warehouseId,
        });

        res.status(201).json({ message: "Bin created successfully" });
    } catch (err) {
        next(err);
    }
};

export const deleteBin = async (req, res, next) => {
    try {
        await warehouseService.deleteBin(
            Number(req.params.binId),
            Number(req.user.warehouse_id)
        );

        res.json({ message: "Bin removed successfully" });
    } catch (err) {
        next(err);
    }
};

export const getAvailableBins = async (req, res, next) => {
    try {
        const warehouseId = req.user.warehouse_id;

        const bins = await warehouseService.getAvailableBins(warehouseId);

        res.status(200).json({
            success: true,
            data: bins
        });
    } catch (err) {
        next(err);
    }
};