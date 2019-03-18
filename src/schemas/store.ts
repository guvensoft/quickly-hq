import joi from 'joi';

export const CashboxSchema = joi.object().keys({
    type: joi.string(),
    description: joi.string(),
    timestamp: joi.number(),
    cash: joi.number(),
    card: joi.number(),
    coupon: joi.number(),
    user: joi.string()
});

export const CashboxSchemaSafe = joi.object().keys({
    type: joi.string().required(),
    description: joi.string().required(),
    timestamp: joi.number().required(),
    cash: joi.number().required(),
    card: joi.number().required(),
    coupon: joi.number().required(),
    user: joi.string().required()
});

