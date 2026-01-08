import * as masterService from './master.service.js';
import * as itemRepo from '../../repositories/item.repo.js';
export const createItem = async (req, res, next) => {
    try {
        const item = await masterService.createItem(req.body);
        res.status(201).json(item);
    } catch (err) {
        if (err.code === '23505') { // PostgreSQL unique violation
            err.status = 409;
            err.message = 'SKU already exists';
        }
        next(err);
    }
};

export const listItems = async (req, res, next) => {
    try {
        const items = await masterService.listItems();
        res.json(items);
    } catch (err) {
        next(err);
    }
};

export const deleteItem = async (req, res) => {
    await itemRepo.deleteItem(req.params.id);
    res.json({ message: "Item deleted" });
};

export const toggleItem = async (req, res, next) => {
    try {
        await masterService.toggleItem(req.params.id);
        res.json({ message: 'Item status changed successfully' });
    } catch (err) {
        next(err);
    }
};

export const updateItem = async (req, res, next) => {
    try {
        const item = await masterService.updateItem(req.params.id, req.body);
        res.json(item);
    } catch (err) {
        if (err.code === '23505') { // unique violation
            err.status = 409;
            err.message = 'SKU already exists';
        }
        next(err);
    }
};