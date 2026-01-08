import { fetchStockAging } from "./stockAging.service.js";

export const getStockAging = async (req, res) => {
    try {
        const data = await fetchStockAging(req.user);

        res.status(200).json({
            success: true,
            data,
        });
    } catch (error) {
        console.error("Stock Aging Error:", error.message);
        res.status(403).json({
            success: false,
            message: error.message || "Failed to fetch stock aging",
        });
    }
};
