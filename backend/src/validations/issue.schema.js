import Joi from 'joi';

export const issueSchema = Joi.object({
    item_id: Joi.number().integer().required(),
    warehouse_id: Joi.number().integer().required(),
    location_id: Joi.number().integer().required(),
    batch_id: Joi.number().integer().optional(),
    quantity: Joi.number().integer().min(1).required()
});
