import Joi from 'joi';

export const createWarehouseSchema = Joi.object({
    name: Joi.string().required(),
    location: Joi.string().optional()
});
