import joi from 'joi';

export const UserSchema = joi.object().keys({
    username: joi.string().required(),
    password: joi.string().required(),
})