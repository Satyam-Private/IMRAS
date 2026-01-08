import { getStockAgingFromDB } from "../../repositories/stock.repo.js";

export const fetchStockAging = async () => {


    const rows = await getStockAgingFromDB();

    return rows.map((row) => ({
        sku: row.sku,
        name: row.item_name,
        qty: row.quantity,
        age: Number(row.age_days),
        warehouse: `WH-${String(row.warehouse_id).padStart(3, "0")}`,
        value: Number(row.total_value),
    }));
};
