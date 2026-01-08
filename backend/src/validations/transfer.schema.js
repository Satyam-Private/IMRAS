import Joi from 'joi';

export const transferSchema = Joi.object({
    item_id: Joi.number().integer().required(),
    from_warehouse_id: Joi.number().integer().required(),
    from_location_id: Joi.number().integer().required(),
    to_warehouse_id: Joi.number().integer().required(),
    to_location_id: Joi.number().integer().required(),
    quantity: Joi.number().integer().min(1).required()
});
