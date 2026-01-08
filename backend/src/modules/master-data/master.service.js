import * as itemRepo from '../../repositories/item.repo.js';
import * as warehouseRepo from '../../repositories/warehouse.repo.js';
import * as locationRepo from '../../repositories/location.repo.js';
import * as supplierRepo from '../../repositories/supplier.repo.js';
export const createItem = async (data) => {
    return itemRepo.create(data);
};

export const listItems = async () => {
    return itemRepo.findAll();
};

export const toggleItem = async (item_id) => {
    await itemRepo.toggleItem(item_id);
};

export const deleteItem = async (item_id) => {
    await itemRepo.deleteItem(item_id)
}

export const updateItem = async (item_id, data) => {
    return itemRepo.updateItem(item_id, data);
}

export const createWarehouse = async (data) => {
    return warehouseRepo.create(data);
};

export const listWarehouses = async () => {
    return warehouseRepo.findAll();
};

export const createLocation = async (data) => {
    return locationRepo.create(data);
};

export const listLocations = async () => {
    return locationRepo.findAll();
};
export const createSupplier = async (data) => {
    return supplierRepo.create(data);
};

export const listSuppliers = async () => {
    return supplierRepo.findAll();
};

export const toggleWarehouse = async (warehouseId) => {
    await warehouseRepo.toggleWarehouse(warehouseId);
};


export const recruitUsersToWarehouse = async (warehouseId, data) => {
    const { manager_id, staff_ids = [] } = data;

    if (!manager_id && staff_ids.length === 0) {
        const err = new Error('Nothing to recruit');
        err.status = 400;
        throw err;
    }

    await warehouseRepo.recruitUsers(
        warehouseId,
        manager_id,
        staff_ids
    );

    return { message: 'Recruitment successful' };
};


export const toggleSupplier = async (supplierId) => {
    return supplierRepo.toggle(supplierId);
};
