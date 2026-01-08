import * as pickingService from "./picking.service.js";

export const fifoPick = async (req, res, next) => {
    try {
        const { sku, quantity, notes } = req.body;

        if (!sku || !quantity || quantity <= 0) {
            throw new Error("SKU and valid quantity are required");
        }

        const issuedFrom = await pickingService.fifoPick({
            sku,
            quantity,
            notes,
            warehouseId: req.user.warehouse_id,
            userId: req.user.user_id
        });

        res.status(200).json({
            success: true,
            message: "FIFO pick completed",
            issued_from: issuedFrom
        });
    } catch (err) {
        next(err);
    }
};

export const getRecentPicks = async (req, res, next) => {
    try {
        const data = await pickingService.getRecentPicks(
            req.user.warehouse_id
        );

        res.status(200).json({
            success: true,
            data
        });
    } catch (err) {
        next(err);
    }
};
