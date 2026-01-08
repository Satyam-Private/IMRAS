import * as masterService from './master.service.js';

export const createLocation = async (req, res, next) => {
    try {
        const location = await masterService.createLocation(req.body);
        res.status(201).json(location);
    } catch (err) {
        next(err);
    }
};

export const listLocations = async (req, res, next) => {
    try {
        const locations = await masterService.listLocations();
        res.json(locations);
    } catch (err) {
        next(err);
    }
};
