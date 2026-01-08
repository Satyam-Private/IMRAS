import Joi from 'joi';

export const createItemSchema = Joi.object({
    sku: Joi.string().required(),
    name: Joi.string().required(),
    unit_of_measure: Joi.string().required(),
    tracking_type: Joi.string().valid('NONE', 'BATCH', 'SERIAL').required(),
    unit_price: Joi.number().min(0).optional()
});
