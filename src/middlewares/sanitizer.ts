import joi from 'joi';
import { Request, Response, NextFunction } from 'express';
import { createLog, LogType } from '../utils/logger'

export const SchemaGuard = (schema: joi.ObjectSchema) => {
    return (req: Request, res: Response, next: NextFunction) => {
        joi.validate(req.body, schema).then(res => {
            next();
        }).catch(err => {
            createLog(req,LogType.UNVALID_SCHEMA_ERROR,err);
            res.status(400).json({ ok: false, message: err.details[0].message });
        })
    }
}