import Joi from 'joi';

export const createPRSchema = Joi.object({
    items: Joi.array()
        .items(
            Joi.object({
                item_id: Joi.number().integer().required(),
                quantity: Joi.number().integer().min(1).required()
            })
        )
        .min(1)
        .required()
});
