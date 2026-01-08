import Joi from 'joi';

export const createSupplierSchema = Joi.object({
    name: Joi.string().required(),
    contact_details: Joi.string().optional(),
    lead_time_days: Joi.number().integer().min(0).optional()
});
