import * as warehouseRepo from "../../repositories/warehouse.repo.js";
import * as binRepo from "../../repositories/bin.repo.js";


export const getWarehouseById = async (warehouseId) => {
    return warehouseRepo.getById(warehouseId);
};



export const getBinsByWarehouse = async (warehouseId) => {
    return binRepo.getByWarehouseId(warehouseId);
};

export const createBin = async (data) => {
    return binRepo.createBin(data);
};

export const updateBinStatus = async (binId, status, warehouseId) => {
    const bin = await binRepo.getById(binId);

    if (!bin || bin.warehouse_id !== warehouseId) {
        throw new Error("Unauthorized bin update");
    }

    await binRepo.updateStatus(binId, status);
};

export const deleteBin = async (binId, warehouseId) => {
    const bin = await binRepo.getById(binId);
    if (!bin || Number(bin.warehouse_id) !== Number(warehouseId)) {
        throw new Error("Unauthorized bin delete");
    }

    if (bin.used_capacity > 0) {
        throw new Error("Cannot delete bin with stock");
    }

    await binRepo.softDelete(binId);
};

export const getAvailableBins = async (warehouseId) => {
    return binRepo.findAvailableBins(warehouseId);
};