import joi from 'joi';

export const UserSchemaSafe = joi.object().keys({
    username: joi.string().trim().required(),
    password: joi.string().alphanum().trim().required(),
    fullname: joi.string().required(),
    email: joi.string().required().email({ minDomainAtoms: 2 }),
    phone_number: joi.number().required(),
    group: joi.string().required()
});

export const UserSchema = joi.object().keys({
    username: joi.string().trim(),
    password: joi.string().alphanum().trim(),
    fullname: joi.string(),
    email: joi.string().email({ minDomainAtoms: 2 }),
    phone_number: joi.number(),
    group: joi.string(),
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
});

export const GroupSchema = joi.object().keys({
    name: joi.string(),
    description: joi.string(),
});

export const DatabaseSchemaSafe = joi.object().keys({
    host: joi.string().ip().required(),
    port: joi.number().port().required(),
    username: joi.string().required(),
    password: joi.string().required(),
    codename: joi.string().required()
});

export const DatabaseSchema = joi.object().keys({
    host: joi.string().ip(),
    port: joi.number().port(),
    username: joi.string(),
    password: joi.string(),
    codename: joi.string()
});

export const AuthSchemaSafe = joi.object().keys({
    name: joi.string().required(),
    description: joi.string().required(),
});