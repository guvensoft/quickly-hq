import { NextFunction, Request, Response } from 'express';
import { ManagementDB } from '../configrations/database';
import { AdminHash } from '../configrations/secrets';
import { SessionMessages } from '../utils/messages';
import { createLog, LogType } from '../utils/logger';

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
                createLog(req, LogType.DATABASE_ERROR, err,);
            });
        }
    } else {
        res.status(SessionMessages.UNAUTHORIZED_REQUEST.code).json(SessionMessages.UNAUTHORIZED_REQUEST.response);
        createLog(req, LogType.AUTH_ERROR, 'Auth Headers Not Found!');
    }
}