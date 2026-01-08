import Joi from 'joi';

export const createPOSchema = Joi.object({
    supplier_id: Joi.number().integer().required(),
    items: Joi.array()
        .items(
            Joi.object({
                item_id: Joi.number().integer().required(),
                ordered_qty: Joi.number().integer().min(1).required(),
                unit_price: Joi.number().positive().required()
            })
        )
        .min(1)
        .required()
});
