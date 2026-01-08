import Joi from 'joi';

export const createUserSchema = Joi.object({
    name: Joi.string().min(2).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    role: Joi.string()
        .valid('ADMIN', 'INVENTORY_MANAGER', 'WAREHOUSE_STAFF')
        .required(),

    warehouse_id: Joi.when('role', {
        is: Joi.valid('INVENTORY_MANAGER', 'WAREHOUSE_STAFF'),
        then: Joi.number().integer().required(),
        otherwise: Joi.allow(null)
    })
});
