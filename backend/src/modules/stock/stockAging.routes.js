import express from "express";
import { getStockAging } from "./stockAging.controller.js";

const router = express.Router();

// GET /api/stock-aging
router.get("/", getStockAging);

export default router;
