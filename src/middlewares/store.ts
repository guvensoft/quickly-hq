import { NextFunction, Request, Response } from 'express';
import { StoreDB, ManagementDB } from '../configrations/database';
import { AdminHash } from '../configrations/secrets';
import { createLog, LogType } from '../utils/logger';
import { SessionMessages } from '../utils/messages';

export const AuthenticateGuard = (req: Request, res: Response, next: NextFunction) => {
    let AuthToken = req.headers.authorization;
    let StoreID = req.headers.store_id;
    if (AuthToken && StoreID) {
        if (AuthToken == AdminHash) {
            next();
        } else {
            StoreDB.Sessions.get(AuthToken.toString()).then((session) => {
                if (session) {
                    if (StoreID) {
                        next();
                    } else {
                        res.status(SessionMessages.UNAUTHORIZED_REQUEST.code).json(SessionMessages.UNAUTHORIZED_REQUEST.response);
                        createLog(req, LogType.UNVALID_SCHEMA_ERROR, 'Store ID Not Found!');
                    }
                } else {
                    res.status(SessionMessages.UNAUTHORIZED_REQUEST.code).json(SessionMessages.UNAUTHORIZED_REQUEST.response);
                    createLog(req, LogType.AUTH_ERROR, 'Store ID Not Found!');
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

export const StoreGuard = (req: Request, res: Response, next: NextFunction) => {
    let StoreID: any = req.headers.store_id
    ManagementDB.Stores.get(StoreID).then(res => {
        next();
    }).catch(err => {
        res.status(SessionMessages.UNAUTHORIZED_REQUEST.code).json(SessionMessages.UNAUTHORIZED_REQUEST.response);
        createLog(req, LogType.AUTH_ERROR, 'Store Not Exist!');
    })
}


