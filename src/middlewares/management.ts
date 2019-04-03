import { NextFunction, Request, Response } from 'express';
import { ManagementDB } from '../configrations/database';
import { AdminHash } from '../configrations/secrets';
import { SessionMessages } from '../utils/messages';
import { createLog, LogType } from '../utils/logger';
import joi from 'joi';

export const AuthenticateGuard = (req: Request, res: Response, next: NextFunction) => {
    let AuthToken = req.headers.authorization;
    if (AuthToken) {
        if (AuthToken == AdminHash) {
            next();
        } else {
            ManagementDB.Sessions.get(AuthToken.toString()).then((session) => {
                if (session) {
                    next();
                } else {
                    res.status(SessionMessages.UNAUTHORIZED_REQUEST.code).json(SessionMessages.UNAUTHORIZED_REQUEST.response);
                    createLog(req, LogType.AUTH_ERROR, 'Auth Headers Not Found!');

                }
            }).catch(err => {
                res.status(SessionMessages.UNAUTHORIZED_REQUEST.code).json(SessionMessages.UNAUTHORIZED_REQUEST.response);
                createLog(req, LogType.DATABASE_ERROR, err);
            });
        }
    } else {
        res.status(SessionMessages.UNAUTHORIZED_REQUEST.code).json(SessionMessages.UNAUTHORIZED_REQUEST.response);
        createLog(req, LogType.AUTH_ERROR, 'Auth Headers Not Found!');
    }
}

export const SchemaGuard = (schema: joi.ObjectSchema) => {
    return (req: Request, res: Response, next: NextFunction) => {
        joi.validate(req.body, schema).then(res => {
            next();
        }).catch(err => {
            createLog(req, LogType.UNVALID_SCHEMA_ERROR, err);
            res.json(err);
            // res.status(400).json({ ok: false, message: err.details[0].message });
        })
    }
}

export const QueryGuard = () => {
    return (req: Request, res: Response, next: NextFunction) => {
        joi.validate(req.query, joi.object().keys({ limit: joi.number(), skip: joi.number() })).then(res => {
            next();
        }).catch(err => {
            createLog(req, LogType.UNVALID_SCHEMA_ERROR, err);
            res.status(400).json({ ok: false, message: err.details[0].message });
        })
    }
}