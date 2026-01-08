import Joi from 'joi';

export const createGRNSchema = Joi.object({
    po_id: Joi.number().integer().required(),
    warehouse_id: Joi.number().integer().required(),
    location_id: Joi.number().integer().required(),

    items: Joi.array().items(
        Joi.object({
            item_id: Joi.number().integer().required(),
            quantity: Joi.number().integer().min(1).required(),
            unit_cost: Joi.number().positive().required(),
            batch_code: Joi.string().optional(),
            expiry_date: Joi.date().optional()
        })
    ).min(1).required()
});
