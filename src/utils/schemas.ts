import joi from 'joi';

export const AuthSchemaSafe = joi.object().keys({
    username: joi.string().required(),
    password: joi.string().required(),
});

export const UserSchemaSafe = joi.object().keys({
    username: joi.string().trim().required(),
    password: joi.string().trim().required(),
    fullname: joi.string().required(),
    email: joi.string().required().email({ minDomainAtoms: 2 }),
    phone_number: joi.number().required(),
    group_id: joi.string().required(),
    avatar: joi.string()
});

export const UserSchema = joi.object().keys({
    username: joi.string().trim(),
    password: joi.string().trim(),
    fullname: joi.string(),
    email: joi.string().email({ minDomainAtoms: 2 }),
    phone_number: joi.number(),
    group_id: joi.string(),
    avatar: joi.string()
});

export const AccountSchemaSafe = joi.object().keys({
    username: joi.string().required(),
    password: joi.string().required(),
    fullname: joi.string().required(),
    email: joi.string().required().email({ minDomainAtoms: 2 }),
    phone_number: joi.number().required(),
    group: joi.string().required()
});

export const AccountSchema = joi.object().keys({
    username: joi.string().trim(),
    password: joi.string().alphanum().trim(),
    fullname: joi.string(),
    email: joi.string().email({ minDomainAtoms: 2 }),
    phone_number: joi.number(),
    group: joi.string(),
});

export const GroupSchemaSafe = joi.object().keys({
    name: joi.string().required(),
    description: joi.string().required(),
    canRead: joi.boolean().required(),
    canWrite: joi.boolean().required(),
    canEdit: joi.boolean().required(),
    canDelete: joi.boolean().required()
});

export const GroupSchema = joi.object().keys({
    name: joi.string(),
    description: joi.string(),
    canRead: joi.boolean(),
    canWrite: joi.boolean(),
    canEdit: joi.boolean(),
    canDelete: joi.boolean()
});

export const DatabaseSchemaSafe = joi.object().keys({
    host: joi.string().ip().required(),
    port: joi.number().port().required(),
    username: joi.string().trim().required(),
    password: joi.string().trim().required(),
    codename: joi.string().required()
});

export const DatabaseSchema = joi.object().keys({
    host: joi.string().ip(),
    port: joi.number().port(),
    username: joi.string().trim(),
    password: joi.string().trim(),
    codename: joi.string()
});

export const PaymentMethodSchema = joi.object().keys({
    name: joi.string(),
    type: joi.number().allow(0,1,2,3),
    description: joi.string()
});

export const PaymentMethodSchemaSafe = joi.object().keys({
    name: joi.string().required(),
    type: joi.number().allow(0,1,2,3).required(),
    description: joi.string()
});

export const StoreAccesibiltySchema = joi.object().keys({
    days: joi.array().items(joi.boolean()).length(6),
    hours: joi.array().items( joi.array().items(joi.string(),joi.string())).length(6),
    wifi: joi.array().items(joi.boolean(),joi.string()),
    others: joi.array().items(joi.string()).length(20)
});

export const StoreSettingsSchema = joi.object().keys({
    order: joi.boolean(),
    preorder: joi.boolean(),
    reservation: joi.boolean(),
    accesibilty: StoreAccesibiltySchema,
    allowed_tables: joi.boolean(),
    allowed_products: joi.boolean(),
    allowed_payments: PaymentMethodSchema
})

export const StoreSchemaSafe = joi.object().keys({
    name: joi.string().required(),
    type:joi.number().allow(0,1,2).required(),
    category: joi.number().required(),
    cuisine: joi.number().required(),
    address: joi.object().required(),
    motto: joi.string().required(),
    description: joi.string().required(),
    logo: joi.string().required(),
    settings: StoreSettingsSchema.required(),
    status: joi.number().allow(0,1,2,3).required(),
    email: joi.string().required().email({ minDomainAtoms: 2 }),
    phone_number: joi.number().required(),
});

export const StoreSchema = joi.object().keys({
    name: joi.string(),
    type: joi.number().allow(0,1,2),
    category: joi.number(),
    cuisine: joi.number(),
    address: joi.object(),
    motto: joi.string(),
    description: joi.string(),
    logo: joi.string(),
    settings: joi.object(),
    status: joi.number().allow(0,1,2,3),
    email: joi.string().email({ minDomainAtoms: 2 }),
    phone_number: joi.number(),
});