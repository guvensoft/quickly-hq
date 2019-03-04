import joi from 'joi';
import { Request, Response, NextFunction } from 'express';

export const SchemaGuard = (schema: joi.ObjectSchema) => {
    return (req: Request, res: Response, next: NextFunction) => {
        joi.validate(req.body, schema).then(res => {
            next();
        }).catch(err => {
            console.log(err);
            res.status(400).json({ ok: false, message: 'Unvalid Schema' });
        })
    }
}