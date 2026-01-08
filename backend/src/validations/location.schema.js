import Joi from 'joi';

export const createLocationSchema = Joi.object({
    warehouse_id: Joi.number().integer().required(),
    code: Joi.string().required()
});
